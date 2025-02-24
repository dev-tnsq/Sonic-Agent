import { ethers } from 'ethers';

interface Vulnerability {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  line?: number;
  details?: string;
}

export class SmartContractScanner {
  private vulnerabilityPatterns = {
    reentrancy: {
      pattern: /(\.\s*call\s*{.*value\s*:|\.transfer\s*\(|\.send\s*\()/g,
      severity: 'high' as const,
      description: 'Potential reentrancy vulnerability detected'
    },
    uncheckedReturn: {
      pattern: /\.call\s*\{.*\}/g,
      severity: 'medium' as const,
      description: 'Unchecked return value from low-level call'
    },
    txOrigin: {
      pattern: /tx\.origin/g,
      severity: 'high' as const,
      description: 'Unsafe use of tx.origin'
    },
    assembly: {
      pattern: /assembly\s*{/g,
      severity: 'medium' as const,
      description: 'Inline assembly usage detected'
    },
    delegatecall: {
      pattern: /\.delegatecall/g,
      severity: 'high' as const,
      description: 'Dangerous delegatecall usage'
    },
    // New patterns
    timeManipulation: {
      pattern: /block\.(timestamp|number)/g,
      severity: 'medium' as const,
      description: 'Timestamp manipulation vulnerability'
    },
    integerOverflow: {
      pattern: /\+\+|\+=|-=|\*=|\/=/g,
      severity: 'high' as const,
      description: 'Potential integer overflow/underflow'
    },
    randomness: {
      pattern: /keccak256|blockhash/g,
      severity: 'medium' as const,
      description: 'Weak source of randomness'
    }
  };

  async scanContract(address: string): Promise<Vulnerability[]> {
    try {
      if (!ethers.utils.isAddress(address)) {
        throw new Error('Invalid contract address');
      }

      // Get contract code
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const code = await provider.getCode(address);
      
      if (code === '0x') {
        throw new Error('No contract found at this address');
      }

      console.log('Scanning contract:', {
        address,
        codeLength: code.length
      });
      
      // Scan for vulnerabilities
      const vulnerabilities: Vulnerability[] = [];

      for (const [type, config] of Object.entries(this.vulnerabilityPatterns)) {
        const matches = code.match(config.pattern);
        if (matches) {
          const vulnerability: Vulnerability = {
            type,
            severity: config.severity,
            description: config.description,
            details: `Found ${matches.length} instance(s)`
          };

          // Get line numbers if possible
          try {
            const lines = code.split('\n');
            const lineNumbers = matches.map(match => 
              lines.findIndex(line => line.includes(match))
            ).filter(line => line !== -1);

            if (lineNumbers.length) {
              vulnerability.line = lineNumbers[0] + 1;
              vulnerability.details += ` at line(s): ${lineNumbers.map(l => l + 1).join(', ')}`;
            }
          } catch (e) {
            console.warn('Could not determine line numbers:', e);
          }

          vulnerabilities.push(vulnerability);
        }
      }

      // Custom security checks
      await this.performCustomChecks(code, vulnerabilities, provider, address);

      return vulnerabilities;

    } catch (error: any) {
      console.error('Contract scanning error:', error);
      throw new Error(error.message || 'Failed to scan contract');
    }
  }

  private async performCustomChecks(
    code: string, 
    vulnerabilities: Vulnerability[],
    provider: ethers.providers.Web3Provider,
    address: string
  ) {
    try {
      // Check balance handling
      const balance = await provider.getBalance(address);
      if (balance.gt(0) && !code.includes('receive()')) {
        vulnerabilities.push({
          type: 'missingReceive',
          severity: 'medium',
          description: 'Contract can receive ETH but has no receive() function'
        });
      }

      // Check for access control
      if (!code.includes('onlyOwner') && !code.includes('AccessControl')) {
        vulnerabilities.push({
          type: 'accessControl',
          severity: 'high',
          description: 'No apparent access control mechanism'
        });
      }

      // Check for pausability
      if (!code.includes('pause') && !code.includes('Pausable')) {
        vulnerabilities.push({
          type: 'pausability',
          severity: 'medium',
          description: 'Contract has no pause mechanism'
        });
      }

    } catch (error) {
      console.warn('Error in custom checks:', error);
    }
  }

  private async checkTransactionHistory(
    address: string,
    provider: ethers.providers.Web3Provider
  ): Promise<void> {
    try {
      const block = await provider.getBlock('latest');
      const history = await Promise.all(
        Array.from({ length: 10 }, (_, i) => 
          provider.getBlockWithTransactions(block.number - i)
        )
      );
      // Analyze transaction patterns
      // Add findings to vulnerabilities
    } catch (error) {
      console.warn('Error checking transaction history:', error);
    }
  }
}
