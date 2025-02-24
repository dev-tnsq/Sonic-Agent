'use client';

import { useState } from 'react';
import WorkflowNode from './WorkflowNode';

interface WorkflowConfig {
  trigger: {
    condition: string;
    value: string;
  };
  action: {
    action: string;
    amount: string;
  };
}

export default function WorkflowEditor() {
  const [workflows, setWorkflows] = useState<WorkflowConfig[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowConfig>({
    trigger: { condition: 'price_below', value: '' },
    action: { action: 'buy', amount: '' }
  });

  const saveWorkflow = () => {
    setWorkflows([...workflows, currentWorkflow]);
    setCurrentWorkflow({
      trigger: { condition: 'price_below', value: '' },
      action: { action: 'buy', amount: '' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col items-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <div className="absolute -top-3 left-4 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-medium text-blue-300">
          Workflow Builder
        </div>
        
        <div className="flex gap-8 items-center relative">
          <WorkflowNode
            type="trigger"
            title="Price Trigger"
            config={currentWorkflow.trigger}
            onConfigChange={(config) => 
              setCurrentWorkflow({ ...currentWorkflow, trigger: config })
            }
          />
          <div className="relative">
            <div className="h-[2px] w-16 bg-gradient-to-r from-blue-500/50 to-green-500/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 border-2 border-gray-600 rounded-full" />
          </div>
          <WorkflowNode
            type="action"
            title="Trade Action"
            config={currentWorkflow.action}
            onConfigChange={(config) => 
              setCurrentWorkflow({ ...currentWorkflow, action: config })
            }
          />
        </div>
        
        <button
          onClick={saveWorkflow}
          className="mt-8 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 font-medium"
        >
          Save Workflow
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium px-1">Active Workflows</h3>
        <div className="space-y-3">
          {workflows.map((workflow, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-200">Workflow {index + 1}</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    When price {workflow.trigger.condition.replace('_', ' ')} ${workflow.trigger.value}, 
                    {workflow.action.action} ${workflow.action.amount} of tokens
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded bg-gray-700/50 hover:bg-gray-700 transition-colors">
                    <EditIcon />
                  </button>
                  <button className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  Active
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {workflow.trigger.condition === 'price_below' ? 'Price Trigger' : 'Volume Trigger'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EditIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
