import { create } from 'zustand';

export type WorkflowType = 'monitor' | 'trade' | 'analyze' | 'secure';

interface WorkflowState {
  name: string;
  type: WorkflowType;
  description: string;
  conditions: any[];
  actions: any[];
  isActive: boolean;
}

interface WorkflowStore {
  workflows: WorkflowState[];
  activeWorkflow: WorkflowState | null;
  addWorkflow: (workflow: WorkflowState) => void;
  updateWorkflow: (id: string, data: Partial<WorkflowState>) => void;
  deleteWorkflow: (id: string) => void;
  setActiveWorkflow: (workflow: WorkflowState | null) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflows: [],
  activeWorkflow: null,
  addWorkflow: (workflow) => set((state) => ({ 
    workflows: [...state.workflows, workflow] 
  })),
  updateWorkflow: (id, data) => set((state) => ({
    workflows: state.workflows.map(w => 
      w.name === id ? { ...w, ...data } : w
    )
  })),
  deleteWorkflow: (id) => set((state) => ({
    workflows: state.workflows.filter(w => w.name !== id)
  })),
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow })
}));
