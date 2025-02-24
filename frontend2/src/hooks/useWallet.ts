'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SONIC_NETWORK } from '@/config/network';
import { checkMetaMaskProvider, getProvider } from '@/utils/provider';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('walletAccount') : null
  );
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const autoConnect = async () => {
      const { hasProvider } = checkMetaMaskProvider();
      if (hasProvider && account) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Auto-connect failed:', error);
          localStorage.removeItem('walletAccount');
          setAccount(null);
        }
      }
    };

    autoConnect();
  }, []);

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) {
      throw new Error('Please install MetaMask');
    }

    setIsConnecting(true);
    try {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      await ethersProvider.send("eth_requestAccounts", []);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethersProvider.getNetwork();

      setAccount(address);
      setChainId(`0x${network.chainId.toString(16)}`);
      localStorage.setItem('walletAccount', address);

      // Switch to Sonic network if needed
      if (network.chainId !== SONIC_NETWORK.chainId) {
        await switchToSonicNetwork();
      }
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToSonicNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SONIC_NETWORK.chainIdHex }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: SONIC_NETWORK.chainIdHex,
            chainName: SONIC_NETWORK.name,
            nativeCurrency: SONIC_NETWORK.currency,
            rpcUrls: [SONIC_NETWORK.rpc],
            blockExplorerUrls: [SONIC_NETWORK.explorer]
          }],
        });
      }
    }
  };

  const disconnect = () => {
    localStorage.removeItem('walletAccount');
    setAccount(null);
    setChainId(null);
  };

  return {
    account,
    chainId,
    isConnecting,
    connectWallet,
    disconnect
  };
}
