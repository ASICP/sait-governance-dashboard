# SAIT Governance Dashboard

A comprehensive real-time dashboard for monitoring the SAIT Token Ecosystem, including token circulation, treasury reserves, buyback analytics, and forward-looking projections.

## Features

### Real-Time Metrics
- **SAIT Price Tracking**: Live price data with premium ratio to SAT backing
- **Market Cap**: Total market capitalization and % of AI market ($16.2T)
- **Circulating Supply**: Current circulation with buyback-adjusted figures
- **Treasury Value**: Combined SAIT + SAT treasury holdings

### Visual Analytics
- **Price & Circulation History**: 12-month historical charts
- **Token Allocation**: Pie chart breakdown of 100M total supply
- **Buyback Analytics**: Monthly buyback volumes and runway calculations
- **Vault Balances**: Individual vault tracking (AI Fund, Treasury, Team, Partners)

### Forward-Looking Projections
- **24-Month Projections**: Price, circulation, and reserve forecasts
- **Scenario Modeling**: Conservative growth assumptions based on whitepaper
- **Buyback Runway**: Sustainability analysis at current rates
- **Treasury Health**: Value tracking across SAIT and SAT holdings

## Technology Stack

- **Frontend**: React 18+
- **Charts**: Recharts
- **Web3**: ethers.js v5/v6
- **Blockchain**: Ethereum (compatible with any EVM chain)
- **Styling**: Tailwind CSS

## Prerequisites

```bash
Node.js >= 16.x
npm or yarn
MetaMask or compatible Web3 wallet
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Mbastidas001/SAIToken_v2.git
cd SAIToken_v2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

Required packages:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ethers": "^5.7.2",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 3. Configure Contract Addresses

Edit `web3-service.js` and update with your deployed contract addresses:

```javascript
const CONTRACTS = {
  SAITToken: '0xYourSAITTokenAddress',
  GovernanceStaking: '0xYourGovernanceAddress',
  AIFundVault: '0xYourAIFundVaultAddress',
  TreasuryVault: '0xYourTreasuryVaultAddress',
  TeamVault: '0xYourTeamVaultAddress',
  PartnerVault: '0xYourPartnerVaultAddress',
  SAITSATSwap: '0xYourSwapAddress',
  GovernanceController: '0xYourGovernanceControllerAddress'
};
```

### 4. Setup Environment Variables

Create `.env` file:

```env
REACT_APP_NETWORK_ID=1
REACT_APP_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
REACT_APP_PRICE_ORACLE_ADDRESS=0x...
```

## Smart Contract Integration

### Required Contract Methods

Your smart contracts must expose the following view functions:

#### SAITToken.sol
```solidity
function totalSupply() external view returns (uint256);
function getCirculatingSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
```

#### Vaults (AIFundVault, TreasuryVault, etc.)
```solidity
function getVaultBalance() external view returns (uint256);
function lockedAmount() external view returns (uint256);
function vestedAmount() external view returns (uint256);
```

#### GovernanceStaking.sol
```solidity
function totalStaked() external view returns (uint256);
function getVotingPower(address account) external view returns (uint256);
function proposals(uint256 id) external view returns (Proposal memory);
```

#### SAITSATSwap.sol
```solidity
function getBuybackRate() external view returns (uint256);
function totalSAITSwapped() external view returns (uint256);
function totalSATReceived() external view returns (uint256);
```

## Development

### Run Development Server

```bash
npm start
# or
yarn start
```

Dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

## Usage

### Connecting Wallet

1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Dashboard will automatically load real-time data from blockchain

### Viewing Metrics

- **Overview Cards**: Top section shows key metrics
- **Historical Charts**: Mid section displays 12-month trends
- **Projections Table**: Bottom section shows 24-month forecasts

### Understanding Buyback Analytics

The dashboard calculates:
- **Monthly Buyback Rate**: % of circulating supply bought back monthly
- **Buyback USD Value**: Total monthly USD value removed from circulation
- **Buyback Runway**: Months of sustainability at current rate

Formula:
```
Buyback Runway = (SAT Reserves × $150) / (Circulating SAIT × Buyback Rate × SAIT Price)
```

### Interpreting Projections

Projections use conservative assumptions from the ASIP whitepaper:

**Year 1-2**: 1% monthly price growth  
**Year 2-3**: 1.5% monthly price growth  
**Buyback Rate**: 1.5% monthly (Year 1 end target)  
**Treasury Sales**: 1.5M SAIT annually (5% limit)  
**SAT Backing**: 150% overcollateralization maintained

## Data Sources

### On-Chain Data (Real-time)
- SAIT token balances and circulation
- Vault holdings and vesting schedules
- Governance proposals and votes
- Swap transactions and buybacks

### Off-Chain Data (Oracle-based)
- SAIT market price (Chainlink or Uniswap TWAP)
- Commodity prices for SAT basket (Chainlink)
- Historical price data

### Calculated Metrics
- Market capitalization
- Premium ratios
- Buyback runway
- Treasury value
- 24-month projections

## Architecture

```
┌─────────────────────────────────────────┐
│     SAIT Governance Dashboard (React)    │
└──────────────┬──────────────────────────┘
               │
               ├─── Web3 Service (ethers.js)
               │    │
               │    ├─── SAITToken Contract
               │    ├─── Vault Contracts (4)
               │    ├─── Governance Contract
               │    └─── Swap Contract
               │
               ├─── Price Oracles
               │    ├─── Chainlink Price Feeds
               │    └─── DEX TWAPs (Uniswap V3)
               │
               └─── Calculation Engine
                    ├─── Metrics Calculator
                    ├─── Projection Generator
                    └─── Historical Analyzer
