'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  name: string;
  onBack: () => void;
}

interface TradingConfig {
  token: string;
  strategy: 'momentum' | 'mean_reversion' | 'trend_following';
  amount: number;
  maxSlippage: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: '5m' | '15m' | '1h' | '4h';
  stopLoss?: number;
  takeProfit?: number;
}

export default function AITradingWorkflow({ name, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<TradingConfig>({
    token: '',
    strategy: 'momentum',
    amount: 0,
    maxSlippage: 1,
    riskLevel: 'medium',
    timeframe: '15m'
  });

  const handleSubmit = async () => {
    // Implement trading bot setup
    console.log('Trading config:', config);
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
          <h2 className="text-2xl font-bold">AI Trading Setup</h2>
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
            <label className="block text-sm font-medium mb-2">Trading Strategy</label>
            <select
              value={config.strategy}
              onChange={(e) => setConfig({ 
                ...config, 
                strategy: e.target.value as TradingConfig['strategy']
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
            >
              <option value="momentum">Momentum</option>
              <option value="mean_reversion">Mean Reversion</option>
              <option value="trend_following">Trend Following</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trading Amount</label>
            <input
              type="number"
              value={config.amount}
              onChange={(e) => setConfig({ ...config, amount: parseFloat(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
              placeholder="Enter amount to trade..."
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
        <h2 className="text-2xl font-bold">Risk Parameters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Risk Level</label>
          <select
            value={config.riskLevel}
            onChange={(e) => setConfig({ 
              ...config, 
              riskLevel: e.target.value as TradingConfig['riskLevel']
            })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          >
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stop Loss (%)</label>
          <input
            type="number"
            value={config.stopLoss || ''}
            onChange={(e) => setConfig({ ...config, stopLoss: parseFloat(e.target.value) })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
            placeholder="Enter stop loss percentage..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Take Profit (%)</label>
          <input
            type="number"
            value={config.takeProfit || ''}
            onChange={(e) => setConfig({ ...config, takeProfit: parseFloat(e.target.value) })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
            placeholder="Enter take profit percentage..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg"
        >
          Start Trading Bot
        </button>
      </div>
    </div>
  );
}
