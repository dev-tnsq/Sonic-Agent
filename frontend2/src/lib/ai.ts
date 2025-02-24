import { ethers } from 'ethers';

interface SecurityAnalysisResult {
  vulnerabilities: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    line?: number;
    code?: string;
  }>;
  suggestions: string;
}

interface PricePrediction {
  price: number;
  confidence: number;
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
}

export async function analyzeContract(code: string): Promise<SecurityAnalysisResult> {
  try {
    const response = await fetch('/api/security/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Contract analysis error:', error);
    throw error;
  }
}

export async function predictPrice(
  tokenAddress: string,
  timeframe: string
): Promise<PricePrediction> {
  try {
    const response = await fetch('/api/predict/price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenAddress, timeframe })
    });

    if (!response.ok) {
      throw new Error('Prediction failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Price prediction error:', error);
    throw error;
  }
}

export async function generateTradingStrategy(
  tokenAddress: string,
  riskLevel: 'low' | 'medium' | 'high'
): Promise<any> {
  try {
    const response = await fetch('/api/strategy/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenAddress, riskLevel })
    });

    if (!response.ok) {
      throw new Error('Strategy generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Strategy generation error:', error);
    throw error;
  }
}
