'use client';

import { useState, useCallback } from 'react';
import { useWorkflow, NodeType } from '@/contexts/WorkflowContext';
import { SecurityNode } from './nodes/SecurityNode';
import { MonitorNode } from './nodes/MonitorNode';
import { AINode } from './nodes/AINode';
import { OutputNode } from './nodes/OutputNode';

interface Props {
  onNodeSelect: (nodeId: string) => void;
}

export default function Canvas({ onNodeSelect }: Props) {
  const { nodes, addNode, updateNode } = useWorkflow();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
    if (!nodeType) return;

    // Get drop position relative to canvas
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    addNode(nodeType, { x, y });
  }, [addNode]);

  const renderNode = (nodeType: NodeType) => {
    switch (nodeType) {
      case 'security':
        return SecurityNode;
      case 'monitor':
        return MonitorNode;
      case 'ai':
        return AINode;
      case 'output':
        return OutputNode;
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full h-full relative ${
        isDraggingOver ? 'bg-blue-500/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setIsDraggingOver(false)}
    >
      {nodes.map(node => {
        const NodeComponent = renderNode(node.type);
        if (!NodeComponent) return null;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.position.x,
              top: node.position.y,
            }}
            onClick={() => onNodeSelect(node.id)}
          >
            <NodeComponent
              data={node.data}
              onUpdate={(data) => updateNode(node.id, { data })}
            />
          </div>
        );
      })}
    </div>
  );
}
