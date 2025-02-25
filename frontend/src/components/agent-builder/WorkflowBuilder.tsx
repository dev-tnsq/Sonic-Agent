'use client';

import { useDrop } from 'react-dnd';
import { Agent, AgentFunction, TradingConfig, SecurityConfig } from '@/types/agent';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface WorkflowBuilderProps {
  agent: Partial<Agent>;
  onChange: (agent: Partial<Agent>) => void;
}

interface NodeData {
  label: string;
  type: string;
  icon?: any;
  config?: TradingConfig | SecurityConfig;
}

// Custom Node Component
function CustomNode({ data, id }: { data: NodeData; id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderTradingForm = (config: TradingConfig = {}) => (
    <div className="space-y-4">
      <div>
        <Label>Target Price</Label>
        <Input 
          type="number"
          placeholder="Enter target price"
          value={config.price || ''}
          onChange={(e) => {
            data.config = { 
              ...data.config as TradingConfig, 
              price: parseFloat(e.target.value) 
            };
          }}
        />
      </div>
      <div>
        <Label>Amount</Label>
        <Input 
          type="number"
          placeholder="Enter amount"
          value={config.amount || ''}
          onChange={(e) => {
            data.config = { 
              ...data.config as TradingConfig, 
              amount: parseFloat(e.target.value) 
            };
          }}
        />
      </div>
      <div>
        <Label>Slippage (%)</Label>
        <Input 
          type="number"
          placeholder="Enter slippage"
          value={config.slippage || ''}
          onChange={(e) => {
            data.config = { 
              ...data.config as TradingConfig, 
              slippage: parseFloat(e.target.value) 
            };
          }}
        />
      </div>
      {data.type === 'price-monitor' && (
        <div>
          <Label>Update Interval (seconds)</Label>
          <Input 
            type="number"
            placeholder="Enter interval"
            value={config.interval || ''}
            onChange={(e) => {
              data.config = { 
                ...data.config as TradingConfig, 
                interval: parseInt(e.target.value) 
              };
            }}
          />
        </div>
      )}
    </div>
  );

  const renderSecurityForm = (config: SecurityConfig = {}) => (
    <div className="space-y-4">
      <div>
        <Label>Risk Threshold</Label>
        <Input 
          type="number"
          placeholder="Enter risk threshold"
          value={config.riskThreshold || ''}
          onChange={(e) => {
            data.config = { 
              ...data.config as SecurityConfig, 
              riskThreshold: parseInt(e.target.value) 
            };
          }}
        />
      </div>
      <div>
        <Label>Max Exposure</Label>
        <Input 
          type="number"
          placeholder="Enter max exposure"
          value={config.maxExposure || ''}
          onChange={(e) => {
            data.config = { 
              ...data.config as SecurityConfig, 
              maxExposure: parseInt(e.target.value) 
            };
          }}
        />
      </div>
      <div>
        <Label>Alert Threshold</Label>
        <Input 
          type="number"
          placeholder="Enter alert threshold"
          value={config.alertThreshold || ''}
          onChange={(e) => {
            data.config = { 
              ...data.config as SecurityConfig, 
              alertThreshold: parseInt(e.target.value) 
            };
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox"
          checked={config.alertsEnabled || false}
          onChange={(e) => {
            data.config = { 
              ...data.config as SecurityConfig, 
              alertsEnabled: e.target.checked 
            };
          }}
        />
        <Label>Enable Alerts</Label>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center">
          {data.icon && <data.icon className="h-4 w-4 mr-2" />}
          <div className="ml-2">
            <div className="text-sm font-bold">{data.label}</div>
            <div className="text-xs text-gray-500">{data.type}</div>
            {data.config && (
              <div className="text-xs text-primary">
                {data.type.includes('trading') ? 
                  `Price: ${(data.config as TradingConfig).price || 0}` :
                  `Risk: ${(data.config as SecurityConfig).riskThreshold || 0}%`
                }
              </div>
            )}
          </div>
        </div>
        <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Configure {data.label}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {data.type.includes('trading') ? 
            renderTradingForm(data.config as TradingConfig) : 
            renderSecurityForm(data.config as SecurityConfig)
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export function WorkflowBuilder({ agent, onChange }: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#10b981' } }, eds));
  }, [setEdges]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'function',
    drop: (item: AgentFunction & { icon?: any }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const newNode: Node = {
          id: `${item.id}-${Date.now()}`,
          type: 'custom',
          position: { x: offset.x - 250, y: offset.y - 100 },
          data: { 
            label: item.name, 
            type: item.type,
            icon: item.icon,
            config: item.config,
          },
        };
        setNodes((nds) => [...nds, newNode]);

        // Update agent's functions
        onChange({
          ...agent,
          functions: [...(agent.functions || []), item],
          tradingParams: item.type === 'trading' ? {
            buyPrice: (item.config as TradingConfig).price || 0,
            sellPrice: (item.config as TradingConfig).price || 0,
            maxAmount: (item.config as TradingConfig).amount || 0,
            stopLoss: 0,
            isActive: true
          } : agent.tradingParams,
          securityParams: item.type === 'security' ? {
            monitoredContracts: [],
            riskThreshold: (item.config as SecurityConfig).riskThreshold || 80,
            alertsEnabled: (item.config as SecurityConfig).alertsEnabled || true
          } : agent.securityParams
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Card 
      ref={drop}
      className="h-full overflow-hidden relative border-2 border-dashed bg-slate-50/50"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50/50"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 }
        }}
      >
        <Background color="#10b981" />
        <Controls />
        <MiniMap />
        <Panel position="top-center" className="bg-background/95 p-4 rounded-lg shadow-lg border my-4">
          <h3 className="font-medium">Workflow Builder</h3>
          <p className="text-sm text-muted-foreground">Configure trading and security parameters</p>
        </Panel>
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
              <PlusCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Drop Functions Here</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop trading and security functions to build your agent
            </p>
          </div>
        )}
      </ReactFlow>
    </Card>
  );
} 