'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface NodeProps {
  id: string;
  type: 'trigger' | 'action';
  position: { x: number; y: number };
  config: any;
  isSelected?: boolean;
  onSelect?: () => void;
  onConfigChange?: (config: any) => void;
  onDelete?: () => void;
  onConnect?: (source: string, target: string) => void;
  onContextMenu?: (e: React.MouseEvent, nodeId: string) => void;
  onScanContract?: (address: string) => void;
}

export default function WorkflowNode({
  id,
  type,
  position,
  config,
  isSelected = false,
  onSelect = () => {},
  onConfigChange = () => {},
  onDelete = () => {},
  onConnect = () => {},
  onContextMenu = () => {},
  onScanContract = () => {}
}: NodeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    ...position,
  } : position;

  const bgGradient = type === 'trigger' 
    ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/5' 
    : 'bg-gradient-to-br from-green-500/10 to-green-600/5';
  const borderColor = type === 'trigger' ? 'border-blue-500/30' : 'border-green-500/30';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleConfigChange = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: style.x,
        top: style.y,
        touchAction: 'none',
      }}
      className={`
        ${bgGradient} border ${borderColor} rounded-xl p-4 w-72
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        cursor-move backdrop-blur-sm
      `}
      onClick={onSelect}
      onContextMenu={(e) => onContextMenu(e, id)}
      {...listeners}
      {...attributes}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-200">
          {type === 'trigger' ? 'Price Trigger' : 'Trade Action'}
        </h3>
        <div className="flex gap-2">
          <button 
            className="p-1 rounded bg-gray-700/50 hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onScanContract(config.contractAddress || '');
            }}
          >
            ⚙️
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {type === 'trigger' ? (
        <div className="space-y-2">
          <select
            value={config.condition}
            onChange={(e) => handleConfigChange('condition', e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2 text-sm"
          >
            <option value="price_above">Price Above</option>
            <option value="price_below">Price Below</option>
          </select>
          <input
            type="number"
            value={config.value}
            onChange={(e) => handleConfigChange('value', e.target.value)}
            placeholder="Trigger value"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2 text-sm"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <select
            value={config.action}
            onChange={(e) => handleConfigChange('action', e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2 text-sm"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input
            type="number"
            value={config.amount}
            onChange={(e) => handleConfigChange('amount', e.target.value)}
            placeholder="Amount"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2 text-sm"
          />
        </div>
      )}
    </div>
  );
}
