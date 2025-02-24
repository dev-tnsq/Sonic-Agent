import React from 'react';
import { nodeTypes } from '@/config/nodeTypes';

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-2">
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
        >
          <h3 className="font-medium text-sm">{node.label}</h3>
          <p className="text-xs text-gray-500 mt-1">{node.description}</p>
        </div>
      ))}
    </div>
  );
}
