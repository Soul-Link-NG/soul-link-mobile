import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAppKit } from "@reown/appkit-react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Web3Context for Soul Link
 *
 * Uses Reown AppKit (WalletConnect v2) for wallet management.
 * Provides wallet connection, address, chain info, and signing capabilities.
 */

export type Web3ContextType = {
  // Account state
  address: string | undefined;
  isConnected: boolean;

  // Chain info
  chainId: number | undefined;
  chainName: string | undefined;

  // Connection state
  isConnecting: boolean;

  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const WALLET_ADDRESS_KEY = "soul-link-wallet-address";
const CHAIN_ID_KEY = "soul-link-chain-id";

/**
 * Web3Provider component that wraps the app with AppKit context
 * Must be used inside the app layout, after Web3 is initialized
 */
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { open } = useAppKit();

  // Local state management since AppKit hooks aren't available
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [isConnecting, setIsConnecting] = useState(false);

  // Load saved address on mount
  useEffect(() => {
    loadStoredWallet();
  }, []);

  const loadStoredWallet = async () => {
    try {
      const savedAddress = await SecureStore.getItemAsync(WALLET_ADDRESS_KEY);
      const savedChainId = await SecureStore.getItemAsync(CHAIN_ID_KEY);
      if (savedAddress) {
        setAddress(savedAddress);
      }
      if (savedChainId) {
        setChainId(Number(savedChainId));
      }
    } catch (error) {
      console.error("Failed to load stored wallet:", error);
    }
  };

  // Map chainId to chain name
  const getChainName = (id: number | undefined): string | undefined => {
    if (!id) return undefined;
    const chainNames: Record<number, string> = {
      1: "Ethereum Mainnet",
      137: "Polygon",
      42161: "Arbitrum",
      10: "Optimism",
      8453: "Base",
    };
    return chainNames[id] || `Chain ${id}`;
  };

  const chainName = getChainName(chainId);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      // AppKit's open() method opens the wallet selector modal
      // User selects and connects their wallet (Trust, Bybit, Phantom, etc.)
      await open();

      // Note: After wallet connects, you'll need to manually set address and chainId
      // This would typically come from a callback or state listener in AppKit
      // For now, this is handled by the login flow in walletAuth.ts
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [open]);

  const disconnectWallet = useCallback(async () => {
    try {
      setAddress(undefined);
      setChainId(undefined);
      await SecureStore.deleteItemAsync(WALLET_ADDRESS_KEY);
      await SecureStore.deleteItemAsync(CHAIN_ID_KEY);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      throw error;
    }
  }, []);

  // Helper method to update address (called from walletAuth after successful login)
  const updateWalletInfo = useCallback(
    async (newAddress: string, newChainId?: number) => {
      setAddress(newAddress);
      if (newChainId) {
        setChainId(newChainId);
      }
      await SecureStore.setItemAsync(WALLET_ADDRESS_KEY, newAddress);
      if (newChainId) {
        await SecureStore.setItemAsync(CHAIN_ID_KEY, String(newChainId));
      }
    },
    [],
  );

  useEffect(() => {
    (globalThis as any).__updateWalletInfo = updateWalletInfo;
  }, [updateWalletInfo]);


  const value: Web3ContextType = {
    address,
    isConnected: !!address,
    chainId,
    chainName,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}



export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
