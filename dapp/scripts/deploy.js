const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Verify we're on Sonic Blaze Testnet
  const network = await hre.ethers.provider.getNetwork();
  console.log("Current Network:", {
    name: network.name,
    chainId: Number(network.chainId)
  });
  
  if (Number(network.chainId) !== 57054) {
    throw new Error(`Please run deployment on Sonic Blaze Testnet. Current chain ID: ${Number(network.chainId)}`);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy the SonicToken contract first (if not already deployed)
  const sonicTokenAddress = "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38"; // WS token address
  const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Sonic Router address

  // Deploy the AgentFactory contract
  const AgentFactory = await ethers.getContractFactory("AgentFactory");
  console.log("Deploying AgentFactory...");
  const agentFactory = await AgentFactory.deploy(sonicTokenAddress, routerAddress);
  await agentFactory.waitForDeployment();
  const agentFactoryAddress = await agentFactory.getAddress();
  console.log("AgentFactory deployed to:", agentFactoryAddress);
  
  const fs = require("fs");
  const deploymentInfo = {
    network: "Sonic Blaze Testnet",
    chainId: Number(network.chainId),
    contracts: {
      AgentFactory: agentFactoryAddress,
      SonicToken: sonicTokenAddress
    },
    tokens: {
      WETH: "0x309C92261178fA0CF748A855e90Ae73FDb79EBc7",
      WS: sonicTokenAddress
    },
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Verification commands
  console.log("\nVerification commands:");
  console.log(`npx hardhat verify --network sonicTestnet ${agentFactoryAddress} "${sonicTokenAddress}" "${routerAddress}"`);

  return { agentFactory };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });