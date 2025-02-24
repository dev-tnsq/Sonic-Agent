import React from 'react';
import { NodeType } from '@/types';

interface WorkflowSidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const nodeTypes: Array<{ type: NodeType; label: string; description: string }> = [
  {
    type: 'security',
    label: 'Security Node',
    description: 'Analyze smart contract security'
  },
  {
    type: 'aiAnalysis',
    label: 'AI Analysis',
    description: 'AI-powered code analysis'
  },
  {
    type: 'tokenPrice',
    label: 'Token Price',
    description: 'Fetch token prices'
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Display results'
  }
];

export const WorkflowSidebar = ({ onDragStart }: WorkflowSidebarProps) => {
  return (
    <aside className="w-64 bg-white p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Workflow Nodes</h2>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <h3 className="font-medium">{node.label}</h3>
            <p className="text-sm text-gray-500">{node.description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};
