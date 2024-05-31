//import "@ethersproject/shims"
//import { ethers } from "ethers";

require('dotenv').config();
const express = require('express');
const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');
const { Web3 } = require('web3');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
	origin: 'http://localhost:3001'
}));

var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");



const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const USDC = "0xa4eE9C98643403cF6555728272129c721EF4c266";
const LINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

// Load your contracts
let link, weth, uniswapV3MultiHopSwap, accounts;

async function loadContracts() {
	const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_API_KEY}`);
	const wallet = new ethers.Wallet(process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY, provider);

	link = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", LINK, wallet);
	weth = await ethers.getContractAt("IWETH", WETH, wallet);

	// Use the existing contract address
	const existingContractAddress = process.env.MULTIHOP_CONTRACT_ADDR_NEWROUTER;
	uniswapV3MultiHopSwap = await ethers.getContractAt("UniswapV3MultiHopSwap", existingContractAddress, wallet);

	accounts = [wallet];
}

app.get('/api/v1/get-pool-price', async (req, res) => {
  try {
    const contractABI = require('../Uniswap-v3/artifacts/contracts/UniswapV3Oracle.sol/UniswapV3Oracle.json').abi;
    const contractAddress = process.env.ORACLE_CONTRACT_ADDR;

    const provider = new ethers.providers.JsonRpcProvider(`${process.env.INFURA_URL}`);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const result = await contract.getPrice();
    const price = result[0].toString();
    const decimalAdjFactor = result[1].toString();

    res.json({
      price,
      decimalAdjFactor
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


app.post('/api/v1/swap-exact-input', async (req, res) => {
  try {
    await loadContracts();
    
    console.log(accounts[0].address)
    console.log(await link.balanceOf(accounts[0].address));
    console.log(await weth.balanceOf(accounts[0].address));

    // Convert amounts to Wei and ERC20 decimals
    const amountIn = ethers.utils.parseEther("0.005"); // Convert Ether to Wei req.body.amountIn.toString()
    const amountOutMin = ethers.utils.parseEther("0.0002"); // Convert LINK to smallest unit req.body.amountOutMin.toString()

    // Perform the swap
    await weth.deposit({
      value: amountIn
    });
    await weth.approve(uniswapV3MultiHopSwap.address, amountIn);

    const tx = await uniswapV3MultiHopSwap.swapExactInputMultiHop(amountIn, amountOutMin, {
      gasLimit: ethers.utils.hexlify(10000000) // Manually specify gas limit
    });
    const txreceipt = await tx.wait();

    console.log(await link.balanceOf(accounts[0].address));
    console.log(await weth.balanceOf(accounts[0].address));
    console.log(txreceipt);
    // Get the balance
    const balance = await link.balanceOf(accounts[0].address);
    res.json({
      success: true,
      balance: balance.toString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/v1/swap-exact-output', async (req, res) => {
  try {
    await loadContracts();

    console.log(accounts[0].address);

    console.log(await link.balanceOf(accounts[0].address));
    console.log(await weth.balanceOf(accounts[0].address));

    const amountOut = ethers.utils.parseEther(req.body.amountOut.toString()); // Convert LINK to Wei
    const amountInMax = ethers.utils.parseEther(req.body.amountInMax.toString()); // Convert WETH to smallest unit

    // Perform the swap
    await weth.deposit({
      value: amountInMax
    });
    await weth.approve(uniswapV3MultiHopSwap.address, amountInMax);
    const tx = await uniswapV3MultiHopSwap.swapExactOutputMultiHop(amountOut, amountInMax, {
      gasLimit: ethers.utils.hexlify(10000000) // Manually specify gas limit
    });
    const txreceipt = await tx.wait();

    console.log(await link.balanceOf(accounts[0].address));
    console.log(await weth.balanceOf(accounts[0].address));

    console.log(txreceipt);
    // Get the balance
    const balance = await link.balanceOf(accounts[0].address);
    res.json({
      success: true,
      balance: balance.toString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});


app.listen(3000, () => console.log('Server is running on port 3000'));