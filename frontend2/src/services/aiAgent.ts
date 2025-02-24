import { ethers } from 'ethers';
import { SONIC_NETWORK } from '@/config/network';
import { toast } from 'react-hot-toast';

export interface AIAgentConfig {
  priceThresholds: {
    buy: number;
    sell: number;
  };
  tradingLimits: {
    min: number;
    max: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  strategies: Array<'momentum' | 'mean_reversion' | 'trend_following'>;
}

interface MarketState {
  trend: 'up' | 'down' | 'sideways';
  volatility: number;
  volume: number;
  sentiment: number;
}

export class AIAgent {
  private static instance: AIAgent;
  private priceHistory: { price: number; timestamp: number }[] = [];
  private contract: ethers.Contract | null = null;
  private config: AIAgentConfig;
  private isRunning = false;
  private marketState: MarketState = {
    trend: 'sideways',
    volatility: 0,
    volume: 0,
    sentiment: 0
  };

  private constructor() {
    this.config = {
      priceThresholds: { buy: 0.45, sell: 0.55 },
      tradingLimits: { min: 0.1, max: 1.0 },
      riskLevel: 'medium',
      strategies: ['momentum', 'mean_reversion']
    };
  }

  static getInstance(): AIAgent {
    if (!AIAgent.instance) {
      AIAgent.instance = new AIAgent();
    }
    return AIAgent.instance;
  }

  async init(contract: ethers.Contract) {
    this.contract = contract;
  }

  async start(workflowId: string, nodes: any[]) {
    if (this.isRunning) {
      throw new Error('AI Agent is already running');
    }

    this.isRunning = true;
    toast.success('AI Agent started successfully');

    try {
      await Promise.all([
        this.monitorPrices(workflowId),
        this.analyzeMarket(),
        this.executeStrategies(nodes)
      ]);
    } catch (error: any) {
      toast.error(`AI Agent error: ${error.message}`);
      this.stop();
    }
  }

  stop() {
    this.isRunning = false;
    toast.success('AI Agent stopped');
  }

  private async monitorPrices(workflowId: string) {
    while (this.isRunning) {
      try {
        const price = await this.getCurrentPrice();
        const timestamp = Date.now();
        
        this.priceHistory.push({ price, timestamp });
        if (this.priceHistory.length > 100) {
          this.priceHistory.shift();
        }

        this.updateMarketState();
        await this.sleep(60000); // 1 minute interval
      } catch (error: any) {
        console.error('Price monitoring error:', error);
        toast.error(`Price monitoring error: ${error.message}`);
      }
    }
  }

  private async analyzeMarket() {
    while (this.isRunning) {
      try {
        const prediction = await this.predictNextPrice();
        const sentiment = await this.analyzeSentiment();
        const signal = this.generateTradeSignal(prediction);

        if (signal) {
          await this.executeTrade(signal, prediction);
        }

        await this.sleep(300000); // 5 minute interval
      } catch (error: any) {
        console.error('Market analysis error:', error);
        toast.error(`Market analysis error: ${error.message}`);
      }
    }
  }

  private updateMarketState() {
    if (this.priceHistory.length < 2) return;

    // Calculate trend
    const prices = this.priceHistory.map(p => p.price);
    const trend = this.calculateTrend(prices);
    
    // Calculate volatility
    const volatility = this.calculateVolatility(prices);
    
    // Update market state
    this.marketState = {
      ...this.marketState,
      trend,
      volatility
    };
  }

  private calculateTrend(prices: number[]): 'up' | 'down' | 'sideways' {
    const changes = prices.slice(1).map((p, i) => p - prices[i]);
    const averageChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    if (averageChange > 0.01) return 'up';
    if (averageChange < -0.01) return 'down';
    return 'sideways';
  }

