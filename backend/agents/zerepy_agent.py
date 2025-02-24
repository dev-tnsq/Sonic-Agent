from typing import Dict, List, Optional
import asyncio
from datetime import datetime
import logging
from zerepy import Zerepy, Chain
from zerepy.utils import parse_token_amount
from web3 import Web3

class SonicZerepyAgent:
    def __init__(self, config: Dict):
        self.config = config
        self.zerepy = Zerepy(
            private_key=config['private_key'],
            chain=Chain.SONIC_TESTNET
        )
        self.w3 = Web3(Web3.HTTPProvider(config['rpc_url']))
        self.last_analysis = None
        self.trading_enabled = True

    async def initialize(self):
        """Initialize Zerepy connection and verify setup"""
        try:
            # Check connection and balance
            account = self.zerepy.get_account()
            balance = await self.zerepy.get_balance(account.address)
            logging.info(f"Zerepy Agent Initialized:")
            logging.info(f"Account: {account.address}")
            logging.info(f"Balance: {parse_token_amount(balance, 18)} SONIC")
            return True
        except Exception as e:
            logging.error(f"Zerepy initialization failed: {e}")
            return False

    async def analyze_token(self, token_address: str):
        """Analyze token using Zerepy's built-in methods"""
        try:
            # Get token info
            token_info = await self.zerepy.get_token_info(token_address)
            
            # Get price and liquidity data
            pool_info = await self.zerepy.get_pool_info(token_address)
            
            # Get recent trades
            trades = await self.zerepy.get_recent_trades(token_address, limit=100)
            
            # Calculate metrics
            metrics = {
                'price': pool_info.price,
                'liquidity': pool_info.liquidity,
                'volume_24h': pool_info.volume_24h,
                'price_change_24h': pool_info.price_change_24h,
                'trades_count': len(trades),
                'average_trade_size': sum(t.amount for t in trades) / len(trades) if trades else 0
            }

            self.last_analysis = {
                'token': token_info,
                'metrics': metrics,
                'timestamp': datetime.now()
            }

            return self.last_analysis

        except Exception as e:
            logging.error(f"Token analysis failed: {e}")
            return None

    async def execute_trade(self, token_address: str, amount: float, is_buy: bool):
        """Execute trade using Zerepy's smart routing"""
        try:
            if not self.trading_enabled:
                logging.warning("Trading is currently disabled")
                return None

            # Convert amount to Wei
            amount_wei = self.w3.to_wei(amount, 'ether')

            if is_buy:
                transaction = await self.zerepy.swap_exact_eth_for_tokens(
                    token_address=token_address,
                    amount_in=amount_wei,
                    slippage=0.5,  # 0.5% slippage
                    deadline_minutes=20
                )
            else:
                transaction = await self.zerepy.swap_exact_tokens_for_eth(
                    token_address=token_address,
                    amount_in=amount_wei,
                    slippage=0.5,
                    deadline_minutes=20
                )

            # Wait for transaction confirmation
            receipt = await self.zerepy.wait_for_transaction(transaction.hash)
            
            if receipt.status == 1:
                logging.info(f"Trade executed successfully: {transaction.hash.hex()}")
                trade_info = {
                    'hash': transaction.hash.hex(),
                    'type': 'buy' if is_buy else 'sell',
                    'amount': amount,
                    'token': token_address,
                    'timestamp': datetime.now().isoformat()
                }
                return trade_info
            else:
                logging.error(f"Trade failed: {receipt}")
                return None

        except Exception as e:
            logging.error(f"Trade execution failed: {e}")
            return None

    async def monitor_pool(self, token_address: str):
        """Monitor pool activity using Zerepy's event listeners"""
        try:
            async def handle_swap(event):
                logging.info(f"Swap detected: {event}")
                await self.analyze_market_impact(event)

            # Subscribe to pool events
            await self.zerepy.subscribe_to_pool_events(
                token_address,
                callbacks={
                    'Swap': handle_swap
                }
            )

        except Exception as e:
            logging.error(f"Pool monitoring failed: {e}")

    async def analyze_market_impact(self, swap_event: Dict):
        """Analyze market impact of swaps"""
        try:
            # Calculate price impact
            price_impact = await self.zerepy.calculate_price_impact(
                swap_event.amount_in,
                swap_event.amount_out,
                swap_event.pool_address
            )

            # If significant impact detected, adjust trading parameters
            if abs(price_impact) > 2.0:  # 2% impact
                logging.warning(f"High price impact detected: {price_impact}%")
                self.trading_enabled = False
                await asyncio.sleep(300)  # Cool down for 5 minutes
                self.trading_enabled = True

        except Exception as e:
            logging.error(f"Market impact analysis failed: {e}")

    async def get_optimal_route(self, token_address: str, amount: float, is_buy: bool):
        """Get optimal trading route using Zerepy's router"""
        try:
            route = await self.zerepy.find_best_route(
                token_address=token_address,
                amount=self.w3.to_wei(amount, 'ether'),
                is_exact_in=True,
                is_eth_in=is_buy
            )

            return {
                'route': route.path,
                'expected_output': route.amount_out,
                'price_impact': route.price_impact,
                'gas_estimate': route.gas_estimate
            }

        except Exception as e:
            logging.error(f"Route finding failed: {e}")
            return None
