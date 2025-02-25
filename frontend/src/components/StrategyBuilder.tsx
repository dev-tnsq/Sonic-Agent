import { useState } from 'react';
import { useMonitorContract } from '@/hooks/useContracts';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function StrategyBuilder() {
  const { createStrategy } = useMonitorContract();
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await createStrategy({
        targetPrice: Number(targetPrice),
        stopLoss: Number(stopLoss),
        maxAmount: Number(maxAmount),
        tokens: [CONTRACT_ADDRESSES.WETH, CONTRACT_ADDRESSES.WRAPPED_S]
      });
      toast.success('Strategy created successfully');
      setTargetPrice('');
      setStopLoss('');
      setMaxAmount('');
    } catch (error) {
      console.error('Failed to create strategy:', error);
      toast.error('Failed to create strategy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1D1D1D] rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Create Trading Strategy</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Target Price (SONIC)</label>
          <Input
            type="number"
            step="0.000001"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Enter target price"
            className="bg-[#2D2D2D]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Stop Loss (SONIC)</label>
          <Input
            type="number"
            step="0.000001"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="Enter stop loss"
            className="bg-[#2D2D2D]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Max Amount (SONIC)</label>
          <Input
            type="number"
            step="0.000001"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="Enter maximum trade amount"
            className="bg-[#2D2D2D]"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Setting Strategy...' : 'Create Strategy'}
        </Button>
      </form>
    </div>
  );
}
