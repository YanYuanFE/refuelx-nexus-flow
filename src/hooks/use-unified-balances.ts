import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useNexusSDK } from './use-nexus-sdk';

// Original SDK response shape
interface UnifiedBalance {
  chainId: number;
  balance: string;
  // Adjust according to the actual SDK response when available
}

// Desired shape for RefuelCard
interface BalanceData {
  abstracted?: boolean;
  balance: string;
  balanceInFiat: number;
  breakdown: Array<{
    balance: string;
    balanceInFiat: number;
    chain: {
      id: number;
      logo: string;
      name: string;
    };
    contractAddress: string;
    decimals: number;
    universe: number;
  }>;
  decimals: number;
  icon: string;
  symbol: string;
}

interface UseUnifiedBalancesOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface UseUnifiedBalancesReturn {
  data: BalanceData[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  balances: BalanceData[] | undefined;
  isLoadingBalances: boolean;
  balancesError: Error | null;
  refetchBalances: () => void;
}

// Transform SDK balances into the RefuelCard shape
function transformUnifiedBalances(rawBalances: any[]): BalanceData[] {
  // Adjust this logic once the final SDK response shape is confirmed
  // Currently returns placeholder data until integration is finalized
  if (!rawBalances || !Array.isArray(rawBalances)) {
    return [];
  }

  // Return as-is if the SDK already matches the expected shape
  if (rawBalances.length > 0 && rawBalances[0].breakdown) {
    return rawBalances as BalanceData[];
  }

  // Otherwise convert (example transformation logic)
  return rawBalances.map((balance: any) => ({
    abstracted: false,
    balance: balance.balance || "0",
    balanceInFiat: 0,
    breakdown: [{
      balance: balance.balance || "0",
      balanceInFiat: 0,
      chain: {
        id: balance.chainId || 1,
        logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", // Default ETH logo
        name: `Chain ${balance.chainId || 1}`,
      },
      contractAddress: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      universe: 0,
    }],
    decimals: 18,
    icon: "⟠",
    symbol: "ETH",
  }));
}

export function useUnifiedBalances(
  options: UseUnifiedBalancesOptions = {}
): UseUnifiedBalancesReturn {
  const { address } = useAccount();
  const { sdk, isInitialized, network } = useNexusSDK();
  
  const {
    enabled = true,
    refetchInterval = 30000, // Refresh every 30 seconds
    staleTime = 10000, // Treat data as fresh for 10 seconds
  } = options;

  const queryResult = useQuery({
    queryKey: ['unified-balances', address, network],
    queryFn: async (): Promise<BalanceData[]> => {
      if (!sdk || !isInitialized) {
        throw new Error('SDK not initialized');
      }
      
      const rawBalances = await sdk.getUnifiedBalances();
      return transformUnifiedBalances(rawBalances);
    },
    enabled: enabled && !!address && !!sdk && isInitialized,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    balances: queryResult.data,
    isLoadingBalances: queryResult.isLoading,
    balancesError: queryResult.error,
    refetchBalances: queryResult.refetch,
  };
}
