import { useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, Agent } from '../lib/contracts'
import { useAccount } from 'wagmi'

export function useUserAgents() {
  const { address } = useAccount()

  const { data: agentIds, isLoading: isLoadingIds } = useContractRead({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'getUserAgents',
    args: [address!],
    enabled: !!address
  })

  return {
    agentIds: agentIds as bigint[],
    isLoading: isLoadingIds
  }
}

export function useAgent(agentId: bigint | undefined) {
  const { data: agent, isLoading } = useContractRead({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'getAgent',
    args: [agentId!],
    enabled: !!agentId
  })

  return {
    agent: agent as Agent,
    isLoading
  }
} 