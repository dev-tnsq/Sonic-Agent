'use client';

interface Props {
  node: {
    id: string;
    type: string;
    config: any;
  };
  onClose: () => void;
  onUpdate: (id: string, config: any) => void;
  vulnerabilities: any[];
}

export default function NodeConfigPanel({ node, onClose, onUpdate, vulnerabilities }: Props) {
  return (
    <div className="absolute top-4 right-4 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium">Configure Node</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        {node.type === 'trigger' ? (
          <TriggerConfig 
            config={node.config} 
            onChange={config => onUpdate(node.id, config)} 
          />
        ) : (
          <ActionConfig 
            config={node.config} 
            onChange={config => onUpdate(node.id, config)}
          />
        )}

        {vulnerabilities.length > 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="text-red-400 font-medium mb-2">Vulnerabilities Found</h4>
            <ul className="space-y-2">
              {vulnerabilities.map((vuln, i) => (
                <li key={i} className="text-sm text-red-300">
                  • {vuln.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function TriggerConfig({ config, onChange }: { config: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Condition</label>
        <select
          value={config.condition}
          onChange={e => onChange({ ...config, condition: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        >
          <option value="price_above">Price Above</option>
          <option value="price_below">Price Below</option>
          <option value="volume_spike">Volume Spike</option>
          <option value="ai_signal">AI Signal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Value</label>
        <input
          type="number"
          value={config.value}
          onChange={e => onChange({ ...config, value: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        />
      </div>
    </div>
  );
}

function ActionConfig({ config, onChange }: { config: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Action</label>
        <select
          value={config.action}
          onChange={e => onChange({ ...config, action: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
          <option value="notify">Notify</option>
          <option value="ai_strategy">AI Strategy</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          value={config.amount}
          onChange={e => onChange({ ...config, amount: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        />
      </div>
    </div>
  );
}
