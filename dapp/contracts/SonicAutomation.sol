// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract SonicAutomation is Ownable, ReentrancyGuard, Pausable {
    error InsufficientFunds();
    error InvalidWeights();
    error InvalidName();
    error Unauthorized();

    constructor() Ownable(msg.sender) {}

    mapping(string => uint256) public priceData;

    event PriceUpdated(string coinId, uint256 price);
    event SonicBought(address user, uint256 amount);

    function updatePrice(string calldata coinId, uint256 price) external onlyOwner {
        priceData[coinId] = price;
        emit PriceUpdated(coinId, price);
    }

    function buySonic(uint256 amount) external payable nonReentrant whenNotPaused {
        if (msg.value < amount) revert InsufficientFunds();
        emit SonicBought(msg.sender, amount);
    }

    function withdraw() external onlyOwner nonReentrant {
        payable(owner()).transfer(address(this).balance);
    }

    struct Index {
        string name;
        string[] tokens;
        uint256[] weights;
        uint256 lastRebalance;
    }

    mapping(address => Index[]) public userIndices;
    mapping(address => mapping(string => string)) public ensNames;
    
    event IndexCreated(address user, string name);
    event IndexRebalanced(address user, string name);
    event ENSRegistered(address user, string ensName);

    function createIndex(
        string calldata name,
        string[] calldata tokens,
        uint256[] calldata weights
    ) external whenNotPaused {
        if (bytes(name).length == 0) revert InvalidName();
        if (tokens.length != weights.length || tokens.length == 0) revert InvalidWeights();
        
        uint256 totalWeight;
        for(uint i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        if (totalWeight != 100) revert InvalidWeights();

        userIndices[msg.sender].push(Index(name, tokens, weights, block.timestamp));
        emit IndexCreated(msg.sender, name);
    }

    function rebalanceIndex(uint256 indexId) external {
        Index storage index = userIndices[msg.sender][indexId];
        index.lastRebalance = block.timestamp;
        emit IndexRebalanced(msg.sender, index.name);
    }

    function registerENS(string memory ensName) external {
        ensNames[msg.sender][ensName] = ensName;
        emit ENSRegistered(msg.sender, ensName);
    }
}
