'use client';

import { useState, useEffect } from 'react'
import Dashboard from '@/components/Dashboard'
import Navbar from '@/components/Navbar'
import { useWalletContext } from './providers'
import { NETWORKS } from '@/constants/contracts'
import { isCorrectNetwork } from '@/config/network'
import type { ChainState } from '@/types'

export default function Home() {
  const { account, chainId } = useWalletContext()
  const [chainState, setChainState] = useState<ChainState>({
    sonic: { connected: false, balance: '0' },
    ethereum: { connected: false, balance: '0' }
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chainId || !account) {  // Only check if we have both
      setError(null)
      return
    }

    if (!isCorrectNetwork(chainId)) {
      setError('Please connect to Sonic Blaze Testnet');
    } else {
      setError(null);
    }
  }, [chainId, account])  // Watch both chainId and account

  // Only show error if we have an account but wrong network
  const shouldShowError = error && account

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Remove props since Navbar uses context directly */}
      {shouldShowError && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 text-center">
          {error}
        </div>
      )}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  )
}
