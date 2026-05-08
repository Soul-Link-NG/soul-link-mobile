import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'soul-link-token';
const USER_KEY = 'soul-link-user';

export type User = {
    id: string;
    email: string;
    username: string;
    displayName: string;
    profileCompleted: boolean;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

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

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inOnboarding = segments[0] === 'onboarding';

        if (!token && !inAuthGroup && !inOnboarding) {
            router.replace('/(auth)/landing');
        } else if (token && !user?.profileCompleted && !inOnboarding) {
            router.replace('/onboarding/setup');
        } else if (token && user?.profileCompleted && (inAuthGroup || inOnboarding)) {
            router.replace('/(tabs)');
        }
    }, [token, user, segments, isLoading]);

    const login = async (newToken: string, newUser: User) => {
        try {
            await SecureStore.setItemAsync(TOKEN_KEY, newToken);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.error('Failed to save auth data:', error);
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
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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
