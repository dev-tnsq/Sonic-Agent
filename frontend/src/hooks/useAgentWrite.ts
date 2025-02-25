import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, TradingParams, SecurityParams } from '../lib/contracts'

export function useCreateAgent() {
  const { write, data: hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'createAgent'
  })

  const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  return {
    createAgent: write,
    isLoading,
    isSuccess
  }
}

export function useUpdateTradingParams() {
  const { write, data: hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'updateTradingParams'
  })

  const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  return {
    updateTradingParams: write,
    isLoading,
    isSuccess
  }
}

export function useUpdateSecurityParams() {
  const { write, data: hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'updateSecurityParams'
  })

  const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  return {
    updateSecurityParams: write,
    isLoading,
    isSuccess
  }
}

export function useDeactivateAgent() {
  const { write, data: hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'deactivateAgent'
  })

  const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  return {
    deactivateAgent: write,
    isLoading,
    isSuccess
  }
}

export function useReactivateAgent() {
  const { write, data: hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'reactivateAgent'
  })

  const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  return {
    reactivateAgent: write,
    isLoading,
    isSuccess
  }
}

export function useExecuteTrade() {
  const { write, data: hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'executeTrade'
  })

  const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  return {
    executeTrade: write,
    isLoading,
    isSuccess
  }
} 