import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Wallet, ArrowLeft, X, CheckCircle2 } from "lucide-react-native";
import { useWeb3 } from "../../src/context/Web3Context";
import { useAuth } from "../../src/context/AuthContext";
import { walletLogin } from "../../src/services/walletAuth";
import Toast from "react-native-toast-message";

export default function WalletConnectScreen() {
  const router = useRouter();
  const {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    chainName,
    chainId,
  } = useWeb3();
  const { loginWithWallet } = useAuth();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      Toast.show({
        type: "success",
        text1: "Connected",
        text2: "Wallet connected successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Connection Failed",
        text2: error.message || "Unable to connect wallet",
      });
    }
  };

  const handleLogin = async () => {
    if (!address) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Wallet not connected",
      });
      return;
    }

    setIsAuthenticating(true);
    try {
      // Call walletLogin which handles the full auth flow
      const authResponse = await walletLogin(address, chainId);

      // Store auth token and user
      await loginWithWallet(authResponse.token, authResponse.user);

      // Show success modal
      setIsSuccess(true);
      setShowSuccessModal(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace("/(tabs)");
      }, 2000);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "Failed to authenticate with wallet",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setIsSuccess(false);
      Toast.show({
        type: "success",
        text1: "Disconnected",
        text2: "Wallet disconnected",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to disconnect wallet",
      });
    }
  };

  return (
    <View className="flex-1 bg-[#05070A]">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-8"
        >
          {/* Header */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 mb-10 w-12 h-12 bg-white/5 items-center justify-center rounded-full"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-white text-4xl font-bold mb-2">
            Connect Your Wallet
          </Text>
          <Text className="text-slate-400 text-lg mb-12">
            Own your identity with Web3. Sign in with your wallet to begin your
            soul journey.
          </Text>

          {/* Wallet Icon */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-[#5EEAD4]/20 items-center justify-center mb-6">
              <Wallet color="#5EEAD4" size={40} />
            </View>
          </View>

          {/* Status Display */}
          {address && isConnected ? (
            <>
              {/* Connected State */}
              <View className="bg-[#5EEAD4]/10 border border-[#5EEAD4] rounded-3xl p-6 mb-8">
                <View className="flex-row items-center mb-4">
                  <CheckCircle2 color="#5EEAD4" size={24} />
                  <Text className="text-[#5EEAD4] font-bold text-lg ml-3">
                    Wallet Connected
                  </Text>
                </View>
                <Text className="text-white font-mono text-sm mb-2">
                  {address.substring(0, 6)}...
                  {address.substring(address.length - 4)}
                </Text>
                {chainName && (
                  <Text className="text-slate-400 text-xs">
                    Network: {chainName}
                  </Text>
                )}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isAuthenticating}
                className={`py-5 rounded-3xl mb-4 flex-row items-center justify-center ${
                  isAuthenticating ? "bg-[#5EEAD4]/50" : "bg-[#5EEAD4]"
                }`}
              >
                {isAuthenticating ? (
                  <>
                    <ActivityIndicator
                      color="#05070A"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-[#05070A] font-bold text-lg">
                      Signing in...
                    </Text>
                  </>
                ) : (
                  <Text className="text-[#05070A] font-bold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Disconnect Button */}
              <TouchableOpacity
                onPress={handleDisconnect}
                className="py-4 rounded-3xl border border-white/10 bg-white/5"
              >
                <Text className="text-white text-center font-semibold">
                  Disconnect Wallet
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Not Connected State */}
              <Text className="text-slate-400 text-center mb-8 text-base leading-relaxed">
                To sign in with Web3, you'll need a wallet installed on your
                device:
              </Text>

              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
                <Text className="text-white font-semibold mb-2">
                  ✅ Supported Wallets:
                </Text>
                <Text className="text-slate-300 text-sm mb-1">
                  • Trust Wallet
                </Text>
                <Text className="text-slate-300 text-sm mb-1">• Phantom</Text>
                <Text className="text-slate-300 text-sm mb-1">
                  • Bybit Wallet
                </Text>
                <Text className="text-slate-300 text-sm">• MetaMask</Text>
              </View>

              {/* Connect Button */}
              <TouchableOpacity
                onPress={handleConnectWallet}
                className={`py-5 rounded-3xl flex-row items-center justify-center mb-8 bg-[#5EEAD4]`}
              >
                <Wallet color="#05070A" size={24} style={{ marginRight: 8 }} />
                <Text className="text-[#05070A] font-bold text-lg">
                  Connect Wallet
                </Text>
              </TouchableOpacity>

              {/* Alternative Link */}
              <View className="flex-row justify-center">
                <Text className="text-slate-400 text-base">New to Web3? </Text>
                <TouchableOpacity
                  onPress={() => {
                    Toast.show({
                      type: "info",
                      text1: "Get Started",
                      text2: "Download Trust Wallet, Phantom, or Bybit Wallet",
                    });
                  }}
                >
                  <Text className="text-[#5EEAD4] font-bold text-base">
                    Learn more
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 bg-black/80 items-center justify-center px-6">
          <View className="bg-[#0F1219] rounded-3xl p-8 border border-white/10 w-full items-center">
            <View className="w-16 h-16 rounded-full bg-[#5EEAD4]/20 items-center justify-center mb-6">
              <CheckCircle2 color="#5EEAD4" size={40} fill="#5EEAD4" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2 text-center">
              Welcome Back!
            </Text>
            <Text className="text-slate-400 text-center">
              Your wallet is authenticated. Redirecting...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
