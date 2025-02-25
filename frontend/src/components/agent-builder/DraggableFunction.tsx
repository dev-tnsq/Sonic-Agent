'use client';

import { useDrag } from 'react-dnd';
import { AgentFunction } from '@/types/agent';
import * as Icons from 'lucide-react';

interface DraggableFunctionProps {
  func: AgentFunction;
  onAdd: (func: AgentFunction) => void;
}

export function DraggableFunction({ func, onAdd }: DraggableFunctionProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'function',
    item: func,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Dynamically get the icon component
  const IconComponent = func.icon ? Icons[func.icon as keyof typeof Icons] : Icons.Grip;

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move"
    >
      <div className="p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#333] transition-colors">
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 text-[#98FF98]" />
          <div>
            <p className="font-medium text-white">{func.name}</p>
            <p className="text-sm text-gray-400">{func.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 