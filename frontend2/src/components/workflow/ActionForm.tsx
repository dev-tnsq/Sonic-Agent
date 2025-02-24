'use client';

interface ActionFormProps {
  data: any;
  onChange: (data: any) => void;
}

export default function ActionForm({ data, onChange }: ActionFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Action Type</label>
        <select
          value={data.action}
          onChange={(e) => onChange({ ...data, action: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        >
          <option value="buy">Buy Token</option>
          <option value="sell">Sell Token</option>
          <option value="notify">Send Notification</option>
          <option value="ai_strategy">Execute AI Strategy</option>
        </select>
      </div>

      {(data.action === 'buy' || data.action === 'sell') && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={data.amount || ''}
              onChange={(e) => onChange({ ...data, amount: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slippage %</label>
            <input
              type="number"
              value={data.slippage || ''}
              onChange={(e) => onChange({ ...data, slippage: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
              placeholder="Enter slippage percentage"
            />
          </div>
        </>
      )}

      {data.action === 'notify' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Channel</label>
            <select
              value={data.channel || 'telegram'}
              onChange={(e) => onChange({ ...data, channel: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
            >
              <option value="telegram">Telegram</option>
              <option value="discord">Discord</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={data.message || ''}
              onChange={(e) => onChange({ ...data, message: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
              placeholder="Enter notification message"
              rows={3}
            />
          </div>
        </>
      )}

      {data.action === 'ai_strategy' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Strategy</label>
            <select
              value={data.strategy || 'momentum'}
              onChange={(e) => onChange({ ...data, strategy: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
            >
              <option value="momentum">Momentum Trading</option>
              <option value="mean_reversion">Mean Reversion</option>
              <option value="trend_following">Trend Following</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Risk Level</label>
            <select
              value={data.risk || 'medium'}
              onChange={(e) => onChange({ ...data, risk: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
