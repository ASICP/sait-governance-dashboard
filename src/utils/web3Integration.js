// src/utils/web3Integration.js
import { ethers } from 'ethers';

// ERC20 ABI - minimal interface for token operations
const ERC20_ABI = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

// Initialize provider using Alchemy Sepolia RPC
const getProvider = () => {
  const rpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/33nEYBLRFd_1TfSplklSa';
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Contract addresses (Sepolia testnet - public blockchain addresses)
const ADDRESSES = {
  saitToken: process.env.REACT_APP_SAIT_TOKEN_ADDRESS || '0x02213239610bbEe7A734cEC79DDbD1ed516E40bF',
  governanceStaking: process.env.REACT_APP_GOVERNANCE_STAKING_ADDRESS || '0xE82F5dEA7631d522D33D96C7234A5b7DDd550A66',
  aiFund: process.env.REACT_APP_AI_FUND_ADDRESS || '0x5C3E9f1AC0e6B3188c50291C522E24D42Fac01E1',
  treasury: process.env.REACT_APP_TREASURY_ADDRESS || '0x99F62e317EC5c7AF43329dE27CED9E157b90dD98',
  team: process.env.REACT_APP_TEAM_ADDRESS || '0x9CFf2e0651Ef7926398a46a176dDE4b64FC818b4',
  partner: process.env.REACT_APP_PARTNER_ADDRESS || '0x790E5972C1bb9F646a83d5b801e3c4f51113B674',
  controller: process.env.REACT_APP_CONTROLLER_ADDRESS || '0xcFB77BaE499Ab9812D3F4E51F0B79c33f5EB94cd',
  swap: process.env.REACT_APP_SWAP_ADDRESS || '0xDA65e88F8E0b3F43E9215ad56A54ffd3D6b9B635',
  mockSat: process.env.REACT_APP_MOCK_SAT_ADDRESS || '0xc866Bc738e27Ad4206C5e8188569a7dFd2209295'
};

// Fetch SAIT token data from blockchain
export const fetchSAITTokenData = async () => {
  try {
    const provider = getProvider();
    const saitContract = new ethers.Contract(
      ADDRESSES.saitToken,
      ERC20_ABI,
      provider
    );

    const [totalSupply, decimals] = await Promise.all([
      saitContract.totalSupply(),
      saitContract.decimals()
    ]);

    return {
      totalSupply: Number(ethers.formatUnits(totalSupply, decimals)),
      decimals: Number(decimals)
    };
  } catch (error) {
    console.error('Error fetching SAIT token data:', error);
    return null;
  }
};

// Fetch balances for treasury addresses
export const fetchTreasuryBalances = async () => {
  try {
    const provider = getProvider();
    const saitContract = new ethers.Contract(
      ADDRESSES.saitToken,
      ERC20_ABI,
      provider
    );
    const satContract = new ethers.Contract(
      ADDRESSES.mockSat,
      ERC20_ABI,
      provider
    );

    const decimals = await saitContract.decimals();

    const [
      treasuryBalance,
      aiFundBalance,
      teamBalance,
      partnerBalance,
      satTreasuryBalance
    ] = await Promise.all([
      saitContract.balanceOf(ADDRESSES.treasury),
      saitContract.balanceOf(ADDRESSES.aiFund),
      saitContract.balanceOf(ADDRESSES.team),
      saitContract.balanceOf(ADDRESSES.partner),
      satContract.balanceOf(ADDRESSES.treasury)
    ]);

    return {
      saitTreasury: Number(ethers.formatUnits(treasuryBalance, decimals)),
      aiFundReserve: Number(ethers.formatUnits(aiFundBalance, decimals)),
      teamAllocation: Number(ethers.formatUnits(teamBalance, decimals)),
      partnerAllocation: Number(ethers.formatUnits(partnerBalance, decimals)),
      satTreasury: Number(ethers.formatUnits(satTreasuryBalance, decimals))
    };
  } catch (error) {
    console.error('Error fetching treasury balances:', error);
    return null;
  }
};

// Fetch circulating supply (total supply minus locked tokens)
export const fetchCirculatingSupply = async () => {
  try {
    const provider = getProvider();
    const saitContract = new ethers.Contract(
      ADDRESSES.saitToken,
      ERC20_ABI,
      provider
    );

    const decimals = await saitContract.decimals();
    const totalSupply = await saitContract.totalSupply();

    // Get balances of locked addresses
    const [treasuryBal, aiFundBal, teamBal, partnerBal] = await Promise.all([
      saitContract.balanceOf(ADDRESSES.treasury),
      saitContract.balanceOf(ADDRESSES.aiFund),
      saitContract.balanceOf(ADDRESSES.team),
      saitContract.balanceOf(ADDRESSES.partner)
    ]);

    // ethers v6 returns BigInt, use native operators
    const lockedTokens = treasuryBal + aiFundBal + teamBal + partnerBal;
    const circulating = totalSupply - lockedTokens;

    return Number(ethers.formatUnits(circulating, decimals));
  } catch (error) {
    console.error('Error fetching circulating supply:', error);
    return null;
  }
};

// Helper function to add timeout to promises
const withTimeout = (promise, timeoutMs) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    )
  ]);
};

// Fetch all blockchain data in one call with timeout
export const fetchAllBlockchainData = async () => {
  try {
    const [tokenData, treasuryBalances, circulating] = await withTimeout(
      Promise.all([
        fetchSAITTokenData(),
        fetchTreasuryBalances(),
        fetchCirculatingSupply()
      ]),
      10000 // 10 second timeout
    );

    if (!tokenData || !treasuryBalances || circulating === null) {
      throw new Error('Failed to fetch some blockchain data');
    }

    return {
      totalSupply: tokenData.totalSupply,
      saitCirculating: circulating,
      saitTreasury: treasuryBalances.saitTreasury,
      satTreasury: treasuryBalances.satTreasury,
      aiFundReserve: treasuryBalances.aiFundReserve,
      teamAllocation: treasuryBalances.teamAllocation,
      partnerAllocation: treasuryBalances.partnerAllocation,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching all blockchain data:', error);
    return null;
  }
};

// Check if Web3 is available and configured
export const isWeb3Configured = () => {
  // Always configured since we have hardcoded fallbacks for Sepolia testnet
  return true;
};

const web3Integration = {
  fetchSAITTokenData,
  fetchTreasuryBalances,
  fetchCirculatingSupply,
  fetchAllBlockchainData,
  isWeb3Configured,
  ADDRESSES
};

export default web3Integration;
