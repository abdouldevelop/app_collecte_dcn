import { create } from 'zustand'

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface SyncState {
  status: SyncStatus
  message: string
  /** Démarre l'indicateur de synchronisation */
  start: (message?: string) => void
  /** Marque la synchronisation comme réussie */
  succeed: (message?: string) => void
  /** Marque la synchronisation comme échouée */
  fail: (message?: string) => void
  /** Masque l'indicateur */
  reset: () => void
}

/**
 * État global de synchronisation, piloté depuis n'importe où
 * (démarrage de session, bouton sync, dashboard…) et consommé
 * par le bandeau animé <SyncBanner />.
 */
export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  message: '',
  start: (message = 'Synchronisation…') => set({ status: 'syncing', message }),
  succeed: (message = 'Données synchronisées') => set({ status: 'success', message }),
  fail: (message = 'Synchronisation différée') => set({ status: 'error', message }),
  reset: () => set({ status: 'idle', message: '' }),
}))
