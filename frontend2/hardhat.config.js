require("@nomicfoundation/hardhat-toolbox");

const SONIC_PRIVATE_KEY = "84acd61bcc12a6df3948eb63a4872401c54aafed26afc05b89c581e3e0608389";

module.exports = {
  solidity: "0.8.26",
  networks: {
    sonic: {
      url: "https://rpc.blaze.soniclabs.com",
      accounts: [SONIC_PRIVATE_KEY],
      chainId: 57054
    }
  }
};
