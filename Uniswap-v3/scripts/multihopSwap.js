require('dotenv').config();
const hre = require("hardhat");

async function main() {
    // Get the deployed address of the Uniswap V3 SwapRouter contract
    const swapRouterAddress = process.env.SWAP_ROUTER_ADDR; // Update with the address of the SwapRouter contract

    // Deploy the SwapExamples contract
    const SwapExamples = await hre.ethers.getContractFactory("UniswapV3MultiHopSwap");
    const swapExamples = await SwapExamples.deploy();
    console.log("Deploying SwapExamples contract...");

    // Wait for deployment to be successful
    await swapExamples.deployed();
    console.log("SwapExamples contract deployed at address:", swapExamples.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
