// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ISonicRouter {
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);
    
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract SonicAIAutomation is Ownable, ReentrancyGuard, Pausable {
    ISonicRouter public sonicRouter;
    mapping(string => uint256) public priceFeeds;
    mapping(address => bool) public authorizedAI;
    
    struct TradeConfig {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 slippageTolerance;
        uint256 executionDelay;
        bool enabled;
    }
    
    struct Strategy {
        string name;
        TradeConfig config;
        bool active;
        uint256 lastExecution;
    }
    
    mapping(address => Strategy[]) public userStrategies;
    
    event StrategyCreated(address indexed user, string name);
    event TradeExecuted(
        address indexed user,
        string strategyName,
        bool isBuy,
        uint256 amount,
        uint256 price
    );
    event PriceUpdated(string indexed pair, uint256 price, uint256 timestamp);
    
    constructor(address _router) Ownable(msg.sender) {
        sonicRouter = ISonicRouter(_router);
    }
    
    function addAuthorizedAI(address ai) external onlyOwner {
        authorizedAI[ai] = true;
    }
    
    function createStrategy(
        string calldata name,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 slippageTolerance
    ) external {
        require(bytes(name).length > 0, "Invalid name");
        require(maxAmount > minAmount, "Invalid amounts");
        
        TradeConfig memory config = TradeConfig({
            minAmount: minAmount,
            maxAmount: maxAmount,
            slippageTolerance: slippageTolerance,
            executionDelay: 5 minutes,
            enabled: true
        });
        
        Strategy memory strategy = Strategy({
            name: name,
            config: config,
            active: true,
            lastExecution: 0
        });
        
        userStrategies[msg.sender].push(strategy);
        emit StrategyCreated(msg.sender, name);
    }
    
    function executeTrade(
        address user,
        uint256 strategyIndex,
        bool isBuy,
        uint256 amount,
        uint256 minReturn
    ) external nonReentrant whenNotPaused {
        require(authorizedAI[msg.sender], "Unauthorized");
        require(strategyIndex < userStrategies[user].length, "Invalid strategy");
        
        Strategy storage strategy = userStrategies[user][strategyIndex];
        require(strategy.active, "Strategy inactive");
        require(
            block.timestamp >= strategy.lastExecution + strategy.config.executionDelay,
            "Too soon"
        );
        
        if (isBuy) {
            executeBuy(user, strategy, amount, minReturn);
        } else {
            executeSell(user, strategy, amount, minReturn);
        }
        
        strategy.lastExecution = block.timestamp;
        emit TradeExecuted(user, strategy.name, isBuy, amount, minReturn);
    }
    
    function executeBuy(
        address user,
        Strategy storage strategy,
        uint256 amount,
        uint256 minReturn
    ) internal {
        require(amount >= strategy.config.minAmount, "Amount too low");
        require(amount <= strategy.config.maxAmount, "Amount too high");
        
        address[] memory path = new address[](2);
        path[0] = sonicRouter.WETH();
        path[1] = address(this);
        
        sonicRouter.swapExactETHForTokens{value: amount}(
            minReturn,
            path,
            user,
            block.timestamp + 15 minutes
        );
    }
    
    function executeSell(
        address user,
        Strategy storage strategy,
        uint256 amount,
        uint256 minReturn
    ) internal {
        require(amount >= strategy.config.minAmount, "Amount too low");
        require(amount <= strategy.config.maxAmount, "Amount too high");
        
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = sonicRouter.WETH();
        
        sonicRouter.swapExactTokensForETH(
            amount,
            minReturn,
            path,
            user,
            block.timestamp + 15 minutes
        );
    }
    
    function updatePrice(string calldata pair, uint256 price) external {
        require(authorizedAI[msg.sender], "Unauthorized");
        priceFeeds[pair] = price;
        emit PriceUpdated(pair, price, block.timestamp);
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
