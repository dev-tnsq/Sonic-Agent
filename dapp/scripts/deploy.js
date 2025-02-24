const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Verify we're on Sonic Blaze Testnet
  const network = await hre.ethers.provider.getNetwork();
  console.log("Current Network:", {
    name: network.name,
    chainId: Number(network.chainId)
  });
  
  // ChainId is now a bigint in ethers v6, so we need to convert it
  if (Number(network.chainId) !== 57054) {
    throw new Error(`Please run deployment on Sonic Blaze Testnet. Current chain ID: ${Number(network.chainId)}`);
  }

  const [deployer] = await ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  try {
    // Deploy the contract
    const SonicAutomation = await ethers.getContractFactory("SonicAutomation");
    console.log("Deploying SonicAutomation...");
    const sonicAutomation = await SonicAutomation.deploy();
    
    // Wait for deployment
    await sonicAutomation.waitForDeployment();
    const deployedAddress = await sonicAutomation.getAddress();

    console.log("SonicAutomation deployed to:", deployedAddress);
    console.log("Verify on Sonic Explorer:", `https://testnet.sonicscan.org/address/${deployedAddress}`);

    // Write deployment address to a file for the AI agent
    const fs = require("fs");
    const deploymentInfo = {
      address: deployedAddress,
      network: "Sonic Blaze Testnet",
      chainId: Number(network.chainId)
    };
    
    fs.writeFileSync(
      "../backend/deployment.json",
      JSON.stringify(deploymentInfo, null, 2)
    );

    return sonicAutomation;
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });