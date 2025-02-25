import React, { useState } from 'react';
import { SecurityAnalysis } from '@/types/workflows';
import { Button } from '../ui/button';

interface Props {
  name: string;
}

export default function SecurityWorkflow({ name }: Props) {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [fixedCode, setFixedCode] = useState('');

  const analyzeContract = async () => {
    // TODO: Implement AI analysis
    const mockAnalysis: SecurityAnalysis = {
      contractCode: code,
      vulnerabilities: [
        {
          severity: 'high',
          description: 'Reentrancy vulnerability detected',
          location: 'Line 42: transfer() call',
        }
      ],
      suggestions: [
        'Implement checks-effects-interactions pattern',
        'Add reentrancy guard'
      ]
    };
    setAnalysis(mockAnalysis);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">{name}</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Contract Code</h3>
          <textarea
            className="w-full h-96 p-4 rounded bg-[#1D1D1D] font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your Solidity code here..."
          />
          <Button 
            onClick={analyzeContract}
            className="mt-4"
          >
            Analyze Contract
          </Button>
        </div>

        <div className="space-y-6">
          {analysis && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Vulnerabilities</h3>
                {analysis.vulnerabilities.map((v, i) => (
                  <div key={i} className="p-4 rounded bg-[#1D1D1D] mb-2">
                    <span className={`text-${v.severity}`}>●</span>
                    <p className="font-semibold">{v.description}</p>
                    <p className="text-sm text-muted-foreground">{v.location}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
                <ul className="list-disc pl-4">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Fixed Code</h3>
                <textarea
                  className="w-full h-48 p-4 rounded bg-[#1D1D1D] font-mono"
                  value={fixedCode}
                  onChange={(e) => setFixedCode(e.target.value)}
                  placeholder="Enter your fixed code here..."
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
