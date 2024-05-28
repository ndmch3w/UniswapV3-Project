require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


//const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },

      // { version: "0.4.11" },
      { version: "0.8.20" },
    ],
  },
  networks: {
    hardhat: {
      forking: {
          url: process.env.ALCHEMY_URL,
      },
      gas: "auto"
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_API_KEY}`,
      accounts: [process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY]
    }
  },
}
