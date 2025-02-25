export const SONIC_AI_MONITOR_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "targetPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stopLoss",
        "type": "uint256"
      }
    ],
    "name": "StrategyUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_targetPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_stopLoss",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxAmount",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      }
    ],
    "name": "setStrategy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getStrategy",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "targetPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stopLoss",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxAmount",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const SONIC_AI_AUTOMATION_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "strategyIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isBuy",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minReturn",
        "type": "uint256"
      }
    ],
    "name": "executeTrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
