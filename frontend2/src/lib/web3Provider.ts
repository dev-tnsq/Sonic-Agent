import { ethers } from 'ethers';
import { SONIC_NETWORK } from '@/config/network';

class Web3Provider {
  private static instance: Web3Provider;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {
    console.log('Web3Provider instance created');
  }

  static getInstance(): Web3Provider {
    if (!Web3Provider.instance) {
      console.log('Creating new Web3Provider instance');
      Web3Provider.instance = new Web3Provider();
    }
    return Web3Provider.instance;
  }

  async init(): Promise<void> {
    console.log('Initializing Web3Provider...');
    console.log('Window ethereum object:', window.ethereum);

    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask not found in window');
      throw new Error('MetaMask not installed');
    }

    try {
      console.log('Requesting account access...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);
      
      console.log('Initializing Web3Provider...');
      this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      
      console.log('Getting signer...');
      this.signer = this.provider.getSigner();
      
      console.log('Setting up network...');
      await this.setupNetwork();
      
      // Verify connection
      const network = await this.provider.getNetwork();
      const address = await this.signer.getAddress();
      console.log('Connection verified:', {
        network,
        address,
        chainId: network.chainId
      });
    } catch (error) {
      console.error('Failed to initialize Web3Provider:', error);
      throw error;
    }
  }

  private async setupNetwork(): Promise<void> {
    console.log('Setting up network...');
    console.log('Target network:', SONIC_NETWORK);

    if (!window.ethereum) {
      console.error('No ethereum object');
      return;
    }

    try {
      console.log('Attempting to switch chain...');
      try {
        const switchResult = await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SONIC_NETWORK.chainIdHex }]
        });
        console.log('Switch chain result:', switchResult);
      } catch (switchError: any) {
        console.log('Switch chain error:', switchError);
        
        if (switchError.code === 4902) {
          console.log('Network not found, adding network...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SONIC_NETWORK.chainIdHex,
              chainName: SONIC_NETWORK.name,
              nativeCurrency: SONIC_NETWORK.currency,
              rpcUrls: [SONIC_NETWORK.rpc],
              blockExplorerUrls: [SONIC_NETWORK.explorer]
            }]
          });
        } else {
          throw switchError;
        }
      }

      // Verify network switch
      if (this.provider) {
        const network = await this.provider.getNetwork();
        const currentChainId = network.chainId;
        
        if (currentChainId !== SONIC_NETWORK.chainId) {
          throw new Error(`Network switch failed. Expected ${SONIC_NETWORK.chainId}, got ${currentChainId}`);
        }
      }
    } catch (error) {
      console.error('Network setup failed:', error);
      throw error;
    }
  }

  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider;
  }

  getSigner(): ethers.Signer | null {
    return this.signer;
  }

  async getAccount(): Promise<string | null> {
    try {
      if (!this.signer) return null;
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  async getNetwork(): Promise<ethers.providers.Network | null> {
    try {
      if (!this.provider) return null;
      return await this.provider.getNetwork();
    } catch {
      return null;
    }
  }
}

export default Web3Provider;
