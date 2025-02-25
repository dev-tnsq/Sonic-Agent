export type AgentType = 'TRADING' | 'SECURITY';

export interface AgentFunction {
  id: string;
  name: string;
  description: string;
  type: 'trading' | 'security';
  category: 'Trading' | 'Security';
  icon?: string;
  config: TradingConfig | SecurityConfig;
}

export interface Agent {
  id: string;
  name: string;
  codename: string;
  description: string;
  type: AgentType;
  functions: AgentFunction[];
  configuration: AgentConfiguration;
  tradingParams?: TradingParams;
  securityParams?: SecurityParams;
}

export interface AgentConfiguration {
  provider?: string;
  model?: string;
  parameters?: Record<string, any>;
}

export interface TradingParams {
  buyPrice: number;
  sellPrice: number;
  maxAmount: number;
  stopLoss: number;
  isActive: boolean;
}

export interface SecurityParams {
  monitoredContracts: string[];
  riskThreshold: number;
  alertsEnabled: boolean;
}

export interface TradingConfig {
  price?: number;
  amount?: number;
  slippage?: number;
  interval?: number;
  priceChange?: number;
}

export interface SecurityConfig {
  riskThreshold?: number;
  alertsEnabled?: boolean;
  maxExposure?: number;
  alertThreshold?: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    type: string;
    config?: TradingConfig | SecurityConfig;
  };
} 