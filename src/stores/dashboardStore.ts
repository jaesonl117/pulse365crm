import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  activeWidgets: string[];
  setActiveWidgets: (widgets: string[]) => void;
  toggleWidget: (widgetId: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activeWidgets: ['metrics', 'status', 'trend', 'conversion'],
      setActiveWidgets: (widgets) => set({ activeWidgets: widgets }),
      toggleWidget: (widgetId) => set((state) => ({
        activeWidgets: state.activeWidgets.includes(widgetId)
          ? state.activeWidgets.filter(id => id !== widgetId)
          : [...state.activeWidgets, widgetId]
      })),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);