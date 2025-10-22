import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { globalConfig } from "@/constants";
import { useNetworkStore } from "@/hooks/useStore";
import { NexusProvider } from "@/providers/NexusProvider";

const chains = globalConfig.chainList;

export const wagmiConfig = getDefaultConfig({
  appName: "Web3 Club",
  projectId: "6b037f0da1f5fe47510a11cbdb5bca85",
  chains: chains as any,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const network = useNetworkStore((state) => state.network);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NexusProvider
            config={{
              debug: true, // true to view debug logs
              network: network, // "mainnet" (default) or "testnet"
            }}
          >
            {children}
          </NexusProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
