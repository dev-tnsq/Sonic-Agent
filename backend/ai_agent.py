import time
import requests
from web3 import Web3
from eth_account import Account
import json
import numpy as np
from datetime import datetime
import logging
from web3.auto import w3 as _w3
from agents.zerepy_agent import SonicZerepyAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='ai_agent.log'
)

# Network Configuration
SONIC_TESTNET_RPC = "https://rpc.blaze.soniclabs.com"
w3 = Web3(Web3.HTTPProvider(SONIC_TESTNET_RPC))

# Account Configuration
PRIVATE_KEY = "84acd61bcc12a6df3948eb63a4872401c54aafed26afc05b89c581e3e0608389"
account = Account.from_key(PRIVATE_KEY)
USER_ADDRESS = account.address
CONTRACT_ADDRESS = "0x713336e3B1A95c6f8Ad3CA610fD6B615Ba59a41E"

# Trading Configuration
PRICE_CHECK_INTERVAL = 60  # seconds
BUY_THRESHOLD = 0.45
SELL_THRESHOLD = 0.55
TRADE_AMOUNT = 0.1
GAS_LIMIT = 2000000
MAX_PRIORITY_FEE = 2  # gwei

class PricePredictor:
    def __init__(self, window_size=10):
        self.window_size = window_size
        self.price_history = []
        
    def add_price(self, price):
        self.price_history.append(price)
        if len(self.price_history) > self.window_size:
            self.price_history.pop(0)
            
    def predict_next(self):
        if len(self.price_history) < self.window_size:
            return self.price_history[-1] if self.price_history else 0
        
        # Simple trend prediction
        price_diff = np.diff(self.price_history)
        trend = np.mean(price_diff)
        return self.price_history[-1] + trend

