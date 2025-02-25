import os
import json
import yaml
import logging
import asyncio
import aiohttp
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List, Optional
from web3 import Web3
from eth_account import Account
from eth_typing import Address
from datetime import datetime
from zerepy import Zerepy, Chain
from zerepy.utils import parse_token_amount

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='ai_agent.log'
)
logger = logging.getLogger(__name__)

class UnifiedAgent:
    def __init__(self, config_path: str = "config.yaml"):
        self.config = self._load_config(config_path)
        self.w3 = Web3(Web3.HTTPProvider(self.config['blockchain']['rpc_url']))
        self.agent_factory = self._load_contract('AgentFactory')
        self.sonic_token = self._load_contract('SonicToken')
        
        # Initialize Zerepy client
        self.zerepy = Zerepy(
            private_key=self.config['blockchain']['private_key'],
            chain=Chain.SONIC_MAINNET if self.config['blockchain'].get('network') == 'mainnet' else Chain.SONIC_TESTNET
        )
        
        # Initialize email settings
        self.smtp_config = self.config.get('smtp', {})
        self.smtp_server = self.smtp_config.get('server')
        self.smtp_port = self.smtp_config.get('port')
        self.smtp_username = self.smtp_config.get('username')
        self.smtp_password = self.smtp_config.get('password')
        
        # Price monitoring state
        self.price_alerts = {}
        self.monitoring_tasks = {}

    def _load_config(self, config_path: str) -> Dict:
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            return {}

    def _load_contract(self, contract_name: str):
        try:
            with open('dapp/deployment.json', 'r') as f:
                deployment = json.load(f)
                contract_address = deployment['contracts'][contract_name]
                
            with open(f'dapp/artifacts/contracts/{contract_name}.sol/{contract_name}.json', 'r') as f:
                contract_data = json.load(f)
                abi = contract_data['abi']
                
            return self.w3.eth.contract(address=contract_address, abi=abi)
        except Exception as e:
            logger.error(f"Failed to load contract {contract_name}: {e}")
            return None

    async def create_agent(self, 
        name: str, 
        codename: str, 
        description: str,
        functions: List[Dict],
        llm_config: Optional[Dict] = None
    ) -> Dict:
        """Create a new AI agent with specified functions"""
        try:
            # Prepare agent metadata
            metadata = {
                'name': name,
                'codename': codename,
                'description': description,
                'functions': functions,
                'llm_config': llm_config or self.llm_config,
                'created_at': datetime.utcnow().isoformat()
            }
            
            # Mock IPFS storage for now
            ipfs_hash = f"ipfs://Qm...{name}"
            
            # Extract trading and security params from functions
            trading_params = {
                'buyPrice': 0,
                'sellPrice': 0,
                'maxAmount': 0,
                'stopLoss': 0,
                'isActive': True
            }
            
            security_params = {
                'monitoredContracts': [],
                'riskThreshold': 80,
                'alertsEnabled': True
            }
            
            for func in functions:
                if func['type'] == 'trading':
                    config = func.get('config', {})
                    trading_params.update({
                        'buyPrice': config.get('buyPrice', 0),
                        'sellPrice': config.get('sellPrice', 0),
                        'maxAmount': config.get('maxAmount', 0),
                        'stopLoss': config.get('stopLoss', 0)
                    })
                elif func['type'] == 'security':
                    config = func.get('config', {})
                    security_params.update({
                        'monitoredContracts': config.get('monitoredContracts', []),
                        'riskThreshold': config.get('riskThreshold', 80),
                        'alertsEnabled': config.get('alertsEnabled', True)
                    })
            
            # Deploy agent on blockchain
            tx_hash = await self.agent_factory.functions.createAgent(
                name,
                codename,
                ipfs_hash,
                trading_params,
                security_params
            ).transact()
            
            receipt = await self.w3.eth.wait_for_transaction_receipt(tx_hash)
            agent_id = receipt['logs'][0]['topics'][1]  # Extract agent ID from event
            
            # Start monitoring if price monitor function is included
            if any(f['type'] == 'monitor' for f in functions):
                await self._start_price_monitoring(agent_id, functions)
            
            return {
                'success': True,
                'agent_id': agent_id,
                'metadata': metadata
            }
            
        except Exception as e:
            logger.error(f"Failed to create agent: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def execute_function(self, agent_id: int, function_id: str, params: Dict) -> Dict:
        """Execute a specific function for an agent"""
        try:
            # Get agent status
            agent = await self.agent_factory.functions.getAgent(agent_id).call()
            if not agent[4]:  # isActive check
                raise Exception("Agent is not active")
            
            # Route to appropriate function handler
            if function_id.startswith('security'):
                return await self._execute_security_function(params)
            elif function_id.startswith('trading'):
                return await self._execute_trading_function(params)
            elif function_id.startswith('monitor'):
                return await self._execute_monitoring_function(params)
            else:
                raise Exception("Unknown function type")
                
        except Exception as e:
            logger.error(f"Failed to execute function: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _execute_security_function(self, params: Dict) -> Dict:
        """Execute security analysis on smart contracts"""
        try:
            contract_address = params.get('contract_address')
            if not contract_address:
                raise ValueError("Contract address is required")
            
            # Fetch contract code
            contract_code = await self.w3.eth.get_code(contract_address)
            
            # Basic security checks
            security_issues = []
            
            # Check for reentrancy vulnerabilities
            if b'CALL' in contract_code and b'SSTORE' in contract_code:
                security_issues.append({
                    'type': 'REENTRANCY',
                    'severity': 'HIGH',
                    'description': 'Potential reentrancy vulnerability detected'
                })
            
            # Check for unchecked external calls
            if b'CALL' in contract_code and b'ISZERO' not in contract_code:
                security_issues.append({
                    'type': 'UNCHECKED_CALL',
                    'severity': 'MEDIUM',
                    'description': 'Unchecked external call detected'
                })
            
            # Calculate risk score
            risk_score = len(security_issues) * 20  # Simple scoring
            
            # Send email alert if issues found
            if security_issues and self.smtp_server:
                await self._send_security_alert(contract_address, security_issues)
            
            return {
                'success': True,
                'contract_address': contract_address,
                'risk_score': risk_score,
                'issues': security_issues
            }
            
        except Exception as e:
            logger.error(f"Security analysis failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _execute_trading_function(self, params: Dict) -> Dict:
        """Execute trading operation based on parameters"""
        try:
            amount = params.get('amount')
            is_buy = params.get('is_buy', True)
            token_address = params.get('token_address')
            
            if not all([amount, token_address]):
                raise ValueError("Missing required parameters")
            
            # Get current price
            price = await self._get_token_price(token_address)
            
            # Check trading conditions
            if is_buy:
                if price > params.get('max_price', float('inf')):
                    return {
                        'success': False,
                        'error': 'Price above maximum buy price'
                    }
            else:
                if price < params.get('min_price', 0):
                    return {
                        'success': False,
                        'error': 'Price below minimum sell price'
                    }
            
            # Execute trade
            tx_hash = await self.zerepy.swap(
                token_in=self.sonic_token.address if is_buy else token_address,
                token_out=token_address if is_buy else self.sonic_token.address,
                amount_in=amount,
                slippage=0.01  # 1% slippage
            )
            
            return {
                'success': True,
                'transaction_hash': tx_hash,
                'price': price,
                'amount': amount,
                'type': 'buy' if is_buy else 'sell'
            }
            
        except Exception as e:
            logger.error(f"Trading operation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _execute_monitoring_function(self, params: Dict) -> Dict:
        """Start or update price monitoring for tokens"""
        try:
            token_address = params.get('token_address')
            target_price = params.get('target_price')
            alert_type = params.get('alert_type', 'above')  # 'above' or 'below'
            
            if not all([token_address, target_price]):
                raise ValueError("Missing required parameters")
            
            # Update price alert settings
            self.price_alerts[token_address] = {
                'target_price': target_price,
                'alert_type': alert_type,
                'email': params.get('email')
            }
            
            # Start monitoring if not already running
            if token_address not in self.monitoring_tasks:
                task = asyncio.create_task(self._monitor_price(token_address))
                self.monitoring_tasks[token_address] = task
            
            return {
                'success': True,
                'message': f'Price monitoring active for {token_address}'
            }
            
        except Exception as e:
            logger.error(f"Failed to start price monitoring: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _monitor_price(self, token_address: str):
        """Continuous price monitoring loop"""
        while True:
            try:
                current_price = await self._get_token_price(token_address)
                alert_config = self.price_alerts.get(token_address)
                
                if alert_config:
                    target_price = alert_config['target_price']
                    alert_type = alert_config['alert_type']
                    
                    should_alert = (
                        (alert_type == 'above' and current_price >= target_price) or
                        (alert_type == 'below' and current_price <= target_price)
                    )
                    
                    if should_alert and alert_config.get('email'):
                        await self._send_price_alert(
                            token_address,
                            current_price,
                            target_price,
                            alert_config['email']
                        )
                
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"Price monitoring error: {e}")
                await asyncio.sleep(60)  # Continue monitoring despite errors

    async def _get_token_price(self, token_address: str) -> float:
        """Get current token price from DEX"""
        try:
            # Use 1 SONIC as input amount for price check
            one_sonic = parse_token_amount("1", 18)
            
            path = [self.sonic_token.address, token_address]
            amounts = await self.zerepy.get_amounts_out(one_sonic, path)
            
            return float(amounts[1]) / float(one_sonic)
        except Exception as e:
            logger.error(f"Failed to get token price: {e}")
            raise

    async def _send_security_alert(self, contract_address: str, issues: List[Dict]):
        """Send security alert email"""
        if not self.smtp_server:
            return
        
        try:
            msg = MIMEMultipart()
            msg['Subject'] = f'Security Alert: Issues Found in Contract {contract_address}'
            msg['From'] = self.smtp_username
            msg['To'] = self.config['alerts']['email']
            
            body = "Security Issues Found:\n\n"
            for issue in issues:
                body += f"Type: {issue['type']}\n"
                body += f"Severity: {issue['severity']}\n"
                body += f"Description: {issue['description']}\n\n"
            
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
                
        except Exception as e:
            logger.error(f"Failed to send security alert: {e}")

    async def _send_price_alert(self, token_address: str, current_price: float, target_price: float, email: str):
        """Send price alert email"""
        if not self.smtp_server:
            return
        
        try:
            msg = MIMEMultipart()
            msg['Subject'] = f'Price Alert: Target Price Reached for {token_address}'
            msg['From'] = self.smtp_username
            msg['To'] = email
            
            body = f"Price Alert:\n\n"
            body += f"Token: {token_address}\n"
            body += f"Current Price: {current_price}\n"
            body += f"Target Price: {target_price}\n"
            body += f"Time: {datetime.utcnow().isoformat()}\n"
            
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
                
        except Exception as e:
            logger.error(f"Failed to send price alert: {e}")

    def get_agent_status(self, agent_id: int) -> Dict:
        """Get current status of an agent"""
        try:
            agent = self.agent_factory.functions.getAgent(agent_id).call()
            
            return {
                'success': True,
                'name': agent[0],
                'codename': agent[1],
                'owner': agent[2],
                'created_at': agent[3],
                'is_active': agent[4],
                'metadata': agent[5],
                'trading_params': agent[6],
                'security_params': agent[7],
                'balance': agent[8]
            }
        except Exception as e:
            logger.error(f"Failed to get agent status: {e}")
            return {
                'success': False,
                'error': str(e)
            }

if __name__ == "__main__":
    agent = UnifiedAgent()
    # Add test code here
