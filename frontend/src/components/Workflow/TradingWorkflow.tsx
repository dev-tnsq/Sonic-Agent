import React, { useState } from 'react';
import { TradingRule } from '@/types/workflows';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  name: string;
}

export default function TradingWorkflow({ name }: Props) {
  const [rules, setRules] = useState<TradingRule[]>([]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{name}</h2>
        <Button 
          onClick={() => setRules([...rules, {
            targetPrice: 0,
            action: 'buy',
            amount: 0,
            tokenAddress: ''
          }])}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-[#1D1D1D] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Trading Rules</h3>
            {rules.map((rule, i) => (
              <div key={i} className="bg-[#2D2D2D] p-4 rounded-lg mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <select 
                    className="bg-[#3D3D3D] p-2 rounded"
                    value={rule.action}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[i] = {...rule, action: e.target.value as 'buy' | 'sell'};
                      setRules(newRules);
                    }}
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                  <ArrowRight className="w-4 h-4" />
                  <input
                    type="number"
                    className="bg-[#3D3D3D] p-2 rounded w-32"
                    placeholder="Amount"
                    value={rule.amount}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[i] = {...rule, amount: Number(e.target.value)};
                      setRules(newRules);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>When price</span>
                  <select className="bg-[#3D3D3D] p-2 rounded">
                    <option>reaches</option>
                    <option>drops below</option>
                    <option>rises above</option>
                  </select>
                  <input
                    type="number"
                    className="bg-[#3D3D3D] p-2 rounded w-32"
                    placeholder="Target Price"
                    value={rule.targetPrice}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[i] = {...rule, targetPrice: Number(e.target.value)};
                      setRules(newRules);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1D1D1D] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2D2D2D] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Total Profit/Loss</div>
              <div className="text-2xl font-bold text-green-500">+$1,234.56</div>
            </div>
            <div className="bg-[#2D2D2D] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Active Rules</div>
              <div className="text-2xl font-bold">{rules.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
