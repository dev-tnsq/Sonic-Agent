// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface ISonicPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
}

contract SonicAITrading is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

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
    ) {
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
        if (expectedPrice >= actualPrice) {
            return expectedPrice.sub(actualPrice).mul(100).div(expectedPrice);
        } else {
            return actualPrice.sub(expectedPrice).mul(100).div(expectedPrice);
        }
    }

    function getLatestPrice() public view returns (uint256) {
        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
        return uint256(reserve0).mul(1e18).div(uint256(reserve1));
    }

    // Trade execution
    function executeTrade(
        uint256 amount,
        uint256 expectedPrice,
        bool isBuy,
        uint256 confidence,
        bytes32 signature
    ) external nonReentrant {
        require(!usedSignatures[signature], "AI signature already used");
        require(confidence >= config.minConfidence, "Confidence too low");
        require(amount <= config.maxTradeAmount, "Amount too large");
        
        // Verify user's last trade cooldown
        if (userTrades[msg.sender].length > 0) {
            Trade storage lastTrade = userTrades[msg.sender][userTrades[msg.sender].length - 1];
            require(
                block.timestamp.sub(lastTrade.timestamp) >= config.cooldownPeriod,
                "Trade cooldown active"
            );
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
        require(
            calculateSlippage(expectedPrice, currentPrice) <= config.maxSlippage,
            "Slippage too high"
        );

        // Execute trade
        if (isBuy) {
            require(
                userDeposits[msg.sender] >= amount,
                "Insufficient deposit"
            );
            userDeposits[msg.sender] = userDeposits[msg.sender].sub(amount);
            
            // Swap ETH for SONIC
            (uint256 amount0Out, uint256 amount1Out) = pair.token0() == address(sonicToken)
                ? (amount, 0)
                : (0, amount);
            pair.swap(amount0Out, amount1Out, address(this), "");
        } else {
            // Swap SONIC for ETH
            require(
                sonicToken.balanceOf(msg.sender) >= amount,
                "Insufficient SONIC balance"
            );
            sonicToken.transferFrom(msg.sender, address(this), amount);
            
            (uint256 amount0Out, uint256 amount1Out) = pair.token0() == address(sonicToken)
                ? (0, amount)
                : (amount, 0);
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
        userDeposits[msg.sender] = userDeposits[msg.sender].add(msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(userDeposits[msg.sender] >= amount, "Insufficient deposit");
        userDeposits[msg.sender] = userDeposits[msg.sender].sub(amount);
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
