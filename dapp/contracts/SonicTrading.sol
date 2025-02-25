// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SonicTrading is Ownable, ReentrancyGuard {
    IERC20 public wethToken;
    IERC20 public wrappedSToken;
    
    event TradeExecuted(address user, bool isBuy, uint256 amount);
    
    constructor() Ownable(msg.sender) {
        // Initialize with Sonic's official token addresses
        wethToken = IERC20(0x309C92261178fA0CF748A855e90Ae73FDb79EBc7);     // WETH
        wrappedSToken = IERC20(0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38); // Wrapped S
    }
    
    function executeTrade(bool isBuy, uint256 amount) external nonReentrant {
        if (isBuy) {
            // User wants to buy Wrapped S with WETH
            require(wethToken.transferFrom(msg.sender, address(this), amount), "WETH transfer failed");
            require(wrappedSToken.transfer(msg.sender, amount), "WS transfer failed");
        } else {
            // User wants to sell Wrapped S for WETH
            require(wrappedSToken.transferFrom(msg.sender, address(this), amount), "WS transfer failed");
            require(wethToken.transfer(msg.sender, amount), "WETH transfer failed");
        }
        
        emit TradeExecuted(msg.sender, isBuy, amount);
    }

    function withdraw(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }
}
