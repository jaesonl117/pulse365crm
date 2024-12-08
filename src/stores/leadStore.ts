import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Lead, LeadStatus, LeadHistory, DEFAULT_STATUSES } from '../types/lead';
import { authService } from '../lib/authService';
import { createHistoryEntry } from '../lib/history';
import { mockDb } from '../lib/mockDb';
import { generateId } from '../lib/idGenerator';

interface LeadState {
  leads: Lead[];
  nextId: number;
  version: number;
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: number | null;
}

interface LeadActions {
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'history' | 'tenantId'>) => Promise<Lead | null>;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'history' | 'tenantId'>>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addNote: (leadId: string, content: string) => Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  syncWithMockDb: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
}

const STORE_VERSION = 4;
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

const getInitialState = (): LeadState => ({
  leads: [],
  nextId: 1,
  version: STORE_VERSION,
  tenantId: null,
  isLoading: false,
  error: null,
  lastSyncTime: null,
});

export const useLeadStore = create<LeadState & LeadActions>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),

      initialize: async () => {
        const user = authService.getCurrentUser();
        if (!user?.tenantId) {
          set(getInitialState());
          return;
        }

        const currentState = get();
        if (
          user.tenantId !== currentState.tenantId ||
          !currentState.lastSyncTime ||
          Date.now() - currentState.lastSyncTime > SYNC_INTERVAL
        ) {
          await get().syncWithMockDb();
        }
      },

      addLead: async (leadData) => {
        const user = authService.getCurrentUser();
        if (!user?.tenantId) return null;

        try {
          set({ isLoading: true, error: null });

          const timestamp = new Date().toISOString();
          const id = generateId('lead');
          
          const newLead: Lead = {
            ...leadData,
            id,
            tenantId: user.tenantId,
            status: DEFAULT_STATUSES[0],
            notes: [],
            history: [createHistoryEntry('created', user)],
            createdAt: timestamp,
            updatedAt: timestamp,
          };

          const savedLead = await mockDb.addLead(newLead);
          if (!savedLead) throw new Error('Failed to save lead');

          set((state) => ({
            leads: [...state.leads, savedLead],
            nextId: state.nextId + 1,
            isLoading: false,
          }));

          return savedLead;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add lead';
          set({ error: message, isLoading: false });
          return null;
        }
      },

      updateLead: async (id, updates) => {
        const user = authService.getCurrentUser();
        if (!user?.tenantId) return;

        try {
          set({ isLoading: true, error: null });

          const state = get();
          const lead = state.leads.find(
            (l) => l.id === id && l.tenantId === user.tenantId
          );
          
          if (!lead) throw new Error('Lead not found');

          const historyEntries: LeadHistory[] = [];
          Object.entries(updates).forEach(([key, value]) => {
            if (value !== lead[key as keyof Lead]) {
              historyEntries.push(
                createHistoryEntry(
                  'updated',
                  user,
                  key,
                  String(lead[key as keyof Lead]),
                  String(value)
                )
              );
            }
          });

          const updatedLead: Lead = {
            ...lead,
            ...updates,
            history: [...lead.history, ...historyEntries],
            updatedAt: new Date().toISOString(),
          };

          const savedLead = await mockDb.updateLead(updatedLead);
          if (!savedLead) throw new Error('Failed to update lead');

          set((state) => ({
            leads: state.leads.map((l) =>
              l.id === id && l.tenantId === user.tenantId ? savedLead : l
            ),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update lead';
          set({ error: message, isLoading: false });
        }
      },

      updateLeadStatus: async (leadId, newStatus) => {
        const user = authService.getCurrentUser();
        if (!user?.tenantId) return;

        try {
          const state = get();
          const lead = state.leads.find(
            (l) => l.id === leadId && l.tenantId === user.tenantId
          );

          if (!lead) throw new Error('Lead not found');

          await get().updateLead(leadId, {
            status: newStatus,
            history: [
              ...lead.history,
              createHistoryEntry(
                'status_changed',
                user,
                'status',
                lead.status.name,
                newStatus.name
              ),
            ],
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update lead status';
          set({ error: message, isLoading: false });
        }
      },

      deleteLead: async (id) => {
        const user = authService.getCurrentUser();
        if (!user?.tenantId) return;

        try {
          set({ isLoading: true, error: null });

          const deleted = await mockDb.deleteLead(id, user.tenantId);
          if (!deleted) throw new Error('Failed to delete lead');

          set((state) => ({
            leads: state.leads.filter(
              (lead) => !(lead.id === id && lead.tenantId === user.tenantId)
            ),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete lead';
          set({ error: message, isLoading: false });
        }
      },

      addNote: async (leadId, content) => {
        const user = authService.getCurrentUser();
        if (!user?.tenantId) return;

        try {
          set({ isLoading: true, error: null });

          const timestamp = new Date().toISOString();
          const historyEntry = createHistoryEntry('note_added', user);
          
          const note = {
            id: generateId('note'),
            content,
            createdAt: timestamp,
            createdBy: {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
            },
          };

          await get().updateLead(leadId, {
            notes: [...(get().leads.find((l) => l.id === leadId)?.notes || []), note],
            history: [
              ...(get().leads.find((l) => l.id === leadId)?.history || []),
              historyEntry,
            ],
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add note';
          set({ error: message, isLoading: false });
        }
      },

      syncWithMockDb: async () => {
        const user = authService.getCurrentUser();
        
        try {
          set({ isLoading: true, error: null });

          if (!user?.tenantId) {
            set(getInitialState());
            return;
          }

          const mockDbLeads = await mockDb.getLeadsByTenant(user.tenantId);
          const maxId = Math.max(...mockDbLeads.map((l) => parseInt(l.id)), 0);

          set((state) => ({
            ...state,
            leads: mockDbLeads,
            tenantId: user.tenantId,
            nextId: maxId + 1,
            lastSyncTime: Date.now(),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to sync leads';
          set({ error: message, isLoading: false });
        }
      },
    }),
    {
      name: 'lead-store-v4',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        leads: state.leads,
        nextId: state.nextId,
        version: state.version,
        tenantId: state.tenantId,
        lastSyncTime: state.lastSyncTime,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize().catch(console.error);
        }
      },
    }
  )
);

// Selectors
export const selectLeads = (state: LeadState) => state.leads;
export const selectLeadById = (id: string) => (state: LeadState) =>
  state.leads.find((lead) => lead.id === id);
export const selectLeadsByStatus = (status: LeadStatus) => (state: LeadState) =>
  state.leads.filter((lead) => lead.status.id === status.id);
export const selectIsLoading = (state: LeadState) => state.isLoading;
export const selectError = (state: LeadState) => state.error;