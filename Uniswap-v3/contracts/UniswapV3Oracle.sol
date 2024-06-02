// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract UniswapV3Oracle {
    address private uniswapV3PoolAddress;

    constructor(address pool) {
        uniswapV3PoolAddress = pool;
    }

    function getPrice(uint32 _seconds) public view returns (uint256 price, uint256 decimalAdjFactor) {
        IUniswapV3Pool uniswapv3Pool = IUniswapV3Pool(uniswapV3PoolAddress);

        uint32[] memory secondAgos = new uint32[](2);
        secondAgos[0] = _seconds; // Max: 4,294,967,295
        secondAgos[1] = 0;

        (int56[] memory tickCumulatives, ) = uniswapv3Pool.observe(secondAgos);

        int56 tickCumulativesDiff = tickCumulatives[1] - tickCumulatives[0];
        uint56 period = uint56(secondAgos[0]-secondAgos[1]);

        int56 timeWeightedAverageTick = tickCumulativesDiff / -int56(period);

        uint256 decimalToken0 = IERC20Metadata(uniswapv3Pool.token0()).decimals();
        uint256 decimalToken1 = IERC20Metadata(uniswapv3Pool.token1()).decimals();

        uint160 sqrtRatioX96 = TickMath.getSqrtRatioAtTick(int24(timeWeightedAverageTick));
        uint256 ratioX192 = uint256(sqrtRatioX96) * sqrtRatioX96;

        uint256 adjustedPrice = (ratioX192 * 1e18) >> (96 * 2); // Price in token1 units
        
        decimalAdjFactor = uint32(10**(decimalToken0));

        // Adjust the price based on the decimals difference between the two tokens
        if (decimalToken0 > decimalToken1) {
            price = adjustedPrice / (10**(decimalToken0 - decimalToken1));
        } else {
            price = adjustedPrice * (10**(decimalToken1 - decimalToken0));
        }
    }
}