class PriceTracker:
    def __init__(self):
        self.price_history = []
        self.last_trade_time = 0
        self.trade_cooldown = 300  # 5 minutes
        self.predictor = PricePredictor()
        
    def get_current_price(self):
        try:
            url = "https://api.coingecko.com/api/v3/simple/price"
            params = {
                "ids": "sonic-token",
                "vs_currencies": "usd",
                "include_24hr_change": "true"
            }
            headers = {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
            response = requests.get(url, params=params, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                price = float(data.get("sonic-token", {}).get("usd", 0.5))
                self.predictor.add_price(price)
                return price
            return 0.5
                
        except Exception as e:
            logging.error(f"Price fetch error: {e}")
            return 0.5

    def should_trade(self, current_price):
        if time.time() - self.last_trade_time < self.trade_cooldown:
            return False, None
            
        predicted_price = self.predictor.predict_next()
        logging.info(f"Current price: ${current_price}, Predicted: ${predicted_price}")
        
        if current_price < BUY_THRESHOLD and predicted_price > current_price:
            return True, "buy"
        elif current_price > SELL_THRESHOLD and predicted_price < current_price:
            return True, "sell"
        return False, None

    def execute_trade(self, trade_type, price):
        try:
            nonce = w3.eth.get_transaction_count(USER_ADDRESS)
            amount_wei = w3.to_wei(TRADE_AMOUNT, 'ether')
            gas_price = w3.eth.gas_price
            priority_fee = w3.to_wei(MAX_PRIORITY_FEE, 'gwei')
            max_fee = gas_price + priority_fee

            if trade_type == "buy":
                transaction = contract.functions.buySonic(amount_wei).build_transaction({
                    'chainId': 57054,
                    'gas': GAS_LIMIT,
                    'maxFeePerGas': max_fee,
                    'maxPriorityFeePerGas': priority_fee,
                    'nonce': nonce,
                    'value': amount_wei,
                    'from': USER_ADDRESS
                })
            else:
                logging.info("Sell functionality not implemented yet")
                return None

            signed_txn = w3.eth.account.sign_transaction(transaction, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            logging.info(f"Transaction sent: {tx_hash.hex()}")
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
            
            if receipt.status == 1:
                trade_info = {
                    'type': trade_type,
                    'amount': TRADE_AMOUNT,
                    'price': price,
                    'hash': receipt.transactionHash.hex(),
                    'gas_used': receipt.gasUsed,
                    'timestamp': datetime.now().isoformat()
                }
                
                self._log_trade(trade_info)
                self.last_trade_time = time.time()
                return receipt
            else:
                logging.error(f"Transaction failed: {receipt}")
                return None

        except Exception as e:
            logging.error(f"Trade execution error: {str(e)}")
            return None

    def _log_trade(self, trade_info):
        try:
            with open('trades.json', 'a+') as f:
                f.seek(0)
                try:
                    trades = json.load(f)
                except json.JSONDecodeError:
                    trades = []
                trades.append(trade_info)
                f.seek(0)
                f.truncate()
                json.dump(trades, f, indent=2)
        except Exception as e:
            logging.error(f"Error logging trade: {e}")

def verify_setup():
    try:
        if not w3.is_connected():
            raise Exception("Failed to connect to Sonic network")

        chain_id = w3.eth.chain_id
        if chain_id != 57054:
            raise Exception(f"Wrong network. Expected Sonic Testnet (57054), got {chain_id}")

        balance = w3.eth.get_balance(USER_ADDRESS)
        balance_eth = w3.from_wei(balance, 'ether')
        
        logging.info("Setup Verification Successful:")
        logging.info(f"Network: Sonic Testnet (Chain ID: {chain_id})")
        logging.info(f"Account: {USER_ADDRESS}")
        logging.info(f"Balance: {balance_eth:.4f} S")
        logging.info(f"Contract: {CONTRACT_ADDRESS}")
        return True

    except Exception as e:
        logging.error(f"Setup verification failed: {str(e)}")
        return False

class AIAgent:
    def __init__(self, config: Dict):
        self.config = config
        self.zerepy_agent = SonicZerepyAgent(config)
        self.strategy_engine = AIStrategyEngine()
        # ...existing initialization...

    async def run(self):
        # Initialize Zerepy
        if not await self.zerepy_agent.initialize():
            logging.error("Failed to initialize Zerepy agent")
            return

        while True:
            try:
                # Get market data using Zerepy
                token_analysis = await self.zerepy_agent.analyze_token(self.config['token_address'])
                if not token_analysis:
                    continue

                # Update market condition
                market_condition = await self.strategy_engine.analyze_market_data(
                    token_analysis['metrics']['price'],
                    token_analysis['metrics']['volume_24h']
                )

                # Get optimal trading route
                if market_condition.trend == 'bullish':
                    route = await self.zerepy_agent.get_optimal_route(
                        self.config['token_address'],
                        self.config['trade_amount'],
                        is_buy=True
                    )
                    
                    if route and route['price_impact'] < 1.0:  # Less than 1% impact
                        await self.zerepy_agent.execute_trade(
                            self.config['token_address'],
                            self.config['trade_amount'],
                            is_buy=True
                        )

                # Monitor pool for significant events
                await self.zerepy_agent.monitor_pool(self.config['token_address'])

                await asyncio.sleep(self.config['update_interval'])

            except Exception as e:
                logging.error(f"Agent error: {e}")
                await asyncio.sleep(30)

def main():
    if not verify_setup():
        return

    logging.info("Starting Sonic AI Trading Agent...")
    tracker = PriceTracker()
    
    while True:
        try:
            if not w3.is_connected():
                logging.error("Lost connection to Sonic network. Retrying...")
                time.sleep(30)
                continue

            balance = w3.eth.get_balance(USER_ADDRESS)
            balance_eth = w3.from_wei(balance, 'ether')
            current_price = tracker.get_current_price()

            if current_price is None:
                continue

            print(f"\rTime: {datetime.now().strftime('%H:%M:%S')} | "
                  f"Price: ${current_price:.4f} | "
                  f"Balance: {balance_eth:.4f} S | "
                  f"Predicted: ${tracker.predictor.predict_next():.4f}", end='', flush=True)

            should_trade, trade_type = tracker.should_trade(current_price)
            
            if should_trade:
                print(f"\nTrigger detected: {trade_type} at ${current_price}")
                if trade_type == "buy" and balance_eth >= TRADE_AMOUNT:
                    tracker.execute_trade(trade_type, current_price)
                elif trade_type == "sell":
                    tracker.execute_trade(trade_type, current_price)

        except KeyboardInterrupt:
            logging.info("Stopping AI agent...")
            break
        except Exception as e:
            logging.error(f"Error in main loop: {e}")
            time.sleep(30)
            continue

        time.sleep(PRICE_CHECK_INTERVAL)

if __name__ == "__main__":
    try:
        # Load contract ABI
        with open('../dapp/artifacts/contracts/SonicAutomation.sol/SonicAutomation.json', 'r') as f:
            contract_json = json.load(f)
            CONTRACT_ABI = contract_json['abi']
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        main()
    except KeyboardInterrupt:
        print("\nShutting down AI agent...")
    except Exception as e:
        logging.error(f"Fatal error: {e}")
