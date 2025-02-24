'use client';

interface Props {
  data: {
    label: string;
    token?: string;
    threshold?: number;
    alerts?: string[];
  };
  onChange: (data: any) => void;
}

export function MonitorConfig({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Node Name</label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Token Address</label>
        <input
          type="text"
          value={data.token || ''}
          onChange={(e) => onChange({ ...data, token: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2"
          placeholder="Enter token contract address..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price Threshold</label>
        <input
          type="number"
          value={data.threshold || ''}
          onChange={(e) => onChange({ ...data, threshold: parseFloat(e.target.value) })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2"
          placeholder="Enter price threshold..."
        />
      </div>
    </div>
  );
}
