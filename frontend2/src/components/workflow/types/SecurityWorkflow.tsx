'use client';

import { useState } from 'react';
import { analyzeContract } from '@/lib/ai';

interface Props {
  name: string;
  onBack: () => void;
}

export default function SecurityWorkflow({ name, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [fixedCode, setFixedCode] = useState('');

  const analyzeCode = async () => {
    const result = await analyzeContract(code);
    setAnalysis(result);
    setStep(2);
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
          <h2 className="text-2xl font-bold">Contract Security Check</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Paste your Solidity code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 
                       font-mono text-sm"
              placeholder="// Paste your smart contract code here..."
            />
          </div>

          <button
            onClick={analyzeCode}
            disabled={!code.trim()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg 
                     disabled:opacity-50"
          >
            Analyze Contract
          </button>
        </div>
      </div>
    );
  }

  if (step === 2 && analysis) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Security Analysis Results</h2>
        
        {/* Vulnerabilities Found */}
        <div className="mb-6 space-y-4">
          {analysis.vulnerabilities.map((vuln: any, i: number) => (
            <div 
              key={i}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <h3 className="font-medium text-red-400 mb-2">{vuln.title}</h3>
              <p className="text-sm text-gray-300">{vuln.description}</p>
              <div className="mt-2 text-sm text-gray-400">
                Line {vuln.line}: <code>{vuln.code}</code>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">
              {analysis.suggestions}
            </pre>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Back to Code
          </button>
          <button
            onClick={() => setStep(3)}
            className="px-4 py-2 bg-blue-500 rounded-lg"
          >
            Fix Issues
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Fix Security Issues</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Updated Contract Code</label>
            <textarea
              value={fixedCode}
              onChange={(e) => setFixedCode(e.target.value)}
              rows={15}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 
                       font-mono text-sm"
              placeholder="// Paste your fixed contract code here..."
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              Back to Analysis
            </button>
            <button
              onClick={() => {/* Handle deployment */}}
              className="px-4 py-2 bg-green-500 rounded-lg"
            >
              Deploy Fixed Contract
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
