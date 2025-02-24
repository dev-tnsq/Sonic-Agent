import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const SecurityNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="ml-2">
            <div className="text-lg font-bold">Security Analysis</div>
            <div className="text-gray-500">Input Solidity Code</div>
          </div>
        </div>
        <textarea
          value={data.code}
          onChange={(evt) => data.onChange(evt.target.value)}
          className="mt-2 p-2 border rounded"
          placeholder="Paste your Solidity code here..."
          rows={4}
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(SecurityNode);
