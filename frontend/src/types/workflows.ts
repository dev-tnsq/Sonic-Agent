export type WorkflowType = 'security' | 'monitoring' | 'trading';

export interface WorkflowStep {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

export interface SecurityAnalysis {
  contractCode: string;
  vulnerabilities: Array<{
    severity: 'high' | 'medium' | 'low';
    description: string;
    location: string;
  }>;
  suggestions: string[];
}

export interface TradingRule {
  targetPrice: number;
  action: 'buy' | 'sell';
  amount: number;
  tokenAddress: string;
}

export interface MonitoringConfig {
  tokenAddress: string;
  metrics: Array<'price' | 'volume' | 'liquidity'>;
  alerts: Array<{
    condition: string;
    threshold: number;
    action?: TradingRule;
  }>;
}
