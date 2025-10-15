import { RefuelCard } from "@/components/RefuelCard";
import { Header } from "@/components/Header";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'var(--gradient-background)',
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-24">
        {/* Description */}
        <div className="text-center mb-12 space-y-4 max-w-3xl">
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Unified Crosschain Gas Aggregator
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Refuel gas on any blockchain using any token. Powered by Avail Nexus SDK, 
            RefuelX makes crosschain gas management seamless and efficient.
          </p>
        </div>

        {/* Main Refuel Card */}
        <RefuelCard />

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Powered by Avail Nexus SDK
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/70">
            <span>Secure</span>
            <span>•</span>
            <span>Fast</span>
            <span>•</span>
            <span>Crosschain</span>
          </div>
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Index;
