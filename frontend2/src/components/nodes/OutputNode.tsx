import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const OutputNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col">
        <div className="text-lg font-bold">Output</div>
        <div className="mt-2 p-2 bg-gray-50 rounded min-h-[100px] max-h-[200px] overflow-auto">
          {data.result ? (
            <pre className="text-sm whitespace-pre-wrap">
              {typeof data.result === 'string' 
                ? data.result 
                : JSON.stringify(data.result, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500">Waiting for input...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(OutputNode);
