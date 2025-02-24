'use client';

interface Props {
  scale: number;
  onZoom: (scale: number) => void;
}

export default function ZoomControls({ scale, onZoom }: Props) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-gray-800/90 p-2 rounded-lg backdrop-blur-sm">
      <button
        onClick={() => onZoom(scale - 0.1)}
        className="p-2 hover:bg-gray-700 rounded-lg"
        disabled={scale <= 0.25}
      >
        <span className="text-xl">-</span>
      </button>
      
      <span className="min-w-[3ch] text-center">
        {Math.round(scale * 100)}%
      </span>
      
      <button
        onClick={() => onZoom(scale + 0.1)}
        className="p-2 hover:bg-gray-700 rounded-lg"
        disabled={scale >= 2}
      >
        <span className="text-xl">+</span>
      </button>
    </div>
  );
}
