'use client';

import { useState } from 'react';
import { WorkflowConfig, WorkflowCategory, WorkflowTemplate } from '@/types/workflow';
import { WorkflowTemplates } from './WorkflowTemplates';
import { WorkflowBasicForm } from './WorkflowBasicForm';
import { WorkflowStepEditor } from './WorkflowStepEditor';
import { WorkflowScheduler } from './WorkflowScheduler';
import { WorkflowPreview } from './WorkflowPreview';

type CreationStage = 'select' | 'configure' | 'steps' | 'schedule' | 'preview';

export default function WorkflowCreator() {
  const [stage, setStage] = useState<CreationStage>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [config, setConfig] = useState<WorkflowConfig>({
    name: '',
    description: '',
    category: 'monitoring'
  });

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setConfig(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.category
    }));
    setStage('configure');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Workflow</h2>
        <div className="flex gap-2">
          {['select', 'configure', 'steps', 'schedule', 'preview'].map((s) => (
            <div
              key={s}
              className={`
                px-4 py-2 rounded-lg ${stage === s 
                  ? 'bg-blue-500/20 border-blue-500/30' 
                  : 'bg-gray-800/50 border-gray-700'
                } border
              `}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        {stage === 'select' && (
          <WorkflowTemplates onSelect={handleTemplateSelect} />
        )}

        {stage === 'configure' && selectedTemplate && (
          <WorkflowBasicForm
            config={config}
            onChange={setConfig}
            onNext={() => setStage('steps')}
          />
        )}

        {stage === 'steps' && selectedTemplate && (
          <WorkflowStepEditor
            template={selectedTemplate}
            onNext={() => setStage('schedule')}
            onBack={() => setStage('configure')}
          />
        )}

        {stage === 'schedule' && (
          <WorkflowScheduler
            config={config}
            onChange={setConfig}
            onNext={() => setStage('preview')}
            onBack={() => setStage('steps')}
          />
        )}

        {stage === 'preview' && selectedTemplate && (
          <WorkflowPreview
            template={selectedTemplate}
            config={config}
            onBack={() => setStage('schedule')}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

const handleSubmit = async (template: WorkflowTemplate, config: WorkflowConfig) => {
  try {
    // Save workflow implementation
  } catch (error) {
    console.error('Failed to create workflow:', error);
  }
};
