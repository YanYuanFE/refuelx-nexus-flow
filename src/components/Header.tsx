import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sparkles } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useAccount } from "wagmi";
import { useNexus } from "@/providers/NexusProvider";
import { useEffect } from "react";

interface HeaderProps {
  network: string;
  switchNetwork: (network: string) => void;
  isInitialized: boolean;
}

export const Header = ({
  network,
  switchNetwork,
  isInitialized,
}: HeaderProps) => {
  const { connector, isConnected } = useAccount();
  const { setProvider } = useNexus();

  useEffect(() => {
    console.log(isConnected, connector?.getProvider);
    if (isConnected && connector?.getProvider) {
      connector.getProvider().then(setProvider);
    }
  }, [isConnected, connector, setProvider]);

  const handleNetworkSwitch = (checked: boolean) => {
    const newNetwork = checked ? "mainnet" : "testnet";
    switchNetwork(newNetwork);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-accent animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            RefuelX
          </h1>
          <Sparkles className="h-7 w-7 text-primary animate-pulse" />
        </div>

        {/* Network Switch and Connect Wallet */}
        <div className="flex items-center gap-4">
          {/* Network Switch */}
          <div className="flex items-center gap-2">
            <Label htmlFor="network-switch" className="text-sm font-medium">
              Testnet
            </Label>
            <Switch
              id="network-switch"
              checked={network === "mainnet"}
              onCheckedChange={handleNetworkSwitch}
              disabled={!isInitialized}
            />
            <Label htmlFor="network-switch" className="text-sm font-medium">
              Mainnet
            </Label>
          </div>

          {/* Connect Wallet Button */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
