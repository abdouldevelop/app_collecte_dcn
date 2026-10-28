import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { IAuth } from '@/interfaces'

// Initialize MMKV storage
export const storage = createMMKV()

// Storage interface for Zustand persist middleware (MMKV is synchronous → hydratation instantanée)
const mmkvStorage: StateStorage = {
 getItem: (name: string) => storage.getString(name) ?? null,
 setItem: (name: string, value: string) => storage.set(name, value),
 removeItem: (name: string) => storage.remove(name),
}

// Define your store state type
interface StoreState {
 /** Compte enregistré localement (l'agent s'est déjà connecté au moins une fois) */
 hasAccount: boolean
 /** Session déverrouillée pour cette exécution (NON persisté → verrouillé à chaque démarrage) */
 isUnlocked: boolean
 /** Session agent (token + infos) */
 agent: IAuth | null
 /** Hash SHA-256 du mot de passe pour la vérification hors-ligne */
 passwordHash: string | null
 /** Connexion complète en ligne réussie (téléphone + mot de passe) */
 authenticate: (agent: IAuth, passwordHash: string) => void
 /** Déverrouillage rapide hors-ligne réussi */
 unlock: () => void
 /** Verrouille la session (sans supprimer le compte) */
 lock: () => void
 /** Déconnexion complète : supprime le compte local */
 logout: () => void
}

// Create persisted store
export const agentStore = create<StoreState>()(
 persist(
  (set) => ({
   hasAccount: false,
   isUnlocked: false,
   agent: null,
   passwordHash: null,
   authenticate: (agent: IAuth, passwordHash: string) =>
    set({ hasAccount: true, isUnlocked: true, agent, passwordHash }),
   unlock: () => set({ isUnlocked: true }),
   lock: () => set({ isUnlocked: false }),
   logout: () =>
    set({ hasAccount: false, isUnlocked: false, agent: null, passwordHash: null }),
  }),
  {
   name: 'app-storage',
   storage: createJSONStorage(() => mmkvStorage),
   // isUnlocked reste en mémoire uniquement → l'app se reverrouille à chaque lancement
   partialize: (state) => ({
    hasAccount: state.hasAccount,
    agent: state.agent,
    passwordHash: state.passwordHash,
   }),
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
