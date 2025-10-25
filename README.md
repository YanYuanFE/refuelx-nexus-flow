# RefuelX - Unified Crosschain Gas Aggregator

RefuelX is a crosschain gas aggregator built on Avail Nexus SDK, enabling users to refuel gas on any blockchain using any token.

## 🚀 Features

- **Crosschain Gas Refueling**: Support gas refueling across multiple blockchain networks
- **Multi-Token Support**: Support mainstream tokens like ETH, USDC, USDT
- **Unified Balance Query**: View asset balances across all chains with one click
- **Network Switching**: Seamless switching between mainnet and testnet
- **Modern UI**: Beautiful interface built with shadcn/ui
- **Wallet Integration**: Support multiple wallets through RainbowKit

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Web3 Integration**: 
  - Wagmi v2 (Ethereum interactions)
  - RainbowKit (Wallet connections)
  - Avail Nexus SDK (Crosschain functionality)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## 🌐 Supported Networks

### Mainnet
- Ethereum Mainnet
- Optimism
- Arbitrum
- Polygon
- Avalanche
- Base
- Scroll
- Sophon
- Kaia
- BSC
- HyperEVM

### Testnet
- Optimism Sepolia
- Polygon Amoy
- Arbitrum Sepolia
- Base Sepolia
- Ethereum Sepolia
- Monad Testnet

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Start Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

The application will start at `http://localhost:8080`.

### Build for Production

```bash
# Development build
pnpm build:dev

# Production build
pnpm build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Header.tsx      # Page header component
│   ├── RefuelCard.tsx  # Main refuel card component
│   └── ...
├── hooks/              # Custom React Hooks
│   ├── use-nexus-sdk.ts    # Nexus SDK integration
│   ├── use-unified-balances.ts # Unified balance queries
│   └── ...
├── lib/                # Utility libraries
│   ├── nexus.ts        # Nexus SDK configuration
│   └── utils.ts        # Common utility functions
├── pages/              # Page components
├── providers/          # React Context Providers
├── constants/          # Constant definitions
└── assets/            # Static assets
```

## 🔧 Core Features

### 1. Crosschain Gas Refueling
- Select source and destination chains
- Choose payment token (ETH/USDC/USDT)
- Input refuel amount
- Execute crosschain refueling with one click

### 2. Unified Balance Management
- Real-time query of asset balances across all supported chains
- Display balances for multiple tokens
- Automatic balance refresh

### 3. Network Switching
- Support mainnet/testnet switching
- Persistent state storage
- Automatic configuration adaptation for different networks

## 🎨 UI Features

- **Responsive Design**: Compatible with desktop and mobile devices
- **Dark Theme**: Modern dark interface
- **Animations**: Smooth interaction animations
- **Loading States**: Comprehensive loading and error state handling

## 🔗 Related Links

- [Avail Nexus SDK](https://github.com/availproject/nexus)
- [shadcn/ui](https://ui.shadcn.com/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Issues and Pull Requests are welcome to improve the project!

## 📞 Support

If you encounter any issues while using the project, please:

1. Check the project documentation
2. Search existing Issues
3. Create a new Issue describing the problem

---

**RefuelX** - Making crosschain gas management simple and efficient!
