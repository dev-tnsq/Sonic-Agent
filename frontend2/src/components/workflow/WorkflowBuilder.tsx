'use client';

import { useState } from 'react';
import { WorkflowProvider } from '@/contexts/WorkflowContext';
import NodePanel from './NodePanel';
import Canvas from './Canvas';
import ConfigPanel from './ConfigPanel';

export default function WorkflowBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <WorkflowProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Node Types Panel */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <NodePanel />
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-900 relative">
          <Canvas onNodeSelect={setSelectedNode} />
        </div>

        {/* Config Panel */}
        {selectedNode && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <ConfigPanel 
              nodeId={selectedNode} 
              onClose={() => setSelectedNode(null)} 
            />
          </div>
        )}
      </div>
    </WorkflowProvider>
  );
}

