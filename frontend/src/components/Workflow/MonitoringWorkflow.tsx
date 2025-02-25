import React, { useState } from 'react';
import { MonitoringConfig } from '@/types/workflows';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';

interface Props {
  name: string;
}

export default function MonitoringWorkflow({ name }: Props) {
  const [config, setConfig] = useState<MonitoringConfig>({
    tokenAddress: '',
    metrics: ['price'],
    alerts: []
  });

  const mockData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: Math.random() * 100 + 50,
    volume: Math.random() * 1000000
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{name}</h2>
        <Button variant="outline">Add Alert</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-[#1D1D1D] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1D1D1D] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Token Info</h3>
            <input
              className="w-full p-2 rounded bg-[#2D2D2D] mb-4"
              placeholder="Token Address"
              value={config.tokenAddress}
              onChange={(e) => setConfig({...config, tokenAddress: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#2D2D2D] p-3 rounded">
                <div className="text-sm text-gray-400">Price</div>
                <div className="text-xl font-bold">$73.45</div>
              </div>
              <div className="bg-[#2D2D2D] p-3 rounded">
                <div className="text-sm text-gray-400">24h Volume</div>
                <div className="text-xl font-bold">$2.1M</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1D1D1D] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
            {config.alerts.length === 0 ? (
              <div className="text-gray-400 text-center py-4">
                No alerts configured
              </div>
            ) : (
              <div className="space-y-2">
                {config.alerts.map((alert, i) => (
                  <div key={i} className="bg-[#2D2D2D] p-3 rounded">
                    <div className="text-sm">{alert.condition}</div>
                    <div className="text-sm text-gray-400">
                      Threshold: {alert.threshold}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
