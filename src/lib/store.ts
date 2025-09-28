import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Objective, KeyResult, ObjectiveStatus } from '@/types';
type OkrState = {
  okrs: Objective[];
  loading: boolean;
  error: string | null;
  ownerFilter: string;
  statusFilter: ObjectiveStatus | 'all';
  fetchOkrs: () => Promise<void>;
  addObjective: (objective: Omit<Objective, 'id' | 'keyResults' | 'status'> & { keyResults: Omit<KeyResult, 'id'>[] }) => Promise<void>;
  updateObjective: (objective: Objective) => Promise<void>;
  updateObjectiveStatus: (objectiveId: string, status: ObjectiveStatus) => Promise<void>;
  deleteObjective: (objectiveId: string) => Promise<void>;
  getObjectiveById: (id: string) => Objective | undefined;
  setOwnerFilter: (owner: string) => void;
  setStatusFilter: (status: ObjectiveStatus | 'all') => void;
};
export const useOkrStore = create<OkrState>()(
  immer((set, get) => ({
    okrs: [],
    loading: true,
    error: null,
    ownerFilter: 'all',
    statusFilter: 'all',
    fetchOkrs: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/okrs');
        if (!response.ok) throw new Error('Failed to fetch OKRs');
        const { data } = await response.json();
        set({ okrs: data, loading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: errorMessage, loading: false });
      }
    },
    addObjective: async (objective) => {
      try {
        const response = await fetch('/api/okrs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(objective),
        });
        if (!response.ok) throw new Error('Failed to add objective');
        const { data: newObjective } = await response.json();
        set((state) => {
          state.okrs.push(newObjective);
        });
      } catch (error) {
        console.error("Failed to add objective:", error);
      }
    },
    updateObjective: async (updatedObjective) => {
      const originalOkrs = get().okrs;
      set(state => {
        const index = state.okrs.findIndex((o) => o.id === updatedObjective.id);
        if (index !== -1) {
          state.okrs[index] = updatedObjective;
        }
      });
      try {
        const response = await fetch(`/api/okrs/${updatedObjective.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedObjective),
        });
        if (!response.ok) throw new Error('Failed to update objective');
      } catch (error) {
        console.error("Failed to update objective:", error);
        set({ okrs: originalOkrs });
      }
    },
    updateObjectiveStatus: async (objectiveId, status) => {
      const originalOkrs = get().okrs;
      set(state => {
        const objective = state.okrs.find(o => o.id === objectiveId);
        if (objective) {
          objective.status = status;
        }
      });
      try {
        const response = await fetch(`/api/okrs/${objectiveId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update status');
      } catch (error) {
        console.error("Failed to update status:", error);
        set({ okrs: originalOkrs });
      }
    },
    deleteObjective: async (objectiveId: string) => {
      const originalOkrs = get().okrs;
      set(state => {
        state.okrs = state.okrs.filter(o => o.id !== objectiveId);
      });
      try {
        const response = await fetch(`/api/okrs/${objectiveId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete objective');
      } catch (error) {
        console.error("Failed to delete objective:", error);
        set({ okrs: originalOkrs });
      }
    },
    getObjectiveById: (id) => {
      return get().okrs.find(o => o.id === id);
    },
    setOwnerFilter: (owner) => {
      set({ ownerFilter: owner });
    },
    setStatusFilter: (status) => {
      set({ statusFilter: status });
    },
  }))
);