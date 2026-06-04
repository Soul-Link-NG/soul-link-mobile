import { api } from './api';

/**
 * Wallet-based authentication service using AppKit (WalletConnect v2)
 * 
 * Flow:
 * 1. Request nonce from backend: GET /auth/wallet/nonce?address=0x...
 * 2. Sign nonce with wallet via WalletConnect provider
 * 3. Verify signature: POST /auth/wallet/verify { address, signature, nonce }
 * 4. Backend returns JWT token and user profile
 */

export interface WalletAuthResponse {
  token: string;
  user: {
    id: string;
    walletAddress: string;
    username: string;
    displayName: string;
    email?: string;
    profileCompleted: boolean;
    walletChainId?: number;
  };
}

/**
 * Get a nonce to sign from the backend
 */
export const getWalletNonce = async (address: string, chainId?: number): Promise<string> => {
  try {
    const response = await api.get('/auth/wallet/nonce', {
      params: { 
        address,
        ...(chainId && { chainId })
      },
    });
    return response.data.nonce;
  } catch (error: any) {
    console.error('Failed to get wallet nonce:', error);
    throw new Error(error.response?.data?.message || 'Failed to get nonce');
  }
};

/**
 * Sign a message using AppKit provider (WalletConnect session)
 * 
 * This sends a personal_sign request to the connected wallet app
 * through the WalletConnect bridge
 */
export const signWalletMessage = async (
  provider: any,
  message: string,
  address: string
): Promise<string> => {
  try {
    if (!provider) {
      throw new Error('No wallet provider available');
    }

    // Convert message to hex if it's a string
    const hexMessage = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    
    // Use personal_sign via the WalletConnect provider
    const signature = await provider.send('personal_sign', [hexMessage, address]);
    
    return signature;
  } catch (error: any) {
    console.error('Failed to sign message:', error);
    throw new Error(error.message || 'Failed to sign message with wallet');
  }
};

/**
 * Verify the signed message on the backend and get auth token
 */
export const verifyWalletSignature = async (
  address: string,
  signature: string,
  nonce: string,
  chainId?: number
): Promise<WalletAuthResponse> => {
  try {
    const response = await api.post('/auth/wallet/verify', {
      address,
      signature,
      nonce,
      ...(chainId && { chainId })
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to verify wallet signature:', error);
    throw new Error(
      error.response?.data?.message || 'Wallet verification failed'
    );
  }
};

/**
 * Complete wallet login flow using AppKit provider
 * 
 * @param address - Connected wallet address
 * @param provider - AppKit provider from WalletConnect session
 * @param chainId - Current chain ID (optional)
 */
export const walletLogin = async (
  address: string,
  provider: any,
  chainId?: number
): Promise<WalletAuthResponse> => {
  try {
    if (!address) {
      throw new Error('Wallet address is required');
    }

    if (!provider) {
      throw new Error('Wallet provider is not available. Please connect your wallet first.');
    }

    // 1. Get nonce from backend
    const nonce = await getWalletNonce(address, chainId);

    // 2. Sign nonce with wallet via WalletConnect
    const signature = await signWalletMessage(provider, nonce, address);

    // 3. Verify signature and get token
    const authResponse = await verifyWalletSignature(address, signature, nonce, chainId);

    return authResponse;
  } catch (error: any) {
    console.error('Wallet login failed:', error);
    throw error;
  }
};
