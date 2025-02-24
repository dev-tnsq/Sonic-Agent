'use client';

interface Props {
  data: {
    label: string;
    token?: string;
    threshold?: number;
    alerts?: string[];
  };
  onUpdate: (data: any) => void;
}

export function MonitorNode({ data, onUpdate }: Props) {
  return (
    <div className="w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <span className="font-medium flex items-center gap-2">
          📊 {data.label}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={data.token || ''}
          onChange={(e) => onUpdate({ ...data, token: e.target.value })}
          placeholder="Token Address"
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm"
        />
        <input
          type="number"
          value={data.threshold || ''}
          onChange={(e) => onUpdate({ ...data, threshold: parseFloat(e.target.value) })}
          placeholder="Price Threshold"
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm"
        />
      </div>
    </div>
  );
}
