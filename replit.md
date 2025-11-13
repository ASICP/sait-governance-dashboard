# SAIT Governance Dashboard

## Overview
This is a React-based governance dashboard for the SAIT Token Ecosystem. It provides real-time metrics, historical data visualization, and 24-month projections for the Aligned Sovereign Intelligence Protocol (ASIP).

**Purpose**: Monitor SAIT token circulation, treasury reserves, buyback analytics, and governance activities through an interactive web dashboard.

**Current State**: The application is fully configured for Replit and running on port 5000. It includes Web3 integration for connecting to Ethereum wallets (MetaMask) and displays both mock data and real blockchain data.

## Recent Changes
- **November 13, 2025**: Initial project import and Replit setup
  - Configured React app to run on port 5000 with host 0.0.0.0
  - Set up workflow for frontend with webview output
  - Created App.css file for basic styling
  - Verified all dependencies installed successfully
  - Application running with minor ESLint warnings (non-critical)

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18.2.0
- **Blockchain Integration**: ethers.js 5.7.2
- **Charts & Visualizations**: Recharts 2.10.3
- **Styling**: Tailwind CSS 3.4.0
- **Build Tool**: Create React App (react-scripts 5.0.1)

### Key Components
1. **App.js**: Main application wrapper with wallet connection logic
2. **GovernanceDashboard.jsx**: Primary dashboard component with metrics, charts, and projections
3. **web3Service.js**: Web3 integration service for blockchain interactions
4. **contractAbis.js**: Smart contract ABI definitions

### File Structure
```
/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   └── GovernanceDashboard.jsx
│   ├── config/       # Configuration files
│   │   └── contractAbis.js
│   ├── services/     # Service layer
│   │   └── web3Service.js
│   ├── App.js        # Main app component
│   ├── App.css       # App-specific styles
│   ├── index.js      # Entry point
│   └── index.css     # Global styles (Tailwind)
├── docs/             # Documentation
├── design/           # Design mockups
├── package.json      # Dependencies and scripts
├── tailwind.config.js
└── postcss.config.js
```

## Configuration

### Development Server
- **Port**: 5000 (required for Replit webview)
- **Host**: 0.0.0.0 (allows external access)
- **Host Check**: Disabled (required for Replit proxy)

### Workflow
- **Name**: React App
- **Command**: `npm start`
- **Output Type**: webview
- **Port**: 5000

### Environment
The application uses environment variables configured in the package.json scripts:
- `PORT=5000`
- `HOST=0.0.0.0`
- `DANGEROUSLY_DISABLE_HOST_CHECK=true`

## Features

### Real-Time Metrics
- SAIT Price tracking with premium ratio to SAT backing
- Market capitalization and % of AI market
- Circulating supply with buyback-adjusted figures
- Treasury value (combined SAIT + SAT holdings)

### Visual Analytics
- Price & circulation history (12-month charts)
- Token allocation pie chart
- Buyback analytics with monthly volumes
- Vault balances for all 4 vaults

### Projections
- 24-month forward-looking projections
- Price, circulation, and reserve forecasts
- Conservative growth modeling based on whitepaper
- Buyback runway sustainability analysis

### Web3 Integration
- MetaMask wallet connection
- Real-time blockchain data fetching
- Support for Ethereum mainnet and testnets
- Fallback to mock data when wallet not connected

## Smart Contracts
The dashboard integrates with the following smart contracts:
- **SAITToken**: ERC-20 token contract (100M supply)
- **Vault Contracts** (4): AIFundVault, TreasuryVault, TeamVault, PartnerVault
- **GovernanceStaking**: Staking and voting contract
- **SAITSATSwap**: Buyback mechanism contract
- **GovernanceController**: Protocol parameter management

**Note**: Contract addresses need to be configured in `src/services/web3Service.js` when deploying to a specific network.

## User Preferences
No specific user preferences configured yet.

## Development Notes

### Running Locally
```bash
npm install
npm start
```
The app will open on http://0.0.0.0:5000

### Building for Production
```bash
npm run build
```
Creates optimized production build in `/build` directory.

### Known Issues
- ESLint warnings for React Hook dependencies (non-critical)
- Unused variable `swapRate` in web3Service.js (non-functional)

## Deployment
- **Current**: Development environment on Replit
- **Production**: Not yet configured (pending deployment settings)
- **Recommended**: Vercel, AWS S3+CloudFront, or Docker deployment

## Resources
- GitHub Repository: https://github.com/Mbastidas001/SAIToken_v2
- Contact: amonroy@asi2.org
- Documentation: See `/docs` folder for detailed guides

## License
MIT License - see LICENSE file for details
