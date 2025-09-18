import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "@/database/database";
import { http } from "@/shared/http";
import { HTTPError } from "ky";

// Types
interface SyncResult {
  success: boolean;
  error?: string;
  pullCount?: number;
  pushCount?: number;
  hasLocalChanges?: boolean;
  syncPhase?: string;
}

interface SyncOptions {
  conflictResolver?: "local" | "remote" | "latest";
}

// Debug helper to check if there are local changes
export const checkLocalChanges = async () => {
  try {
    console.log("🔍 Checking for local changes...");
    
    const collections = database.collections.map;
    const localChanges: Record<string, any> = {};
    let totalDirty = 0;
    
    for (const [tableName, collection] of Object.entries(collections)) {
      try {
        // Get all records
        const allRecords = await collection.query().fetch();
        
        // Filter for dirty records (not synced)
        const dirtyRecords = allRecords.filter((record: any) => {
          const status = record._raw._status;
          return status === 'created' || status === 'updated' || status === 'deleted';
        });
        
        if (dirtyRecords.length > 0) {
          localChanges[tableName] = {
            total: allRecords.length,
            dirty: dirtyRecords.length,
            records: dirtyRecords.map((record: any) => ({
              id: record.id,
              status: record._raw._status,
              lastModified: record._raw.last_modified,
            }))
          };
          totalDirty += dirtyRecords.length;
        }
        
        console.log(`📊 ${tableName}: ${allRecords.length} total, ${dirtyRecords.length} dirty`);
      } catch (error) {
        console.error(`❌ Error checking ${tableName}:`, error);
      }
    }
    
    console.log(`🔍 Total dirty records: ${totalDirty}`);
    console.log("🔍 Local changes detail:", JSON.stringify(localChanges, null, 2));
    
    return {
      hasChanges: totalDirty > 0,
      totalDirty,
      changesByTable: localChanges
    };
  } catch (error) {
    console.error("❌ Failed to check local changes:", error);
    return { hasChanges: false, totalDirty: 0, changesByTable: {} };
  }
};

// Create some test data to ensure we have changes to push
export const createTestData = async () => {
  try {
    console.log("🧪 Creating test data...");
    
    // You'll need to adapt this to your actual models
    // Example assuming you have a User model:
    /*
    await database.write(async () => {
      await database.collections.get('users').create(user => {
        user.name = 'Test User ' + Date.now();
        user.email = 'test' + Date.now() + '@example.com';
      });
    });
    */
    
    console.log("🧪 Test data created (adapt this to your models)");
    return true;
  } catch (error) {
    console.error("❌ Failed to create test data:", error);
    return false;
  }
};

