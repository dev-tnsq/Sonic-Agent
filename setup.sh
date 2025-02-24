#!/bin/bash

# Create project structure
mkdir -p backend/
mkdir -p contracts/
mkdir -p dapp/scripts dapp/tests
mkdir -p frontend/pages frontend/components frontend/styles
mkdir -p workflow-ui/

# Initialize Node.js projects
cd frontend
npm init -y
npm install next react react-dom ethers@^5.7.2 autoprefixer postcss tailwindcss
npm install --save-dev @types/node @types/react typescript

# Initialize Next.js
npx create-next-app@latest . --typescript --tailwind --no-app --no-src-dir --import-alias "@/*"

cd ../dapp
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
npx hardhat init

# Setup Python environment
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install web3 requests nltk scikit-learn
pip freeze > requirements.txt

# Copy smart contract
cd ../contracts
echo 'Creating SonicAutomation.sol...'
cat > SonicAutomation.sol << 'EOL'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SonicAutomation {
    address public owner;
    mapping(string => uint256) public priceData;

    event PriceUpdated(string coinId, uint256 price);
    event SonicBought(address user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updatePrice(string memory coinId, uint256 price) external onlyOwner {
        priceData[coinId] = price;
        emit PriceUpdated(coinId, price);
    }

    function buySonic(uint256 amount) external payable {
        require(msg.value >= amount, "Insufficient funds");
        emit SonicBought(msg.sender, amount);
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
EOL

# Create initial AI agent
cd ../backend
cat > ai_agent.py << 'EOL'
import time
import requests
from web3 import Web3
from nltk import word_tokenize, pos_tag
from sklearn.linear_model import LinearRegression
import json

SONIC_TESTNET_RPC = "https://testnet.rpc.sonic.network"
w3 = Web3(Web3.HTTPProvider(SONIC_TESTNET_RPC))

CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"
USER_ADDRESS = "YOUR_WALLET_ADDRESS"
PRIVATE_KEY = "YOUR_PRIVATE_KEY"

def get_price(coin_id="sonic-token"):
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={coin_id}"
    response = requests.get(url).json()
    return response[0]["current_price"] if response else 0.5

def run_agent():
    while True:
        if w3.is_connected():
            print("Connected to Sonic Testnet")
            price = get_price("sonic-token")
            print(f"Current SONIC price: ${price}")
        time.sleep(60)

if __name__ == "__main__":
    run_agent()
EOL

# Create frontend components
cd ../frontend/pages
cat > index.tsx << 'EOL'
import { useState } from "react";
import { ethers } from "ethers";
import WorkflowEditor from "../components/WorkflowEditor";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setAccount(await signer.getAddress());
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Sonic Dream AI (Testnet)</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        {account ? `Connected: ${account}` : "Connect to Sonic Testnet"}
      </button>
      <WorkflowEditor />
    </div>
  );
}
EOL

cd ../components
cat > WorkflowEditor.tsx << 'EOL'
import { useState } from "react";

interface Node {
  id: number;
  command: string;
}

export default function WorkflowEditor() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [command, setCommand] = useState("");

  const addNode = () => {
    if (command) {
      setNodes([...nodes, { id: Date.now(), command }]);
      setCommand("");
    }
  };

  return (
    <div className="border p-4 rounded bg-white">
      <h2 className="text-xl mb-2">Workflow Editor (Sonic Testnet)</h2>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="e.g., If SONIC price drops below $0.50, then buy $1000 worth of SONIC"
        className="border p-2 w-full mb-2"
      />
      <button onClick={addNode} className="bg-green-500 text-white p-2 rounded">
        Add Node
      </button>
      <div className="mt-4">
        {nodes.map((node) => (
          <div key={node.id} className="border p-2 mb-2 rounded bg-gray-50">
            {node.command}
          </div>
        ))}
      </div>
    </div>
  );
}
EOL

# Make setup script executable
cd ../..
chmod +x setup.sh

echo "Setup completed! Please follow these steps:"
echo "1. Update backend/ai_agent.py with your contract address and wallet details"
echo "2. Update dapp/hardhat.config.js with your network configuration"
echo "3. Run 'cd frontend && npm run dev' to start the frontend"
echo "4. Run 'cd backend && source venv/bin/activate && python ai_agent.py' to start the AI agent"
