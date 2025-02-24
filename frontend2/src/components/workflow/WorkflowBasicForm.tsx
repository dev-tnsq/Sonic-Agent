'use client';

import { WorkflowConfig, WorkflowCategory } from '@/types/workflow';

const CATEGORIES: WorkflowCategory[] = ['monitoring', 'scanning', 'trading', 'security', 'analytics'];

interface Props {
  config: WorkflowConfig;
  onChange: (config: WorkflowConfig) => void;
  onNext: () => void;
}

export function WorkflowBasicForm({ config, onChange, onNext }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Workflow Name</label>
        <input
          type="text"
          value={config.name}
          onChange={e => onChange({ ...config, name: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5"
          placeholder="My Workflow"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={config.category}
          onChange={e => onChange({ ...config, category: e.target.value as WorkflowCategory })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={config.description}
          onChange={e => onChange({ ...config, description: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5"
          rows={4}
          placeholder="Describe what this workflow does..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!config.name}
          className="px-4 py-2 bg-blue-500 rounded-lg disabled:opacity-50"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
