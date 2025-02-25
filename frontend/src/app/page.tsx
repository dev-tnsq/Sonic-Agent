import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WalletMonitor } from "@/components/WalletMonitor";
import { TradeHistory } from "@/components/TradeHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, Activity, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <ErrorBoundary>
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Sonic AI Dashboard
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build, deploy, and monitor AI agents for automated blockchain operations
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/agent-builder">
                <Button size="lg" className="gap-2">
                  Build Your Agent <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/monitoring">
                <Button size="lg" variant="outline" className="gap-2">
                  View Monitoring <Activity className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">AI-Powered Trading</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated trading with advanced AI strategies
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Track performance and get instant alerts
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Security First</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced risk management and protection
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <WalletMonitor />
            </div>
            <div className="space-y-6">
              <TradeHistory />
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
