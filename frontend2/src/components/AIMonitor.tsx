'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AIMonitor() {
  const [predictions, setPredictions] = useState<number[]>([]);
  const [actualPrices, setActualPrices] = useState<number[]>([]);
  const [accuracy, setAccuracy] = useState(94.5);
  const [activeWorkflows, setActiveWorkflows] = useState(12);

  useEffect(() => {
    // Simulate real-time data updates
    const timer = setInterval(() => {
      const newPrice = 0.5 + Math.random() * 0.1;
      const newPrediction = newPrice * (1 + (Math.random() - 0.5) * 0.1);
      
      setActualPrices(prev => [...prev.slice(-11), newPrice]);
      setPredictions(prev => [...prev.slice(-11), newPrediction]);
      setAccuracy(prev => prev + (Math.random() - 0.5));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const chartData = {
    labels: Array.from({ length: actualPrices.length }, (_, i) => 
      new Date(Date.now() - (actualPrices.length - i) * 5000).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'AI Predictions',
        data: predictions,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Actual Prices',
        data: actualPrices,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'SONIC Price Predictions vs Actual'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          title="Prediction Accuracy" 
          value={`${accuracy.toFixed(1)}%`}
          trend={accuracy > 94 ? 'up' : 'down'}
        />
        <MetricCard 
          title="Active Workflows" 
          value={activeWorkflows.toString()}
          trend="neutral"
        />
      </div>
    </div>
  );
}

const MetricCard = ({ title, value, trend }: { title: string, value: string, trend: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="text-gray-400 text-sm">{title}</h3>
    <div className="flex items-center mt-2">
      <span className="text-2xl font-bold text-white">{value}</span>
      {trend === 'down' && <span className="ml-2 text-red-500">↓</span>}
      {trend === 'up' && <span className="ml-2 text-green-500">↑</span>}
    </div>
  </div>
);