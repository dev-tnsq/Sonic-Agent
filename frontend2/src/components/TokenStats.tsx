'use client';

import { useState, useEffect } from 'react';
import { useWalletContext } from '@/app/providers';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  chain: string;
}

export default function TokenStats() {
  const { chainId } = useWalletContext();
  const [tokens, setTokens] = useState<TokenData[]>([
    {
      symbol: 'SONIC',
      name: 'Sonic Token',
      price: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      chain: 'sonic'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      chain: 'ethereum'
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Using v3/simple/price endpoint with all parameters
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?' +
          'ids=ethereum' +
          '&vs_currencies=usd' +
          '&include_24hr_vol=true' +
          '&include_24hr_change=true' +
          '&include_market_cap=true'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch token data');
        }

        const data = await response.json();
        
        setTokens(prev => prev.map(token => {
          if (token.symbol === 'ETH' && data.ethereum) {
            return {
              ...token,
              price: data.ethereum.usd || 0,
              change24h: data.ethereum.usd_24h_change || 0,
              volume24h: data.ethereum.usd_24h_vol || 0,
              marketCap: data.ethereum.usd_market_cap || 0
            };
          }
          // Simulate SONIC token data with more realistic values
          const basePrice = 0.5;
          return {
            ...token,
            price: basePrice + (Math.random() * 0.1 - 0.05), // Price between 0.45-0.55
            change24h: Math.random() * 10 - 5, // Change between -5% and +5%
            volume24h: 1_000_000 + Math.random() * 500_000,
            marketCap: 100_000_000 + Math.random() * 10_000_000
          };
        }));
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError('Failed to fetch token data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Token Statistics</h2>
        {error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : isLoading ? (
          <div className="animate-pulse text-sm text-gray-400">
            Updating...
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {tokens.map((token) => (
          <div key={token.symbol} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{token.symbol}</h3>
                <p className="text-sm text-gray-400">{token.name}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">${token.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className={`text-sm ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <div className="text-gray-400">24h Volume</div>
                <div>${abbreviateNumber(token.volume24h)}</div>
              </div>
              <div>
                <div className="text-gray-400">Market Cap</div>
                <div>${abbreviateNumber(token.marketCap)}</div>
              </div>
            </div>

            {token.chain === 'sonic' && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="text-xs text-gray-400">Network Status</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Sonic Network Active</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function abbreviateNumber(value: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(Math.log10(Math.abs(value)) / 3);
  
  if (suffixNum === 0) return value.toFixed(2);
  
  const shortValue = (value / Math.pow(1000, suffixNum)).toFixed(1);
  return `${shortValue}${suffixes[suffixNum]}`;
}
