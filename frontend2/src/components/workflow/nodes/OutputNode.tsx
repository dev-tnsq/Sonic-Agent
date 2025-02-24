'use client';

interface Props {
  data: {
    label: string;
    output?: string;
    type?: 'notification' | 'action' | 'display';
  };
  onUpdate: (data: any) => void;
}

export function OutputNode({ data, onUpdate }: Props) {
  return (
    <div className="w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <span className="font-medium flex items-center gap-2">
          📤 {data.label}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <select
          value={data.type || 'display'}
          onChange={(e) => onUpdate({ ...data, type: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm"
        >
          <option value="notification">Send Notification</option>
          <option value="action">Execute Action</option>
          <option value="display">Display Result</option>
        </select>
        <div className="bg-gray-900/50 rounded p-2 text-sm">
          {data.output || 'No output yet'}
        </div>
      </div>
    </div>
  );
}
