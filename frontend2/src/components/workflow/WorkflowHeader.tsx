import React from 'react';
import { Button } from '@/components/ui/button';

interface WorkflowHeaderProps {
  isExecuting: boolean;
  onExecute: () => void;
}

export function WorkflowHeader({ isExecuting, onExecute }: WorkflowHeaderProps) {
  return (
    <div className="h-16 bg-white border-b px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          onClick={onExecute}
          disabled={isExecuting}
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isExecuting ? 'Executing...' : 'Run Workflow'}
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
