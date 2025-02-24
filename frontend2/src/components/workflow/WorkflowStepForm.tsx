'use client';

import { useState, useCallback } from 'react';
import { useWalletContext } from '@/app/providers';
import TriggerSelection from './TriggerSelection';
import ActionSelection from './ActionSelection';
import TriggerForm from './TriggerForm';
import ActionForm from './ActionForm';

interface TriggerType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ActionType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface StepFormProps {
  step?: {
    id: string;
    type: 'trigger' | 'action';
    name?: string;
    config: any;
    canAddNextStep?: boolean;
  };
  isTrigger: boolean;
  isLastStep: boolean;
  onAddStep: () => void;
  onRemoveStep: (id: string) => void;
  onUpdateStep: (id: string, data: any) => void;
}

type StepStage = 'step_selection' | 'step_form' | 'created';

export default function WorkflowStepForm({
  step,
  isTrigger,
  isLastStep,
  onAddStep,
  onRemoveStep,
  onUpdateStep
}: StepFormProps) {
  const { account } = useWalletContext();
  const [activeStage, setActiveStage] = useState<StepStage>('step_selection');
  const [formData, setFormData] = useState<any>(step?.config || {});

  const handleBack = useCallback(() => {
    if (formData && Object.keys(formData).length > 0) {
      if (confirm('These form data will be cleared. Are you sure?')) {
        setFormData({});
        setActiveStage('step_selection');
      }
    } else {
      setActiveStage('step_selection');
    }
  }, [formData]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (step) {
      onUpdateStep(step.id, formData);
      setActiveStage('created');
    }
  }, [step, formData, onUpdateStep]);

  return (
    <div className="relative bg-gray-800 rounded-lg border border-blue-500/30 shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="font-mono text-lg truncate">
          {step?.name || (isTrigger ? 'Trigger' : 'Step')}
        </h3>

        <div className="space-x-3">
          {!isTrigger && (
            <button
              onClick={() => step && onRemoveStep(step.id)}
              className="p-2 text-gray-400 hover:text-white"
            >
              🗑️
            </button>
          )}
          
          {activeStage === 'created' && (
            <button
              onClick={() => setActiveStage('step_form')}
              className="p-2 text-gray-400 hover:text-white"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {activeStage === 'step_selection' && (
          <div>
            {isTrigger ? (
              <TriggerSelection 
                onSelect={(trigger: TriggerType) => {
                  setFormData({ trigger: trigger.id });
                  setActiveStage('step_form');
                }}
              />
            ) : (
              <ActionSelection 
                onSelect={(action: ActionType) => {
                  setFormData({ action: action.id });
                  setActiveStage('step_form');
                }}
              />
            )}
          </div>
        )}

        {activeStage === 'step_form' && (
          <div className="space-y-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              ← Back
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {isTrigger ? (
                <TriggerForm 
                  data={formData}
                  onChange={setFormData}
                />
              ) : (
                <ActionForm 
                  data={formData}
                  onChange={setFormData}
                />
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg"
              >
                Save
              </button>
            </form>
          </div>
        )}

        {activeStage === 'created' && (
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-3xl text-green-500">✓</span>
            <span className="text-xl font-medium">Step ready</span>
          </div>
        )}
      </div>

      {(step?.canAddNextStep || isTrigger) && !isLastStep && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="absolute w-px bg-orange-500 h-[72px] top-full" />
          <button
            onClick={onAddStep}
            className="absolute top-[20px] p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
