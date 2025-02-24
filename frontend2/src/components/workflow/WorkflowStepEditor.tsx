'use client';

import { useState } from 'react';
import { WorkflowTemplate, WorkflowStep } from '@/types/workflow';

interface Props {
  template: WorkflowTemplate;
  onNext: () => void;
  onBack: () => void;
}

export function WorkflowStepEditor({ template, onNext, onBack }: Props) {
  const [steps, setSteps] = useState<WorkflowStep[]>(template.steps);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const updateStep = (id: string, config: any) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, config } : step
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {steps.map(step => (
          <div
            key={step.id}
            className={`
              p-4 rounded-lg border transition-all cursor-pointer
              ${selectedStep === step.id 
                ? 'bg-blue-500/20 border-blue-500/30' 
                : 'bg-gray-700/50 border-gray-700'
              }
            `}
            onClick={() => setSelectedStep(step.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{step.name}</h3>
              <span className="text-sm text-gray-400">{step.type}</span>
            </div>

            {selectedStep === step.id && (
              <div className="mt-4 space-y-4">
                {Object.entries(step.config).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={typeof value === 'number' ? 'number' : 'text'}
                      value={value as string}
                      onChange={e => updateStep(step.id, {
                        ...step.config,
                        [key]: e.target.value
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-500 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
