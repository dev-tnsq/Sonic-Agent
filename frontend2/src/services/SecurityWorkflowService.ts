import { ethers } from 'ethers';

interface SecurityVulnerability {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  line?: number;
  code?: string;
}

interface AnalysisResult {
  vulnerabilities: SecurityVulnerability[];
  suggestions: string;
  score: number;
}

export class SecurityWorkflowService {
  private static instance: SecurityWorkflowService;
  private provider: ethers.providers.Web3Provider | null = null;

  private constructor() {}

  static getInstance(): SecurityWorkflowService {
    if (!SecurityWorkflowService.instance) {
      SecurityWorkflowService.instance = new SecurityWorkflowService();
    }
    return SecurityWorkflowService.instance;
  }

  async init() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  async analyzeContract(code: string): Promise<AnalysisResult> {
    try {
      // Here you would typically call your AI service
      // For now, we'll simulate the analysis
      const vulnerabilities = await this.detectVulnerabilities(code);
      const suggestions = this.generateSuggestions(vulnerabilities);
      const score = this.calculateSecurityScore(vulnerabilities);

      return {
        vulnerabilities,
        suggestions,
        score
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  private async detectVulnerabilities(code: string): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const patterns = {
      reentrancy: /(\.\s*call\s*{.*value\s*:|\.transfer\s*\(|\.send\s*\()/g,
      uncheckedReturn: /\.call\s*\{.*\}/g,
      txOrigin: /tx\.origin/g,
      assembly: /assembly\s*{/g,
      delegatecall: /\.delegatecall/g
    };

    // Check each pattern
    Object.entries(patterns).forEach(([type, pattern]) => {
      const matches = code.match(pattern);
      if (matches) {
        vulnerabilities.push(this.createVulnerability(type, matches));
      }
    });

    return vulnerabilities;
  }

  private createVulnerability(type: string, matches: RegExpMatchArray): SecurityVulnerability {
    const vulnTypes: Record<string, SecurityVulnerability> = {
      reentrancy: {
        title: 'Reentrancy Vulnerability',
        description: 'Contract is vulnerable to reentrancy attacks',
        severity: 'high'
      },
      uncheckedReturn: {
        title: 'Unchecked Return Value',
        description: 'Low-level call return value not checked',
        severity: 'medium'
      },
      txOrigin: {
        title: 'tx.origin Usage',
        description: 'Dangerous use of tx.origin for authorization',
        severity: 'high'
      },
      assembly: {
        title: 'Inline Assembly',
        description: 'Contract uses inline assembly',
        severity: 'medium'
      },
      delegatecall: {
        title: 'Delegatecall Usage',
        description: 'Dangerous use of delegatecall',
        severity: 'high'
      }
    };

    return {
      ...vulnTypes[type],
      code: matches[0]
    };
  }

  private generateSuggestions(vulnerabilities: SecurityVulnerability[]): string {
    let suggestions = '';
    
    vulnerabilities.forEach(vuln => {
      suggestions += `• ${vuln.title}:\n`;
      suggestions += `  - ${vuln.description}\n`;
      suggestions += `  - Recommendation: ${this.getRecommendation(vuln.title)}\n\n`;
    });

    return suggestions;
  }

  private getRecommendation(vulnType: string): string {
    const recommendations: Record<string, string> = {
      'Reentrancy Vulnerability': 'Use ReentrancyGuard or checks-effects-interactions pattern',
      'Unchecked Return Value': 'Always check return values from external calls',
      'tx.origin Usage': 'Use msg.sender instead of tx.origin',
      'Inline Assembly': 'Avoid inline assembly unless absolutely necessary',
      'Delegatecall Usage': 'Avoid delegatecall or implement strict access controls'
    };

    return recommendations[vulnType] || 'Review and fix the identified issue';
  }

  private calculateSecurityScore(vulnerabilities: SecurityVulnerability[]): number {
    const baseScore = 100;
    const deductions = {
      high: 25,
      medium: 15,
      low: 5
    };

    const totalDeduction = vulnerabilities.reduce((sum, vuln) => 
      sum + (deductions[vuln.severity] || 0), 0);

    return Math.max(0, baseScore - totalDeduction);
  }
}

export default SecurityWorkflowService;
