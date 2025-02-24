export function checkMetaMaskProvider(): { hasProvider: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { hasProvider: false, error: 'Window is not defined' };
  }

  if (!window.ethereum) {
    return { hasProvider: false, error: 'MetaMask not installed' };
  }

  if (!window.ethereum.isMetaMask) {
    return { hasProvider: false, error: 'Provider is not MetaMask' };
  }

  return { hasProvider: true };
}

export function getProvider() {
  const { hasProvider, error } = checkMetaMaskProvider();
  if (!hasProvider) {
    throw new Error(error || 'No provider available');
  }
  return window.ethereum;
}
