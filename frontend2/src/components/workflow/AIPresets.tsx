'use client';

import { WorkflowType } from '@/stores/workflowStore';

const PRESETS = {
  monitor: [
    { name: 'Price Alert', description: 'Get notified when price hits target' },
    { name: 'Volatility Monitor', description: 'Track sudden price movements' },
  ],
  trade: [
    { name: 'DCA Bot', description: 'Automated dollar-cost averaging' },
    { name: 'Momentum Trading', description: 'Trade based on momentum signals' },
  ],
  analyze: [
    { name: 'Trend Analysis', description: 'AI-powered trend prediction' },
    { name: 'Sentiment Analysis', description: 'Track market sentiment' },
  ],
  secure: [
    { name: 'Contract Scanner', description: 'Find vulnerabilities in contracts' },
    { name: 'Transaction Monitor', description: 'Monitor suspicious activities' },
  ],
};

interface Props {
  type: WorkflowType;
  onSelect: () => void;
  onBack: () => void;
}

export function AIPresets({ type, onSelect, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {PRESETS[type].map((preset, i) => (
          <button
            key={i}
            onClick={onSelect}
            className="p-4 text-left bg-gray-700/50 hover:bg-gray-700 
                     border border-gray-600 rounded-lg transition-colors"
          >
            <h3 className="font-medium mb-2">{preset.name}</h3>
            <p className="text-sm text-gray-400">{preset.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
}
