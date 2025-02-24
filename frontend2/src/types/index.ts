export * from './workflow';

export interface ChainState {
  sonic: {
    connected: boolean;
    balance: string;
  };
  ethereum: {
    connected: boolean;
    balance: string;
  };
}

export interface Workflow {
  id: number;
  name: string;
  chain: string;
  triggers: Trigger[];
  actions: Action[];
  status: 'active' | 'paused' | 'completed';
}

export interface Trigger {
  type: 'price' | 'time' | 'event';
  condition: string;
  value: string | number;
}

export interface Action {
  type: 'buy' | 'sell' | 'swap' | 'bridge';
  params: Record<string, any>;
}

export interface AIAnalysisResult {
  vulnerabilities: Array<{
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    location?: {
      line: number;
      column: number;
    };
  }>;
  suggestions: string[];
  score: number;
}
