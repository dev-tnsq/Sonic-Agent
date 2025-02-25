export interface Trade {
  timestamp: bigint;
  amount: bigint;
  price: bigint;
  isBuy: boolean;
  successful: boolean;
  aiSignature: `0x${string}`;
}

export interface Strategy {
  isActive: boolean;
  targetPrice: bigint;
  stopLoss: bigint;
  maxAmount: bigint;
  tokens: readonly `0x${string}`[];
}

export type TradeResult = ReadonlyArray<{
  readonly timestamp: bigint;
  readonly amount: bigint;
  readonly price: bigint;
  readonly isBuy: boolean;
  readonly successful: boolean;
  readonly aiSignature: `0x${string}`;
}>;