```

## Key Calculations

### Market Cap
```javascript
marketCap = circulatingSupply × saitPrice
```

### Treasury Value
```javascript
treasuryValue = (saitTreasury × saitPrice) + (satReserves × 150)
```

### Premium Ratio
```javascript
premiumRatio = saitPrice / satBackingPrice (150)
// 1.0 = parity, 2.0 = 100% premium (Year 3 target)
```

### Buyback Runway
```javascript
runway = (satReserves × 150) / (circulation × buybackRate × saitPrice)
// Result in months
```

### SAT Reserve Growth
```javascript
// From SAIT treasury sales
proceeds = saitSold × avgPrice
newSAT = (proceeds / 150) × 0.667 // 150% overcollateralization
satReserves += newSAT
```

## Whitepaper Alignment

The dashboard implements the economic model from **SAITSATEQv5.pdf**:

### Year 1 (2026)
- Launch Price: $150 (treasury parity)
- Circulating: 10M SAIT
- Market Cap: $1.5B
- Buyback Rate: 0.3% → 1.5% monthly

### Year 2 (2027)
- Target Price: $200
- Circulating: 20M SAIT
- Market Cap: $4B
- Premium Ratio: 1.33:1

### Year 3 (2028)
- Fair Value: $300
- Circulating: 30M SAIT
- Market Cap: $9B
- Premium Ratio: 2:1

## Security Considerations

### Smart Contract Security
- All contracts should be audited before mainnet deployment
- Use OpenZeppelin libraries for standard functionality
- Implement timelocks for critical operations

### Frontend Security
- Never store private keys in frontend code
- Validate all user inputs
- Use HTTPS for all API calls
- Implement rate limiting for RPC calls

### Price Oracle Security
- Use multiple oracle sources
- Implement price deviation checks
- Have fallback mechanisms for oracle failures

## Troubleshooting

### MetaMask Not Connecting
1. Check if MetaMask is installed
2. Verify correct network is selected
3. Clear browser cache and retry

### Contract Data Not Loading
1. Verify contract addresses in `web3-service.js`
2. Check RPC endpoint is responding
3. Ensure contracts are deployed and verified

### Incorrect Calculations
1. Verify all contract methods return correct units
2. Check decimal places (18 for SAIT)
3. Review calculation formulas against whitepaper

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Testing

### Unit Tests
```bash
npm test
# or
yarn test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Docker Deployment
```bash
docker build -t sait-dashboard .
docker run -p 3000:3000 sait-dashboard
```

## Roadmap

- [ ] Mobile responsive improvements
- [ ] Real-time WebSocket integration
- [ ] Advanced filtering and search
- [ ] Export data to CSV/PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Notification system for key events
- [ ] Historical data archive (> 1 year)

## License

MIT License - see LICENSE file for details

## Contact

Project Link: [https://github.com/Mbastidas001/SAIToken_v2](https://github.com/Mbastidas001/SAIToken_v2)

For questions or support: team@asi2.org

## Acknowledgments

- **ASIP White Paper**: Economic model and projections
- **OpenZeppelin**: Smart contract libraries
- **Recharts**: Visualization library
- **ethers.js**: Web3 integration
- **Tailwind CSS**: Styling framework

---

**Disclaimer**: This dashboard is for informational purposes only. Token prices and projections are estimates based on the ASIP whitepaper model and actual results may vary significantly. Always do your own research before making any investment decisions.
