import { useState } from "react";
import { useAccount } from "wagmi";
import { NexusSDK, UserAsset } from "@avail-project/nexus-core";
import { useQuery } from "@tanstack/react-query";

export type NetworkType = "testnet" | "mainnet";

interface UseNexusSDKReturn {
  sdk: NexusSDK | null;
  isInitialized: boolean;
  isInitializing: boolean;
  network: NetworkType;
  switchNetwork: (network: NetworkType) => Promise<void>;
  balanceData: UserAsset[] | null;
}

// Create SDK instance
const createSDK = (networkType: NetworkType) => {
  return new NexusSDK({ network: networkType });
};

// Initialize SDK
const initializeSDK = async (network: NetworkType, connector: any) => {
  if (!connector || !connector.getProvider) return;

  try {
    console.log(connector, "cc");
    const provider = await connector.getProvider();
    if (!provider) {
      throw new Error("No EIP-1193 provider (e.g., MetaMask) found");
    }

    // Create a fresh SDK instance
    const newSdk = createSDK(network);

    console.log("newSDK", network, newSdk);
    // Initialize the SDK
    await newSdk.initialize(provider as any);

    return newSdk;
  } catch (err) {
    console.error("Failed to initialize Nexus SDK:", err);
  }
};

export function useNexusSDK(
  initialNetwork: NetworkType = "testnet"
): UseNexusSDKReturn {
  const { connector, address } = useAccount();
  const [network, setNetwork] = useState<NetworkType>(initialNetwork);

  const { data, isLoading } = useQuery({
    queryKey: ["nexus-sdk", network, connector?.id],
    queryFn: () => initializeSDK(network, connector),
    enabled: !!connector,
  });

  console.log(connector, data, "cc");
  const { data: balanceData } = useQuery({
    queryKey: ["unified-balances", network, data],
    queryFn: async () => {
      const rawBalances = await data?.getUnifiedBalances();
      return rawBalances;
    },
    enabled: !!address && !!data && data.isInitialized(),
  });

  // Switch network
  const switchNetwork = async (newNetwork: NetworkType) => {
    if (newNetwork === network) return;

    setNetwork(newNetwork);
    console.log(newNetwork, "newNetwork");
  };

  return {
    sdk: data,
    isInitialized: data?.isInitialized(),
    isInitializing: isLoading,
    network,
    switchNetwork,
    balanceData,
  };
}
