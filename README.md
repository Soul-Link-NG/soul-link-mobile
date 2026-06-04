# SoulLink Mobile

The mobile app is SoulLink’s primary Web3 client. It is built with Expo and React Native, and it uses WalletConnect v2 through Reown AppKit to connect Trust Wallet, Bybit, Phantom, MetaMask, and other mobile wallets.

## Overview

SoulLink Mobile is designed as a Web3-first experience: wallet login only, wallet-backed identity, and secure off-chain authentication. It does not rely on `window.ethereum` or injected browser providers.

## Technologies

- Expo
- React Native
- TypeScript
- `@reown/appkit-react-native` for WalletConnect v2
- `@walletconnect/react-native-compat`
- `expo-router`
- `expo-secure-store`
- `axios`
- `nativewind` / Tailwind CSS for styling
- `lucide-react-native` for icons

## Setup

### Prerequisites

- Node.js 18+ or compatible version
- npm
- Expo CLI: `npm install -g expo-cli`
- Expo Dev Client installed on your device or simulator
- Wallet app on your phone: Trust Wallet, Bybit Wallet, Phantom, or MetaMask Mobile

### Install dependencies

```bash
cd mobile
npm install
```

### Environment

Copy the example environment file and set your runtime values:

```bash
cd mobile
cp .env.example .env.local
```

Update `.env.local`:

```env
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
EXPO_PUBLIC_API_URL=http://localhost:4000
```

If testing on a physical device, use your computer’s local IP address instead of `localhost`:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:4000
```

### Get a WalletConnect Project ID

SoulLink Mobile requires a WalletConnect Project ID from Reown:

1. Open [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID into `.env.local`

> Note: `cloud.walletconnect.com` redirects to Reown, so this is the official path for the mobile wallet bridge.

### Run the app

```bash
npm run dev
```

If Expo asks for native config plugins, run:

```bash
npx expo prebuild
```

## Important files

- `src/config/appkit.config.ts` — Reown AppKit setup and storage adapter
- `src/context/Web3Context.tsx` — wallet connection state and persistence
- `src/services/walletAuth.ts` — nonce-based wallet login flow
- `src/services/api.ts` — Axios client and JWT auth interceptor
- `app/(auth)/wallet-connect.tsx` — wallet connect UI and login actions
- `.env.local` — runtime environment settings

## WalletConnect flow

1. User taps Connect Wallet
2. AppKit opens the wallet selector
3. User selects a wallet app
4. The wallet app opens via deep link
5. User approves connection
6. App signs the nonce from the backend
7. API verifies the signature and returns JWT + user profile

## Scripts

- `npm run dev` — start Expo Dev Client
- `npm start` — start standard Expo server
- `npm run build:dev` — build via EAS for Android development

## Notes for maintainers

- Do not use `window.ethereum` or browser-only provider assumptions in mobile code.
- Wallet signing must happen through AppKit / WalletConnect.
- Keep project ID logic in `src/config/appkit.config.ts`.
- Keep auth token persistence in `expo-secure-store`.
- Sync `EXPO_PUBLIC_API_URL` with the running backend.
- Document new environment variables in `.env.example`.

## Troubleshooting

### WalletConnect project ID error

- Make sure `EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID` is set.
- Create the project in Reown / WalletConnect dashboard.
- Restart the app after updating `.env.local`.

### API connection fails

- Confirm the API server is running.
- Use your machine IP for physical devices.
- Check `mobile/src/services/api.ts` for the correct base URL.

### Connection modal does not appear

- Confirm a compatible wallet is installed.
- Relaunch Expo Dev Client.
- Verify `@reown/appkit-react-native` is installed and configured.
