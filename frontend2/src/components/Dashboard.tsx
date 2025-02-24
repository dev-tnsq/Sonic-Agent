'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletContext } from '@/app/providers';
import WorkflowCanvas from './workflow/WorkflowCanvas';
import TokenStats from './TokenStats';
import AIMonitor from './AIMonitor';
import { fetchWorkflowRuns, WorkflowRun } from '@/services/workflowService';
import WorkflowCard from './workflow/WorkflowCard';

interface WorkflowStats {
  total: number;
  active: number;
  completed: number;
  failed: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { account } = useWalletContext();
  const [stats, setStats] = useState<WorkflowStats>({
    total: 0,
    active: 0,
    completed: 0,
    failed: 0
  });
  const [activeTab, setActiveTab] = useState('workflows');
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchWorkflowStats();
    }
  }, [account]);

  const fetchWorkflowStats = async () => {
    // Implement actual API call here
    setStats({
      total: 5,
      active: 2,
      completed: 2,
      failed: 1
    });
  };

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const data = await fetchWorkflowRuns();
        setRuns(data);
      } catch (error) {
        console.error('Failed to load workflow runs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRuns();
  }, []);

  // Calculate stats
  const calculatedStats = {
    total: runs.length,
    running: runs.filter(r => r.status === 'running').length,
    completed: runs.filter(r => r.status === 'completed').length,
    failed: runs.filter(r => r.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => router.push('/workflows/new')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
          Create Workflow
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Workflows"
          value={calculatedStats.total}
          icon="📊"
        />
        <StatCard 
          title="Active"
          value={calculatedStats.running}
          icon="✅"
          color="green"
        />
        <StatCard 
          title="Completed"
          value={calculatedStats.completed}
          icon="🎯"
          color="blue"
        />
        <StatCard 
          title="Failed"
          value={calculatedStats.failed}
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            type="security"
            message="Contract vulnerability scan completed"
            time="2 minutes ago"
          />
          <ActivityItem 
            type="monitor"
            message="Price alert triggered at $0.52"
            time="15 minutes ago"
          />
          <ActivityItem 
            type="trading"
            message="Buy order executed: 1000 SONIC"
            time="1 hour ago"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
            <div className="flex space-x-4 mb-6">
              <TabButton 
                active={activeTab === 'workflows'} 
                onClick={() => setActiveTab('workflows')}
                label="Workflows"
              />
              <TabButton 
                active={activeTab === 'monitor'} 
                onClick={() => setActiveTab('monitor')}
                label="AI Monitor"
              />
            </div>
            
            <div className="bg-gray-900/50 rounded-lg">
              {activeTab === 'workflows' ? (
                <WorkflowCanvas />
              ) : (
                <AIMonitor />
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <TokenStats />
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : runs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No workflows found. Create your first workflow to get started.
          </div>
        ) : (
          runs.map(run => (
            <WorkflowCard 
              key={run.id} 
              workflow={{
                name: `Workflow #${run.id}`,
                trigger: {
                  name: 'Example Trigger',
                  slug: 'example-trigger',
                  parameters: {}
                },
                steps: []
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { 
  active: boolean, 
  onClick: () => void,
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, color = 'gray' }: {
  title: string;
  value: number;
  icon: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <span className="text-2xl">{icon}</span>
        <span className={`text-${color}-400 text-sm`}>{title}</span>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </div>
  );
}

function ActivityItem({ type, message, time }: {
  type: 'security' | 'monitor' | 'trading';
  message: string;
  time: string;
}) {
  const icons = {
    security: '🔒',
    monitor: '📊',
    trading: '💱'
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
      <span className="text-xl">{icons[type]}</span>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}
