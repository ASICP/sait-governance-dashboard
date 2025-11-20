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

// Initialize provider
const getProvider = () => {
  const rpcUrl = process.env.REACT_APP_SEPOLIA_RPC_URL;
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Contract addresses from environment
const ADDRESSES = {
  saitToken: process.env.REACT_APP_SAIT_TOKEN_ADDRESS,
  governanceStaking: process.env.REACT_APP_GOVERNANCE_STAKING_ADDRESS,
  aiFund: process.env.REACT_APP_AI_FUND_ADDRESS,
  treasury: process.env.REACT_APP_TREASURY_ADDRESS,
  team: process.env.REACT_APP_TEAM_ADDRESS,
  partner: process.env.REACT_APP_PARTNER_ADDRESS,
  controller: process.env.REACT_APP_CONTROLLER_ADDRESS,
  swap: process.env.REACT_APP_SWAP_ADDRESS,
  mockSat: process.env.REACT_APP_MOCK_SAT_ADDRESS
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

    const lockedTokens = treasuryBal + aiFundBal + teamBal + partnerBal;
    const circulating = totalSupply - lockedTokens;

    return Number(ethers.formatUnits(circulating, decimals));
  } catch (error) {
    console.error('Error fetching circulating supply:', error);
    return null;
  }
};

// Fetch all blockchain data in one call
export const fetchAllBlockchainData = async () => {
  try {
    const [tokenData, treasuryBalances, circulating] = await Promise.all([
      fetchSAITTokenData(),
      fetchTreasuryBalances(),
      fetchCirculatingSupply()
    ]);

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
  return !!(
    process.env.REACT_APP_SEPOLIA_RPC_URL &&
    process.env.REACT_APP_SAIT_TOKEN_ADDRESS
  );
};

export default {
  fetchSAITTokenData,
  fetchTreasuryBalances,
  fetchCirculatingSupply,
  fetchAllBlockchainData,
  isWeb3Configured,
  ADDRESSES
};
