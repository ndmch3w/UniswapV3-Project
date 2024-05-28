// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract UniswapV3MultiHopSwap {
    // ISwapRouter private constant router =
    //     ISwapRouter(0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD);
    ISwapRouter private constant router =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    // address private constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    // address private constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    // address private constant DAI = 0xFFFeD8254566B7F800f6D8CDb843ec75AE49B07A;

    address private constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    address private constant USDC = 0xa4eE9C98643403cF6555728272129c721EF4c266;
    address private constant LINK = 0x779877A7B0D9E8603169DdbD7836e478b4624789;


    function swapExactInputMultiHop(uint amountIn, uint amountOutMin) external {
        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(WETH, address(router), amountIn);
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
                deadline: block.timestamp + 15, // 15 second deadlin
                amountIn: amountIn,
                amountOutMinimum: amountOutMin
            });

        router.exactInput(params);

        // Refund any remaining tokens back to the sender
        uint256 remainingAmount = IERC20(WETH).balanceOf(address(this));
        if (remainingAmount > 0) {
            TransferHelper.safeTransfer(WETH, msg.sender, remainingAmount);
        }
    }

    function swapExactOutputMultiHop(uint amountOut, uint amountInMax)
        external
    {
        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountInMax);
        TransferHelper.safeApprove(WETH, address(router), amountInMax);

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
            TransferHelper.safeApprove(WETH, address(router), 0);
            TransferHelper.safeTransferFrom(WETH, address(this), msg.sender, amountInMax - amountIn);
        }
    }
}