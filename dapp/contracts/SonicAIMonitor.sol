// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SonicAIMonitor is Ownable, ReentrancyGuard {
    // User settings
    struct UserStrategy {
        bool isActive;
        uint256 targetPrice;
        uint256 stopLoss;
        uint256 maxAmount;
        address[] tokensToMonitor;
    }
    
    mapping(address => UserStrategy) public userStrategies;
    mapping(address => bool) public authorizedAI;
    
    event StrategyUpdated(address user, uint256 targetPrice, uint256 stopLoss);
    event TradeExecuted(address user, address token, uint256 amount, bool isBuy);
    
    constructor() Ownable(msg.sender) {}
    
    function setStrategy(
        uint256 _targetPrice,
        uint256 _stopLoss,
        uint256 _maxAmount,
        address[] calldata _tokens
    ) external {
        userStrategies[msg.sender] = UserStrategy({
            isActive: true,
            targetPrice: _targetPrice,
            stopLoss: _stopLoss,
            maxAmount: _maxAmount,
            tokensToMonitor: _tokens
        });
        
        emit StrategyUpdated(msg.sender, _targetPrice, _stopLoss);
    }
    
    function addAuthorizedAI(address ai) external onlyOwner {
        authorizedAI[ai] = true;
    }
    
    // AI agent can call this to execute trades
    function executeTrade(
        address user,
        address token,
        uint256 amount,
        bool isBuy
    ) external {
        require(authorizedAI[msg.sender], "Not authorized");
        require(userStrategies[user].isActive, "No active strategy");
        require(amount <= userStrategies[user].maxAmount, "Amount too high");
        
        // Execute trade through user's wallet (requires prior approval)
        if (isBuy) {
            IERC20(token).transferFrom(user, address(this), amount);
        } else {
            IERC20(token).transfer(user, amount);
        }
        
        emit TradeExecuted(user, token, amount, isBuy);
    }
    
    function getStrategy(address user) external view returns (
        bool isActive,
        uint256 targetPrice,
        uint256 stopLoss,
        uint256 maxAmount,
        address[] memory tokens
    ) {
        UserStrategy memory strategy = userStrategies[user];
        return (
            strategy.isActive,
            strategy.targetPrice,
            strategy.stopLoss,
            strategy.maxAmount,
            strategy.tokensToMonitor
        );
    }
}
