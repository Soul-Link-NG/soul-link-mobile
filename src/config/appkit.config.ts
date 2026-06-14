import { createAppKit } from "@reown/appkit-react-native";
import type { Storage } from "@reown/appkit-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EthersAdapter } from "@reown/appkit-ethers-react-native";

const mainnet = {
  id: "eip155:1",
  chainId: 1,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://cloudflare-eth.com"] } },
  explorerUrl: "https://etherscan.io",
};

const polygon = {
  id: "eip155:137",
  chainId: 137,
  name: "Polygon",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: { default: { http: ["https://polygon-rpc.com"] } },
  explorerUrl: "https://polygonscan.com",
};

const arbitrum = {
  id: "eip155:42161",
  chainId: 42161,
  name: "Arbitrum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://arb1.arbitrum.io/rpc"] } },
  explorerUrl: "https://arbiscan.io",
};

const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.error(
    "❌ EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. " +
      "Create a .env file from .env.example and add your WalletConnect Project ID. " +
      "Get one at https://cloud.walletconnect.com",
  );
}

const metadata = {
  name: "Soul Link",
  description: "Web3 Social App - Own Your Digital Soul",
  url: "https://soullink.com.ng",
  icons: ["https://soullink.com.ng/assets/logo.png"],
  redirect: {
    native: "soul-link://",
  },
};

// 2. Fix the Storage Adapter Types
const storageAdapter: Storage = {
  getItem: async <T>(key: string): Promise<T | undefined> => {
    const item = await AsyncStorage.getItem(key);
    // Cast to T to satisfy the generic requirement
    return item === null ? undefined : (item as unknown as T);
  },
  setItem: async <T>(key: string, value: T): Promise<void> => {
    // AppKit sometimes passes objects, so ensure it's a string for AsyncStorage
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
  getKeys: async (): Promise<string[]> => {
    const keys = await AsyncStorage.getAllKeys();
    return Array.from(keys);
  },
  getEntries: async <T>(): Promise<[string, T][]> => {
    const keys = await AsyncStorage.getAllKeys();
    const res = await AsyncStorage.multiGet(keys);
    return res
      .filter(([_, v]) => v !== null)
      .map(([k, v]) => [k, v as unknown as T]);
  },
};

// Guard: don't call createAppKit with an empty projectId — it will crash
export const appKit = projectId
  ? createAppKit({
      projectId,
      metadata,
      networks: [mainnet, polygon, arbitrum],
      adapters: [new EthersAdapter()],
      defaultNetwork: mainnet,
      storage: storageAdapter,
    })
  : null;
