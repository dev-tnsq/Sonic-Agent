'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  Background,
  Controls,
  NodeChange,
  EdgeChange,
  ReactFlowProvider
} from 'reactflow';
import SecurityNode from '../nodes/SecurityNode';
import AIAnalysisNode from '../nodes/AIAnalysisNode';
import OutputNode from '../nodes/OutputNode';
import TokenPriceNode from '../nodes/TokenPriceNode';
import 'reactflow/dist/style.css';

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
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          className="bg-gray-50"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default WorkflowCanvas;
