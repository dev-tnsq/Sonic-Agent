require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SONIC_PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  solidity: "0.8.20",
  networks: {
    sonicTestnet: {
      url: "https://rpc.blaze.soniclabs.com",
      chainId: 57054,
      accounts: [SONIC_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      sonicTestnet: process.env.SONICSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "sonicTestnet",
        chainId: 57054,
        urls: {
          apiURL: "https://api-testnet.sonicscan.org/api",
          browserURL: "https://testnet.sonicscan.org"
        }
      }
    ]
  }
};
