'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Agent, AgentFunction } from '@/types/agent';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { Shield, Zap, Brain, AlertTriangle } from 'lucide-react';
import { FunctionsSidebar } from '@/components/agent-builder/FunctionsSidebar';
import { WorkflowBuilder } from '@/components/agent-builder/WorkflowBuilder';
import { ClientOnly } from '@/components/ClientOnly';

export default function AgentBuilderPage() {
  const { address } = useAccount();
  const [agent, setAgent] = useState<Partial<Agent>>({
    name: '',
    codename: '',
    description: '',
    type: 'TRADING',
    functions: [],
    configuration: {
      provider: 'deepseek',
      model: 'deepseek-coder-33b',
    },
    tradingParams: {
      buyPrice: 0,
      sellPrice: 0,
      maxAmount: 0,
      stopLoss: 0,
      isActive: true
    },
    securityParams: {
      monitoredContracts: [],
      riskThreshold: 80,
      alertsEnabled: true
    }
  });

  const handleFunctionAdd = (func: AgentFunction) => {
    setAgent(prev => ({
      ...prev,
      functions: [...(prev.functions || []), func],
      // Update trading params if it's a trading function
      tradingParams: func.type === 'trading' ? {
        ...prev.tradingParams,
        buyPrice: (func.config as any).buyPrice || 0,
        sellPrice: (func.config as any).sellPrice || 0,
        maxAmount: (func.config as any).maxAmount || 0,
        stopLoss: (func.config as any).stopLoss || 0,
      } : prev.tradingParams,
      // Update security params if it's a security function
      securityParams: func.type === 'security' ? {
        ...prev.securityParams,
        monitoredContracts: (func.config as any).monitoredContracts || [],
        riskThreshold: (func.config as any).riskThreshold || 80,
        alertsEnabled: (func.config as any).alertsEnabled || true
      } : prev.securityParams
    }));
  };

  const handleAgentUpdate = (updatedAgent: Partial<Agent>) => {
    setAgent(updatedAgent);
  };

  const handleDeploy = async () => {
    // TODO: Implement agent deployment
    console.log('Deploying agent:', agent);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#98FF98] mb-2">AI Agent Builder</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Create intelligent agents for automated trading, security monitoring, and price tracking
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Panel - Agent Details */}
          <Card className="col-span-3 bg-[#1A1A1A] border-[#333] p-6 overflow-auto">
            <h2 className="text-[#98FF98] text-xl font-semibold mb-6">Agent Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-gray-400">Agent Name</Label>
                <Input 
                  placeholder="Enter agent name"
                  className="bg-[#2A2A2A] border-[#333] mt-2"
                  value={agent.name}
                  onChange={(e) => setAgent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-gray-400">Codename</Label>
                <Input 
                  placeholder="Enter codename"
                  className="bg-[#2A2A2A] border-[#333] mt-2"
                  value={agent.codename}
                  onChange={(e) => setAgent(prev => ({ ...prev, codename: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-gray-400">Agent Type</Label>
                <Select 
                  value={agent.type}
                  onValueChange={(value) => setAgent(prev => ({ ...prev, type: value as 'TRADING' | 'SECURITY' }))}
                >
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333] mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRADING">Trading Agent</SelectItem>
                    <SelectItem value="SECURITY">Security Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400">LLM Provider</Label>
                <Select 
                  value={agent.configuration?.provider}
                  onValueChange={(value) => setAgent(prev => ({
                    ...prev,
                    configuration: { ...prev.configuration, provider: value }
                  }))}
                >
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333] mt-2">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400">LLM Model</Label>
                <Select 
                  value={agent.configuration?.model}
                  onValueChange={(value) => setAgent(prev => ({
                    ...prev,
                    configuration: { ...prev.configuration, model: value }
                  }))}
                >
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333] mt-2">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-coder-33b">DeepSeek Coder 33B</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400">Description</Label>
                <Textarea 
                  placeholder="Describe your agent's purpose"
                  className="bg-[#2A2A2A] border-[#333] mt-2 h-24"
                  value={agent.description}
                  onChange={(e) => setAgent(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button 
                className="w-full bg-[#98FF98] text-black hover:bg-[#7FFF7F]"
                onClick={handleDeploy}
                disabled={!address}
              >
                Deploy Agent
              </Button>
            </div>
          </Card>

          {/* Middle Panel - Workflow Builder */}
          <div className="col-span-6 h-full">
            <WorkflowBuilder 
              agent={agent}
              onChange={handleAgentUpdate}
            />
          </div>

          {/* Right Panel - Functions */}
          <div className="col-span-3 h-full">
            <FunctionsSidebar 
              agent={agent}
              onFunctionAdd={handleFunctionAdd}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 