'use client';

interface Props {
  data: {
    label: string;
    code?: string;
    analysis?: string;
  };
  onChange: (data: any) => void;
}

export function SecurityConfig({ data, onChange }: Props) {
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
        <label className="block text-sm font-medium mb-1">Solidity Code</label>
        <textarea
          value={data.code || ''}
          onChange={(e) => onChange({ ...data, code: e.target.value })}
          rows={10}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 font-mono"
          placeholder="// Paste your smart contract code here..."
        />
      </div>

      {data.analysis && (
        <div>
          <label className="block text-sm font-medium mb-1">Analysis Result</label>
          <div className="bg-gray-900 border border-gray-700 rounded p-3">
            <pre className="text-sm whitespace-pre-wrap">{data.analysis}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
