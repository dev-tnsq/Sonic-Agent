'use client';

import { useWorkflow } from '@/contexts/WorkflowContext';
import { SecurityConfig } from './configs/SecurityConfig';
import { MonitorConfig } from './configs/MonitorConfig';
import { AIConfig } from './configs/AIConfig';
import { OutputConfig } from './configs/OutputConfig';

interface Props {
  nodeId: string;
  onClose: () => void;
}

export default function ConfigPanel({ nodeId, onClose }: Props) {
  const { nodes, updateNode } = useWorkflow();
  const node = nodes.find(n => n.id === nodeId);

  if (!node) return null;

  const renderConfig = () => {
    switch (node.type) {
      case 'security':
        return (
          <SecurityConfig
            data={node.data}
            onChange={(data) => updateNode(nodeId, { data })}
          />
        );
      case 'monitor':
        return (
          <MonitorConfig
            data={node.data}
            onChange={(data) => updateNode(nodeId, { data })}
          />
        );
      case 'ai':
        return (
          <AIConfig
            data={node.data}
            onChange={(data) => updateNode(nodeId, { data })}
          />
        );
      case 'output':
        return (
          <OutputConfig
            data={node.data}
            onChange={(data) => updateNode(nodeId, { data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-medium">{node.data.label} Configuration</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderConfig()}
      </div>
    </div>
  );
}
