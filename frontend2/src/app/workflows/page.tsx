'use client';

import { useState } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';

export default function WorkflowsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Workflows</h1>
          <p className="text-gray-400">Create and manage your automated workflows</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2"
        >
          <span>+</span>
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Workflow Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['Monitoring', 'Trading', 'Security', 'Analytics'].map(category => (
          <div 
            key={category}
            className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
          >
            <h3 className="text-lg font-medium mb-2">{category}</h3>
            <p className="text-sm text-gray-400">
              {getDescriptionForCategory(category)}
            </p>
          </div>
        ))}
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
        <div className="grid gap-4">
          {/* Example Workflow Card */}
          <WorkflowCard
            name="Price Monitor"
            description="Monitor SONIC price and send alerts"
            status="active"
            lastRun="2 minutes ago"
          />
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateWorkflowModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function WorkflowCard({ name, description, status, lastRun }: any) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{name}</h3>
        <div className={`px-2 py-1 rounded text-xs ${
          status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {status}
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Last run: {lastRun}</span>
        <button className="text-blue-400 hover:text-blue-300">Configure</button>
      </div>
    </div>
  );
}

function CreateWorkflowModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'monitoring',
    description: ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 w-[32rem] border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Workflow</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Workflow Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
              placeholder="My Workflow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
            >
              <option value="monitoring">Monitoring</option>
              <option value="trading">Trading</option>
              <option value="security">Security</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
              rows={3}
              placeholder="What does this workflow do?"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {/* Handle create */}}
            disabled={!formData.name}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50"
          >
            Create Workflow
          </button>
        </div>
      </div>
    </div>
  );
}

function getDescriptionForCategory(category: string): string {
  const descriptions = {
    'Monitoring': 'Track prices and market movements',
    'Trading': 'Automated trading strategies',
    'Security': 'Smart contract monitoring and alerts',
    'Analytics': 'AI-powered market analysis'
  };
  return descriptions[category as keyof typeof descriptions] || '';
}
