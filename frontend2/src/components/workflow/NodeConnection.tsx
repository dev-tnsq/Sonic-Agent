'use client';

interface NodeConnectionProps {
  sourceId: string;
  targetId: string;
  sourcePosition: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

export function NodeConnection({ 
  sourcePosition, 
  targetPosition 
}: NodeConnectionProps) {
  if (!targetPosition) return null;

  const startX = sourcePosition.x + 144; // Half of node width
  const startY = sourcePosition.y + 40;  // Half of node height
  const endX = targetPosition.x;
  const endY = targetPosition.y + 40;

  const controlX1 = startX + (endX - startX) / 2;
  const controlX2 = endX - (endX - startX) / 2;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <path
        d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
        fill="none"
        stroke="rgba(59, 130, 246, 0.5)"
        strokeWidth={2}
      />
      <circle
        cx={startX}
        cy={startY}
        r={4}
        fill="rgb(59, 130, 246)"
      />
      <circle
        cx={endX}
        cy={endY}
        r={4}
        fill="rgb(59, 130, 246)"
      />
    </svg>
  );
}
