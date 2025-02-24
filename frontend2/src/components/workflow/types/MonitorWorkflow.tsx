'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  name: string;
  onBack: () => void;
}

interface MonitorConfig {
  token: string;
  priceThreshold: number;
  alertType: 'above' | 'below' | 'change';
  percentage?: number;
  notifications: {
    telegram: boolean;
    email: boolean;
    discord: boolean;
  };
}

export default function MonitorWorkflow({ name, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<MonitorConfig>({
    token: '',
    priceThreshold: 0,
    alertType: 'above',
    notifications: {
      telegram: true,
      email: false,
      discord: false
    }
  });

  const handleSubmit = async () => {
    // Implement monitor setup
    console.log('Monitor config:', config);
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
          <h2 className="text-2xl font-bold">Configure Price Monitor</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Token Address</label>
            <input
              type="text"
              value={config.token}
              onChange={(e) => setConfig({ ...config, token: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
              placeholder="Enter token contract address..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alert Type</label>
            <select
              value={config.alertType}
              onChange={(e) => setConfig({ 
                ...config, 
                alertType: e.target.value as 'above' | 'below' | 'change' 
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
            >
              <option value="above">Price Above</option>
              <option value="below">Price Below</option>
              <option value="change">Price Change %</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {config.alertType === 'change' ? 'Change Percentage' : 'Price Threshold'}
            </label>
            <input
              type="number"
              value={config.alertType === 'change' ? config.percentage : config.priceThreshold}
              onChange={(e) => setConfig({
                ...config,
                [config.alertType === 'change' ? 'percentage' : 'priceThreshold']: parseFloat(e.target.value)
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
              placeholder={config.alertType === 'change' ? 'Enter % change...' : 'Enter price threshold...'}
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">←</button>
        <h2 className="text-2xl font-bold">Notification Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.notifications.telegram}
              onChange={(e) => setConfig({
                ...config,
                notifications: {
                  ...config.notifications,
                  telegram: e.target.checked
                }
              })}
              className="rounded border-gray-700 bg-gray-800"
            />
            <span>Telegram Notifications</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.notifications.email}
              onChange={(e) => setConfig({
                ...config,
                notifications: {
                  ...config.notifications,
                  email: e.target.checked
                }
              })}
              className="rounded border-gray-700 bg-gray-800"
            />
            <span>Email Notifications</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.notifications.discord}
              onChange={(e) => setConfig({
                ...config,
                notifications: {
                  ...config.notifications,
                  discord: e.target.checked
                }
              })}
              className="rounded border-gray-700 bg-gray-800"
            />
            <span>Discord Notifications</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg"
        >
          Create Monitor
        </button>
      </div>
    </div>
  );
}
