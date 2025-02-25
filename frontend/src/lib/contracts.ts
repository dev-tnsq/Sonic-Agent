import { Address } from 'viem';
import AgentFactoryABI from '../abi/AgentFactory.json';
import SonicTokenABI from '../abi/SonicToken.json';

export const CONTRACT_ADDRESSES = {
  AGENT_FACTORY: process.env.NEXT_PUBLIC_AGENT_FACTORY_ADDRESS as Address,
  SONIC_TOKEN: process.env.NEXT_PUBLIC_SONIC_TOKEN_ADDRESS as Address,
  WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9' as Address,
  WS: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' as Address,
  MONITOR: process.env.NEXT_PUBLIC_MONITOR_ADDRESS as Address,
  AUTOMATION: process.env.NEXT_PUBLIC_AUTOMATION_ADDRESS as Address
} as const;

export const CONTRACT_ABIS = {
  AGENT_FACTORY: AgentFactoryABI,
  SONIC_TOKEN: SonicTokenABI,
} as const;

export type TradingParams = {
  buyPrice: bigint
  sellPrice: bigint
  maxAmount: bigint
  stopLoss: bigint
  isActive: boolean
}

export type SecurityParams = {
  monitoredContracts: Address[]
  riskThreshold: bigint
  alertsEnabled: boolean
}

export type Agent = {
  name: string
  codename: string
  owner: Address
  createdAt: bigint
  isActive: boolean
  metadata: string
  tradingParams: TradingParams
  securityParams: SecurityParams
  balance: bigint
}

// Function to validate contract addresses
export const validateAddress = (address: string): `0x${string}` => {
  if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
    throw new Error('Invalid Ethereum address');
  }
  return address as `0x${string}`;
}