export const syncWithBackend = async (
  options: SyncOptions = {}
): Promise<SyncResult> => {
  let currentPhase = "starting";
  
  try {
    console.log("🔄 Starting database sync...");
    
    // First, check if we have local changes
    const localChangesCheck = await checkLocalChanges();
    console.log(`📊 Pre-sync: ${localChangesCheck.totalDirty} dirty records found`);
    
    if (!localChangesCheck.hasChanges) {
      console.log("⚠️  No local changes found - pushChanges won't be called");
    }

    let pullCount = 0;
    let pushCount = 0;
    let pullCalled = false;
    let pushCalled = false;

    await synchronize({
      database,

      // 📥 PULL (download server changes)
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        currentPhase = "pulling";
        pullCalled = true;
        
        console.log("📥 PULL STARTED - Pulling changes from server...", {
          lastPulledAt: lastPulledAt ? new Date(lastPulledAt).toISOString() : null,
          schemaVersion,
          migration,
        });

        try {
          const data = await http.post<{
            changes: Record<string, any>;
            timestamp: number;
          }>('sync/pull', {
            lastPulledAt,
            schemaVersion,
            migration,
          });

          const { changes, timestamp } = data;
          
          pullCount = Object.values(changes).reduce((total, tableChanges: any) => {
            return total + (tableChanges.created?.length || 0) + 
                          (tableChanges.updated?.length || 0) + 
                          (tableChanges.deleted?.length || 0);
          }, 0);

          console.log("📥 PULL COMPLETED", {
            changesReceived: pullCount,
            tablesAffected: JSON.parse(JSON.stringify(changes)),
            timestamp: new Date(timestamp).toISOString()
          });

          return { changes, timestamp };
        } catch (error) {
          console.error("❌ PULL FAILED:", error);
          throw new Error(`Pull failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },

      // 📤 PUSH (send local changes)
      pushChanges: async ({ changes, lastPulledAt }) => {
        currentPhase = "pushing";
        pushCalled = true;
        
        // This is the log you're looking for!
        console.log("📤 PUSH STARTED - Pushing changes to server...");
        console.log("📤 Push called with:", { 
          changes,
          lastPulledAt: lastPulledAt ? new Date(lastPulledAt).toISOString() : null
        });

        // Count changes being pushed
        pushCount = Object.values(changes).reduce((total, tableChanges: any) => {
          return total + (tableChanges.created?.length || 0) + 
                        (tableChanges.updated?.length || 0) + 
                        (tableChanges.deleted?.length || 0);
        }, 0);

        console.log(`📤 PUSH DETAILS: ${pushCount} changes across ${Object.keys(changes).length} tables`);

        if (pushCount === 0) {
          console.log("📤 No changes to push, returning empty result");
          return {};
        }

        // Log detailed changes for debugging
        console.log("📤 Changes being pushed:", JSON.stringify(changes, null, 2));

        try {
          const result = await http.post<any>('sync/push', {
            changes,
            lastPulledAt,
          });

          console.log("📤 PUSH COMPLETED successfully:", result);
          return result || {};
        } catch (error) {
          console.error("❌ PUSH FAILED:", error);
          
          if (error instanceof HTTPError) {
            console.error("❌ Push HTTP Error Details:", {
              status: error.response.status,
              statusText: error.response.statusText,
              url: error.request.url,
            });
          }
          
          throw new Error(`Push failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },

      // ⚖️ Conflict resolution
      conflictResolver:
        options.conflictResolver === "remote"
          ? undefined
          : options.conflictResolver === "local"
          ? () => "local"
          : undefined,

      migrationsEnabledAtVersion: 1,
    });

    currentPhase = "completed";
    
    console.log("✅ SYNC COMPLETED", { 
      pullCalled,
      pushCalled,
      pullCount, 
      pushCount,
      hadLocalChanges: localChangesCheck.hasChanges
    });
    
    // Check changes after sync
    const postSyncChanges = await checkLocalChanges();
    console.log(`📊 Post-sync: ${postSyncChanges.totalDirty} dirty records remaining`);

    return { 
      success: true, 
      pullCount, 
      pushCount,
      hasLocalChanges: localChangesCheck.hasChanges,
      syncPhase: currentPhase
    };
  } catch (error) {
    console.error(`❌ SYNC FAILED in phase: ${currentPhase}`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown sync error",
      syncPhase: currentPhase
    };
  }
};

// Diagnostic function to run before sync
export const runSyncDiagnostics = async () => {
  console.log("🔧 Running sync diagnostics...");
  
  try {
    // 1. Check database connection
    const collections = database.collections.map;
    console.log("✅ Database collections:", Object.keys(collections));
    
    // 2. Check local changes
    const localChanges = await checkLocalChanges();
    console.log("📊 Local changes check:", localChanges);
    
    // 3. Test pull endpoint
    try {
      console.log("🧪 Testing pull endpoint...");
      const pullResult = await http.post('sync/pull', {
        lastPulledAt: null,
        schemaVersion: 1,
        migration: null
      });
      console.log("✅ Pull endpoint working:", pullResult);
    } catch (error) {
      console.error("❌ Pull endpoint failed:", error);
    }
    
    // 4. Check sync metadata
    try {
      const lastPulledAt = await database.adapter.getLocal('lastPulledAt');
      console.log("📅 Last pulled at:", lastPulledAt ? new Date(parseInt(lastPulledAt)).toISOString() : 'Never');
    } catch (error) {
      console.error("❌ Could not read sync metadata:", error);
    }
    
    return {
      databaseOk: true,
      localChanges: localChanges.hasChanges,
      totalDirty: localChanges.totalDirty
    };
  } catch (error) {
    console.error("❌ Diagnostics failed:", error);
    return {
      databaseOk: false,
      localChanges: false,
      totalDirty: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Usage example:
export const debugSync = async () => {
  console.log("🔧 Starting debug sync process...");
  
  // 1. Run diagnostics
  const diagnostics = await runSyncDiagnostics();
  console.log("🔧 Diagnostics result:", diagnostics);
  
  // 2. Create test data if no local changes
  if (!diagnostics.localChanges) {
    console.log("⚠️  No local changes found, you may want to create some test data first");
    // await createTestData(); // Uncomment and adapt to your models
  }
  
  // 3. Run sync
  const syncResult = await syncWithBackend();
  console.log("🔧 Debug sync result:", syncResult);
  
  return { diagnostics, syncResult };
};