'use client';

import { WorkflowConfig } from '@/types/workflow';

interface Props {
  config: WorkflowConfig;
  onChange: (config: WorkflowConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WorkflowScheduler({ config, onChange, onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Execution Schedule</label>
        <select
          value={config.schedule?.frequency || 'manual'}
          onChange={e => onChange({
            ...config,
            schedule: { ...config.schedule, frequency: e.target.value as any }
          })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5"
        >
          <option value="manual">Manual Execution</option>
          <option value="hourly">Every Hour</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {config.schedule?.frequency !== 'manual' && (
        <div>
          <label className="block text-sm font-medium mb-2">Execution Time</label>
          <input
            type="time"
            value={config.schedule?.time || ''}
            onChange={e => onChange({
              ...config,
              schedule: { ...config.schedule, frequency: config.schedule?.frequency || 'manual', time: e.target.value }
            })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Notifications</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.notifications?.onSuccess || false}
              onChange={e => onChange({
                ...config,
                notifications: {
                  ...config.notifications,
                  onSuccess: e.target.checked,
                  onFailure: config.notifications?.onFailure || false,
                  channels: config.notifications?.channels || []
                }
              })}
              className="rounded border-gray-700 bg-gray-900"
            />
            Notify on Success
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.notifications?.onFailure || false}
              onChange={e => onChange({
                ...config,
                notifications: {
                  ...config.notifications,
                  onSuccess: config.notifications?.onSuccess || false,
                  onFailure: e.target.checked,
                  channels: config.notifications?.channels || []
                }
              })}
              className="rounded border-gray-700 bg-gray-900"
            />
            Notify on Failure
          </label>
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
          onClick={onNext}
          className="px-4 py-2 bg-blue-500 rounded-lg"
        >
          Preview Workflow
        </button>
      </div>
    </div>
  );
}
