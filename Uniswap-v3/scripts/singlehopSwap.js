require('dotenv').config();
const hre = require("hardhat");

async function main() {
    // Get the deployed address of the Uniswap V3 SwapRouter contract
    // const swapRouterAddress = process.env.SEPOLIA_SWAP_ROUTER_ADDR; // Update with the address of the SwapRouter contract

    // Deploy the SwapExamples contract
    const SwapSingleHop = await hre.ethers.getContractFactory("UniswapV3SingleHopSwap");
    

    // Deploy the contract with increased gas price
    console.log("Deploying SwapExamples contract...");
    const swapSingleHop = await SwapSingleHop.deploy();

    // Wait for deployment to be successful
    await swapSingleHop.deployed();
    console.log("SwapExamples contract deployed at address:", swapSingleHop.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
