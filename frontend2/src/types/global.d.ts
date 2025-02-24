interface Window {
  ethereum: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, handler: (params: any) => void) => void;
    removeListener: (eventName: string, handler: (params: any) => void) => void;
    isMetaMask?: boolean;
    chainId?: string;
    selectedAddress?: string | null;
  };
}

declare interface ImportMeta {
  env: {
    VITE_RPC_URL: string;
    VITE_CHAIN_ID: string;
  };
}
