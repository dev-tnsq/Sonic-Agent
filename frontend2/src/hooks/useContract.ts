'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletContext } from '@/app/providers';

// Simplified ABI with only the functions we need
const CONTRACT_ABI = [
  "function buySonic(uint256 amount) external payable",
  "function createIndex(string name, string[] tokens, uint256[] weights) external",
  "function updatePrice(string coinId, uint256 price) external",
  "event SonicBought(address user, uint256 amount)",
  "event IndexCreated(address user, string name)"
];

const CONTRACT_ADDRESS = '0x713336e3B1A95c6f8Ad3CA610fD6B615Ba59a41E';

export function useContract() {
  const { account } = useWalletContext();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== 'undefined' && account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setSigner(signer);
          
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);
        } catch (error) {
          console.error('Contract initialization error:', error);
        }
      }
    };

    initContract();
  }, [account]);

  const buySonic = useCallback(async (amount: string) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    
    try {
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await contract.buySonic(amountWei, {
        value: amountWei
      });
      console.log('Buy transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Buy transaction confirmed:', receipt);
      return receipt;
    } catch (error) {
      console.error('Buy transaction error:', error);
      throw error;
    }
  }, [contract, signer]);

  const createIndex = useCallback(async (
    name: string,
    tokens: string[],
    weights: number[]
  ) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    
    try {
      // Convert weights to correct format
      const weightsWei = weights.map(w => 
        ethers.utils.parseUnits(w.toString(), 18)
      );

      const tx = await contract.createIndex(name, tokens, weightsWei);
      console.log('Create index transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Index created:', receipt);
      return receipt;
    } catch (error) {
      console.error('Create index error:', error);
      throw error;
    }
  }, [contract, signer]);

  const updatePrice = useCallback(async (
    coinId: string,
    price: number
  ) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    
    try {
      const priceWei = ethers.utils.parseUnits(price.toString(), 18);
      const tx = await contract.updatePrice(coinId, priceWei);
      console.log('Update price transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Price updated:', receipt);
      return receipt;
    } catch (error) {
      console.error('Update price error:', error);
      throw error;
    }
  }, [contract, signer]);

  return {
    contract,
    signer,
    isReady: !!contract && !!signer,
    buySonic,
    createIndex,
    updatePrice
  };
}

// Helper hook for contract events
export function useContractEvent(eventName: string, callback: (args: any[]) => void) {
  const { contract } = useContract();

  useEffect(() => {
    if (!contract) return;

    const listener = (...args: any[]) => {
      callback(args);
    };

    contract.on(eventName, listener);
    return () => {
      contract.off(eventName, listener);
    };
  }, [contract, eventName, callback]);
}
