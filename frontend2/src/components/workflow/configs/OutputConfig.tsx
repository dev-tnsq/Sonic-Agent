'use client';

interface Props {
  data: {
    label: string;
    type?: 'notification' | 'action' | 'display';
    channels?: string[];
    format?: 'text' | 'json' | 'table';
    recipients?: string[];
    webhook?: string;
    output?: string;
  };
  onChange: (data: any) => void;
}

export function OutputConfig({ data, onChange }: Props) {
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
        <label className="block text-sm font-medium mb-1">Output Type</label>
        <select
          value={data.type || 'display'}
          onChange={(e) => onChange({ 
            ...data, 
            type: e.target.value as 'notification' | 'action' | 'display' 
          })}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2"
        >
          <option value="notification">Send Notification</option>
          <option value="action">Execute Action</option>
          <option value="display">Display Result</option>
        </select>
      </div>

      {data.type === 'notification' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Notification Channels</label>
            <div className="space-y-2">
              {['email', 'telegram', 'discord', 'webhook'].map(channel => (
                <label key={channel} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.channels?.includes(channel)}
                    onChange={(e) => {
                      const channels = data.channels || [];
                      onChange({
                        ...data,
                        channels: e.target.checked
                          ? [...channels, channel]
                          : channels.filter(c => c !== channel)
                      });
                    }}
                    className="rounded border-gray-700 bg-gray-900"
                  />
                  <span className="capitalize">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          {data.channels?.includes('webhook') && (
            <div>
              <label className="block text-sm font-medium mb-1">Webhook URL</label>
              <input
                type="url"
                value={data.webhook || ''}
                onChange={(e) => onChange({ ...data, webhook: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2"
                placeholder="https://"
              />
            </div>
          )}
        </>
      )}

      {data.type === 'display' && (
        <div>
          <label className="block text-sm font-medium mb-1">Display Format</label>
          <select
            value={data.format || 'text'}
            onChange={(e) => onChange({ ...data, format: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2"
          >
            <option value="text">Plain Text</option>
            <option value="json">JSON</option>
            <option value="table">Table</option>
          </select>
        </div>
      )}

      {data.output && (
        <div>
          <label className="block text-sm font-medium mb-1">Current Output</label>
          <div className="bg-gray-900 border border-gray-700 rounded p-3">
            <pre className="text-sm whitespace-pre-wrap">{data.output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
