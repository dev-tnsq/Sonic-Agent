import asyncio
import yaml
import logging
from datetime import datetime
from typing import Dict, List, Optional
import openai
from web3 import Web3
from zerepy import Zerepy, Chain
from zerepy.utils import parse_token_amount

class SmartAgent:
    def __init__(self, config_path: str):
        # Load configuration
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)

        # Initialize OpenAI
        openai.api_key = self.config['api']['openai']['api_key']

        # Initialize Zerepy
        self.zerepy = Zerepy(
            private_key=self.config['sonic']['private_key'],
            chain=Chain.SONIC_TESTNET
        )

        # Initialize Web3
        self.w3 = Web3(Web3.HTTPProvider(self.config['sonic']['rpc_url']))
        self.trading_enabled = True
        self.last_analysis = None

    async def analyze_market_with_gpt(self, market_data: Dict) -> Dict:
        """Use GPT to analyze market conditions"""
        try:
            prompt = f"""
            Analyze the following market data for Sonic token:
            Price: ${market_data['price']}
            24h Volume: ${market_data['volume_24h']}
            Price Change: {market_data['price_change_24h']}%
            Number of Trades: {market_data['trades_count']}
            
            Provide a trading recommendation with the following:
            1. Market sentiment (bullish/bearish/neutral)
            2. Risk level (high/medium/low)
            3. Suggested action (buy/sell/hold)
            4. Confidence score (0-100)
            5. Key reasons for recommendation
            """

            response = await openai.ChatCompletion.acreate(
                model=self.config['api']['openai']['model'],
                messages=[{
                    "role": "system",
                    "content": "You are an AI trading expert analyzing Sonic blockchain market data."
                }, {
                    "role": "user",
                    "content": prompt
                }],
                temperature=self.config['api']['openai']['temperature'],
                max_tokens=self.config['api']['openai']['max_tokens']
            )

            analysis = response.choices[0].message.content
            return self._parse_gpt_analysis(analysis)

        except Exception as e:
            logging.error(f"GPT analysis failed: {e}")
            return None

    def _parse_gpt_analysis(self, analysis: str) -> Dict:
        """Parse GPT's text response into structured data"""
        try:
            lines = analysis.split('\n')
            result = {}
            
            for line in lines:
                if 'sentiment:' in line.lower():
                    result['sentiment'] = line.split(':')[1].strip().lower()
                elif 'risk level:' in line.lower():
                    result['risk_level'] = line.split(':')[1].strip().lower()
                elif 'action:' in line.lower():
                    result['action'] = line.split(':')[1].strip().lower()
                elif 'confidence:' in line.lower():
                    score = line.split(':')[1].strip()
                    result['confidence'] = int(score.replace('%', ''))

            return result

        except Exception as e:
            logging.error(f"Failed to parse GPT analysis: {e}")
            return None

    async def execute_strategy(self, analysis: Dict) -> bool:
        """Execute trading strategy based on GPT analysis"""
        try:
            if not analysis or analysis['confidence'] < 70:
                logging.info("Confidence too low for trade execution")
                return False

            token_address = self.config['zerepy']['token_address']
            amount = self.config['zerepy']['trading']['min_amount']

            if analysis['action'] == 'buy' and analysis['sentiment'] == 'bullish':
                route = await self.zerepy.find_best_route(
                    token_address=token_address,
                    amount=self.w3.to_wei(amount, 'ether'),
                    is_exact_in=True,
                    is_eth_in=True
                )

                if route['price_impact'] < self.config['zerepy']['max_slippage']:
                    tx = await self.zerepy.swap_exact_eth_for_tokens(
                        token_address=token_address,
                        amount_in=self.w3.to_wei(amount, 'ether'),
                        slippage=self.config['zerepy']['max_slippage'],
                        deadline_minutes=20
                    )
                    return bool(tx)

            elif analysis['action'] == 'sell' and analysis['sentiment'] == 'bearish':
                # Similar sell logic...
                pass

            return False

        except Exception as e:
            logging.error(f"Strategy execution failed: {e}")
            return False

    async def monitor_pool(self):
        """Monitor pool events"""
        try:
            token_address = self.config['zerepy']['token_address']

            async def handle_swap(event):
                logging.info(f"Swap detected: {event}")
                
                # Get updated market data
                market_data = await self.get_market_data()
                
                # Analyze with GPT
                analysis = await self.analyze_market_with_gpt(market_data)
                
                # Execute strategy if conditions met
                if analysis and self.trading_enabled:
                    await self.execute_strategy(analysis)

            await self.zerepy.subscribe_to_pool_events(
                token_address,
                callbacks={'Swap': handle_swap}
            )

        except Exception as e:
            logging.error(f"Pool monitoring failed: {e}")

    async def get_market_data(self) -> Dict:
        """Get current market data"""
        try:
            token_address = self.config['zerepy']['token_address']
            
            # Get token info
            token_info = await self.zerepy.get_token_info(token_address)
            
            # Get pool info
            pool_info = await self.zerepy.get_pool_info(token_address)
            
            # Get recent trades
            trades = await self.zerepy.get_recent_trades(token_address, limit=100)
            
            return {
                'price': pool_info.price,
                'volume_24h': pool_info.volume_24h,
                'price_change_24h': pool_info.price_change_24h,
                'trades_count': len(trades),
                'liquidity': pool_info.liquidity,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logging.error(f"Failed to get market data: {e}")
            return None

    async def run(self):
        """Main loop"""
        try:
            logging.info("Starting Smart Agent...")
            
            # Initialize monitoring
            await self.monitor_pool()
            
            while True:
                try:
                    # Get market data
                    market_data = await self.get_market_data()
                    if not market_data:
                        continue

                    # Analyze with GPT
                    analysis = await self.analyze_market_with_gpt(market_data)
                    if not analysis:
                        continue

                    # Execute strategy
                    if self.trading_enabled:
                        await self.execute_strategy(analysis)

                    # Wait for next interval
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
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

    # Create and run agent
    agent = SmartAgent("config.yaml")
    asyncio.run(agent.run())
