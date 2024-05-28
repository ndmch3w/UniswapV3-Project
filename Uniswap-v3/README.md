# Prepare
- npm install
- Edit .env file with ALCHEMY_URL=<....>. If choose a mainnet ALCHEMY_URL, change the address of the pool to mainnet Uniswap v3 pool.
# Multihop & Singlehop testing
- Edit node_modules\@uniswap\v3-core\contracts\libraries\TickMath.sol so that it uses solidity >= 0.5.0.
- Edit Uniswap-v3\node_modules\@uniswap\v3-core\contracts\libraries\TickMath.sol file: "require(absTick <= uint256(MAX_TICK), 'T');" --> "require(absTick <= uint256(uint24(MAX_TICK)), 'T');"
- To test multihop and singlehop: npx harhat test ./test/swapV3.test.js -> This should works fine but deploying on server is causing problem of 0 balance after swapped.
# Deploy forked mainnet 
- npx hardhat node
# Deploy contracts
- npx hardhat run .\scripts\getPoolPrice.js --network sepolia 
- npx hardhat run .\scripts\multihopSwap.js --network sepolia 
Change the addresses of deployed contracts in .env file.
# Deploy the backend server
- node .\server.js
