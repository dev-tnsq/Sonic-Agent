import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { SONIC_ADDRESSES } from '@/constants/addresses';
import monitorABI from '@/abi/SonicAIMonitor.json';
import { parseEther } from 'viem';

export function useMonitoring() {
  const { address } = useAccount();

  const { data: strategy } = useContractRead({
    address: SONIC_ADDRESSES.MONITOR_CONTRACT,
    abi: monitorABI,
    functionName: 'getStrategy',
    args: [address],
  });

  const { writeAsync: setStrategy } = useContractWrite({
    address: SONIC_ADDRESSES.MONITOR_CONTRACT,
    abi: monitorABI,
    functionName: 'setStrategy',
  });

  const createStrategy = async (
    targetPrice: number,
    stopLoss: number,
    maxAmount: number,
    tokens: `0x${string}`[]
  ) => {
    await setStrategy({
      args: [
        parseEther(targetPrice.toString()),
        parseEther(stopLoss.toString()),
        parseEther(maxAmount.toString()),
        tokens,
      ],
    });
  };

  return {
    strategy,
    createStrategy,
  };
}
