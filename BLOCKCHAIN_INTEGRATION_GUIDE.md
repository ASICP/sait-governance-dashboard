# SAIT Governance Dashboard - Blockchain Integration Guide

## 🎯 Overview

This update adds **hybrid data mode** to your dashboard, combining:
- **Blockchain data** from Sepolia testnet (real-time smart contract data)
- **Synthetic data** from whitepaper projections (for price, buyback rates, etc.)

## 📦 Files to Add/Update

### New Files to Add:
1. **`.env`** - Environment variables with contract addresses
2. **`src/utils/web3Integration.js`** - Web3/blockchain integration utilities
3. **`package.json`** - Updated with ethers.js dependency

### Files to Update:
- **`governance-dashboard.jsx`** - Replace with hybrid version OR merge the blockchain integration code

## 🚀 Step-by-Step Deployment

### Step 1: Push Files to GitHub

Upload these files to your repository:

```bash
# In your local repository
git add .env
git add src/utils/web3Integration.js
git add package.json

# Commit
git commit -m "Add blockchain integration for Sepolia testnet"

# Push
git push origin main
```

**Or use GitHub web interface:**
1. Go to https://github.com/ASICP/sait-governance-dashboard
2. Click "Add file" → "Upload files"
3. Upload: `.env`, `web3Integration.js`, updated `package.json`
4. Commit changes

### Step 2: Update in Replit

#### Method A: Auto-sync from GitHub
1. Open your Replit project
2. Go to Shell tab
3. Run:
```bash
git pull origin main
```

#### Method B: Manual upload
1. Copy `.env` file to root directory
2. Create `src/utils/` folder if it doesn't exist
3. Copy `web3Integration.js` to `src/utils/`
4. Update `package.json`

### Step 3: Install Dependencies

In Replit Shell, run:
```bash
npm install ethers
```

This will install ethers.js v6.9.0 for blockchain interactions.

### Step 4: File Structure

Your project should look like this:

```
sait-governance-dashboard/
├── .env                          ← NEW: Contract addresses
├── package.json                  ← UPDATED: Added ethers.js
├── public/
│   └── index.html
├── src/
│   ├── utils/
│   │   └── web3Integration.js   ← NEW: Blockchain utilities
│   ├── governance-dashboard.jsx  ← EXISTING: Your current dashboard
│   ├── App.js
│   └── index.js
└── README.md
```

### Step 5: Integrate Blockchain Code

You have two options:

#### Option A: Merge Integration (Recommended)
Add these imports to your existing `governance-dashboard.jsx`:

```javascript
import { fetchAllBlockchainData, isWeb3Configured } from './utils/web3Integration';
```

Then add the blockchain data fetching logic (see the hybrid dashboard example).

