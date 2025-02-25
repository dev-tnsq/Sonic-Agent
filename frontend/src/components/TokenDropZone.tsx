'use client';

import { useDrop } from 'react-dnd';
import { Card } from './ui/card';

interface DropZoneProps {
  onTokenDrop: (token: { symbol: string; address: `0x${string}` }) => void;
  accept?: string[];
}

export function TokenDropZone({ onTokenDrop, accept = ['token'] }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { symbol: string; address: `0x${string}` }) => {
      onTokenDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} className="w-full h-32">
      <Card 
        className={`h-full flex items-center justify-center border-2 border-dashed
          ${isOver && canDrop ? 'border-primary/50 bg-primary/5' : 'border-muted'}
          ${canDrop ? 'bg-muted/5' : ''}
        `}
      >
        <p className="text-muted-foreground text-sm">
          {isOver ? 'Drop here' : 'Drag tokens here'}
        </p>
      </Card>
    </div>
  );
}
