'use client';

interface Props {
  data: {
    label: string;
    code?: string;
    analysis?: string;
  };
  onUpdate: (data: any) => void;
}

export function SecurityNode({ data, onUpdate }: Props) {
  return (
    <div className="w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <span className="font-medium flex items-center gap-2">
          🔒 {data.label}
        </span>
      </div>
      <div className="p-3">
        <textarea
          value={data.code || ''}
          onChange={(e) => onUpdate({ ...data, code: e.target.value })}
          placeholder="Paste Solidity code here..."
          className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-2 text-sm font-mono"
        />
        {data.analysis && (
          <div className="mt-2 text-sm text-gray-400">
            {data.analysis}
          </div>
        )}
      </div>
    </div>
  );
}
