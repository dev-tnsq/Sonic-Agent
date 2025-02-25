'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { sonicBlaze } from '@/lib/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected, walletConnect } from '@wagmi/connectors'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '16f805b39bad011a456d1808c7cf4f87'

const metadata = {
  name: 'Sonic AI',
  description: 'Advanced blockchain trading and monitoring platform powered by Sonic',
  url: 'https://sonic.fan',
  icons: ['https://sonic.fan/icon.png']
}

const config = defaultWagmiConfig({
  chains: [sonicBlaze],
  projectId,
  metadata,
  ssr: true,
  transports: {
    [sonicBlaze.id]: http('https://rpc.blaze.soniclabs.com'),
  },
  connectors: [
    injected(),
    walletConnect({ projectId })
  ],
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
