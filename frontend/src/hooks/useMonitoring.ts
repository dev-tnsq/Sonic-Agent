import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { SONIC_AI_MONITOR_ABI } from '@/lib/abi/contracts';
import { parseEther } from 'viem';
import { type Strategy } from '@/types/contracts';

export function useMonitoring() {
  const { address } = useAccount();

  const { data: strategy } = useContractRead({
    address: CONTRACT_ADDRESSES.MONITOR as `0x${string}`,
    abi: SONIC_AI_MONITOR_ABI,
    functionName: 'getStrategy',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: Boolean(address),
    },
  });

  const { writeContract: setStrategy } = useContractWrite();

  const createStrategy = async (
    targetPrice: number,
    stopLoss: number,
    maxAmount: number,
    tokens: `0x${string}`[]
  ) => {
    if (!setStrategy) return;
    
    await setStrategy({
      address: CONTRACT_ADDRESSES.MONITOR as `0x${string}`,
      abi: SONIC_AI_MONITOR_ABI,
      functionName: 'setStrategy',
      args: [
        parseEther(targetPrice.toString()),
        parseEther(stopLoss.toString()),
        parseEther(maxAmount.toString()),
        tokens,
      ],
    });
  };

  return {
    strategy: strategy as Strategy | undefined,
    createStrategy,
  };
}
