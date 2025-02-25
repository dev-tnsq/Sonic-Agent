import React, { useState } from 'react';
import { WorkflowType } from '@/types/workflows';
import { Sidebar } from '../layout/Sidebar';
import SecurityWorkflow from './SecurityWorkflow';
import MonitoringWorkflow from './MonitoringWorkflow';
import TradingWorkflow from './TradingWorkflow';
import { motion } from 'framer-motion';

export default function Workflow() {
  const [workflowType, setWorkflowType] = useState<WorkflowType | null>(null);
  const [workflowName, setWorkflowName] = useState('');

  const renderWorkflow = () => {
    if (!workflowName) {
      return (
        <div className="flex flex-col gap-4 p-6">
          <input
            className="p-2 rounded bg-background border border-foreground"
            placeholder="Enter Workflow Name"
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-4">
            <WorkflowCard
              type="security"
              title="Smart Contract Security"
              description="AI-powered security analysis and vulnerability detection"
              onClick={() => setWorkflowType('security')}
            />
            <WorkflowCard
              type="monitoring"
              title="Token Monitoring"
              description="Real-time monitoring and alerts for token metrics"
              onClick={() => setWorkflowType('monitoring')}
            />
            <WorkflowCard
              type="trading"
              title="Automated Trading"
              description="Set up automated trading rules with AI assistance"
              onClick={() => setWorkflowType('trading')}
            />
          </div>
        </div>
      );
    }

    switch (workflowType) {
      case 'security':
        return <SecurityWorkflow name={workflowName} />;
      case 'monitoring':
        return <MonitoringWorkflow name={workflowName} />;
      case 'trading':
        return <TradingWorkflow name={workflowName} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <motion.main 
        className="flex-1 ml-64 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderWorkflow()}
      </motion.main>
    </div>
  );
}

interface WorkflowCardProps {
  type: WorkflowType;
  title: string;
  description: string;
  onClick: () => void;
}

function WorkflowCard({ type, title, description, onClick }: WorkflowCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-lg bg-[#1D1D1D] hover:bg-accent text-left"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
