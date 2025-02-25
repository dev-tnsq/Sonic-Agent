import { useMonitorContract } from '@/hooks/useContracts';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import { Trade, TradeResult } from '@/types/contracts';

export function TradeHistory() {
  const { address } = useAccount();
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const { data: userTradeData } = useMonitorContract({
    functionName: 'userTrades',
    args: [address!],  // Use non-null assertion as enabled handles the check
    enabled: !!address,
    watch: true,
  });

  useEffect(() => {
    if (!userTradeData) return;
    
    try {
      const formattedTrades = (userTradeData as TradeResult).map((trade) => ({
        timestamp: trade.timestamp,
        amount: trade.amount,
        price: trade.price,
        isBuy: trade.isBuy,
        successful: trade.successful,
        aiSignature: trade.aiSignature
      }));
      
      setTrades(formattedTrades);
    } catch (error) {
      console.error('Error formatting trade data:', error);
    }
  }, [userTradeData]);

  // Loading state
  if (!address) {
    return (
      <div className="bg-[#1D1D1D] rounded-lg p-6">
        <p className="text-gray-400">Connect your wallet to view trade history</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1D1D1D] rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Trade History</h2>
      
      {trades.length === 0 ? (
        <p className="text-gray-400">No trades found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#333]">
                <th className="p-2">Time</th>
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={index} className="border-b border-[#333] hover:bg-[#2D2D2D] transition-colors">
                  <td className="p-2">
                    {new Date(Number(trade.timestamp) * 1000).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <span className={trade.isBuy ? 'text-green-500' : 'text-red-500'}>
                      {trade.isBuy ? 'Buy' : 'Sell'}
                    </span>
                  </td>
                  <td className="p-2">
                    {formatEther(trade.amount)} SONIC
                  </td>
                  <td className="p-2">
                    {formatEther(trade.price)} WS
                  </td>
                  <td className="p-2">
                    <span 
                      className={`px-2 py-1 rounded ${
                        trade.successful 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {trade.successful ? 'Success' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
