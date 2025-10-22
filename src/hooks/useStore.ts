import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NetworkType = "testnet" | "mainnet";

interface NetworkState {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      network: "testnet",
      setNetwork: (network: NetworkType) => set({ network }),
    }),
    {
      name: "refuelx-storage", // name of the item in the storage (must be unique)
    }
  )
);
