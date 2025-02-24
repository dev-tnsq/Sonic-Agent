'use client';

interface Props {
  data: {
    label: string;
    model?: string;
    prompt?: string;
    result?: string;
    temperature?: number;
    maxTokens?: number;
  };
  onChange: (data: any) => void;
}

export function AIConfig({ data, onChange }: Props) {
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
        <label className="block text-sm font-medium mb-1">AI Model</label>
        <select
          value={data.model || 'gpt-4'}
          onChange={(e) => onChange({ ...data, model: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2"
        >
          <option value="gpt-4">GPT-4 (Most Capable)</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
          <option value="code-davinci-002">Codex (Code Specific)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">System Prompt</label>
        <textarea
          value={data.prompt || ''}
          onChange={(e) => onChange({ ...data, prompt: e.target.value })}
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2"
          placeholder="Enter instructions for the AI..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Temperature</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.temperature || 0.7}
            onChange={(e) => onChange({ 
              ...data, 
              temperature: parseFloat(e.target.value) 
            })}
            className="w-full"
          />
          <div className="text-xs text-gray-400 mt-1">
            {data.temperature || 0.7} (Creativity Level)
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Tokens</label>
          <input
            type="number"
            value={data.maxTokens || 2000}
            onChange={(e) => onChange({ 
              ...data, 
              maxTokens: parseInt(e.target.value) 
            })}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
          />
        </div>
      </div>

      {data.result && (
        <div>
          <label className="block text-sm font-medium mb-1">Last Response</label>
          <div className="bg-gray-900 border border-gray-700 rounded p-3">
            <pre className="text-sm whitespace-pre-wrap">{data.result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
