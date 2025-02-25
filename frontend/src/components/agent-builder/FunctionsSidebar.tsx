'use client';

import { Agent, AgentFunction } from '@/types/agent';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DraggableFunction } from './DraggableFunction';
import { Shield, LineChart, Activity, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { ClientOnly } from '@/components/ClientOnly';

interface FunctionsSidebarProps {
  agent: Partial<Agent>;
  onFunctionAdd: (func: AgentFunction) => void;
}

const availableFunctions: AgentFunction[] = [
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Analyze smart contracts for vulnerabilities',
    type: 'security',
    category: 'Security',
    icon: Shield.name,
    config: {
      riskThreshold: 80,
      alertsEnabled: true,
      monitoredContracts: []
    }
  },
  {
    id: 'trade-executor',
    name: 'Trade Executor',
    description: 'Execute trades based on price targets',
    type: 'trading',
    category: 'Trading',
    icon: TrendingUp.name,
    config: {
      buyPrice: 0,
      sellPrice: 0,
      maxAmount: 0,
      stopLoss: 0,
      slippage: 1
    }
  },
  {
    id: 'price-monitor',
    name: 'Price Monitor',
    description: 'Monitor token prices and send alerts',
    type: 'monitor',
    category: 'Monitor',
    icon: Activity.name,
    config: {
      targetPrice: 0,
      alertType: 'above',
      interval: 60
    }
  }
];

export function FunctionsSidebar({ agent, onFunctionAdd }: FunctionsSidebarProps) {
  const { isConnected } = useAccount();

  const functionsByCategory = availableFunctions.reduce((acc, func) => {
    const category = func.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(func);
    return acc;
  }, {} as Record<string, AgentFunction[]>);

  return (
    <Card className="h-full bg-black text-white">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Functions</h2>
        <code className="text-sm text-[#98FF98]">agent api</code>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)] px-4">
        <div className="space-y-8">
          {Object.entries(functionsByCategory).map(([category, functions]) => (
            <div key={category}>
              <h3 className="text-xl text-gray-400 mb-4 flex items-center gap-2">
                {category === 'Security' && <Shield className="h-5 w-5" />}
                {category === 'Trading' && <TrendingUp className="h-5 w-5" />}
                {category === 'Monitor' && <Activity className="h-5 w-5" />}
                {category}
              </h3>
              <div className="space-y-4">
                {functions.map((func) => (
                  <DraggableFunction 
                    key={func.id} 
                    func={func}
                    onAdd={onFunctionAdd}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[#333] mt-auto">
        <p className="text-center text-gray-400 mb-4">
          Agent Cost: {agent.cost || '9.995158497'} SONIC
        </p>
        <ClientOnly>
          <WalletConnect />
        </ClientOnly>
      </div>
    </Card>
  );
} 