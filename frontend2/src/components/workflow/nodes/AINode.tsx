'use client';

interface Props {
  data: {
    label: string;
    model?: string;
    prompt?: string;
    result?: string;
  };
  onUpdate: (data: any) => void;
}

export function AINode({ data, onUpdate }: Props) {
  return (
    <div className="w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <span className="font-medium flex items-center gap-2">
          🤖 {data.label}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <select
          value={data.model || 'gpt-4'}
          onChange={(e) => onUpdate({ ...data, model: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5">GPT-3.5</option>
        </select>
        <textarea
          value={data.prompt || ''}
          onChange={(e) => onUpdate({ ...data, prompt: e.target.value })}
          placeholder="Enter prompt..."
          className="w-full h-20 bg-gray-900 border border-gray-700 rounded p-2 text-sm"
        />
      </div>
    </div>
  );
}
