'use client';

import { WalletMonitor } from "@/components/WalletMonitor";
import { PriceAlerts } from "@/components/PriceAlerts";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";

export default function MonitoringPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to access the monitoring dashboard
          </p>
          <WalletConnect />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your assets and set up price alerts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <WalletMonitor />
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Price Alerts</h2>
            <PriceAlerts />
          </Card>
        </div>
      </div>
    </div>
  );
} 