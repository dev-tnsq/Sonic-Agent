import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NodePalette } from './NodePalette';
import { NodeType } from '@/types/workflow';

interface WorkflowSidebarProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onCreateWorkflow: () => void;
}

export function WorkflowSidebar({
  workflowName,
  onWorkflowNameChange,
  onCreateWorkflow
}: WorkflowSidebarProps) {
  return (
    <div className="w-80 bg-white border-r p-4 flex flex-col">
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold">Create Workflow</h2>
        <div className="space-y-2">
          <Input
            placeholder="Workflow name"
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
          />
          <Button 
            onClick={onCreateWorkflow}
            className="w-full"
          >
            Create New Workflow
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Available Nodes</h3>
        <NodePalette />
      </div>
    </div>
  );
}
