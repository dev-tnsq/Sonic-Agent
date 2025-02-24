import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { analyzeContract } from '@/lib/ai';

const AIAnalysisNode = ({ data, isConnectable }: NodeProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.inputCode) {
      setLoading(true);
      analyzeContract(data.inputCode)
        .then(result => {
          setAnalysis(result);
          data.onAnalysisComplete?.(result);
        })
        .catch(error => {
          setAnalysis({ error: error.message });
        })
        .finally(() => setLoading(false));
    }
  }, [data.inputCode]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col">
        <div className="text-lg font-bold">AI Analysis</div>
        {loading ? (
          <div className="text-gray-500">Analyzing...</div>
        ) : analysis ? (
          <div className="mt-2">
            {analysis.error ? (
              <div className="text-red-500">{analysis.error}</div>
            ) : (
              <div>
                <div className="text-sm font-bold">Vulnerabilities Found: {analysis.vulnerabilities?.length}</div>
                <div className="text-sm text-gray-500">{analysis.suggestions}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">Waiting for input...</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default memo(AIAnalysisNode);
