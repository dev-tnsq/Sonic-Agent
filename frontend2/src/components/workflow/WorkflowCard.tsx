'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface WorkflowData {
  name: string;
  trigger: {
    name: string;
    slug: string;
    parameters: Record<string, any>;
  };
  steps: Array<{
    name: string;
    function: string;
    function_id: string;
    parameters: Record<string, any>;
  }>;
}

interface Props {
  workflow: WorkflowData;
}

export default function WorkflowCard({ workflow }: Props) {
  const [triggerExpanded, setTriggerExpanded] = useState(false);
  const [stepsExpanded, setStepsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-orange-500/30 overflow-hidden">
      {/* Trigger Section */}
      <div>
        <div className="flex justify-between p-3 bg-orange-500/5">
          <h3 className="text-lg font-bold">{workflow.name}</h3>
          <button onClick={() => setTriggerExpanded(!triggerExpanded)}>
            {triggerExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="border-t border-orange-500/30" />
        
        <div className="p-4">
          {triggerExpanded ? (
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-400">Trigger name:</span>
                <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-sm">
                  {workflow.trigger.name}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Slug:</span>
                <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-sm">
                  {workflow.trigger.slug}
                </span>
              </div>
              <pre className="text-xs bg-gray-800 p-2 rounded-lg overflow-auto">
                {JSON.stringify({ parameters: workflow.trigger.parameters }, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center text-gray-400 text-3xl">⋯</div>
          )}
        </div>
      </div>

      {/* Steps Section */}
      <div>
        <div className="border-t border-orange-500/30" />
        <div className="flex justify-between p-3 bg-orange-500/5">
          <h3 className="text-lg font-bold">Steps</h3>
          <button onClick={() => setStepsExpanded(!stepsExpanded)}>
            {stepsExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="border-t border-orange-500/30" />
        
        <div className="p-4">
          {stepsExpanded ? (
            <div className="space-y-6">
              {workflow.steps.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-400">Step name:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-sm">
                      {step.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Function:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-sm">
                      {step.function}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Function ID:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-sm">
                      {step.function_id}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-800 p-2 rounded-lg overflow-auto">
                    {JSON.stringify({ parameters: step.parameters }, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-3xl">⋯</div>
          )}
        </div>
      </div>
    </div>
  );
}
