export const NODE_TYPES = {
  TRIGGERS: {
    PRICE: {
      type: 'price_trigger',
      label: 'Price Trigger',
      color: 'blue',
      inputs: [
        { name: 'condition', type: 'select', options: ['above', 'below', 'between'] },
        { name: 'value', type: 'number', label: 'Price ($)' },
        { name: 'interval', type: 'select', options: ['1m', '5m', '15m', '1h'] }
      ],
      outputs: ['trigger']
    },
    AI_PREDICTION: {
      type: 'ai_prediction',
      label: 'AI Prediction',
      color: 'purple',
      inputs: [
        { name: 'model', type: 'select', options: ['price_trend', 'market_sentiment'] },
        { name: 'confidence', type: 'number', label: 'Min Confidence (%)' }
      ],
      outputs: ['prediction', 'confidence']
    },
    ZERP_EVENT: {
      type: 'zerp_event',
      label: 'Zerp Event',
      color: 'orange',
      inputs: [
        { name: 'eventType', type: 'select', options: ['transfer', 'swap', 'liquidity'] },
        { name: 'minAmount', type: 'number', label: 'Min Amount' }
      ],
      outputs: ['event']
    }
  },
  ACTIONS: {
    TRADE: {
      type: 'trade',
      label: 'Trade Action',
      color: 'green',
      inputs: [
        { name: 'action', type: 'select', options: ['buy', 'sell'] },
        { name: 'amount', type: 'number', label: 'Amount' },
        { name: 'slippage', type: 'number', label: 'Slippage %' }
      ],
      outputs: ['success', 'failed']
    },
    AI_STRATEGY: {
      type: 'ai_strategy',
      label: 'AI Strategy',
      color: 'indigo',
      inputs: [
        { name: 'strategy', type: 'select', options: ['momentum', 'mean_reversion', 'trend_following'] },
        { name: 'riskLevel', type: 'select', options: ['low', 'medium', 'high'] }
      ],
      outputs: ['signal']
    },
    NOTIFICATION: {
      type: 'notification',
      label: 'Notify',
      color: 'yellow',
      inputs: [
        { name: 'channel', type: 'select', options: ['email', 'telegram', 'discord'] },
        { name: 'message', type: 'text', label: 'Message' }
      ]
    }
  }
} as const;

export const nodeTypes = [
  {
    type: 'security',
    label: 'Security Analysis',
    description: 'Analyze smart contract security'
  },
  {
    type: 'aiAnalysis',
    label: 'AI Analysis',
    description: 'AI-powered code analysis'
  },
  {
    type: 'tokenPrice',
    label: 'Token Price',
    description: 'Fetch token prices'
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Execute blockchain transactions'
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Display results'
  }
] as const;

export type NodeType = typeof nodeTypes[number]['type'];
