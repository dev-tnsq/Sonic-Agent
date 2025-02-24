'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type NodeType = 'security' | 'monitor' | 'ai' | 'output';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    code?: string;
    analysis?: string;
    config?: any;
  };
  connectedTo?: string[];
}

interface WorkflowContextType {
  nodes: WorkflowNode[];
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  connectNodes: (sourceId: string, targetId: string) => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);

  const addNode = (type: NodeType, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
      },
      connectedTo: []
    };
    setNodes(prev => [...prev, newNode]);
  };

  const updateNode = (id: string, data: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, ...data } : node
    ));
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const connectNodes = (sourceId: string, targetId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === sourceId) {
        return {
          ...node,
          connectedTo: [...(node.connectedTo || []), targetId]
        };
      }
      return node;
    }));
  };

  return (
    <WorkflowContext.Provider value={{
      nodes,
      addNode,
      updateNode,
      removeNode,
      connectNodes
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
