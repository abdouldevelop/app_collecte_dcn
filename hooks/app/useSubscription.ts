import { useState, useCallback } from 'react'
import { database } from '@/database/database'
import { Q } from '@nozbe/watermelondb'
import Souscription from '@/database/model/Souscription'

// Custom hook for Souscription CRUD operations
export const useSouscription = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  // GET SUBSCRIPTION

  const getSouscriptionsById = useCallback(async(clientId: string) =>{
    setLoading(true)
    setError(null)
    return database.get<Souscription>('souscriptions')
      .query(Q.where('client_id', clientId))
      .fetch()


  }, [])

  // CREATE
  const createSouscription = useCallback(async (
    clientId: string,
    kitId: string,
    saisonId: string,
    statut: string = 'active'
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const newSouscription = await database.write(async () => {
        return await database.get<Souscription>('souscriptions').create((souscription) => {
          souscription.client.set(clientId)
          souscription.kit.set(kitId)
          souscription.saison.set(saisonId)
          souscription.statut = statut
          souscription.createdAt = Date.now()
        })
      })
      
      return newSouscription
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // UPDATE
  const updateSouscription = useCallback(async (
    souscriptionId: string,
    updates: {
      clientId?: string
      kitId?: string
      saisonId?: string
      statut?: string
    }
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedSouscription = await database.write(async () => {
        const souscription = await database.get<Souscription>('souscriptions').find(souscriptionId)
        
        return await souscription.update((record) => {
          if (updates.clientId) record.client.set(updates.clientId)
          if (updates.kitId) record.kit.set(updates.kitId)
          if (updates.saisonId) record.saison.set(updates.saisonId)
          if (updates.statut) record.statut = updates.statut
        })
      })
      
      return updatedSouscription
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // DELETE
  const deleteSouscription = useCallback(async (souscriptionId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await database.write(async () => {
        const souscription = await database.get<Souscription>('souscriptions').find(souscriptionId)
        await souscription.markAsDeleted()
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // BATCH UPDATE STATUS
  const updateMultipleStatus = useCallback(async (
    souscriptionIds: string[],
    newStatus: string
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      await database.write(async () => {
        const souscriptions = await database.get<Souscription>('souscriptions')
          .query(Q.where('id', Q.oneOf(souscriptionIds)))
          .fetch()
        
        await Promise.all(
          souscriptions.map(souscription =>
            souscription.update(record => {
              record.statut = newStatus
            })
          )
        )
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
    createSouscription,
    updateSouscription,
    deleteSouscription,
    updateMultipleStatus,
    clearError: () => setError(null)
  }
}

// Hook for observing souscriptions (reactive data)
export const useSouscriptions = (filters?: {
  clientId?: string
  statut?: string
  limit?: number
}) => {
  // This would typically use withObservables or useDatabase hook
  // depending on your setup
  
  // Example with basic query (you might need to adapt based on your database setup)
  const getSouscriptions = useCallback(() => {
    let query = database.get<Souscription>('souscriptions').query()
    
    if (filters?.clientId) {
      query = query.extend(Q.where('client_id', filters.clientId))
    }
    
    if (filters?.statut) {
      query = query.extend(Q.where('statut', filters.statut))
    }
    
    if (filters?.limit) {
      query = query.extend(Q.take(filters.limit))
    }
    
    return query.fetch()
  }, [filters])

  return {
    getSouscriptions
  }
}