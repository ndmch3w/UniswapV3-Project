const hre = require("hardhat");

async function main() {
    // USDC/WETH 0x16ca232553d516dea346db86d4f2a495e096a7f5
    const pool_address = "0x3a41a6d24d9963ea63c5f858a25bc1a8175c7d72"; //WBTC/WETH 0x3a41a6d24d9963ea63c5f858a25bc1a8175c7d72

    //Deploy
    const Oracle = await hre.ethers.getContractFactory("UniswapV3Oracle");
    const oracle = await Oracle.deploy(pool_address);
    console.log("Deploying contract ....");
    
    //Wait until deployment is successful
    await oracle.deployed();
    console.log("Contract Deployed with address: ",oracle.address);

    //Call Uniswap v3 Oracle
    let [price, decimals] = await oracle.getPrice(3600); //Change the time for each contract you want to deploy

    //Format returned variables
    price = Number(price.toString());
    decimals = Number(decimals.toString());

    //Price WBTC
    const result = price / decimals;
    console.log("Price of USDC/WETH: ", result);
    
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
