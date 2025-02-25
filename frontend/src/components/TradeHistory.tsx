'use client';

import { useMonitorContract } from '@/hooks/useContracts';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import { Trade } from '@/types/contracts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientOnly } from '@/components/ClientOnly';

function TradeHistoryContent() {
  const { address } = useAccount();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trades: userTradeData } = useMonitorContract();

  useEffect(() => {
    setIsLoading(true);
    if (!userTradeData) {
      setTrades([]);
      setIsLoading(false);
      return;
    }
    
    try {
      const formattedTrades = userTradeData
        .filter(trade => trade && typeof trade === 'object')
        .map((trade) => ({
          timestamp: BigInt(trade.timestamp || 0),
          amount: BigInt(trade.amount || 0),
          price: BigInt(trade.price || 0),
          isBuy: Boolean(trade.isBuy),
          successful: Boolean(trade.successful),
          aiSignature: trade.aiSignature || ''
        }));
      
      setTrades(formattedTrades);
    } catch (error) {
      console.error('Error formatting trade data:', error);
      setTrades([]);
    } finally {
      setIsLoading(false);
    }
  }, [userTradeData]);

  const formatTradeValue = (value: bigint | undefined) => {
    if (!value || value === BigInt(0)) return '0.00';
    try {
      return formatEther(value);
    } catch (error) {
      console.error('Error formatting trade value:', error);
      return '0.00';
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Connect your wallet to view trade history
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No trades found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full data-grid">
        <thead>
          <tr>
            <th className="p-2">Time</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index} className="hover:bg-muted/5">
              <td className="p-2">
                {formatTimestamp(trade.timestamp)}
              </td>
              <td className="p-2">
                <Badge variant={trade.isBuy ? "success" : "destructive"}>
                  {trade.isBuy ? 'Buy' : 'Sell'}
                </Badge>
              </td>
              <td className="p-2">
                <span className="token-price">
                  {formatTradeValue(trade.amount)} <span className="text-muted-foreground">SONIC</span>
                </span>
              </td>
              <td className="p-2">
                <span className="token-price">
                  {formatTradeValue(trade.price)} <span className="text-muted-foreground">WS</span>
                </span>
              </td>
              <td className="p-2">
                <Badge 
                  variant={trade.successful ? "success" : "destructive"}
                  className="opacity-80"
                >
                  {trade.successful ? 'Success' : 'Failed'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TradeHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          <TradeHistoryContent />
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
