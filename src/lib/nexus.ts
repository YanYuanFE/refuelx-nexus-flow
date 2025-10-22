import { NexusSDK } from "@avail-project/nexus-core";

export type NexusNetwork = "testnet" | "mainnet";

export interface NexusSdkConfig {
  network?: NexusNetwork;
  debug?: boolean;
}

// Default SDK instance used when a dedicated instance is not supplied.
export const sdk = new NexusSDK({ network: "testnet" });

export function createNexusSdk(config: NexusSdkConfig = {}) {
  const { network = "testnet", debug = false } = config;
  return new NexusSDK({ network, debug });
}

export function isInitialized(targetSdk: NexusSDK = sdk) {
  return targetSdk.isInitialized();
}

export async function initializeWithProvider(
  provider: any,
  targetSdk: NexusSDK = sdk
) {
  if (!provider)
    throw new Error("No EIP-1193 provider (e.g., MetaMask) found");

  if (targetSdk.isInitialized()) return;

  await targetSdk.initialize(provider);
}

export async function deinit(targetSdk: NexusSDK = sdk) {
  if (!targetSdk.isInitialized()) return;

  await targetSdk.deinit();
}

export async function getUnifiedBalances(targetSdk: NexusSDK = sdk) {
  return await targetSdk.getUnifiedBalances();
}
