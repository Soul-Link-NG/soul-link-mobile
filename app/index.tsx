import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
    const { token, user, isLoading } = useAuth();

    if (isLoading) return null;

    if (!token) {
        return <Redirect href="/(auth)/landing" />;
    }

    if (!user?.profileCompleted) {
        return <Redirect href="/onboarding/setup" />;
    }

    return <Redirect href="/(tabs)" />;
}
