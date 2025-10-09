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

interface RefuelCardProps {}

type TransactionStatus = "idle" | "quoting" | "executing" | "success" | "error";

const CHAINS = [
  { id: "ethereum", name: "Ethereum", icon: "⟠" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔷" },
  { id: "optimism", name: "Optimism", icon: "🔴" },
  { id: "polygon", name: "Polygon", icon: "🟣" },
  { id: "starknet", name: "Starknet", icon: "⭐" },
  { id: "base", name: "Base", icon: "🔵" },
];

const TOKENS = [
  { id: "usdc", name: "USDC", icon: "💵" },
  { id: "usdt", name: "USDT", icon: "💲" },
  { id: "eth", name: "ETH", icon: "⟠" },
  { id: "dai", name: "DAI", icon: "🪙" },
];

export const RefuelCard = ({}: RefuelCardProps) => {
  const [sourceChain, setSourceChain] = useState("");
  const [token, setToken] = useState("");
  const [targetChain, setTargetChain] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("idle");

  const handleRefuel = async () => {
    if (!sourceChain || !token || !targetChain || !targetAddress || !amount) {
      setStatus("error");
      return;
    }

    // Simulate transaction flow
    setStatus("quoting");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("executing");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
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
            <span>Executing crosschain refuel...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Refuel successful! ✅</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Please fill all fields ❌</span>
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
          <Select value={sourceChain} onValueChange={setSourceChain}>
            <SelectTrigger id="source-chain" className="glass-card border-border h-12">
              <SelectValue placeholder="Select source chain" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border">
              {CHAINS.map((chain) => (
                <SelectItem key={chain.id} value={chain.id} className="hover:bg-muted/50">
                  <span className="flex items-center gap-2">
                    <span>{chain.icon}</span>
                    <span>{chain.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Token Selector */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-foreground font-medium">
            Pay With
          </Label>
          <Select value={token} onValueChange={setToken}>
            <SelectTrigger id="token" className="glass-card border-border h-12">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border">
              {TOKENS.map((token) => (
                <SelectItem key={token.id} value={token.id} className="hover:bg-muted/50">
                  <span className="flex items-center gap-2">
                    <span>{token.icon}</span>
                    <span>{token.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <SelectTrigger id="target-chain" className="glass-card border-border h-12">
              <SelectValue placeholder="Select target chain" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border">
              {CHAINS.map((chain) => (
                <SelectItem key={chain.id} value={chain.id} className="hover:bg-muted/50">
                  <span className="flex items-center gap-2">
                    <span>{chain.icon}</span>
                    <span>{chain.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Address */}
        <div className="space-y-2">
          <Label htmlFor="target-address" className="text-foreground font-medium">
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
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-smooth glow-primary"
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
