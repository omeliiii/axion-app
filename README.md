<div align="center">

# ⚡ Axion Leagues

### On-Chain Gamification Platform on Cosmos

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Cosmos SDK](https://img.shields.io/badge/Cosmos_SDK-CosmJS-2E3148?style=for-the-badge&logo=cosmos&logoColor=white)](https://cosmos.network/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Zero-loss competitive leagues where your entry ticket is always refunded.**  
Participate, earn points through on-chain actions, climb leaderboards, and win crypto rewards — all without risking your principal.

[Live Demo](https://axionleagues.com) · [Report Bug](https://github.com/OutOfBounds-Lab/axion-app/issues) · [Request Feature](https://github.com/OutOfBounds-Lab/axion-app/issues)

</div>

---

## 🎯 Value Proposition

Traditional competitions require risking your capital. **Axion Leagues** pioneered a zero-loss model on the Cosmos ecosystem: participants lock an entry ticket that generates yield during the league, and the yield funds the prize pool. At the end, everyone gets their ticket back — winners take the rewards.

## ✨ Features

- **Multi-Wallet Authentication** — Keplr, Leap, Sonar (via QR), XDEFI, MetaMask Snap
- **On-Chain Leagues** — Smart contract-powered competitions with transparent rules
- **Real-Time Leaderboards** — Paginated standings with live score tracking
- **Zero-Loss Model** — Entry tickets are refunded; only yield is distributed as prizes
- **Referral System** — On-chain referral codes with reward claiming
- **Booster NFTs** — Performance multipliers tied to on-chain assets
- **Angel Donations** — Support leagues by donating to the prize pool
- **i18n Ready** — Full internationalization with server/client translation support
- **Responsive Design** — Mobile-first UI with Tailwind CSS

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router (i18n routes)
│   ├── [lng]/              # Language-prefixed routes
│   │   ├── league/[id]/    # Dynamic league detail pages
│   │   └── page.tsx        # Home page (SSR)
│   ├── api/                # API routes
│   └── i18n/               # Translation setup & locale files
├── components/             # Presentational components
│   ├── buttons/            # Action buttons & wallet sign-in
│   ├── cards/              # Content cards (league, referral, booster)
│   ├── composites/         # Composed layouts
│   ├── navigation/         # Header, footer, navbar
│   └── overlays/           # Modals, toasts, disclaimers
├── contexts/               # React Context providers
│   └── adapterProvider     # Cosmos wallet adapter (Tendermint client, RPC)
├── hooks/                  # Custom React hooks
│   └── contracts/          # Smart contract interaction hooks
├── model/                  # TypeScript domain models
└── redux/                  # State management
    ├── slices/             # Feature slices + RTK Query endpoints
    └── store.ts            # Store configuration
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **RTK Query** for API layer | Automatic caching, request deduplication, and optimistic updates |
| **Typed Wallet Context** | Single source of truth for wallet state, typed with `Wallet` interface |
| **Options Object pattern** | Contract interactions use `PerformActionOptions` instead of positional args |
| **Server Components** | Pages are RSC by default; only interactive widgets use `"use client"` |
| **camelCase ↔ snake_case** | Automatic bidirectional transform at the API boundary layer |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **UI** | React 18, Tailwind CSS 3.4 |
| **State** | Redux Toolkit + RTK Query |
| **Blockchain** | CosmJS, kujira.js, Keplr Wallet Types |
| **i18n** | i18next + react-i18next |
| **Charts** | Recharts |
| **Virtualization** | react-virtualized |
| **QR Codes** | react-qr-rounded |

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm**, **yarn**, **pnpm**, or **bun**
- A Cosmos-compatible wallet extension (Keplr, Leap, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/OutOfBounds-Lab/axion-app.git
cd axion-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server on port 8000 |
| `npm run lint` | Run ESLint checks |
| `npm run tsc` | Run TypeScript type checking |
| `npm run pretty` | Format code with Prettier |

## 🔧 Environment Variables

See [`.env.example`](.env.example) for all available configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API endpoint | `http://localhost:4002/api/v1` |
| `NEXT_PUBLIC_ENV` | Environment name | `development` |
| `NEXT_PUBLIC_LOG_LEVEL` | Logging verbosity | `debug` |
| `NEXT_PUBLIC_NETWORK` | Kujira chain network ID | `pond-1` |
| `NEXT_PUBLIC_DISPLAY_NETWORK` | Human-readable network label | `local (pond-1)` |

## 🗺️ Roadmap

- [ ] **Governance Module** — On-chain voting for league parameters
- [ ] **Multi-Chain Support** — Extend beyond Kujira to Osmosis, Cosmos Hub
- [ ] **Achievement System** — NFT badges for milestones
- [ ] **Social Features** — In-app messaging and team leagues
- [ ] **Analytics Dashboard** — Historical performance tracking with charts
- [ ] **Mobile App** — React Native companion app with WalletConnect
- [ ] **SDK** — Open-source SDK for third-party league creation

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

Built with ❤️ by [OutOfBounds Lab](https://github.com/OutOfBounds-Lab)

</div>
