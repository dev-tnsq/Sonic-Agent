'use client';

interface NodeProps {
  type: 'trigger' | 'action';
  title: string;
  config: any;
  onConfigChange: (config: any) => void;
}

export default function WorkflowNode({ type, title, config, onConfigChange }: NodeProps) {
  const bgGradient = type === 'trigger' 
    ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/5' 
    : 'bg-gradient-to-br from-green-500/10 to-green-600/5';
  const borderColor = type === 'trigger' ? 'border-blue-500/30' : 'border-green-500/30';
  const shadowColor = type === 'trigger' ? 'shadow-blue-500/20' : 'shadow-green-500/20';

  return (
    <div className={`${bgGradient} border ${borderColor} rounded-xl p-5 w-72 shadow-lg ${shadowColor} backdrop-blur-sm`}>
      <h3 className="font-medium mb-4 text-gray-200">{title}</h3>
      {type === 'trigger' ? (
        <div className="space-y-3">
          <select
            value={config.condition}
            onChange={(e) => onConfigChange({ ...config, condition: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2.5 text-sm focus:border-blue-500 transition-colors"
          >
            <option value="price_above">Price Above</option>
            <option value="price_below">Price Below</option>
            <option value="volume_increase">Volume Increase</option>
          </select>
          <div className="relative">
            <input
              type="number"
              value={config.value}
              onChange={(e) => onConfigChange({ ...config, value: e.target.value })}
              placeholder="Value"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2.5 text-sm focus:border-blue-500 transition-colors pl-8"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <select
            value={config.action}
            onChange={(e) => onConfigChange({ ...config, action: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2.5 text-sm focus:border-green-500 transition-colors"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="swap">Swap</option>
          </select>
          <div className="relative">
            <input
              type="number"
              value={config.amount}
              onChange={(e) => onConfigChange({ ...config, amount: e.target.value })}
              placeholder="Amount"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2.5 text-sm focus:border-green-500 transition-colors pl-8"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          </div>
        </div>
      )}
    </div>
  );
}
