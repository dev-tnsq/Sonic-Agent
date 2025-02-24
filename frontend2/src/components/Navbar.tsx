'use client';

import { useWalletContext } from '@/app/providers';
import { isCorrectNetwork } from '@/config/network';

export default function Navbar() {
  const { account, chainId, connectWallet, disconnect, isConnecting } = useWalletContext();
  const isNetworkCorrect = isCorrectNetwork(chainId);
  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  const handleWalletClick = async () => {
    if (account) {
      disconnect();
    } else {
      await connectWallet();
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Sonic Dream AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {account && !isNetworkCorrect && (
              <div className="text-sm px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg">
                Wrong Network
              </div>
            )}
            
            <button
              onClick={handleWalletClick}
              disabled={isConnecting}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${account 
                  ? isNetworkCorrect
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30'
                }
              `}
            >
              {isConnecting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting...
                </span>
              ) : account ? (
                isNetworkCorrect ? shortAddress : 'Switch Network'
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
