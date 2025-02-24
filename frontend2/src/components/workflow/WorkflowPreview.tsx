'use client';

import { WorkflowTemplate, WorkflowConfig } from '@/types/workflow';

interface Props {
  template: WorkflowTemplate;
  config: WorkflowConfig;
  onBack: () => void;
  onSubmit: (template: WorkflowTemplate, config: WorkflowConfig) => void;
}

export function WorkflowPreview({ template, config, onBack, onSubmit }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <h3 className="font-medium mb-2">Basic Information</h3>
          <dl className="space-y-1">
            <dt className="text-sm text-gray-400">Name</dt>
            <dd className="ml-4">{config.name}</dd>
            <dt className="text-sm text-gray-400 mt-2">Category</dt>
            <dd className="ml-4">{config.category}</dd>
            <dt className="text-sm text-gray-400 mt-2">Description</dt>
            <dd className="ml-4">{config.description}</dd>
          </dl>
        </div>

        <div className="p-4 bg-gray-700/50 rounded-lg">
          <h3 className="font-medium mb-2">Steps</h3>
          <div className="space-y-2">
            {template.steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <span className="text-gray-400">{index + 1}.</span>
                <span>{step.name}</span>
                <span className="text-sm text-gray-400">
                  ({JSON.stringify(step.config)})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-700/50 rounded-lg">
          <h3 className="font-medium mb-2">Schedule</h3>
          <p>
            {config.schedule?.frequency === 'manual' 
              ? 'Manual Execution'
              : `${config.schedule?.frequency} at ${config.schedule?.time}`
            }
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={() => onSubmit(template, config)}
          className="px-4 py-2 bg-green-500 rounded-lg"
        >
          Create Workflow
        </button>
      </div>
    </div>
  );
}
