import { Sparkles } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
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

        {/* Connect Wallet Button */}
        <ConnectButton />
      </div>
    </header>
  );
};
