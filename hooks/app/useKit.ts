import { useState, useCallback } from 'react'
import { database } from '@/database/database'
import { Q } from '@nozbe/watermelondb'
import Kit from '@/database/model/Kit'
import Saison from '@/database/model/Saison'

// Custom hook for Kit CRUD operations
export const useKit = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // CREATE - Create a new Kit
  const createKit = useCallback(async (
    label: string,
    saisonId: string,
    montantTotal: number
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const newKit = await database.write(async () => {
        return await database.get<Kit>('kits').create((kit) => {
          kit.label = label
          kit.saison.set(saisonId)
          kit.montantTotal = montantTotal
          kit.createdAt = Date.now()
        })
      })
      
      return newKit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // CREATE with Saison object
  const createKitWithSaison = useCallback(async (
    label: string,
    saison: Saison,
    montantTotal: number
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const newKit = await database.write(async () => {
        return await database.get<Kit>('kits').create((kit) => {
          kit.label = label
          kit.saison.set(saison)
          kit.montantTotal = montantTotal
          kit.createdAt = Date.now()
        })
      })
      
      return newKit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // UPDATE - Update a Kit
  const updateKit = useCallback(async (
    kitId: string,
    updates: {
      label?: string
      saisonId?: string
      montantTotal?: number
    }
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedKit = await database.write(async () => {
        const kit = await database.get<Kit>('kits').find(kitId)
        
        return await kit.update((record) => {
          if (updates.label !== undefined) record.label = updates.label
          if (updates.saisonId) record.saison.set(updates.saisonId)
          if (updates.montantTotal !== undefined) record.montantTotal = updates.montantTotal
        })
      })
      
      return updatedKit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // UPDATE - Update kit price only
  const updateKitPrice = useCallback(async (kitId: string, newPrice: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedKit = await database.write(async () => {
        const kit = await database.get<Kit>('kits').find(kitId)
        
        return await kit.update((record) => {
          record.montantTotal = newPrice
        })
      })
      
      return updatedKit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // DELETE - Delete a Kit
  const deleteKit = useCallback(async (kitId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await database.write(async () => {
        const kit = await database.get<Kit>('kits').find(kitId)
        
        // Check if kit has souscriptions before deleting
        const souscriptions = await kit.souscriptions.fetch()
        if (souscriptions.length > 0) {
          throw new Error('Cannot delete kit with active subscriptions')
        }
        
        await kit.markAsDeleted()
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Cannot delete kit'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // DELETE - Force delete (even with souscriptions)
  const forceDeleteKit = useCallback(async (kitId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await database.write(async () => {
        const kit = await database.get<Kit>('kits').find(kitId)
        
        // Delete all related souscriptions first
        const souscriptions = await kit.souscriptions.fetch()
        await Promise.all(
          souscriptions.map(souscription => souscription.markAsDeleted())
        )
        
        // Then delete the kit
        await kit.markAsDeleted()
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // BATCH - Create multiple kits
  const createMultipleKits = useCallback(async (
    kitsData: Array<{
      label: string
      saisonId: string
      montantTotal: number
    }>
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const newKits = await database.write(async () => {
        const kits = []
        
        for (const data of kitsData) {
          const kit = await database.get<Kit>('kits').create((record) => {
            record.label = data.label
            record.saison.set(data.saisonId)
            record.montantTotal = data.montantTotal
            record.createdAt = Date.now()
          })
          kits.push(kit)
        }
        
        return kits
      })
      
      return newKits
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // BATCH - Update multiple kit prices
  const updateMultiplePrices = useCallback(async (
    updates: Array<{ kitId: string; newPrice: number }>
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      await database.write(async () => {
        for (const update of updates) {
          const kit = await database.get<Kit>('kits').find(update.kitId)
          await kit.update((record) => {
            record.montantTotal = update.newPrice
          })
        }
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createKit,
    createKitWithSaison,
    updateKit,
    updateKitPrice,
    deleteKit,
    forceDeleteKit,
    createMultipleKits,
    updateMultiplePrices,
    clearError: () => setError(null)
  }
}

// Hook for observing kits (reactive data)
export const useKits = (filters?: {
  saisonId?: string
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
  limit?: number
  sortBy?: 'label' | 'montant_total' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}) => {
  const getKits = useCallback(() => {
    let query = database.get<Kit>('kits').query()
    
    // Filter by saison
    if (filters?.saisonId) {
      query = query.extend(Q.where('saison_id', filters.saisonId))
    }
    
    // Filter by price range
    if (filters?.minPrice !== undefined) {
      query = query.extend(Q.where('montant_total', Q.gte(filters.minPrice)))
    }
    
    if (filters?.maxPrice !== undefined) {
      query = query.extend(Q.where('montant_total', Q.lte(filters.maxPrice)))
    }
    
    // Search by label
    if (filters?.searchTerm) {
      query = query.extend(Q.where('label', Q.like(`%${filters.searchTerm}%`)))
    }
    
    // Sort by
    if (filters?.sortBy) {
      const direction = filters.sortOrder === 'desc' ? Q.desc : Q.asc
      query = query.extend(Q.sortBy(filters.sortBy, direction))
    }
    
    // Limit results
    if (filters?.limit) {
      query = query.extend(Q.take(filters.limit))
    }
    
    return query.observe()
  }, [filters])

  return {
    getKits
  }
}

// Hook for kit statistics
export const useKitStats = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getKitStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const kits = await database.get<Kit>('kits').query().fetch()
      
      const stats = {
        totalKits: kits.length,
        totalValue: kits.reduce((sum, kit) => sum + kit.montantTotal, 0),
        averagePrice: kits.length > 0 ? kits.reduce((sum, kit) => sum + kit.montantTotal, 0) / kits.length : 0,
        cheapestKit: kits.length > 0 ? Math.min(...kits.map(k => k.montantTotal)) : 0,
        expensiveKit: kits.length > 0 ? Math.max(...kits.map(k => k.montantTotal)) : 0
      }
      
      return stats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getKitWithSouscriptions = useCallback(async (kitId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const kit = await database.get<Kit>('kits').find(kitId)
      
      // Fetch related data
      const saison = await kit.saison.fetch()
      const souscriptions = await kit.souscriptions.fetch()
      
      return {
        kit,
        saison,
        souscriptions,
        souscriptionsCount: souscriptions.length
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getKitStats,
    getKitWithSouscriptions,
    clearError: () => setError(null)
  }
}