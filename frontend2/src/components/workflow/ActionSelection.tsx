'use client';

interface ActionType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const AVAILABLE_ACTIONS: ActionType[] = [
  {
    id: 'buy',
    name: 'Buy Token',
    description: 'Buy tokens automatically',
    icon: '💰'
  },
  {
    id: 'sell',
    name: 'Sell Token',
    description: 'Sell tokens automatically',
    icon: '💱'
  },
  {
    id: 'notify',
    name: 'Send Notification',
    description: 'Send notification to channels',
    icon: '📢'
  },
  {
    id: 'ai_strategy',
    name: 'AI Strategy',
    description: 'Execute AI trading strategy',
    icon: '🧠'
  }
];

interface Props {
  onSelect: (action: ActionType) => void;
}

export default function ActionSelection({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {AVAILABLE_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action)}
          className="flex items-start gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 
                   border border-gray-600 rounded-lg transition-colors text-left"
        >
          <span className="text-2xl">{action.icon}</span>
          <div>
            <h3 className="font-medium">{action.name}</h3>
            <p className="text-sm text-gray-400">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
