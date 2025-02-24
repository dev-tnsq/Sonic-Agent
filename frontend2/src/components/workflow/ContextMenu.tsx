'use client';

interface Props {
  x: number;
  y: number;
  nodeId?: string;
  onClose: () => void;
  onAction: (action: string, nodeId?: string) => void;
}

export default function ContextMenu({ x, y, nodeId, onClose, onAction }: Props) {
  const menuItems = nodeId ? [
    { label: 'Edit', action: 'edit' },
    { label: 'Duplicate', action: 'duplicate' },
    { label: 'Delete', action: 'delete', className: 'text-red-400' },
    { label: 'Scan Contract', action: 'scan' }
  ] : [
    { label: 'Add Trigger', action: 'add-trigger' },
    { label: 'Add Action', action: 'add-action' }
  ];

  return (
    <div 
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1"
      style={{ left: x, top: y }}
      onClick={onClose}
    >
      {menuItems.map(({ label, action, className }) => (
        <button
          key={action}
          className={`
            w-full px-4 py-2 text-left hover:bg-gray-700 
            ${className || 'text-gray-200'}
          `}
          onClick={() => onAction(action, nodeId)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
