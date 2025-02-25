import { useAccount, useBalance } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useMonitorContract } from '@/hooks/useContracts';
import { formatEther } from 'viem';

export function WalletMonitor() {
  const { address } = useAccount();
  const { strategy } = useMonitorContract();

  const { data: wethBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.WETH,
  });

  const { data: wsBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.WRAPPED_S,
  });

  return (
    <div className="p-4 rounded-lg bg-[#1D1D1D]">
      <h2 className="text-xl font-bold mb-4">Wallet Monitor</h2>
      
      <div className="space-y-4">
        <div>
          <h3>WETH Balance</h3>
          <p>{wethBalance?.formatted} WETH</p>
        </div>

        <div>
          <h3>Wrapped Sonic Balance</h3>
          <p>{wsBalance?.formatted} WS</p>
        </div>

        {strategy && (
          <div>
            <h3>Active Strategy</h3>
            <p>Target Price: {formatEther(strategy.targetPrice)} SONIC</p>
            <p>Stop Loss: {formatEther(strategy.stopLoss)} SONIC</p>
            <p>Max Amount: {formatEther(strategy.maxAmount)} SONIC</p>
          </div>
        )}
      </div>
    </div>
  );
}
