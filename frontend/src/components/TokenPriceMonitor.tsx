import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TokenPriceMonitor() {
  const [priceData, setPriceData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPriceData(old => [...old, {
        time: new Date().toLocaleTimeString(),
        price: Math.random() * 100 + 50
      }].slice(-20));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1D1D1D] rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">SONIC Price Monitor</h2>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
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
  );
}
