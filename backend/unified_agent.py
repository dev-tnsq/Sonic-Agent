import asyncio
import logging
import yaml
import openai
from datetime import datetime
from typing import Dict, List, Optional
from web3 import Web3
from zerepy import Zerepy, Chain
import numpy as np
from dataclasses import dataclass

@dataclass
class TradeSignal:
    action: str  # 'buy', 'sell', 'hold'
    confidence: float
    price: float
    timestamp: datetime
    reason: str

class UnifiedAgent:
    def __init__(self, config_path: str = "config.yaml"):
        # Load configuration
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)

        # Initialize components
        self.setup_components()
        self.trading_enabled = True
        self.price_history = []
        self.last_trade_time = None
        self.trades_executed = 0

    def setup_components(self):
        """Initialize all components"""
        # Zerepy setup
        self.zerepy = Zerepy(
            private_key=self.config['sonic']['private_key'],
            chain=Chain.SONIC_TESTNET
        )

        # Web3 setup
        self.w3 = Web3(Web3.HTTPProvider(self.config['sonic']['rpc_url']))

        # OpenAI setup
        openai.api_key = self.config['api']['openai']['api_key']

        # Initialize contract
        self.contract = self.w3.eth.contract(
            address=self.config['sonic']['contract_address'],
            abi=self.config['sonic']['contract_abi']
        )

    async def analyze_market(self, token_address: str) -> Dict:
        """Comprehensive market analysis"""
        try:
            # Get market data using Zerepy
            token_info = await self.zerepy.get_token_info(token_address)
            pool_info = await self.zerepy.get_pool_info(token_address)
            trades = await self.zerepy.get_recent_trades(token_address, limit=100)

            # Calculate metrics
            market_data = {
                'price': pool_info.price,
                'volume_24h': pool_info.volume_24h,
                'price_change_24h': pool_info.price_change_24h,
                'liquidity': pool_info.liquidity,
                'trades_count': len(trades),
                'average_trade_size': sum(t.amount for t in trades) / len(trades) if trades else 0,
                'timestamp': datetime.now().isoformat()
            }

            # Get AI analysis
            analysis = await self.get_ai_analysis(market_data)
            
            return {
                'market_data': market_data,
                'analysis': analysis,
                'token_info': token_info,
            }

        except Exception as e:
            logging.error(f"Market analysis failed: {e}")
            return None

    async def get_ai_analysis(self, market_data: Dict) -> Dict:
        """Get AI-powered market analysis"""
        try:
            prompt = f"""
            Analyze this Sonic token market data:
            Price: ${market_data['price']}
            24h Volume: ${market_data['volume_24h']}
            Price Change: {market_data['price_change_24h']}%
            Liquidity: ${market_data['liquidity']}
            Number of Trades: {market_data['trades_count']}

            Provide:
            1. Market sentiment (bullish/bearish/neutral)
            2. Risk level (high/medium/low)
            3. Action recommendation (buy/sell/hold)
            4. Confidence score (0-100)
            5. Main reasoning
            """

            response = await openai.ChatCompletion.acreate(
                model=self.config['api']['openai']['model'],
                messages=[
                    {"role": "system", "content": "You are an expert crypto market analyst."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )

            analysis = response.choices[0].message.content
            return self._parse_ai_response(analysis)

        except Exception as e:
            logging.error(f"AI analysis failed: {e}")
            return None

    def _parse_ai_response(self, response: str) -> Dict:
        """Parse AI response into structured data"""
        lines = response.lower().split('\n')
        result = {
            'sentiment': 'neutral',
            'risk_level': 'medium',
            'action': 'hold',
            'confidence': 0,
            'reasoning': ''
        }

        for line in lines:
            if 'sentiment' in line:
                result['sentiment'] = next((s for s in ['bullish', 'bearish', 'neutral'] 
                                         if s in line), 'neutral')
            elif 'risk' in line:
                result['risk_level'] = next((r for r in ['high', 'medium', 'low'] 
                                           if r in line), 'medium')
            elif 'action' in line or 'recommend' in line:
                result['action'] = next((a for a in ['buy', 'sell', 'hold'] 
                                       if a in line), 'hold')
            elif 'confidence' in line:
                try:
                    result['confidence'] = int(''.join(filter(str.isdigit, line)))
                except:
                    result['confidence'] = 0
            elif 'reason' in line:
                result['reasoning'] = line.split(':')[-1].strip()

        return result

    async def execute_trade(self, signal: TradeSignal) -> bool:
        """Execute trade based on signal"""
        try:
            if not self.trading_enabled:
                logging.warning("Trading is currently disabled")
                return False

            token_address = self.config['zerepy']['token_address']
            amount = self.config['zerepy']['trading']['min_amount']

            # Get optimal route
            route = await self.zerepy.find_best_route(
                token_address=token_address,
                amount=self.w3.to_wei(amount, 'ether'),
                is_exact_in=True,
                is_eth_in=(signal.action == 'buy')
            )

            if route['price_impact'] > self.config['zerepy']['max_slippage']:
                logging.warning(f"Price impact too high: {route['price_impact']}%")
                return False

            # Execute trade
            if signal.action == 'buy':
                tx = await self.zerepy.swap_exact_eth_for_tokens(
                    token_address=token_address,
                    amount_in=self.w3.to_wei(amount, 'ether'),
                    slippage=self.config['zerepy']['max_slippage'],
                    deadline_minutes=20
                )
            else:
                tx = await self.zerepy.swap_exact_tokens_for_eth(
                    token_address=token_address,
                    amount_in=self.w3.to_wei(amount, 'ether'),
                    slippage=self.config['zerepy']['max_slippage'],
                    deadline_minutes=20
                )

            receipt = await self.zerepy.wait_for_transaction(tx.hash)
            
            if receipt.status == 1:
                self.trades_executed += 1
                self.last_trade_time = datetime.now()
                logging.info(f"Trade executed successfully: {tx.hash.hex()}")
                return True

            return False

        except Exception as e:
            logging.error(f"Trade execution failed: {e}")
            return False

    async def monitor_events(self):
        """Monitor blockchain events"""
        try:
            async def handle_swap(event):
                logging.info(f"Swap detected: {event}")
                
                # Get fresh analysis
                analysis = await self.analyze_market(
                    self.config['zerepy']['token_address']
                )
                
                if analysis and analysis['analysis']['confidence'] >= 80:
                    signal = TradeSignal(
                        action=analysis['analysis']['action'],
                        confidence=analysis['analysis']['confidence'],
                        price=analysis['market_data']['price'],
                        timestamp=datetime.now(),
                        reason=analysis['analysis']['reasoning']
                    )
                    
                    if self.should_trade(signal):
                        await self.execute_trade(signal)

            # Subscribe to events
            await self.zerepy.subscribe_to_pool_events(
                self.config['zerepy']['token_address'],
                callbacks={'Swap': handle_swap}
            )

        except Exception as e:
            logging.error(f"Event monitoring failed: {e}")

    def should_trade(self, signal: TradeSignal) -> bool:
        """Determine if we should execute a trade"""
        if not self.last_trade_time:
            return True
            
        cooldown = self.config['zerepy']['trading']['cooldown_minutes']
        if (datetime.now() - self.last_trade_time).total_seconds() < cooldown * 60:
            return False
            
        return signal.confidence >= self.config['zerepy']['trading']['min_confidence']

    async def run(self):
        """Main loop"""
        try:
            logging.info("Starting Unified Agent...")
            
            # Start event monitoring
            asyncio.create_task(self.monitor_events())
            
            while True:
                try:
                    # Get market analysis
                    analysis = await self.analyze_market(
                        self.config['zerepy']['token_address']
                    )
                    
                    if analysis:
                        signal = TradeSignal(
                            action=analysis['analysis']['action'],
                            confidence=analysis['analysis']['confidence'],
                            price=analysis['market_data']['price'],
                            timestamp=datetime.now(),
                            reason=analysis['analysis']['reasoning']
                        )
                        
                        if self.should_trade(signal):
                            await self.execute_trade(signal)
                    
                    await asyncio.sleep(self.config['zerepy']['update_interval'])

                except Exception as e:
                    logging.error(f"Loop iteration failed: {e}")
                    await asyncio.sleep(30)

        except Exception as e:
            logging.error(f"Agent failed: {e}")
            raise

if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        filename='unified_agent.log'
    )

    # Create and run agent
    agent = UnifiedAgent()
    asyncio.run(agent.run())
