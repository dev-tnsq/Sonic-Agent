'use client';

import { useAccount } from 'wagmi';
import { WalletMonitor } from './WalletMonitor';
import { StrategyBuilder } from './StrategyBuilder';
import { TokenPriceMonitor } from './TokenPriceMonitor';
import { TradeHistory } from './TradeHistory';
import { useMonitorContract } from '@/hooks/useContracts';

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { strategy } = useMonitorContract();

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Sonic AI Monitor</h1>
          <p className="text-gray-500">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sonic AI Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WalletMonitor />
          <TokenPriceMonitor />
        </div>

        <div className="mt-8">
          <StrategyBuilder />
        </div>

        <div className="mt-8">
          <TradeHistory />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <div className="bg-[#1D1D1D] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Wallet Status</h3>
            <p className="text-sm text-gray-400">
              {isConnected && address ? 
                `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : 
                'Not connected'
              }
            </p>
          </div>

          <div className="bg-[#1D1D1D] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Active Strategy</h3>
            <p className="text-sm text-gray-400">
              {strategy?.isActive ? 'Running' : 'No active strategy'}
            </p>
          </div>

          <div className="bg-[#1D1D1D] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Network</h3>
            <p className="text-sm text-gray-400">Sonic Blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
