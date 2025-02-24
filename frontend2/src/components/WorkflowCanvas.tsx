import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  addEdge,
  Node
} from 'reactflow';
import SecurityNode from './nodes/SecurityNode';
import AIAnalysisNode from './nodes/AIAnalysisNode';
import OutputNode from './nodes/OutputNode';
import TokenPriceNode from './nodes/TokenPriceNode';

const nodeTypes = {
  security: SecurityNode,
  aiAnalysis: AIAnalysisNode,
  output: OutputNode,
  tokenPrice: TokenPriceNode,
};

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeDrop: (event: React.DragEvent) => void;
}

export const WorkflowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDrop,
}: WorkflowCanvasProps) => {
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    onNodeDrop(event);
  }, [onNodeDrop]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div 
      style={{ width: '100%', height: '100vh' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
