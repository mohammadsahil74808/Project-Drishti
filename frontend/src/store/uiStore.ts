/**
 * SentinelX AI — UI Store (Zustand)
 *
 * Cross-page UI state that isn't worth prop-drilling: sidebar collapse,
 * active global filters (district / crime type / date range), and the
 * AI Assistant drawer open/closed state.
 */
import { create } from "zustand";

export interface GlobalFilters {
  districtName: string | null;
  crimeType: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

interface UIState {
  isSidebarCollapsed: boolean;
  isAssistantOpen: boolean;
  filters: GlobalFilters;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleAssistant: () => void;
  setAssistantOpen: (open: boolean) => void;
  setFilters: (filters: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: GlobalFilters = {
  districtName: null,
  crimeType: null,
  dateFrom: null,
  dateTo: null,
};

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isAssistantOpen: false,
  filters: defaultFilters,

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleAssistant: () =>
    set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
  setAssistantOpen: (open) => set({ isAssistantOpen: open }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
