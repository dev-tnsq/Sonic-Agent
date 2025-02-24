'use client';

import { useState } from 'react';
import SecurityWorkflow from './types/SecurityWorkflow';
import MonitorWorkflow from './types/MonitorWorkflow';
import AITradingWorkflow from './types/AITradingWorkflow';

type WorkflowType = 'security' | 'monitor' | 'trading';

const WORKFLOW_OPTIONS = [
  {
    type: 'security',
    title: 'Smart Contract Security',
    icon: '🔒',
    description: 'AI-powered security analysis and vulnerability detection'
  },
  {
    type: 'monitor',
    title: 'Token Monitor',
    icon: '📊',
    description: 'Track prices and set custom alerts'
  },
  {
    type: 'trading',
    title: 'AI Trading Bot',
    icon: '🤖',
    description: 'Automated trading with AI predictions'
  }
] as const;

export default function NewWorkflow() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkflowType | null>(null);

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Name Your Workflow</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workflow name..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          />
          <button
            onClick={() => setStep(2)}
            disabled={!name.trim()}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Choose Workflow Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WORKFLOW_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                setType(option.type);
                setStep(3);
              }}
              className="p-6 bg-gray-800 border border-gray-700 rounded-xl 
                       hover:border-blue-500/50 transition-all text-left"
            >
              <span className="text-3xl mb-4 block">{option.icon}</span>
              <h3 className="text-lg font-medium mb-2">{option.title}</h3>
              <p className="text-sm text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Show specific workflow type component
  if (!type) return null;

  const WorkflowComponent = {
    security: SecurityWorkflow,
    monitor: MonitorWorkflow,
    trading: AITradingWorkflow
  }[type];

  return <WorkflowComponent name={name} onBack={() => setStep(2)} />;
}
