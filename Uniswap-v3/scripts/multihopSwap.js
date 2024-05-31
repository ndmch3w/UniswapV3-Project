require('dotenv').config();
const hre = require("hardhat");

async function main() {
    // Get the deployed address of the Uniswap V3 SwapRouter contract
    const swapRouterAddress = process.env.SEPOLIA_SWAP_ROUTER_ADDR; // Update with the address of the SwapRouter contract

    // Deploy the SwapExamples contract
    const SwapExamples = await hre.ethers.getContractFactory("UniswapV3MultiHopSwap");
    
    // Fetch current gas price
    const gasPrice = await hre.ethers.provider.getGasPrice();
    const higherGasPrice = gasPrice.mul(110).div(100); // Increase gas price by 10%

    // Deploy the contract with increased gas price
    console.log("Deploying SwapExamples contract...");
    const swapExamples = await SwapExamples.deploy({
        gasLimit: hre.ethers.utils.hexlify(2000000), // Adjust gas limit as needed
        maxFeePerGas: higherGasPrice, // EIP-1559 compatible transaction field
    });

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
