const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const sepoliaAlchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_API_KEY}`;
  
  try {
    const provider = new ethers.providers.JsonRpcProvider(sepoliaAlchemyUrl);
    const blockNumber = await provider.getBlockNumber();
    console.log("Connected to Sepolia testnet. Latest block number:", blockNumber);
  } catch (error) {
    console.error("Error connecting to Sepolia testnet:", error);
  }
}

main();