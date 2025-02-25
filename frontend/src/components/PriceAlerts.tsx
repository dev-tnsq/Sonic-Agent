'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAgent, useUserAgents } from '@/hooks/useAgent';
import { useMonitorPrice } from '@/hooks/useMonitor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PriceAlerts() {
    const { address } = useAccount();
    const { data: agentIds } = useUserAgents(address);
    const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
    const { data: agent } = useAgent(selectedAgentId);
    const { alerts, createAlert, updateAlert } = useMonitorPrice(selectedAgentId);

    const [newAlert, setNewAlert] = useState({
        token: '',
        targetPrice: '',
        isAbove: true
    });

    const handleCreateAlert = async () => {
        if (!selectedAgentId || !newAlert.token || !newAlert.targetPrice) return;

        await createAlert({
            token: newAlert.token as `0x${string}`,
            targetPrice: parseFloat(newAlert.targetPrice),
            isAbove: newAlert.isAbove
        });

        setNewAlert({
            token: '',
            targetPrice: '',
            isAbove: true
        });
    };

    const handleUpdateAlert = async (
        token: string,
        targetPrice: string,
        isAbove: boolean
    ) => {
        if (!selectedAgentId) return;

        await updateAlert({
            token: token as `0x${string}`,
            targetPrice: parseFloat(targetPrice),
            isAbove
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Select Agent</Label>
                <select
                    className="w-full p-2 border rounded"
                    value={selectedAgentId || ''}
                    onChange={(e) => setSelectedAgentId(Number(e.target.value))}
                >
                    <option value="">Select an agent</option>
                    {agentIds?.map((id) => (
                        <option key={id} value={id}>
                            Agent {id}
                        </option>
                    ))}
                </select>
            </div>

            {selectedAgentId && (
                <>
                    <Card className="p-4 space-y-4">
                        <h3 className="text-lg font-semibold">Create New Alert</h3>
                        <div className="space-y-2">
                            <Label>Token Address</Label>
                            <Input
                                value={newAlert.token}
                                onChange={(e) =>
                                    setNewAlert({ ...newAlert, token: e.target.value })
                                }
                                placeholder="0x..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Target Price</Label>
                            <Input
                                type="number"
                                value={newAlert.targetPrice}
                                onChange={(e) =>
                                    setNewAlert({ ...newAlert, targetPrice: e.target.value })
                                }
                                placeholder="0.0"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Label>Alert when price is above target</Label>
                            <Switch
                                checked={newAlert.isAbove}
                                onCheckedChange={(checked) =>
                                    setNewAlert({ ...newAlert, isAbove: checked })
                                }
                            />
                        </div>
                        <Button onClick={handleCreateAlert}>Create Alert</Button>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Active Alerts</h3>
                        {alerts?.map((alert, index) => (
                            <Card key={index} className="p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">Token: {alert.token}</p>
                                        <p>Target Price: {alert.targetPrice}</p>
                                        <p>Current Price: {alert.currentPrice || 'N/A'}</p>
                                        <p>
                                            Alert Type:{' '}
                                            {alert.isAbove ? 'Above Target' : 'Below Target'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleUpdateAlert(
                                                    alert.token,
                                                    alert.targetPrice.toString(),
                                                    !alert.isAbove
                                                )
                                            }
                                        >
                                            Toggle Alert Type
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
} 