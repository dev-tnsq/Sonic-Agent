'use client';

interface TriggerFormProps {
  data: any;
  onChange: (data: any) => void;
}

export default function TriggerForm({ data, onChange }: TriggerFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Trigger Type</label>
        <select
          value={data.trigger}
          onChange={(e) => onChange({ ...data, trigger: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        >
          <option value="price_above">Price Above</option>
          <option value="price_below">Price Below</option>
          <option value="volume_spike">Volume Spike</option>
          <option value="ai_signal">AI Signal</option>
        </select>
      </div>

      {data.trigger === 'price_above' || data.trigger === 'price_below' ? (
        <div>
          <label className="block text-sm font-medium mb-1">Price Value</label>
          <input
            type="number"
            value={data.value || ''}
            onChange={(e) => onChange({ ...data, value: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
            placeholder="Enter price threshold"
          />
        </div>
      ) : null}

      {data.trigger === 'volume_spike' && (
        <div>
          <label className="block text-sm font-medium mb-1">Volume Increase %</label>
          <input
            type="number"
            value={data.percentage || ''}
            onChange={(e) => onChange({ ...data, percentage: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
            placeholder="Enter volume increase percentage"
          />
        </div>
      )}

      {data.trigger === 'ai_signal' && (
        <div>
          <label className="block text-sm font-medium mb-1">Signal Strength</label>
          <select
            value={data.strength || 'medium'}
            onChange={(e) => onChange({ ...data, strength: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      )}
    </div>
  );
}
