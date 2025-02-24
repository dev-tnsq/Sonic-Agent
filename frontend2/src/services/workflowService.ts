const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface WorkflowRun {
  id: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
  outputs?: any;
}

export async function fetchWorkflowRuns(): Promise<WorkflowRun[]> {
  const response = await fetch(`${BASE_URL}/api/v1/workflows/runs`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch workflow runs');
  }

  const data = await response.json();
  return data.data;
}

export async function createWorkflow(workflowData: any) {
  const response = await fetch(`${BASE_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(workflowData)
  });

  if (!response.ok) {
    throw new Error('Failed to create workflow');
  }

  return response.json();
}

export async function executeWorkflow(workflowId: string, inputs: any = {}) {
  const response = await fetch(`${BASE_URL}/api/v1/workflows/${workflowId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ inputs })
  });

  if (!response.ok) {
    throw new Error('Failed to execute workflow');
  }

  return response.json();
}
