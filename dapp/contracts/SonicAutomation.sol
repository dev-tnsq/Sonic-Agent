// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SonicAutomation {
    address public owner;
    mapping(string => uint256) public priceData;

    event PriceUpdated(string coinId, uint256 price);
    event SonicBought(address user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updatePrice(string memory coinId, uint256 price) external onlyOwner {
        priceData[coinId] = price;
        emit PriceUpdated(coinId, price);
    }

    function buySonic(uint256 amount) external payable {
        require(msg.value >= amount, "Insufficient funds");
        emit SonicBought(msg.sender, amount);
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
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

    function createIndex(string memory name, string[] memory tokens, uint256[] memory weights) external {
        require(tokens.length == weights.length, "Invalid weights");
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
