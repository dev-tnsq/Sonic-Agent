import { Node, Edge } from 'reactflow';
import { AIAgent } from '@/services/aiAgent';

export interface WorkflowContext {
  nodes: Node[];
  edges: Edge[];
  results: Map<string, any>;
}

export class WorkflowExecutor {
  private agent: AIAgent;

  constructor() {
    this.agent = AIAgent.getInstance();
  }

  async executeWorkflow(nodes: Node[], edges: Edge[]): Promise<Map<string, any>> {
    const context: WorkflowContext = {
      nodes,
      edges,
      results: new Map()
    };

    const startNodes = this.findStartNodes(nodes, edges);
    
    for (const node of startNodes) {
      await this.executeNode(node, context);
    }

    return context.results;
  }

  private async executeNode(node: Node, context: WorkflowContext): Promise<void> {
    try {
      let result;
      
      switch (node.type) {
        case 'security':
          result = node.data.code;
          break;
          
        case 'aiAnalysis':
          const inputCode = this.getNodeInput(node, context);
          result = await this.agent.analyzeCode(inputCode);
          break;
          
        case 'tokenPrice':
          const tokenAddress = node.data.tokenAddress;
          result = await this.agent.getTokenPrice(tokenAddress);
          break;
          
        case 'output':
          const outputData = this.getNodeInput(node, context);
          result = outputData;
          break;
      }

      context.results.set(node.id, result);
      
      // Execute next nodes
      const nextNodes = this.findNextNodes(node, context.nodes, context.edges);
      for (const nextNode of nextNodes) {
        await this.executeNode(nextNode, context);
      }
      
    } catch (error: any) {
      console.error(`Error executing node ${node.id}:`, error);
      context.results.set(node.id, { error: error.message });
    }
  }

  private getNodeInput(node: Node, context: WorkflowContext): any {
    const incomingEdges = context.edges.filter(e => e.target === node.id);
    if (incomingEdges.length === 0) return null;
    
    const sourceNodeId = incomingEdges[0].source;
    return context.results.get(sourceNodeId);
  }

  private findStartNodes(nodes: Node[], edges: Edge[]): Node[] {
    return nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );
  }

  private findNextNodes(node: Node, nodes: Node[], edges: Edge[]): Node[] {
    const outgoingEdges = edges.filter(e => e.source === node.id);
    return outgoingEdges.map(edge => 
      nodes.find(n => n.id === edge.target)!
    ).filter(Boolean);
  }
}
