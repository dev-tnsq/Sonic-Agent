import { ethers } from 'ethers';
import { createPublicClient, http, parseAbi } from 'viem';
import { sonicTestnet } from 'viem/chains';
import { AgentFactoryABI } from '../abi/AgentFactory';
import { SonicTokenABI } from '../abi/SonicToken';

const AGENT_FACTORY_ADDRESS = process.env.AGENT_FACTORY_ADDRESS as `0x${string}`;
const RPC_URL = process.env.SONIC_RPC_URL;

export class PriceMonitor {
    private provider: ethers.providers.JsonRpcProvider;
    private publicClient: any;
    private agentFactory: ethers.Contract;
    private monitoringInterval: NodeJS.Timeout | null = null;
    private isMonitoring: boolean = false;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        this.publicClient = createPublicClient({
            chain: sonicTestnet,
            transport: http(RPC_URL)
        });
        this.agentFactory = new ethers.Contract(
            AGENT_FACTORY_ADDRESS,
            AgentFactoryABI,
            this.provider
        );
    }

    async getTokenPrice(tokenAddress: string): Promise<number> {
        // Implement price fetching logic here
        // This is a placeholder - you'll need to implement actual price fetching
        // from DEX or price feed
        return 0;
    }

    async checkAlertsForAgent(agentId: number) {
        try {
            const alerts = await this.agentFactory.getActiveAlerts(agentId);
            
            for (const alert of alerts) {
                const currentPrice = await this.getTokenPrice(alert.token);
                
                await this.agentFactory.checkPriceAlert(
                    agentId,
                    alert.token,
                    ethers.utils.parseEther(currentPrice.toString())
                );
            }
        } catch (error) {
            console.error(`Error checking alerts for agent ${agentId}:`, error);
        }
    }

    async startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;

        // Listen for new price alerts
        this.agentFactory.on('PriceAlertCreated', async (agentId, token, targetPrice, isAbove) => {
            console.log(`New price alert created for agent ${agentId}`);
            await this.checkAlertsForAgent(agentId);
        });

        // Listen for price alert updates
        this.agentFactory.on('PriceAlertUpdated', async (agentId, token, targetPrice, isAbove) => {
            console.log(`Price alert updated for agent ${agentId}`);
            await this.checkAlertsForAgent(agentId);
        });

        // Start periodic monitoring
        this.monitoringInterval = setInterval(async () => {
            const totalAgents = await this.agentFactory.totalAgents();
            
            for (let i = 0; i < totalAgents.toNumber(); i++) {
                await this.checkAlertsForAgent(i);
            }
        }, 60000); // Check every minute
    }

    async stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        this.agentFactory.removeAllListeners();
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
}

// Export singleton instance
export const priceMonitor = new PriceMonitor(); 