'use client';

import React, { useState, useCallback } from 'react';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { WorkflowSidebar } from '@/components/workflow/WorkflowSidebar';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { useWorkflowStore } from '@/store/workflowStore';
import { WorkflowExecutor } from '@/lib/workflow';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import 'reactflow/dist/style.css';

export default function WorkflowPage() {
  const { workflows, activeWorkflowId, addWorkflow, updateWorkflow } = useWorkflowStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [workflowName, setWorkflowName] = useState('');

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const createNewWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    const id = uuidv4();
    addWorkflow(id, [], []);
    setWorkflowName('');
    toast.success('Workflow created successfully');
  }, [workflowName, addWorkflow]);

  const executeWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Add some nodes to your workflow first');
      return;
    }

    setIsExecuting(true);
    try {
      const executor = new WorkflowExecutor();
      const results = await executor.executeWorkflow(nodes, edges);
      
      setNodes(nodes.map(node => ({
        ...node,
        data: { ...node.data, result: results.get(node.id) }
      })));
      
      toast.success('Workflow executed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <WorkflowSidebar 
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
        onCreateWorkflow={createNewWorkflow}
      />
      <div className="flex-1 flex flex-col">
        <WorkflowHeader 
          isExecuting={isExecuting}
          onExecute={executeWorkflow}
        />
        <div className="flex-1">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
        </div>
      </div>
    </div>
  );
}
