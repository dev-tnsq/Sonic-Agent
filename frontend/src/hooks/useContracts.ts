import { useAccount, useReadContract, useChainId } from 'wagmi'
import { writeContract } from '@wagmi/core'
import { config } from '@/lib/web3Config'
import { CONTRACT_ADDRESSES } from '@/lib/contracts'
import { SONIC_AI_MONITOR_ABI, SONIC_AI_AUTOMATION_ABI } from '@/lib/abi'
import { parseEther, type Hash, zeroAddress } from 'viem'
import { toast } from 'sonner'
import type { Strategy, TradeResult } from '@/types/contracts'

interface StrategyParams {
  targetPrice: number;
  stopLoss: number;
  maxAmount: number;
  tokens: readonly `0x${string}`[];
}

interface TradeParams {
  user: `0x${string}`
  strategyIndex: bigint
  isBuy: boolean
  amount: bigint
  minReturn: bigint
}

export function useMonitorContract() {
  const { address } = useAccount()
  const chainId = useChainId()
  
  const { data: trades, isError: isTradesError } = useReadContract({
    address: CONTRACT_ADDRESSES.MONITOR,
    abi: SONIC_AI_MONITOR_ABI,
    functionName: 'userTrades',
    args: address ? [address] : [zeroAddress],
    query: {
      enabled: Boolean(address),
      gcTime: 0, // Disable caching
    },
  })

  const { data: strategy, isError: isStrategyError } = useReadContract({
    address: CONTRACT_ADDRESSES.MONITOR,
    abi: SONIC_AI_MONITOR_ABI,
    functionName: 'userTrades',
    args: address ? [address] : [zeroAddress],
    query: {
      enabled: Boolean(address),
      gcTime: 0, // Disable caching
    },
  })

  const setStrategy = async (params: StrategyParams): Promise<Hash | undefined> => {
    if (!address || !chainId) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const result = await writeContract(config, {
        address: CONTRACT_ADDRESSES.MONITOR,
        abi: SONIC_AI_MONITOR_ABI,
        functionName: 'setStrategy', // Changed from addAuthorizedAI to setStrategy
        args: [
          parseEther(params.targetPrice.toString()),
          parseEther(params.stopLoss.toString()),
          parseEther(params.maxAmount.toString()),
          params.tokens
        ] as const satisfies readonly [bigint, bigint, bigint, readonly `0x${string}`[]], // Fixed type assertion
        account: address,
        chainId: 57054,
      })
      
      toast.success('Strategy submitted')
      return result
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to set strategy')
      }
      console.error(error)
      return undefined
    }
  }

  return {
    trades: trades as TradeResult | undefined,
    strategy: strategy as Strategy | undefined,
    setStrategy,
    isError: isTradesError || isStrategyError,
  }
}

export function useAutomationContract() {
  const { address } = useAccount()
  const chainId = useChainId()

  const executeTrade = async (params: TradeParams): Promise<Hash | undefined> => {
    if (!address || !chainId) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const result = await writeContract(config, {
          address: CONTRACT_ADDRESSES.AUTOMATION,
          abi: SONIC_AI_AUTOMATION_ABI,
          functionName: 'executeTrade',
          args: [
            params.user,
            params.strategyIndex,
            params.isBuy,
            params.amount,
            params.minReturn,
          ] as const,
          account: address,
          chainId,
      })

      toast.success('Trade submitted')
      return result
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Trade execution failed')
      }
      console.error(error)
      return undefined
    }
  }

  return {
    executeTrade,
  }
}