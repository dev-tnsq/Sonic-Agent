import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useContract } from '@/hooks/useContract';

const TokenPriceNode = ({ data, isConnectable }: NodeProps) => {
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { contract } = useContract();

  const fetchPrice = async () => {
    if (!data.tokenAddress || !contract) return;
    setLoading(true);
    try {
      const price = await contract.getTokenPrice(data.tokenAddress);
      setPrice(price.toString());
      data.onPriceUpdate?.(price.toString());
    } catch (error: any) {
      console.error('Price fetch error:', error);
      setPrice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.tokenAddress) {
      fetchPrice();
      const interval = setInterval(fetchPrice, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [data.tokenAddress, contract]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col">
        <div className="text-lg font-bold">Token Price</div>
        <input
          type="text"
          value={data.tokenAddress || ''}
          onChange={(e) => data.onTokenAddressChange?.(e.target.value)}
          placeholder="Token Address"
          className="mt-2 p-1 border rounded"
        />
        {loading ? (
          <div className="text-gray-500">Fetching price...</div>
        ) : price ? (
          <div className="mt-2 text-lg">{price} SONIC</div>
        ) : (
          <div className="text-gray-500">No price data</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default memo(TokenPriceNode);
