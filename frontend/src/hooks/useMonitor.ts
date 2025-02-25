import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../lib/contracts'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

export interface PriceAlert {
  token: string
  targetPrice: bigint
  currentPrice: bigint
  alertType: 'above' | 'below'
  isActive: boolean
}

export function useMonitorPrice(agentId: bigint | undefined) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])

  // Get agent's monitoring configuration
  const { data: agent } = useContractRead({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'getAgent',
    args: [agentId!],
    enabled: !!agentId
  })

  // Setup price monitoring
  const { write: setupMonitor, data: setupHash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'setupPriceMonitor'
  })

  const { isLoading: isSettingUp } = useWaitForTransaction({ hash: setupHash })

  // Update price alerts
  const { write: updateAlert, data: updateHash } = useContractWrite({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'updatePriceAlert'
  })

  const { isLoading: isUpdating } = useWaitForTransaction({ hash: updateHash })

  // Get active alerts
  const { data: activeAlerts } = useContractRead({
    address: CONTRACT_ADDRESSES.AGENT_FACTORY,
    abi: CONTRACT_ABIS.AGENT_FACTORY,
    functionName: 'getActiveAlerts',
    args: [agentId!],
    enabled: !!agentId,
    watch: true
  })

  useEffect(() => {
    if (activeAlerts) {
      setAlerts(activeAlerts as PriceAlert[])
    }
  }, [activeAlerts])

  const addAlert = async (
    token: string,
    targetPrice: bigint,
    alertType: 'above' | 'below'
  ) => {
    if (!agentId) return

    await setupMonitor({
      args: [agentId, token, targetPrice, alertType === 'above']
    })
  }

  const updateAlertConfig = async (
    token: string,
    targetPrice: bigint,
    alertType: 'above' | 'below'
  ) => {
    if (!agentId) return

    await updateAlert({
      args: [agentId, token, targetPrice, alertType === 'above']
    })
  }

  return {
    alerts,
    addAlert,
    updateAlertConfig,
    isSettingUp,
    isUpdating
  }
} 