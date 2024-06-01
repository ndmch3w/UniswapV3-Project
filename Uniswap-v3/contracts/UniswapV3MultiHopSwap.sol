// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./interfaces/IERC20.sol";
import "./interfaces/IWETH.sol";
import "./interfaces/ISwapRouter.sol";

contract UniswapV3MultiHopSwap {
    ISwapRouter private constant router =
        ISwapRouter(0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD); // Mainnet router: 0xE592427A0AEce92De3Edee1F18E0157C05861564

    address private constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    address private constant USDC = 0xa4eE9C98643403cF6555728272129c721EF4c266;
    address private constant LINK = 0x779877A7B0D9E8603169DdbD7836e478b4624789;

    IWETH private constant weth = IWETH(WETH);
    IERC20 private constant link = IERC20(LINK);

    function swapExactInputMultiHop(uint amountIn, uint amountOutMin) external {
        weth.transferFrom(msg.sender, address(this), amountIn);
        weth.approve(address(router), amountIn);

        bytes memory path = abi.encodePacked(
            WETH,
            uint24(500),
            USDC,
            uint24(3000),
            LINK
        );

        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: path,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin
            });

        router.exactInput(params);
    }

    function swapExactOutputMultiHop(uint amountOut, uint amountInMax)
        external
    {
        weth.transferFrom(msg.sender, address(this), amountInMax);
        weth.approve(address(router), amountInMax);

        bytes memory path = abi.encodePacked(
            LINK,
            uint24(3000),
            USDC,
            uint24(500),
            WETH
        );

        ISwapRouter.ExactOutputParams memory params = ISwapRouter
            .ExactOutputParams({
                path: path,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMax
            });

        uint amountIn = router.exactOutput(params);

        if (amountIn < amountInMax) {
            weth.approve(address(router), 0);
            weth.transfer(msg.sender, amountInMax - amountIn);
        }
    }
}