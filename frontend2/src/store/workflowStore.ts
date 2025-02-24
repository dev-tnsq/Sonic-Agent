import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

interface WorkflowState {
  workflows: Map<string, { nodes: Node[]; edges: Edge[] }>;
  activeWorkflowId: string | null;
  addWorkflow: (id: string, nodes: Node[], edges: Edge[]) => void;
  updateWorkflow: (id: string, nodes: Node[], edges: Edge[]) => void;
  setActiveWorkflow: (id: string) => void;
  deleteWorkflow: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      workflows: new Map(),
      activeWorkflowId: null,
      
      addWorkflow: (id, nodes, edges) => set((state) => ({
        workflows: new Map(state.workflows).set(id, { nodes, edges }),
        activeWorkflowId: id
      })),
      
      updateWorkflow: (id, nodes, edges) => set((state) => ({
        workflows: new Map(state.workflows).set(id, { nodes, edges })
      })),
      
      setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
      
      deleteWorkflow: (id) => set((state) => {
        const workflows = new Map(state.workflows);
        workflows.delete(id);
        return {
          workflows,
          activeWorkflowId: state.activeWorkflowId === id ? null : state.activeWorkflowId
        };
      })
    }),
    {
      name: 'workflow-storage',
      getStorage: () => localStorage
    }
  )
);
