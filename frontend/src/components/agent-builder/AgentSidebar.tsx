'use client';

import { Agent } from '@/types/agent';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCircle2 } from 'lucide-react';

interface AgentSidebarProps {
  agent: Partial<Agent>;
  onChange: (agent: Partial<Agent>) => void;
}

export function AgentSidebar({ agent, onChange }: AgentSidebarProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Agent Details</h2>
          <div className="space-y-4">
            <div>
              <Label>Agent Name</Label>
              <Input
                placeholder="Enter agent name"
                value={agent.name}
                onChange={(e) => onChange({ ...agent, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Codename</Label>
              <Input
                placeholder="Enter codename"
                value={agent.codename}
                onChange={(e) => onChange({ ...agent, codename: e.target.value })}
              />
            </div>

            <div>
              <Label>LLM Provider</Label>
              <Select
                value={agent.configuration?.provider}
                onValueChange={(value) => 
                  onChange({
                    ...agent,
                    configuration: { ...agent.configuration, provider: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>LLM Model</Label>
              <Select
                value={agent.configuration?.model}
                onValueChange={(value) => 
                  onChange({
                    ...agent,
                    configuration: { ...agent.configuration, model: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Role Description</Label>
              <Textarea
                placeholder="Describe agent's role and capabilities"
                className="h-24"
                value={agent.description}
                onChange={(e) => onChange({ ...agent, description: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                <UserCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Upload Avatar</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 