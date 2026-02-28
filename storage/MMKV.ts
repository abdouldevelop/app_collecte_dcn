import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SOTRE_KEYS } from './KEYS'
import { IAgent, IAuth } from '@/interfaces'

// Initialize MMKV storage
export const storage = createMMKV()

// Create storage interface for Zustand persist middleware
const mmkvStorage = {
 getItem: (name: string) => {
  const value = storage.getString(name)
  return value ? Promise.resolve(value) : Promise.resolve(null)
 },
 setItem: (name: string, value: string) => {
  storage.set(name, value)
  return Promise.resolve()
 },
 removeItem: (name: string) => {
  storage.remove(name)
  return Promise.resolve()
 },
}

// Define your store state type
interface StoreState {
 isAgentAuth: boolean
 agent: IAuth | null
 login: (agent: IAuth) => void
 logout: () => void
}

// Create persisted store
export const agentStore = create<StoreState>()(
 persist(
  (set) => ({
   isAgentAuth: false,
   agent: null,
   login: (agent: IAuth) => set((state) => (
    { isAgentAuth: true, agent }
   )),
   logout: () => set((state) => ({ isAgentAuth: false, agent: null })),
  }),
  {
   name: 'app-storage',
   storage: createJSONStorage(() => mmkvStorage),
  }
 )
)

// Helper functions to directly access MMKV
export const setStorageItem = (key: string, value: any) => {
 if (typeof value === 'string') {
  storage.set(key, value)
 } else {
  storage.set(key, JSON.stringify(value))
 }
}

export const getStorageItem = (key: string) => {
 const value = storage.getString(key)
 try {
  return value ? JSON.parse(value) : null
 } catch {
  return value
 }
}

export const removeStorageItem = (key: string) => {
 storage.remove(key)
}
