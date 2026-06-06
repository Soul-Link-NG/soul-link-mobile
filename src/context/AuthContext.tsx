import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'soul-link-token';
const USER_KEY = 'soul-link-user';

export type User = {
    id: string;
    email?: string;
    walletAddress?: string;
    username: string;
    soulId?: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    interests?: string[];
    socialLinks?: Record<string, string>;
    karmaBalance?: number;
    referralCount?: number;
    profileCompleted: boolean;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => Promise<void>;
    loginWithWallet: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider is a PURE state/storage provider.
 * It must NOT use useRouter() or useSegments() because it wraps <Slot /> in
 * the root layout — before expo-router establishes its LinkingContext.
 * Redirect logic belongs in route files (app/index.tsx) which live inside
 * the navigation tree and have access to the LinkingContext.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
            const savedUser = await SecureStore.getItemAsync(USER_KEY);

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error('Failed to load auth data from storage:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const persistUser = async (newToken: string, newUser: User) => {
        try {
            await SecureStore.setItemAsync(TOKEN_KEY, newToken);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.error('Failed to save auth data:', error);
        }
    };

    const login = async (newToken: string, newUser: User) => {
        await persistUser(newToken, newUser);
    };

    const loginWithWallet = async (newToken: string, newUser: User) => {
        // Same as login, but specifically for wallet-based auth
        await persistUser(newToken, newUser);
    };

    const updateUser = async (nextUser: User) => {
        setUser(nextUser);
        if (token) {
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser));
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Failed to clear auth data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, loginWithWallet, logout, setUser: updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
