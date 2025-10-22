import { useMemo, useState } from "react";
import type { UserAsset } from "@avail-project/nexus-core";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiChainSelection {
  assetSymbol: string;
  chainId: number;
  chainName: string;
  assetIcon?: string;
  chainLogo?: string;
  balance: string;
  balanceInFiat: number;
}

interface MultiChainAssetSelectorProps {
  assetsData?: UserAsset[] | null;
  value?: MultiChainSelection | null;
  onSelect?: (selection: MultiChainSelection) => void;
  placeholder?: string;
  disabled?: boolean;
  triggerId?: string;
}

const SUPPORTED_SYMBOLS = new Set(["ETH", "USDC", "USDT"]);

const formatBalance = (balance: string) => {
  const parsed = Number(balance);
  if (!Number.isFinite(parsed)) return "0";
  if (parsed >= 1) {
    return parsed.toFixed(4);
  }
  return parsed.toPrecision(3);
};

const formatFiat = (amount: number) => {
  if (!Number.isFinite(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount < 1 ? 4 : 2,
  }).format(amount);
};

export function MultiChainAssetSelector({
  assetsData,
  value,
  onSelect,
  placeholder = "Select source asset and chain",
  disabled,
  triggerId,
}: MultiChainAssetSelectorProps) {
  const [open, setOpen] = useState(false);

  const assetGroups = useMemo(() => {
    return (
      assetsData
        ?.filter((asset) =>
          SUPPORTED_SYMBOLS.has(asset.symbol?.toUpperCase?.() ?? "")
        )
        .map((asset) => ({
          asset,
          chains: asset.breakdown ?? [],
          totalBalance: Number(asset.balance ?? 0),
          totalFiat: asset.balanceInFiat ?? 0,
        })) ?? []
    );
  }, [assetsData]);

  const selectedEntry = useMemo(() => {
    if (!value) return null;
    for (const group of assetGroups) {
      if (group.asset.symbol !== value.assetSymbol) continue;
      const match = group.chains.find(
        (chainItem) => chainItem.chain.id === value.chainId
      );
      if (match) {
        return {
          asset: group.asset,
          chain: match,
        };
      }
    }
    return null;
  }, [assetGroups, value]);

  const handleSelect = (
    asset: UserAsset,
    chain: UserAsset["breakdown"][number]
  ) => {
    const selection: MultiChainSelection = {
      assetSymbol: asset.symbol,
      assetIcon: asset.icon,
      chainId: chain.chain.id,
      chainName: chain.chain.name,
      chainLogo: chain.chain.logo,
      balance: chain.balance,
      balanceInFiat: chain.balanceInFiat,
    };

    onSelect?.(selection);
    setOpen(false);
  };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={triggerId}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between gap-2",
            !selectedEntry && "text-muted-foreground"
          )}
        >
          {selectedEntry ? (
            <div className="flex items-center gap-3 truncate">
              {selectedEntry.asset.icon && (
                <img
                  src={selectedEntry.asset.icon}
                  alt={selectedEntry.asset.symbol}
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium leading-none">
                  {selectedEntry.asset.symbol}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {selectedEntry.chain.chain.name}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatBalance(selectedEntry.chain.balance)} •{" "}
                  {formatFiat(selectedEntry.chain.balanceInFiat)}
                </span>
              </div>
            </div>
          ) : (
            <span className="truncate text-sm">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[448px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search assets or chains" />
          <CommandList>
            <CommandEmpty>No matching assets</CommandEmpty>
            {assetGroups.map(({ asset, chains, totalBalance, totalFiat }) => (
              <CommandGroup
                key={asset.symbol}
                heading={`${asset.symbol} · ${formatBalance(
                  totalBalance.toString()
                )} · ${formatFiat(totalFiat)}`}
              >
                {chains.map((chainItem) => {
                  const disabledChain = Number(chainItem.balance) <= 0;
                  const isSelected =
                    value?.assetSymbol === asset.symbol &&
                    value?.chainId === chainItem.chain.id;
                  return (
                    <CommandItem
                      key={`${asset.symbol}-${chainItem.chain.id}`}
                      value={`${asset.symbol}-${chainItem.chain.name}-${chainItem.chain.id}`}
                      disabled={disabledChain}
                      onSelect={() => handleSelect(asset, chainItem)}
                      className="flex items-center gap-3"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        {chainItem.chain.logo && (
                          <img
                            src={chainItem.chain.logo}
                            alt={chainItem.chain.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        )}
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium leading-none">
                            {chainItem.chain.name}
                          </span>
                          {/* <span className="text-xs text-muted-foreground">
                            Chain ID: {chainItem.chain.id}
                          </span> */}
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span>{formatBalance(chainItem.balance)}</span>
                        <span>{formatFiat(chainItem.balanceInFiat)}</span>
                      </div>
                      {isSelected && (
                        <Check className="ml-2 h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
