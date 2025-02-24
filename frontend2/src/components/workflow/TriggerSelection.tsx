'use client';

interface TriggerType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const AVAILABLE_TRIGGERS: TriggerType[] = [
  {
    id: 'price_above',
    name: 'Price Above',
    description: 'Trigger when price goes above threshold',
    icon: '📈'
  },
  {
    id: 'price_below',
    name: 'Price Below',
    description: 'Trigger when price goes below threshold',
    icon: '📉'
  },
  {
    id: 'volume_spike',
    name: 'Volume Spike',
    description: 'Trigger on sudden volume increase',
    icon: '📊'
  },
  {
    id: 'ai_signal',
    name: 'AI Signal',
    description: 'Trigger based on AI prediction',
    icon: '🤖'
  }
];

interface Props {
  onSelect: (trigger: TriggerType) => void;
}

export default function TriggerSelection({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {AVAILABLE_TRIGGERS.map((trigger) => (
        <button
          key={trigger.id}
          onClick={() => onSelect(trigger)}
          className="flex items-start gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 
                   border border-gray-600 rounded-lg transition-colors text-left"
        >
          <span className="text-2xl">{trigger.icon}</span>
          <div>
            <h3 className="font-medium">{trigger.name}</h3>
            <p className="text-sm text-gray-400">{trigger.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
