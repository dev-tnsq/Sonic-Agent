'use client';

interface Props {
  connections: Array<{ source: string; target: string }>;
  nodes: Array<{ id: string; position: { x: number; y: number } }>;
}

export function SVGContainer({ connections, nodes }: Props) {
  return (
    <svg 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {connections.map(({ source, target }) => {
        const sourceNode = nodes.find(n => n.id === source);
        const targetNode = nodes.find(n => n.id === target);
        
        if (!sourceNode || !targetNode) return null;

        const startX = sourceNode.position.x + 288; // Node width
        const startY = sourceNode.position.y + 80;  // Half node height
        const endX = targetNode.position.x;
        const endY = targetNode.position.y + 80;

        // Create a curved path
        const midX = (startX + endX) / 2;
        const path = `
          M ${startX} ${startY}
          C ${midX} ${startY},
            ${midX} ${endY},
            ${endX} ${endY}
        `;

        return (
          <g key={`${source}-${target}`}>
            <path
              d={path}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              className="opacity-50"
            />
            <circle
              cx={startX}
              cy={startY}
              r="4"
              fill="rgb(59, 130, 246)"
            />
            <circle
              cx={endX}
              cy={endY}
              r="4"
              fill="rgb(59, 130, 246)"
            />
          </g>
        );
      })}
    </svg>
  );
}
