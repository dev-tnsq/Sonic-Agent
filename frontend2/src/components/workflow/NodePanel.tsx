'use client';

import { useWorkflow, NodeType } from '@/contexts/WorkflowContext';

const NODE_TYPES: Array<{
  type: NodeType;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    type: 'security',
    label: 'Security Scanner',
    icon: '🔒',
    description: 'Scan smart contracts for vulnerabilities'
  },
  {
    type: 'monitor',
    label: 'Price Monitor',
    icon: '📈',
    description: 'Track token prices and set alerts'
  },
  {
    type: 'ai',
    label: 'AI Analysis',
    icon: '🤖',
    description: 'AI-powered code and market analysis'
  },
  {
    type: 'output',
    label: 'Output',
    icon: '📤',
    description: 'Display results and execute actions'
  }
];

export default function NodePanel() {
  const { addNode } = useWorkflow();

  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Nodes</h2>
      <div className="space-y-3">
        {NODE_TYPES.map(node => (
          <div
            key={node.type}
            draggable
            onDragStart={e => handleDragStart(e, node.type)}
            className="p-4 bg-gray-700/50 rounded-lg cursor-move hover:bg-gray-700 
                     border border-gray-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{node.icon}</span>
              <div>
                <h3 className="font-medium">{node.label}</h3>
                <p className="text-sm text-gray-400">{node.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
