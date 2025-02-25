// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISonicRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
}

contract AgentFactory is Ownable, ReentrancyGuard {
    IERC20 public sonicToken;
    ISonicRouter public router;
    uint256 public constant AGENT_COST = 500 * 10**18; // 500 SONIC tokens

    struct TradingParams {
        uint256 buyPrice;
        uint256 sellPrice;
        uint256 maxAmount;
        uint256 stopLoss;
        bool isActive;
    }

    struct SecurityParams {
        address[] monitoredContracts;
        uint256 riskThreshold;
        bool alertsEnabled;
    }

    struct PriceAlert {
        address token;
        uint256 targetPrice;
        uint256 currentPrice;
        bool isAbove;
        bool isActive;
    }

    struct Agent {
        string name;
        string codename;
        address owner;
        uint256 createdAt;
        bool isActive;
        string metadata;
        TradingParams tradingParams;
        SecurityParams securityParams;
        uint256 balance;
        PriceAlert[] priceAlerts;
    }

    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public userAgents;
    mapping(address => bool) public monitoredContracts;
    uint256 public totalAgents;

    event AgentCreated(
        uint256 indexed agentId,
        address indexed owner,
        string name,
        string codename,
        string metadata
    );
    event AgentDeactivated(uint256 indexed agentId);
    event AgentReactivated(uint256 indexed agentId);
    event TradingParamsUpdated(uint256 indexed agentId, TradingParams params);
    event SecurityParamsUpdated(uint256 indexed agentId, SecurityParams params);
    event TradeExecuted(
        uint256 indexed agentId,
        bool isBuy,
        uint256 amount,
        uint256 price
    );
    event SecurityAlert(
        uint256 indexed agentId,
        address indexed contract_,
        string alertType,
        uint256 riskLevel
    );
    event PriceAlertCreated(
        uint256 indexed agentId,
        address indexed token,
        uint256 targetPrice,
        bool isAbove
    );
    event PriceAlertUpdated(
        uint256 indexed agentId,
        address indexed token,
        uint256 targetPrice,
        bool isAbove
    );
    event PriceAlertTriggered(
        uint256 indexed agentId,
        address indexed token,
        uint256 currentPrice,
        uint256 targetPrice
    );

    constructor(address _sonicToken, address _router) Ownable(msg.sender) {
        sonicToken = IERC20(_sonicToken);
        router = ISonicRouter(_router);
    }

    function createAgent(
        string memory _name,
        string memory _codename,
        string memory _metadata,
        TradingParams memory _tradingParams,
        SecurityParams memory _securityParams
    ) external nonReentrant {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_codename).length > 0, "Codename cannot be empty");
        
        // Transfer SONIC tokens from user to contract
        require(
            sonicToken.transferFrom(msg.sender, address(this), AGENT_COST),
            "Token transfer failed"
        );

        uint256 agentId = totalAgents++;
        
        agents[agentId] = Agent({
            name: _name,
            codename: _codename,
            owner: msg.sender,
            createdAt: block.timestamp,
            isActive: true,
            metadata: _metadata,
            tradingParams: _tradingParams,
            securityParams: _securityParams,
            balance: 0,
            priceAlerts: new PriceAlert[](0)
        });

        userAgents[msg.sender].push(agentId);

        // Add contracts to monitoring
        for (uint i = 0; i < _securityParams.monitoredContracts.length; i++) {
            monitoredContracts[_securityParams.monitoredContracts[i]] = true;
        }

        emit AgentCreated(
            agentId,
            msg.sender,
            _name,
            _codename,
            _metadata
        );
    }

    function updateTradingParams(uint256 _agentId, TradingParams memory _params) external {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        require(agents[_agentId].isActive, "Agent not active");
        
        agents[_agentId].tradingParams = _params;
        emit TradingParamsUpdated(_agentId, _params);
    }

    function updateSecurityParams(uint256 _agentId, SecurityParams memory _params) external {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        require(agents[_agentId].isActive, "Agent not active");
        
        // Update monitored contracts
        for (uint i = 0; i < agents[_agentId].securityParams.monitoredContracts.length; i++) {
            monitoredContracts[agents[_agentId].securityParams.monitoredContracts[i]] = false;
        }
        
        for (uint i = 0; i < _params.monitoredContracts.length; i++) {
            monitoredContracts[_params.monitoredContracts[i]] = true;
        }
        
        agents[_agentId].securityParams = _params;
        emit SecurityParamsUpdated(_agentId, _params);
    }

    function executeTrade(
        uint256 _agentId,
        bool _isBuy,
        uint256 _amount,
        address _token
    ) external nonReentrant {
        Agent storage agent = agents[_agentId];
        require(agent.owner == msg.sender, "Not agent owner");
        require(agent.isActive, "Agent not active");
        require(agent.tradingParams.isActive, "Trading not active");

        address[] memory path = new address[](2);
        path[0] = _isBuy ? address(sonicToken) : _token;
        path[1] = _isBuy ? _token : address(sonicToken);

        uint256[] memory amounts = router.getAmountsOut(_amount, path);
        uint256 price = amounts[1];

        if (_isBuy) {
            require(price <= agent.tradingParams.buyPrice, "Price too high");
            require(_amount <= agent.tradingParams.maxAmount, "Amount too high");
            
            sonicToken.approve(address(router), _amount);
            router.swapExactTokensForTokens(
                _amount,
                amounts[1] * 99 / 100, // 1% slippage
                path,
                address(this),
                block.timestamp + 15 minutes
            );
        } else {
            require(price >= agent.tradingParams.sellPrice, "Price too low");
            require(price > agent.tradingParams.stopLoss, "Stop loss triggered");
            
            IERC20(_token).approve(address(router), _amount);
            router.swapExactTokensForTokens(
                _amount,
                amounts[1] * 99 / 100, // 1% slippage
                path,
                address(this),
                block.timestamp + 15 minutes
            );
        }

        emit TradeExecuted(_agentId, _isBuy, _amount, price);
    }

    function raiseSecurityAlert(
        uint256 _agentId,
        address _contract,
        string memory _alertType,
        uint256 _riskLevel
    ) external {
        require(monitoredContracts[_contract], "Contract not monitored");
        Agent storage agent = agents[_agentId];
        require(agent.isActive && agent.securityParams.alertsEnabled, "Alerts not enabled");
        require(_riskLevel <= agent.securityParams.riskThreshold, "Risk below threshold");

        emit SecurityAlert(_agentId, _contract, _alertType, _riskLevel);
    }

    function deactivateAgent(uint256 _agentId) external {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        require(agents[_agentId].isActive, "Agent already inactive");
        
        agents[_agentId].isActive = false;
        emit AgentDeactivated(_agentId);
    }

    function reactivateAgent(uint256 _agentId) external {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        require(!agents[_agentId].isActive, "Agent already active");
        
        require(
            sonicToken.transferFrom(msg.sender, address(this), AGENT_COST / 2),
            "Token transfer failed"
        );

        agents[_agentId].isActive = true;
        emit AgentReactivated(_agentId);
    }

    function getUserAgents(address _user) external view returns (uint256[] memory) {
        return userAgents[_user];
    }

    function getAgent(uint256 _agentId) external view returns (
        string memory name,
        string memory codename,
        address owner,
        uint256 createdAt,
        bool isActive,
        string memory metadata,
        TradingParams memory tradingParams,
        SecurityParams memory securityParams,
        uint256 balance
    ) {
        Agent storage agent = agents[_agentId];
        return (
            agent.name,
            agent.codename,
            agent.owner,
            agent.createdAt,
            agent.isActive,
            agent.metadata,
            agent.tradingParams,
            agent.securityParams,
            agent.balance
        );
    }

    function withdrawTokens() external onlyOwner {
        uint256 balance = sonicToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(
            sonicToken.transfer(owner(), balance),
            "Token transfer failed"
        );
    }

    function setupPriceMonitor(
        uint256 _agentId,
        address _token,
        uint256 _targetPrice,
        bool _isAbove
    ) external {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        require(agents[_agentId].isActive, "Agent not active");

        PriceAlert memory alert = PriceAlert({
            token: _token,
            targetPrice: _targetPrice,
            currentPrice: 0,
            isAbove: _isAbove,
            isActive: true
        });

        agents[_agentId].priceAlerts.push(alert);

        emit PriceAlertCreated(_agentId, _token, _targetPrice, _isAbove);
    }

    function updatePriceAlert(
        uint256 _agentId,
        address _token,
        uint256 _targetPrice,
        bool _isAbove
    ) external {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        require(agents[_agentId].isActive, "Agent not active");

        PriceAlert[] storage alerts = agents[_agentId].priceAlerts;
        bool found = false;

        for (uint i = 0; i < alerts.length; i++) {
            if (alerts[i].token == _token) {
                alerts[i].targetPrice = _targetPrice;
                alerts[i].isAbove = _isAbove;
                found = true;
                break;
            }
        }

        require(found, "Alert not found");

        emit PriceAlertUpdated(_agentId, _token, _targetPrice, _isAbove);
    }

    function checkPriceAlert(
        uint256 _agentId,
        address _token,
        uint256 _currentPrice
    ) external {
        Agent storage agent = agents[_agentId];
        require(agent.isActive, "Agent not active");

        PriceAlert[] storage alerts = agent.priceAlerts;
        for (uint i = 0; i < alerts.length; i++) {
            if (alerts[i].token == _token && alerts[i].isActive) {
                alerts[i].currentPrice = _currentPrice;
                
                bool shouldTrigger = alerts[i].isAbove ? 
                    _currentPrice >= alerts[i].targetPrice :
                    _currentPrice <= alerts[i].targetPrice;

                if (shouldTrigger) {
                    emit PriceAlertTriggered(
                        _agentId,
                        _token,
                        _currentPrice,
                        alerts[i].targetPrice
                    );
                }
            }
        }
    }

    function getActiveAlerts(uint256 _agentId) external view returns (PriceAlert[] memory) {
        Agent storage agent = agents[_agentId];
        uint256 activeCount = 0;

        // Count active alerts
        for (uint i = 0; i < agent.priceAlerts.length; i++) {
            if (agent.priceAlerts[i].isActive) {
                activeCount++;
            }
        }

        // Create array of active alerts
        PriceAlert[] memory activeAlerts = new PriceAlert[](activeCount);
        uint256 j = 0;
        for (uint i = 0; i < agent.priceAlerts.length; i++) {
            if (agent.priceAlerts[i].isActive) {
                activeAlerts[j] = agent.priceAlerts[i];
                j++;
            }
        }

        return activeAlerts;
    }
} 