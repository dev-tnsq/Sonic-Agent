// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface ISonicPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
}

error InvalidSignature();
error SlippageExceeded();
error CooldownActive();
error InsufficientBalance();
error InvalidAmount();

contract SonicAITrading is Ownable, ReentrancyGuard, Pausable {
    struct TradeConfig {
        uint256 minConfidence;
        uint256 maxSlippage;
        uint256 cooldownPeriod;
        uint256 maxTradeAmount;
    }

    struct Trade {
        uint256 timestamp;
        uint256 amount;
        uint256 price;
        bool isBuy;
        bool successful;
        bytes32 aiSignature;
    }

    // State variables
    ISonicPair public pair;
    IERC20 public sonicToken;
    TradeConfig public config;
    mapping(address => uint256) public userDeposits;
    mapping(address => Trade[]) public userTrades;
    mapping(bytes32 => bool) public usedSignatures;

    // Events
    event TradeExecuted(
        address indexed user,
        uint256 amount,
        uint256 price,
        bool isBuy,
        bytes32 aiSignature
    );
    event ConfigUpdated(
        uint256 minConfidence,
        uint256 maxSlippage,
        uint256 cooldownPeriod,
        uint256 maxTradeAmount
    );
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    constructor(
        address _pair,
        address _sonicToken,
        uint256 _minConfidence,
        uint256 _maxSlippage,
        uint256 _cooldownPeriod,
        uint256 _maxTradeAmount
    ) Ownable(msg.sender) {
        validatePair(_pair);
        pair = ISonicPair(_pair);
        sonicToken = IERC20(_sonicToken);
        config = TradeConfig({
            minConfidence: _minConfidence,
            maxSlippage: _maxSlippage,
            cooldownPeriod: _cooldownPeriod,
            maxTradeAmount: _maxTradeAmount
        });
    }

    // Helper functions
    function verifyAISignature(
        uint256 price,
        bool isBuy,
        uint256 timestamp,
        uint256 confidence,
        bytes32 signature
    ) internal pure returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(price, isBuy, timestamp, confidence)
        );
        return messageHash == signature;
    }

    function calculateSlippage(
        uint256 expectedPrice,
        uint256 actualPrice
    ) internal pure returns (uint256) {
        return expectedPrice >= actualPrice 
            ? ((expectedPrice - actualPrice) * 100) / expectedPrice
            : ((actualPrice - expectedPrice) * 100) / expectedPrice;
    }

    function getLatestPrice() public view returns (uint256) {
        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
        return (uint256(reserve0) * 1e18) / uint256(reserve1);
    }

    // Update WETH address for Sonic
    function WETH() external pure returns (address) {
        return 0x309C92261178fA0CF748A855e90Ae73FDb79EBc7; // Correct Sonic WETH address
    }

    // Add Sonic-specific pair validation
    function validatePair(address _pair) internal view {
        require(_pair != address(0), "Invalid pair");
        try ISonicPair(_pair).token0() returns (address) {
            // Pair exists and implements interface
        } catch {
            revert("Not a Sonic pair");
        }
    }

    // Trade execution
    function executeTrade(
        uint256 amount,
        uint256 expectedPrice,
        bool isBuy,
        uint256 confidence,
        bytes32 signature
    ) external nonReentrant whenNotPaused {
        if (usedSignatures[signature]) revert InvalidSignature();
        if (confidence < config.minConfidence) revert InvalidSignature();
        if (amount > config.maxTradeAmount) revert InvalidAmount();
        
        // Verify user's last trade cooldown
        if (userTrades[msg.sender].length > 0) {
            Trade storage lastTrade = userTrades[msg.sender][userTrades[msg.sender].length - 1];
            if (block.timestamp < lastTrade.timestamp + config.cooldownPeriod) 
                revert CooldownActive();
        }

        // Verify AI signature
        require(
            verifyAISignature(
                expectedPrice,
                isBuy,
                block.timestamp,
                confidence,
                signature
            ),
            "Invalid AI signature"
        );

        // Check current price and slippage
        uint256 currentPrice = getLatestPrice();
        if (calculateSlippage(expectedPrice, currentPrice) > config.maxSlippage) revert SlippageExceeded();

        // Execute trade
        if (isBuy) {
            if (userDeposits[msg.sender] < amount) revert InsufficientBalance();
            userDeposits[msg.sender] = userDeposits[msg.sender] - amount;
            
            // Transfer tokens first
            IERC20(address(sonicToken)).approve(address(pair), amount);
            
            (uint256 amount0Out, uint256 amount1Out) = pair.token0() == address(sonicToken)
                ? (uint256(amount), uint256(0))
                : (uint256(0), uint256(amount));
            pair.swap(amount0Out, amount1Out, msg.sender, "");
        } else {
            // Swap SONIC for ETH
            if (sonicToken.balanceOf(msg.sender) < amount) revert InsufficientBalance();
            sonicToken.transferFrom(msg.sender, address(this), amount);
            
            (uint256 amount0Out, uint256 amount1Out) = pair.token0() == address(sonicToken)
                ? (uint256(0), uint256(amount))
                : (uint256(amount), uint256(0));
            pair.swap(amount0Out, amount1Out, address(this), "");
        }

        // Record trade
        userTrades[msg.sender].push(Trade({
            timestamp: block.timestamp,
            amount: amount,
            price: currentPrice,
            isBuy: isBuy,
            successful: true,
            aiSignature: signature
        }));
        
        usedSignatures[signature] = true;

        emit TradeExecuted(
            msg.sender,
            amount,
            currentPrice,
            isBuy,
            signature
        );
    }

    // Deposit and withdrawal
    function deposit() external payable {
        userDeposits[msg.sender] = userDeposits[msg.sender] + msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (userDeposits[msg.sender] < amount) revert InsufficientBalance();
        userDeposits[msg.sender] = userDeposits[msg.sender] - amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    // Admin functions
    function updateConfig(
        uint256 _minConfidence,
        uint256 _maxSlippage,
        uint256 _cooldownPeriod,
        uint256 _maxTradeAmount
    ) external onlyOwner {
        config = TradeConfig({
            minConfidence: _minConfidence,
            maxSlippage: _maxSlippage,
            cooldownPeriod: _cooldownPeriod,
            maxTradeAmount: _maxTradeAmount
        });
        
        emit ConfigUpdated(
            _minConfidence,
            _maxSlippage,
            _cooldownPeriod,
            _maxTradeAmount
        );
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    receive() external payable {}
}
