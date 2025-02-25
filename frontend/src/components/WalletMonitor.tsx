'use client';

import { useAccount, useBalance } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useMonitorContract } from '@/hooks/useContracts';
import { formatEther } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientOnly } from '@/components/ClientOnly';

function WalletMonitorContent() {
  const { address } = useAccount();
  const { strategy } = useMonitorContract();

  const { data: wethBalance, isLoading: isWethLoading } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.WETH,
  });

  const { data: wsBalance, isLoading: isWsLoading } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.WS,
  });

  const formatStrategyValue = (value: bigint | undefined) => {
    try {
      return value ? formatEther(value) : '0.00';
    } catch (error) {
      return '0.00';
    }
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Connect your wallet to view balances
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">WETH Balance</h3>
          {isWethLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{wethBalance?.formatted || '0.00'}</span>
              <Badge variant="secondary">WETH</Badge>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Wrapped Sonic Balance</h3>
          {isWsLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{wsBalance?.formatted || '0.00'}</span>
              <Badge variant="secondary">WS</Badge>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Active Strategy</h3>
        <div className="space-y-4 rounded-lg bg-muted/10 p-4">
          <div>
            <span className="text-sm text-muted-foreground">Target Price</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold">
                {formatStrategyValue(strategy?.targetPrice)}
              </span>
              <Badge variant="outline">SONIC</Badge>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Stop Loss</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold">
                {formatStrategyValue(strategy?.stopLoss)}
              </span>
              <Badge variant="outline">SONIC</Badge>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Max Amount</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold">
                {formatStrategyValue(strategy?.maxAmount)}
              </span>
              <Badge variant="outline">SONIC</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletMonitor() {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Wallet Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          <WalletMonitorContent />
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