  private calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private async predictNextPrice(): Promise<number> {
    if (this.priceHistory.length < 10) return 0;

    try {
      // Get recent prices for prediction
      const recentPrices = this.priceHistory.slice(-10).map(p => p.price);
      
      // Use different strategies based on market state
      switch (this.marketState.trend) {
        case 'up':
          return this.momentumStrategy(recentPrices);
        case 'down':
          return this.meanReversionStrategy(recentPrices);
        default:
          return this.trendFollowingStrategy(recentPrices);
      }
    } catch (error) {
      console.error('Price prediction error:', error);
      return 0;
    }
  }

  private momentumStrategy(prices: number[]): number {
    const lastPrice = prices[prices.length - 1];
    const momentum = prices.slice(-5).reduce((a, b) => a + b, 0) / 5;
    return lastPrice * (1 + (momentum - lastPrice) / lastPrice);
  }

  private meanReversionStrategy(prices: number[]): number {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const lastPrice = prices[prices.length - 1];
    return lastPrice + (mean - lastPrice) * 0.1;
  }

  private trendFollowingStrategy(prices: number[]): number {
    const lastPrice = prices[prices.length - 1];
    const sma = prices.reduce((a, b) => a + b, 0) / prices.length;
    return lastPrice * (1 + (lastPrice - sma) / sma);
  }

  private async analyzeSentiment(): Promise<number> {
    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: 'SONIC' })
      });
      
      const data = await response.json();
      return data.sentiment;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return 0;
    }
  }

  private generateTradeSignal(prediction: number): 'buy' | 'sell' | null {
    const lastPrice = this.priceHistory[this.priceHistory.length - 1].price;
    const potentialReturn = (prediction - lastPrice) / lastPrice;

    // Risk-adjusted thresholds based on market state
    const threshold = this.config.riskLevel === 'high' ? 0.02 :
                     this.config.riskLevel === 'medium' ? 0.03 : 0.05;

    if (potentialReturn > threshold && this.marketState.sentiment > 0.5) {
      return 'buy';
    } else if (potentialReturn < -threshold && this.marketState.sentiment < -0.5) {
      return 'sell';
    }

    return null;
  }

  private async executeTrade(signal: 'buy' | 'sell', predictedPrice: number) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const amount = this.calculateTradeAmount(predictedPrice);
      const tx = await (signal === 'buy' 
        ? this.contract.buy(amount)
        : this.contract.sell(amount));
      
      await tx.wait();
      toast.success(`${signal.toUpperCase()} order executed successfully`);
    } catch (error: any) {
      console.error('Trade execution error:', error);
      toast.error(`Trade execution failed: ${error.message}`);
    }
  }

  private calculateTradeAmount(predictedPrice: number): number {
    const { min, max } = this.config.tradingLimits;
    const lastPrice = this.priceHistory[this.priceHistory.length - 1].price;
    const priceChange = Math.abs((predictedPrice - lastPrice) / lastPrice);
    
    // Scale amount based on confidence (price change magnitude)
    const scaledAmount = min + (max - min) * Math.min(priceChange * 10, 1);
    return Number(scaledAmount.toFixed(4));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeStrategies(nodes: any[]): Promise<void> {
    while (this.isRunning) {
      try {
        for (const node of nodes) {
          // Execute strategy logic for each node
          await this.executeStrategyNode(node);
        }
        await this.sleep(60000); // 1 minute interval
      } catch (error: any) {
        console.error('Strategy execution error:', error);
        throw error;
      }
    }
  }

  private async executeStrategyNode(node: any): Promise<void> {
    // Implement strategy execution logic for individual nodes
    // This is a placeholder and should be implemented based on your specific needs
  }

  private async getCurrentPrice(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.getCurrentPrice();
  }

  // Public methods for external interaction
  public async updateConfig(newConfig: Partial<AIAgentConfig>) {
    this.config = { ...this.config, ...newConfig };
    toast.success('AI Agent configuration updated');
  }

  public getMarketState(): MarketState {
    return { ...this.marketState };
  }

  public getPriceHistory() {
    return [...this.priceHistory];
  }
}

export default AIAgent;
