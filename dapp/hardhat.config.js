require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Use a default private key for testing - NEVER use this in production
const DEFAULT_PRIVATE_KEY = "84acd61bcc12a6df3948eb63a4872401c54aafed26afc05b89c581e3e0608389";
const PRIVATE_KEY = process.env.PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sonic: {
      url: process.env.SONIC_RPC_URL || "https://rpc.blaze.soniclabs.com",
      accounts: [PRIVATE_KEY],
      chainId: 57054,
      gasPrice: "auto",
      timeout: 120000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
