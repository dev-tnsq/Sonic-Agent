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
  
  // Deploy the monitoring contract first
  const SonicAIMonitor = await ethers.getContractFactory("SonicAIMonitor");
  console.log("Deploying SonicAIMonitor...");
  const monitor = await SonicAIMonitor.deploy();
  await monitor.waitForDeployment();
  const monitorAddress = await monitor.getAddress();
  console.log("SonicAIMonitor deployed to:", monitorAddress);

  // Deploy the automation contract that will execute trades
  const SonicAIAutomation = await ethers.getContractFactory("SonicAIAutomation");
  console.log("Deploying SonicAIAutomation...");
  const automation = await SonicAIAutomation.deploy(
    "0x309C92261178fA0CF748A855e90Ae73FDb79EBc7" // WETH address
  );
  await automation.waitForDeployment();
  const automationAddress = await automation.getAddress();
  console.log("SonicAIAutomation deployed to:", automationAddress);

  // Link the two contracts
  console.log("Setting up contract permissions...");
  await monitor.addAuthorizedAI(automationAddress);
  
  const fs = require("fs");
  const deploymentInfo = {
    network: "Sonic Blaze Testnet",
    chainId: Number(network.chainId),
    contracts: {
      monitor: monitorAddress,
      automation: automationAddress
    },
    tokens: {
      WETH: "0x309C92261178fA0CF748A855e90Ae73FDb79EBc7",
      WS: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38"
    },
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Verification commands
  console.log("\nVerification commands:");
  console.log(`npx hardhat verify --network sonic ${monitorAddress}`);
  console.log(`npx hardhat verify --network sonic ${automationAddress} "${ethers.getAddress("0x309C92261178fA0CF748A855e90Ae73FDb79EBc7")}"`);

  return { monitor, automation };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });