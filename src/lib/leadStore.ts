import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Lead, DEFAULT_STATUSES, LeadHistory } from '../types/lead';
import { getCurrentUser } from '../lib/auth';
import { createHistoryEntry } from '../lib/history';
import { mockDb } from '../lib/mockDb';

interface LeadState {
  leads: Lead[];
  nextId: number;
  version: number;
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LeadActions {
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'history' | 'tenantId'>) => Promise<Lead | null>;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'history' | 'tenantId'>>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addNote: (leadId: string, content: string) => Promise<void>;
  syncWithMockDb: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

const STORE_VERSION = 3;

const getInitialState = (): LeadState => {
  const user = getCurrentUser();
  return {
    leads: [],
    nextId: 1,
    version: STORE_VERSION,
    tenantId: user?.tenantId || null,
    isLoading: false,
    error: null
  };
};

export const useLeadStore = create<LeadState & LeadActions>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),

      addLead: async (leadData) => {
        const user = getCurrentUser();
        if (!user?.tenantId) return null;

        try {
          set({ isLoading: true, error: null });

          const timestamp = new Date().toISOString();
          const nextId = get().nextId;
          
          const newLead: Lead = {
            ...leadData,
            id: nextId.toString(),
            tenantId: user.tenantId,
            status: DEFAULT_STATUSES[0],
            notes: [],
            history: [createHistoryEntry('created')],
            createdAt: timestamp,
            updatedAt: timestamp,
          };

          const savedLead = mockDb.addLead(newLead);
          if (!savedLead) throw new Error('Failed to save lead');

          set((state) => ({
            leads: [...state.leads, savedLead],
            nextId: state.nextId + 1,
            isLoading: false,
          }));

          return savedLead;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add lead',
            isLoading: false 
          });
          return null;
        }
      },

      updateLead: async (id, updates) => {
        const user = getCurrentUser();
        if (!user?.tenantId) return;

        try {
          set({ isLoading: true, error: null });

          const state = get();
          const lead = state.leads.find((l) => l.id === id && l.tenantId === user.tenantId);
          if (!lead) throw new Error('Lead not found');

          const historyEntries: LeadHistory[] = [];
          Object.entries(updates).forEach(([key, value]) => {
            if (key === 'status' && value) {
              historyEntries.push(
                createHistoryEntry('status_changed', 'status', lead.status.name, (value as Lead['status']).name)
              );
            } else if (value !== lead[key as keyof Lead]) {
              historyEntries.push(
                createHistoryEntry('updated', key, String(lead[key as keyof Lead]), String(value))
              );
            }
          });

          const updatedLead: Lead = {
            ...lead,
            ...updates,
            history: [...lead.history, ...historyEntries],
            updatedAt: new Date().toISOString(),
          };

          const savedLead = mockDb.updateLead(updatedLead);
          if (!savedLead) throw new Error('Failed to update lead');

          set((state) => ({
            leads: state.leads.map((l) =>
              l.id === id && l.tenantId === user.tenantId ? savedLead : l
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update lead',
            isLoading: false 
          });
        }
      },

      deleteLead: async (id) => {
        const user = getCurrentUser();
        if (!user?.tenantId) return;

        try {
          set({ isLoading: true, error: null });

          const deleted = mockDb.deleteLead(id);
          if (!deleted) throw new Error('Failed to delete lead');

          set((state) => ({
            leads: state.leads.filter((lead) => 
              !(lead.id === id && lead.tenantId === user.tenantId)
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete lead',
            isLoading: false 
          });
        }
      },

      addNote: async (leadId, content) => {
        const user = getCurrentUser();
        if (!user?.tenantId) return;

        try {
          set({ isLoading: true, error: null });

          const timestamp = new Date().toISOString();
          const historyEntry = createHistoryEntry('note_added');
          
          const note = {
            id: `note_${Date.now()}`,
            content,
            createdAt: timestamp,
            createdBy: historyEntry.performedBy,
          };

          set((state) => ({
            leads: state.leads.map((lead) =>
              lead.id === leadId && lead.tenantId === user.tenantId
                ? {
                    ...lead,
                    notes: [...lead.notes, note],
                    history: [...lead.history, historyEntry],
                    updatedAt: timestamp,
                  }
                : lead
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add note',
            isLoading: false 
          });
        }
      },

      syncWithMockDb: async () => {
        const user = getCurrentUser();
        
        try {
          set({ isLoading: true, error: null });

          if (!user?.tenantId) {
            set(getInitialState());
            return;
          }

          const mockDbLeads = mockDb.getLeads();
          const maxId = Math.max(...mockDbLeads.map(l => parseInt(l.id)), 0);

          set((state) => ({
            ...state,
            leads: mockDbLeads,
            tenantId: user.tenantId,
            nextId: maxId + 1,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sync leads',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'lead-store-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        leads: state.leads,
        nextId: state.nextId,
        version: state.version,
        tenantId: state.tenantId
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const user = getCurrentUser();
          if (user?.tenantId !== state.tenantId) {
            // Only sync if tenant IDs don't match
            state.syncWithMockDb().catch(console.error);
          }
        }
      },
    }
  )
);