export type WorkflowCategory = 
  | 'monitoring' 
  | 'scanning' 
  | 'trading' 
  | 'security' 
  | 'analytics';

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: WorkflowCategory;
  description: string;
  icon: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action';
  name: string;
  config: any;
  dependsOn?: string[];
}

export interface WorkflowConfig {
  name: string;
  description: string;
  category: WorkflowCategory;
  schedule?: {
    frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
    time?: string;
    days?: string[];
  };
  notifications?: {
    onSuccess: boolean;
    onFailure: boolean;
    channels: string[];
  };
}

export type NodeType = 
  | 'security' 
  | 'aiAnalysis' 
  | 'tokenPrice' 
  | 'output' 
  | 'trigger' 
  | 'action';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface WorkflowData {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: any[];
  createdAt: number;
  updatedAt: number;
}

export interface NodeData {
  label: string;
  description?: string;
  inputs?: Array<{
    name: string;
    type: string;
    label?: string;
    options?: string[];
  }>;
  outputs?: string[];
}

export interface WorkflowExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
}
