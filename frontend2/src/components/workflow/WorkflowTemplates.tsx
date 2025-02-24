'use client';

const WORKFLOW_TEMPLATES = [
  {
    id: 'price-monitor',
    name: 'Price Monitoring',
    category: 'monitoring',
    description: 'Monitor token prices and receive alerts',
    icon: '📈',
    steps: [
      {
        id: 'price-trigger',
        type: 'trigger',
        name: 'Price Trigger',
        config: { condition: 'above', value: '' }
      },
      {
        id: 'notify',
        type: 'action',
        name: 'Send Notification',
        config: { channel: 'telegram', message: '' }
      }
    ]
  },
  {
    id: 'contract-scan',
    name: 'Contract Scanner',
    category: 'scanning',
    description: 'Scan smart contracts for vulnerabilities',
    icon: '🔍',
    steps: [
      {
        id: 'contract-trigger',
        type: 'trigger',
        name: 'Contract Deployment',
        config: { network: 'sonic' }
      },
      {
        id: 'scan',
        type: 'action',
        name: 'Security Scan',
        config: { depth: 'full' }
      }
    ]
  },
  {
    id: 'ai-trader',
    name: 'AI Trading Bot',
    category: 'trading',
    description: 'Automated trading using AI signals',
    icon: '🤖',
    steps: [
      {
        id: 'ai-signal',
        type: 'trigger',
        name: 'AI Signal',
        config: { confidence: 0.8 }
      },
      {
        id: 'trade',
        type: 'action',
        name: 'Execute Trade',
        config: { amount: '', slippage: 0.5 }
      }
    ]
  }
];

interface Props {
  onSelect: (template: any) => void;
}

export function WorkflowTemplates({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {WORKFLOW_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className="flex flex-col p-6 bg-gray-700/50 hover:bg-gray-700 
                   border border-gray-600 rounded-xl transition-colors text-left"
        >
          <span className="text-3xl mb-4">{template.icon}</span>
          <h3 className="text-lg font-medium mb-2">{template.name}</h3>
          <p className="text-sm text-gray-400">{template.description}</p>
          <span className="mt-4 text-xs text-gray-500 uppercase tracking-wide">
            {template.category}
          </span>
        </button>
      ))}
    </div>
  );
}