#### Option B: Replace Entire File
Replace `governance-dashboard.jsx` with `governance-dashboard-hybrid.jsx` (you'll need to complete this file with the full UI code).

### Step 6: Test the Integration

1. Click "Run" in Replit
2. Check the browser console (F12) for blockchain connection status
3. Look for:
   - ✅ "Blockchain data fetched successfully"
   - Green "Testnet Connected" indicator in header
   - Blue info box showing "Hybrid Mode"

### Step 7: Verify Data Sources

The dashboard will show:
- **Green indicator** = Blockchain connected, using real data
- **Yellow indicator** = Using synthetic data only
- **Blue info box** = Shows which data is from blockchain

## 🔧 Configuration Details

### Environment Variables (.env)

```env
# Sepolia Testnet RPC
REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo

# Network Info
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_CHAIN_ID=11155111

# Contract Addresses
REACT_APP_SAIT_TOKEN_ADDRESS=0x02213239610bbEe7A734cEC79DDbD1ed516E40bF
REACT_APP_GOVERNANCE_STAKING_ADDRESS=0xE82F5dEA7631d522D33D96C7234A5b7DDd550A66
REACT_APP_AI_FUND_ADDRESS=0x5C3E9f1AC0e6B3188c50291C522E24D42Fac01E1
REACT_APP_TREASURY_ADDRESS=0x99F62e317EC5c7AF43329dE27CED9E157b90dD98
REACT_APP_TEAM_ADDRESS=0x9CFf2e0651Ef7926398a46a176dDE4b64FC818b4
REACT_APP_PARTNER_ADDRESS=0x790E5972C1bb9F646a83d5b801e3c4f51113B674
REACT_APP_CONTROLLER_ADDRESS=0xcFB77BaE499Ab9812D3F4E51F0B79c33f5EB94cd
REACT_APP_SWAP_ADDRESS=0xDA65e88F8E0b3F43E9215ad56A54ffd3D6b9B635
REACT_APP_MOCK_SAT_ADDRESS=0xc866Bc738e27Ad4206C5e8188569a7dFd2209295
```

## 📊 What Data Comes from Blockchain?

### From Blockchain (Real-time):
- ✅ Total SAIT supply
- ✅ Circulating supply
- ✅ Treasury SAIT balance
- ✅ SAT Treasury balance
- ✅ AI Fund reserves
- ✅ Team allocation
- ✅ Partner allocation

### Still Synthetic (Until Oracle Integration):
- ⏳ SAIT price (using whitepaper projections)
- ⏳ SAT price (fixed at $150)
- ⏳ Buyback rate
- ⏳ Historical price data
- ⏳ Grant governance data

## 🔍 Troubleshooting

### Issue: "Web3 not configured"
**Solution:** Make sure `.env` file is in the root directory and variables are prefixed with `REACT_APP_`

### Issue: "Failed to fetch blockchain data"
**Solution:** 
1. Check RPC URL is accessible
2. Verify contract addresses are correct
3. Check browser console for specific errors

### Issue: Dashboard shows only synthetic data
**Solution:**
1. Check the green/yellow indicator in header
2. Open browser console (F12)
3. Look for connection errors
4. Verify `.env` file is properly loaded

### Issue: npm install fails
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎨 UI Indicators

The dashboard shows data source status:

```
┌─────────────────────────────────────┐
│ ● Testnet Connected                 │  ← Green = Blockchain connected
│   Sepolia • Updated 10:30:45 AM     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ℹ Hybrid Mode: Combining blockchain │
│   + synthetic data                  │  ← Blue info box
│   Supply: 100M | Circulating: 10M   │
└─────────────────────────────────────┘
```

## 🔄 Data Refresh Rates

- **Blockchain data**: Every 30 seconds
- **Dashboard metrics**: Every 60 seconds
- **Manual refresh**: Reload page

## 🚨 Important Notes

1. **Keep synthetic data**: Grant governance data remains synthetic until manual entry system is built
2. **Hybrid mode**: Best of both worlds - real blockchain data + projected metrics
3. **Testnet**: Currently using Sepolia testnet, will migrate to mainnet later
4. **RPC limits**: Demo RPC has rate limits, consider upgrading to paid Alchemy plan for production

## 📈 Next Steps

After successful deployment:

1. ✅ Verify blockchain data is displaying correctly
2. ✅ Monitor console for any errors
3. ✅ Test data refresh (wait 30 seconds, check if values update)
4. 🔄 Plan for price oracle integration
5. 🔄 Plan for grant governance data persistence

## 🆘 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify all environment variables are set
3. Ensure ethers.js is installed: `npm list ethers`
4. Check contract addresses are valid on Sepolia

## 📝 Deployment Checklist

- [ ] `.env` file added to repository root
- [ ] `web3Integration.js` added to `src/utils/`
- [ ] `package.json` updated with ethers.js
- [ ] Ran `npm install` in Replit
- [ ] Dashboard code updated with blockchain integration
- [ ] Tested in browser - green indicator shows
- [ ] Verified blockchain data in console
- [ ] Checked that synthetic data still works as fallback

---

**Version**: 1.1.0  
**Date**: November 2025  
**Status**: Hybrid Mode (Blockchain + Synthetic)
