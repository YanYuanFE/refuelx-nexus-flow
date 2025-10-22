import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { NexusSDK } from "@avail-project/nexus-core";
import {
  createNexusSdk,
  deinit as deinitSdk,
  initializeWithProvider,
  type NexusSdkConfig,
} from "@/lib/nexus";

type Eip1193Provider = any;

type NexusContextValue = {
  sdk: NexusSDK | null;
  provider: Eip1193Provider | null;
  isSdkInitialized: boolean;
  initializeSdk: (provider?: Eip1193Provider | null) => Promise<void>;
  deinitializeSdk: () => Promise<void>;
  setProvider: (provider: Eip1193Provider | null) => Promise<void>;
};

const NexusContext = createContext<NexusContextValue | undefined>(undefined);

interface NexusProviderProps {
  config?: NexusSdkConfig;
  children: ReactNode;
}

export const NexusProvider = ({ config, children }: NexusProviderProps) => {
  const network = config?.network ?? "testnet";
  const debug = config?.debug ?? false;

  const [sdk, setSdk] = useState<NexusSDK>(() =>
    createNexusSdk({ network, debug })
  );
  const [provider, setProviderState] = useState<Eip1193Provider | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState<boolean>(
    sdk.isInitialized()
  );

  useEffect(() => {
    setSdk((previous) => {
      if (previous) {
        void previous.deinit?.();
      }
      return createNexusSdk({ network, debug });
    });
    setIsSdkInitialized(false);
  }, [network, debug]);

  useEffect(() => {
    return () => {
      void sdk.deinit?.();
    };
  }, [sdk]);

  const initializeSdk = useCallback(
    async (maybeProvider?: Eip1193Provider | null) => {
      const activeProvider = maybeProvider ?? provider;
      if (!sdk) return;
      if (!activeProvider) {
        throw new Error("Wallet provider not connected.");
      }

      try {
        await initializeWithProvider(activeProvider, sdk);
        setIsSdkInitialized(sdk.isInitialized());
      } catch (error) {
        console.error("Failed to initialize Nexus SDK", error);
        throw error;
      }
    },
    [provider, sdk]
  );

  const deinitializeSdk = useCallback(async () => {
    if (!sdk) return;
    try {
      await deinitSdk(sdk);
    } catch (error) {
      console.error("Failed to deinitialize Nexus SDK", error);
    }
    setIsSdkInitialized(false);
  }, [sdk]);

  const setProvider = useCallback(
    async (nextProvider: Eip1193Provider | null) => {
      if (nextProvider === provider) return;

      setProviderState(nextProvider);

      if (!nextProvider) {
        await deinitializeSdk();
        return;
      }

      try {
        await initializeSdk(nextProvider);
      } catch (error) {
        console.error("Failed to initialize SDK after setting provider", error);
      }
    },
    [deinitializeSdk, initializeSdk, provider]
  );

  useEffect(() => {
    if (!provider || !sdk) return;
    if (sdk.isInitialized()) {
      setIsSdkInitialized(true);
      return;
    }

    void initializeSdk().catch((error) => {
      console.error("Automatic Nexus SDK initialization failed", error);
    });
  }, [initializeSdk, provider, sdk]);

  const value = useMemo(
    () => ({
      sdk,
      provider,
      isSdkInitialized,
      initializeSdk,
      deinitializeSdk,
      setProvider,
    }),
    [sdk, provider, isSdkInitialized, initializeSdk, deinitializeSdk, setProvider]
  );

  return <NexusContext.Provider value={value}>{children}</NexusContext.Provider>;
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error("useNexus must be used within a NexusProvider");
  }
  return context;
};
