import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle, Fuel } from "lucide-react";
import { useAccount } from "wagmi";
import {
  MultiChainAssetSelector,
  type MultiChainSelection,
} from "@/components/MultiChainAssetSelector";
import type {
  BridgeParams,
  BridgeResult,
  NexusSDK,
  UserAsset,
} from "@avail-project/nexus-core";

type TransactionStatus = "idle" | "quoting" | "executing" | "success" | "error";

const SUPPORTED_TOKENS = new Set(["eth", "usdc", "usdt"]);

export const RefuelCard = ({
  balanceData,
  sdk,
}: {
  balanceData: UserAsset[] | null;
  sdk: NexusSDK | null;
}) => {
  const { address } = useAccount();

  const [sourceSelection, setSourceSelection] =
    useState<MultiChainSelection | null>(null);
  const [targetChain, setTargetChain] = useState("");
  const [targetAddress, setTargetAddress] = useState(address || "");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transactionUrl, setTransactionUrl] = useState<string>("");

  // Derive all chains from the balance data
  const getAllChains = () => {
    if (!balanceData) return [];

    const chainMap = new Map();

    balanceData.forEach((token) => {
      token.breakdown.forEach((breakdown) => {
        const chainKey = `${breakdown.chain.id}`;
        if (!chainMap.has(chainKey)) {
          chainMap.set(chainKey, {
            id: breakdown.chain.id.toString(),
            name: breakdown.chain.name,
            logo: breakdown.chain.logo,
          });
        }
      });
    });

    return Array.from(chainMap.values());
  };

  const handleRefuel = async () => {
    if (!sourceSelection || !targetChain || !targetAddress || !amount) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields");
      return;
    }

    const normalizedToken = sourceSelection.assetSymbol?.toLowerCase?.() ?? "";
    if (!SUPPORTED_TOKENS.has(normalizedToken)) {
      setStatus("error");
      setErrorMessage("Selected asset is not supported");
      return;
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setStatus("error");
      setErrorMessage("Enter a valid amount");
      return;
    }

    // Validate target address format
    if (!targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setStatus("error");
      setErrorMessage("Enter a valid wallet address");
      return;
    }

    try {
      // Clear previous error messages
      setErrorMessage("");
      setTransactionUrl("");

      // Check if SDK is initialized
      if (!sdk.isInitialized()) {
        setStatus("error");
        setErrorMessage(
          "Nexus SDK is not initialized. Please connect your wallet"
        );
        console.error("Nexus SDK is not initialized");
        return;
      }

      setStatus("quoting");

      // Prepare bridge parameters according to the API
      const bridgeParams: BridgeParams = {
        token: sourceSelection.assetSymbol.toUpperCase() as any, // Convert to supported token format
        amount: numAmount,
        chainId: parseInt(targetChain) as any, // Target chain ID
        // sourceChains is optional - SDK will automatically select optimal source
      };

      // First simulate the bridge to get quote information
      const simulation = await sdk.simulateBridge(bridgeParams);
      console.log("Bridge simulation:", simulation);

      setStatus("executing");

      // Execute the actual bridge transaction
      const result: BridgeResult = await sdk.bridge(bridgeParams);

      if (result.success) {
        setStatus("success");
        console.log("Bridge successful:", result);
        if (result.explorerUrl) {
          setTransactionUrl(result.explorerUrl);
          console.log("Transaction URL:", result.explorerUrl);
        }
        // Reset form after successful transaction
        setTimeout(() => {
          setStatus("idle");
          setSourceSelection(null);
          setTargetChain("");
          setAmount("");
          setTransactionUrl("");
        }, 5000); // Extended timeout to allow user to see the success message
      } else {
        setStatus("error");
        setErrorMessage("Bridge transaction failed. Please try again");
        console.error("Bridge failed");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error: any) {
      setStatus("error");
      const errorMsg =
        error?.message ||
        "Bridge transaction failed. Check your network connection and try again";
      setErrorMessage(errorMsg);
      console.error("Bridge transaction failed:", error);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "quoting":
        return (
          <div className="flex items-center gap-2 text-accent">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching best quote...</span>
          </div>
        );
      case "executing":
        return (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Executing cross-chain bridge...</span>
          </div>
        );
      case "success":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Bridge completed! ✅</span>
            </div>
            {transactionUrl && (
              <div className="text-sm">
                <a
                  href={transactionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  View transaction details &gt;
                </a>
              </div>
            )}
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>
              {errorMessage || "Something went wrong. Please try again"} ❌
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 w-full max-w-lg transition-smooth hover:glow-primary">
      <div className="space-y-6">
        {/* Source Chain */}
        <div className="space-y-2">
          <Label htmlFor="source-chain" className="text-foreground font-medium">
            Source Chain
          </Label>
          <MultiChainAssetSelector
            assetsData={balanceData}
            value={sourceSelection}
            onSelect={setSourceSelection}
            disabled={!balanceData || balanceData.length === 0}
            placeholder="Select source asset and chain"
            triggerId="source-chain"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground font-medium">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="glass-card border-border h-12 text-lg"
          />
        </div>

        {/* Target Chain */}
        <div className="space-y-2">
          <Label htmlFor="target-chain" className="text-foreground font-medium">
            Target Chain
          </Label>
          <Select value={targetChain} onValueChange={setTargetChain}>
            <SelectTrigger
              id="target-chain"
              className="glass-card border-border h-12"
            >
              <SelectValue placeholder="Select target chain" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border">
              {getAllChains().map((chain) => (
                <SelectItem
                  key={chain.id}
                  value={chain.id}
                  className="hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <img
                      src={chain.logo}
                      alt={chain.name}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{chain.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Address */}
        <div className="space-y-2">
          <Label
            htmlFor="target-address"
            className="text-foreground font-medium"
          >
            Target Wallet Address
          </Label>
          <Input
            id="target-address"
            type="text"
            placeholder="0x..."
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="glass-card border-border h-12 font-mono text-sm"
          />
        </div>

        {/* Refuel Button */}
        <Button
          onClick={handleRefuel}
          disabled={status === "quoting" || status === "executing"}
          className="w-full h-14 text-lg font-semibold hover:opacity-90 transition-smooth glow-primary"
        >
          {status === "quoting" || status === "executing" ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Fuel className="h-5 w-5 mr-2" />
          )}
          Refuel Gas
        </Button>

        {/* Status Display */}
        {status !== "idle" && (
          <div className="mt-4 p-4 glass-card rounded-xl border border-border">
            {getStatusDisplay()}
          </div>
        )}
      </div>
    </div>
  );
};
