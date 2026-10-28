import { useState, useEffect, useCallback } from 'react'
import { Database, Q } from '@nozbe/watermelondb'
import Client from '@/database/model/Client'

interface CreateClientData {
  firstName: string
  lastName: string
  phone: string
  numeroOrdre: string
  agentId: string
}

interface UpdateClientData {
  firstName?: string
  lastName?: string
  phone?: string
  numeroOrdre?: string
}

interface UseClientsReturn {
  clients: Client[]
  loading: boolean
  error: string | null
  createClient: (data: CreateClientData) => Promise<Client | null>
  updateClient: (id: string, data: UpdateClientData) => Promise<Client | null>
  deleteClient: (id: string) => Promise<boolean>
  deleteAllClients: () => Promise<boolean>
  getClientById: (id: string) => Promise<Client | null>
  getClientWithSouscriptions: (id: string) => Promise<Client | null>
  searchClients: (query: string) => Promise<Client[]>
  refreshClients: () => Promise<void>
}

export const useClients = (database: Database): UseClientsReturn => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      const allClients = await clientsCollection
        .query()
        .fetch()
      setClients(allClients)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }, [database])

  // Create a new client
  const createClient = useCallback(async (data: CreateClientData): Promise<Client | null> => {
    try {
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      
      const newClient = await database.write(async () => {
        return await clientsCollection.create((client) => {
          client.firstName = data.firstName
          client.lastName = data.lastName
          client.phone = data.phone
          client.numeroOrdre = data.numeroOrdre
          client.agentId = data.agentId
          client.createdAt = Date.now()
          client.updatedAt = Date.now()
        })
      })

      // Refresh the clients list
      await fetchClients()
      return newClient
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client')
      return null
    }
  }, [database, fetchClients])

  // Update an existing client
  const updateClient = useCallback(async (id: string, data: UpdateClientData): Promise<Client | null> => {
    try {
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      const client = await clientsCollection.find(id)
      
      const updatedClient = await database.write(async () => {
        return await client.update((client) => {
          if (data.firstName !== undefined) client.firstName = data.firstName
          if (data.lastName !== undefined) client.lastName = data.lastName
          if (data.phone !== undefined) client.phone = data.phone
          if (data.numeroOrdre !== undefined) client.numeroOrdre = data.numeroOrdre
          client.updatedAt = Date.now()
        })
      })

      // Refresh the clients list
      await fetchClients()
      return updatedClient
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client')
      return null
    }
  }, [database, fetchClients])

  // Delete a client
  const deleteClient = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      const client = await clientsCollection.find(id)
      
      await database.write(async () => {
        await client.destroyPermanently()
      })

      // Refresh the clients list
      await fetchClients()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
      return false
    }
  }, [database, fetchClients]);
  

  const deleteAllClients = useCallback(async (): Promise<boolean> => {
  try {
    setError(null);
    const clientsCollection = database.get<Client>('clients');
    const allClients = await clientsCollection.query().fetch();

    // Prepare deletion operations
    const deletes = allClients.map(client => client.prepareDestroyPermanently());

    await database.write(async () => {
      await database.batch(...deletes);
    });

    await fetchClients();
    return true;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete all clients');
    return false;
  }
}, [database, fetchClients]);

  // Get a client by ID
  const getClientById = useCallback(async (id: string): Promise<Client | null> => {
    try {
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      const client = await clientsCollection.find(id)
      return client
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find client')
      return null
    }
  }, [database])

  // Get a client with their souscriptions
  const getClientWithSouscriptions = useCallback(async (id: string): Promise<Client | null> => {
    try {
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      const client = await clientsCollection.find(id)
      
      // Preload souscriptions relation
      await client.souscriptions.fetch()
      return client
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find client with souscriptions')
      return null
    }
  }, [database])

  // Search clients by name or phone
  const searchClients = useCallback(async (query: string): Promise<Client[]> => {
    try {
      setError(null)
      const clientsCollection = database.get<Client>('clients')
      const searchResults = await clientsCollection
        .query(
          Q.or(
            Q.where('first_name', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
            Q.where('last_name', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
            Q.where('phone', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
            Q.where('numero_ordre', Q.like(`%${Q.sanitizeLikeString(query)}%`))
          )
        )
        .fetch()
      return searchResults
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search clients')
      return []
    }
  }, [database])

  // Refresh clients manually
  const refreshClients = useCallback(async () => {
    await fetchClients()
  }, [fetchClients])

  // Initial fetch on mount
  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientWithSouscriptions,
    searchClients,
    refreshClients,
    deleteAllClients
  }
}