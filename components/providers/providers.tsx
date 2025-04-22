"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  midnightTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import farcasterFrame from "@farcaster/frame-wagmi-connector";
// import {
//   rainbowWallet,
//   walletConnectWallet,
// } from "@rainbow-me/rainbowkit/wallets";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TARGET_CHAIN } from "@/lib/constants";
import { base, sepolia } from "viem/chains";
import { FrameProvider } from "./frame-provider";

// const config = getDefaultConfig({
//   appName: "casual fridays",
//   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "",
//   chains: [TARGET_CHAIN],
//   transports: {
//     [TARGET_CHAIN.id]: http(),
//   },
//   // connectors: [farcasterFrame(), injected()],
//   wallets: [farcasterFrame, rainbowWallet],

//   ssr: true, // If your dApp uses server side rendering (SSR)
// });

export const config = createConfig({
  chains: [TARGET_CHAIN],
  transports: {
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "",
    }),
  ],
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FrameProvider>
          <RainbowKitProvider
            modalSize="compact"
            theme={midnightTheme({
              accentColor: "#d25c41",
              borderRadius: "small",
              fontStack: "system",
            })}
          >
            {children}
          </RainbowKitProvider>
        </FrameProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
