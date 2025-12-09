import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { fetchAllBlockchainData, isWeb3Configured } from '../utils/web3Integration';

// Dashboard Component for SAIT Token Ecosystem with Grant Governance Audit
const SAITGovernanceDashboard = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('ecosystem'); // 'ecosystem' or 'grants'
  
  // State for real-time data - initialized with baseline values
  const [dashboardData, setDashboardData] = useState({
    saitCirculating: 10000000, // 10M baseline
    saitTreasury: 28550000,    // Baseline treasury
    satTreasury: 1629000,      // Baseline SAT reserves
    saitPrice: 165,
    satPrice: 150,
    buybackRate: 0.015,
    totalSupply: 100000000
  });

  const [historicalData, setHistoricalData] = useState([]);
  const [projections, setProjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBlockchainConnected, setIsBlockchainConnected] = useState(false);

  // Grant governance data
  const [grantData, setGrantData] = useState({
    quarterlyData: [],
    currentQuarter: 'Q4 2025',
    grants: []
  });

  // Historical data baseline (from original mock projections)
  const historicalBaseline = {
    saitCirculating: 10000000, // 10M SAIT in circulation (Year 1 projection)
    saitTreasury: 28550000, // After Year 1 sales projection
    satTreasury: 1629000, // Year 1 SAT reserves projection
    saitPrice: 165,
    satPrice: 150,
    buybackRate: 0.015,
    totalSupply: 100000000
  };

  // Fetch current data from Sepolia testnet, use mock data for historical baseline
  useEffect(() => {
    // Always generate historical data and grant data immediately
    generateHistoricalData(historicalBaseline);
    generateGrantData();
    generateProjections(historicalBaseline);
    
    // Show dashboard immediately with baseline data
    setLoading(false);

    const fetchDashboardData = async () => {
      try {
        // Check if Web3 is configured
        const web3Available = isWeb3Configured();
        setIsBlockchainConnected(web3Available);

        if (!web3Available) {
          console.log('Web3 not configured - using baseline data');
          return;
        }

        console.log('Fetching current data from Sepolia testnet...');
        const blockchainData = await fetchAllBlockchainData();

        if (!blockchainData) {
          console.log('Failed to fetch blockchain data - keeping baseline data');
          return;
        }

        console.log('Blockchain data fetched successfully:', blockchainData);
        
        // Add price data (not available on-chain, would come from oracle/API)
        blockchainData.saitPrice = 165;
        blockchainData.satPrice = 150;
        blockchainData.buybackRate = 0.015;

        // Update with current blockchain data for live metrics
        setDashboardData(blockchainData);
        
        // Update projections from current blockchain state
        generateProjections(blockchainData);
      } catch (error) {
        console.log('Error fetching blockchain data:', error.message);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate grant governance data
  const generateGrantData = () => {
    // Historical quarterly data from Q2 2025 to Q4 2025
    const quarterlyData = [
      {
        quarter: 'Q2 2025',
        projectsCompleted: 2,
        projectsReceiving: 3,
        projectsApplying: 8,
        tier1Grants: 1,
        tier2Grants: 2,
        tier3Grants: 2,
        totalCommitted: 2500000, // $2.5M
        tier1Value: 1000000,
        tier2Value: 800000,
        tier3Value: 700000,
        avgVoterParticipation: 42.3,
        totalVotes: 245
      },
      {
        quarter: 'Q3 2025',
        projectsCompleted: 3,
        projectsReceiving: 5,
        projectsApplying: 12,
        tier1Grants: 2,
        tier2Grants: 2,
        tier3Grants: 3,
        totalCommitted: 4200000, // $4.2M
        tier1Value: 2000000,
        tier2Value: 1200000,
        tier3Value: 1000000,
        avgVoterParticipation: 48.7,
        totalVotes: 312
      },
      {
        quarter: 'Q4 2025',
        projectsCompleted: 4,
        projectsReceiving: 7,
        projectsApplying: 15,
        tier1Grants: 2,
        tier2Grants: 3,
        tier3Grants: 4,
        totalCommitted: 5800000, // $5.8M
        tier1Value: 2500000,
        tier2Value: 1800000,
        tier3Value: 1500000,
        avgVoterParticipation: 53.2,
        totalVotes: 387
      }
    ];

    // Individual grant records
    const grants = [
      // Q2 2025
      { id: 'G-2025-001', quarter: 'Q2 2025', tier: 3, title: 'AI Alignment Benchmarking Framework', value: 1000000, status: 'completed', voterParticipation: 45.2, totalVotes: 234 },
      { id: 'G-2025-002', quarter: 'Q2 2025', tier: 2, title: 'Interpretable AI Decision Systems', value: 500000, status: 'receiving', voterParticipation: 41.8, totalVotes: 218 },
      { id: 'G-2025-003', quarter: 'Q2 2025', tier: 1, title: 'Robustness Testing Toolkit', value: 150000, status: 'completed', voterParticipation: 39.5, totalVotes: 203 },
      
      // Q3 2025
      { id: 'G-2025-004', quarter: 'Q3 2025', tier: 3, title: 'Constitutional AI Research Initiative', value: 1200000, status: 'receiving', voterParticipation: 52.3, totalVotes: 298 },
      { id: 'G-2025-005', quarter: 'Q3 2025', tier: 3, title: 'AI Safety Standards Development', value: 800000, status: 'completed', voterParticipation: 48.9, totalVotes: 287 },
      { id: 'G-2025-006', quarter: 'Q3 2025', tier: 2, title: 'Adversarial Robustness Validation', value: 600000, status: 'receiving', voterParticipation: 46.1, totalVotes: 276 },
      { id: 'G-2025-007', quarter: 'Q3 2025', tier: 1, title: 'AI Ethics Training Modules', value: 200000, status: 'completed', voterParticipation: 44.8, totalVotes: 245 },
      
      // Q4 2025
      { id: 'G-2025-008', quarter: 'Q4 2025', tier: 3, title: 'Advanced AI Alignment Research', value: 1500000, status: 'receiving', voterParticipation: 56.7, totalVotes: 412 },
      { id: 'G-2025-009', quarter: 'Q4 2025', tier: 3, title: 'Multi-Agent Safety Protocols', value: 1000000, status: 'receiving', voterParticipation: 54.2, totalVotes: 398 },
      { id: 'G-2025-010', quarter: 'Q4 2025', tier: 2, title: 'Scalable Oversight Mechanisms', value: 650000, status: 'receiving', voterParticipation: 52.9, totalVotes: 385 },
      { id: 'G-2025-011', quarter: 'Q4 2025', tier: 2, title: 'AI Risk Assessment Framework', value: 550000, status: 'completed', voterParticipation: 51.1, totalVotes: 367 },
      { id: 'G-2025-012', quarter: 'Q4 2025', tier: 1, title: 'Safety Evaluation Tools', value: 280000, status: 'receiving', voterParticipation: 49.8, totalVotes: 351 }
    ];

    setGrantData({
      quarterlyData,
      currentQuarter: 'Q4 2025',
      grants
    });
  };

  // Generate historical data for charts
  const generateHistoricalData = (currentData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historical = months.map((month, index) => ({
      month,
      saitPrice: 150 + (index * 1.25), // Gradual price increase
      circulation: 3000000 + (index * 583333), // Growing circulation
      buybacks: 24000 + (index * 26000), // Increasing buyback volume
      satReserves: 113000 + (index * 126416) // Growing SAT reserves
    }));
    setHistoricalData(historical);
  };

  // Generate forward-looking projections
  const generateProjections = (currentData) => {
    const { saitPrice, satTreasury, buybackRate } = currentData;
    
    const projectionData = [];
    let projectedPrice = saitPrice;
    let projectedSATReserves = satTreasury;
    let projectedCirculation = dashboardData.saitCirculating;

    for (let i = 1; i <= 24; i++) { // 24 months projection
      // Price appreciation model (conservative)
      const monthlyGrowth = i <= 12 ? 0.0083 : 0.0125; // Slower Year 2, faster Year 3
      projectedPrice = projectedPrice * (1 + monthlyGrowth);

      // SAT reserves growth (from SAIT sales)
      const monthlySAITSales = i <= 12 ? 120833 : 125000;
      const avgSalePrice = projectedPrice;
      const proceeds = monthlySAITSales * avgSalePrice;
      const newSAT = proceeds / 150 * 0.667; // 150% overcollateralization
      projectedSATReserves += newSAT;

      // Circulation changes (new unlocks - buybacks)
      const monthlyUnlocks = 583333; // Average from Year 1
      const monthlyBuybacks = projectedCirculation * buybackRate;
      projectedCirculation = projectedCirculation + monthlyUnlocks - monthlyBuybacks;

      projectionData.push({
        month: `M${i}`,
        price: Math.round(projectedPrice * 100) / 100,
        satReserves: Math.round(projectedSATReserves),
        circulation: Math.round(projectedCirculation),
        treasuryValue: Math.round((dashboardData.saitTreasury - (i * monthlySAITSales)) * projectedPrice + projectedSATReserves * 150),
        buybackCapacity: Math.round(projectedSATReserves * 150 / projectedPrice)
      });
    }

    setProjections(projectionData);
  };

  // Calculate key metrics
  const calculateMetrics = () => {
    const { saitCirculating, saitTreasury, satTreasury, saitPrice, buybackRate } = dashboardData;
    
    return {
      marketCap: (saitCirculating * saitPrice) / 1e9, // In billions
      treasuryValue: ((saitTreasury * saitPrice) + (satTreasury * 150)) / 1e9, // In billions
      circulatingPercent: (saitCirculating / 100000000) * 100,
      monthlyBuybackVolume: saitCirculating * buybackRate,
      monthlyBuybackUSD: saitCirculating * buybackRate * saitPrice,
      buybackRunway: (satTreasury * 150) / (saitCirculating * buybackRate * saitPrice),
      premiumRatio: saitPrice / 150,
      netCirculation: saitCirculating - (saitCirculating * buybackRate * 12) // Annual net after buybacks
    };
  };

  const metrics = calculateMetrics();

  // Calculate grant metrics
  const calculateGrantMetrics = () => {
    const currentQ = grantData.quarterlyData[grantData.quarterlyData.length - 1];
    const totalCommitted = grantData.quarterlyData.reduce((sum, q) => sum + q.totalCommitted, 0);
    const totalGrants = grantData.grants.length;
    const avgParticipation = grantData.quarterlyData.reduce((sum, q) => sum + q.avgVoterParticipation, 0) / grantData.quarterlyData.length;
    
    return {
      currentProjectsReceiving: currentQ?.projectsReceiving || 0,
      currentProjectsApplying: currentQ?.projectsApplying || 0,
      totalCommitted,
      totalGrants,
      avgParticipation: avgParticipation.toFixed(1)
    };
  };

  const grantMetrics = calculateGrantMetrics();

  // Allocation breakdown for pie chart
  const allocationData = [
    { name: 'Circulating', value: dashboardData.saitCirculating, color: '#3b82f6' },
    { name: 'Treasury', value: dashboardData.saitTreasury, color: '#10b981' },
    { name: 'AI Fund Reserve', value: 50000000 - dashboardData.saitCirculating - 10000000, color: '#f59e0b' },
    { name: 'Team/Partners', value: 20000000, color: '#8b5cf6' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">SAIT Governance Dashboard</h1>
          <p className="text-blue-100">Real-time Ecosystem Metrics & Grant Governance</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all ${
              activeTab === 'ecosystem'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ecosystem Metrics
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all ${
              activeTab === 'grants'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Grant Governance Audit
          </button>
        </div>
      </div>

      {/* Ecosystem Tab Content */}
      {activeTab === 'ecosystem' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="SAIT Price" 
              value={`$${dashboardData.saitPrice.toFixed(2)}`}
              subtitle={`Premium: ${((metrics.premiumRatio - 1) * 100).toFixed(1)}%`}
              trend="+15%" 
              positive={true}
            />
            <MetricCard 
              title="Market Cap" 
              value={`$${metrics.marketCap.toFixed(2)}B`}
              subtitle="0.0094% of AI market"
              trend="+10%" 
              positive={true}
            />
            <MetricCard 
              title="Circulating Supply" 
              value={`${(dashboardData.saitCirculating / 1e6).toFixed(1)}M`}
              subtitle={`${metrics.circulatingPercent.toFixed(1)}% of total`}
              trend={`${(dashboardData.buybackRate * 100).toFixed(1)}% monthly buyback`}
            />
            <MetricCard 
              title="Treasury Value" 
              value={`$${metrics.treasuryValue.toFixed(2)}B`}
              subtitle={`${(dashboardData.satTreasury / 1e6).toFixed(2)}M SAT reserves`}
              positive={true}
            />
          </div>

          {/* Main Charts Section */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price & Circulation History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Price & Circulation History</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="saitPrice" stroke="#3b82f6" name="SAIT Price ($)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="circulation" stroke="#10b981" name="Circulation (M)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Allocation Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">SAIT Token Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value / 1e6).toFixed(2)}M SAIT`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {allocationData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}: {(item.value / 1e6).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buyback Analytics */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Buyback Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Monthly Buyback Rate</p>
                <p className="text-3xl font-bold text-blue-600">{(dashboardData.buybackRate * 100).toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.monthlyBuybackVolume.toLocaleString()} SAIT/month</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Monthly USD Value</p>
                <p className="text-3xl font-bold text-green-600">${(metrics.monthlyBuybackUSD / 1e6).toFixed(2)}M</p>
                <p className="text-xs text-gray-500 mt-1">Deflationary pressure</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Buyback Runway</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.buybackRunway.toFixed(1)} mo</p>
                <p className="text-xs text-gray-500 mt-1">At current rate</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="buybacks" fill="#3b82f6" name="Monthly Buybacks (SAIT)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Forward-Looking Projections */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">24-Month Projections</h2>
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-gray-700">
                <strong>Model Assumptions:</strong> Year 1-2: 1% monthly price growth | Year 2-3: 1.5% growth | 
                1.5% buyback rate | Treasury sells 1.5M SAIT/year | 150% SAT overcollateralization
              </p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="price" stroke="#3b82f6" name="SAIT Price ($)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="circulation" stroke="#10b981" name="Circulation" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="satReserves" stroke="#f59e0b" name="SAT Reserves" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            {/* Projection Summary Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeframe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SAIT Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Cap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SAT Reserves</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treasury Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Runway</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[6, 12, 18, 24].map(month => {
                    const data = projections[month - 1];
                    if (!data) return null;
                    const runway = (data.satReserves * 150) / (data.circulation * 0.015 * data.price);
                    return (
                      <tr key={month} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Month {month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${((data.circulation * data.price) / 1e9).toFixed(2)}B</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(data.satReserves / 1e6).toFixed(2)}M</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(data.treasuryValue / 1e9).toFixed(2)}B</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{runway.toFixed(1)} mo</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Treasury Details */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">SAIT Treasury</h2>
              <div className="space-y-4">
                <DetailRow label="SAIT Holdings" value={`${(dashboardData.saitTreasury / 1e6).toFixed(2)}M SAIT`} />
                <DetailRow label="SAIT Value" value={`$${((dashboardData.saitTreasury * dashboardData.saitPrice) / 1e9).toFixed(2)}B`} />
                <DetailRow label="Allocation" value="30% of total supply" />
                <DetailRow label="Annual Sales Limit" value="5% (1.5M SAIT)" />
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Treasury Strategy:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Strategic SAIT sales fund SAT reserve growth</li>
                    <li>• 5% annual limit ensures supply discipline</li>
                    <li>• Sales halt below launch price ($150)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">SAT Treasury Reserves</h2>
              <div className="space-y-4">
                <DetailRow label="SAT Holdings" value={`${(dashboardData.satTreasury / 1e6).toFixed(2)}M SAT`} />
                <DetailRow label="SAT Value" value={`$${((dashboardData.satTreasury * 150) / 1e6).toFixed(2)}M`} />
                <DetailRow label="Backing" value="150% overcollateralized" />
                <DetailRow label="Buyback Capacity" value={`${metrics.buybackRunway.toFixed(1)} months`} />
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Collateral Basket:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 40% Stablecoins (USDC, USDT)</li>
                    <li>• 25% Gold (tokenized)</li>
                    <li>• 15% Silver</li>
                    <li>• 10% Ethereum</li>
                    <li>• 10% Bitcoin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="max-w-7xl mx-auto bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Live Data Integration:</strong> Connect your Web3 wallet to view real-time blockchain data. 
                  Current display shows Year 1 projections from the ASIP whitepaper.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant Governance Audit Tab Content */}
      {activeTab === 'grants' && (
        <div className="space-y-8">
          {/* Grant Overview Metrics */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Active Projects" 
              value={grantMetrics.currentProjectsReceiving}
              subtitle="Currently receiving funding"
              trend={`${grantMetrics.currentProjectsApplying} applying`}
            />
            <MetricCard 
              title="Total Committed" 
              value={`$${(grantMetrics.totalCommitted / 1e6).toFixed(1)}M`}
              subtitle="Across all quarters"
              trend={`${grantMetrics.totalGrants} total grants`}
              positive={true}
            />
            <MetricCard 
              title="Avg Participation" 
              value={`${grantMetrics.avgParticipation}%`}
              subtitle="Voter participation rate"
              trend="+8.7% vs Q2"
              positive={true}
            />
            <MetricCard 
              title="Current Quarter" 
              value={grantData.currentQuarter}
              subtitle={`${grantData.quarterlyData[grantData.quarterlyData.length - 1]?.totalCommitted ? '$' + (grantData.quarterlyData[grantData.quarterlyData.length - 1].totalCommitted / 1e6).toFixed(1) + 'M' : 'N/A'} committed`}
              positive={true}
            />
          </div>

          {/* Quarterly Project Activity */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Quarterly Project Activity</h2>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={grantData.quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="projectsCompleted" fill="#10b981" name="Completed" />
                <Bar yAxisId="left" dataKey="projectsReceiving" fill="#3b82f6" name="Receiving Funding" />
                <Bar yAxisId="left" dataKey="projectsApplying" fill="#f59e0b" name="Applying" />
                <Line yAxisId="right" type="monotone" dataKey="avgVoterParticipation" stroke="#8b5cf6" name="Voter Participation %" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Grant Tier Breakdown */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grants by Tier Count */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Grants by Tier (Count)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={grantData.quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tier3Grants" stackId="a" fill="#dc2626" name="Tier 3 ($1M+)" />
                  <Bar dataKey="tier2Grants" stackId="a" fill="#f59e0b" name="Tier 2 ($250K+)" />
                  <Bar dataKey="tier1Grants" stackId="a" fill="#10b981" name="Tier 1 ($50K+)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Committed Value by Tier */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Committed Value by Tier</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={grantData.quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1e6).toFixed(2)}M`} />
                  <Legend />
                  <Bar dataKey="tier3Value" stackId="a" fill="#dc2626" name="Tier 3" />
                  <Bar dataKey="tier2Value" stackId="a" fill="#f59e0b" name="Tier 2" />
                  <Bar dataKey="tier1Value" stackId="a" fill="#10b981" name="Tier 1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Voter Participation Trends */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Voter Participation & Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Q2 2025 Participation</p>
                <p className="text-3xl font-bold text-purple-600">42.3%</p>
                <p className="text-xs text-gray-500 mt-1">245 total votes</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Q3 2025 Participation</p>
                <p className="text-3xl font-bold text-purple-600">48.7%</p>
                <p className="text-xs text-gray-500 mt-1">312 total votes (+27%)</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Q4 2025 Participation</p>
                <p className="text-3xl font-bold text-purple-600">53.2%</p>
                <p className="text-xs text-gray-500 mt-1">387 total votes (+24%)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={grantData.quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgVoterParticipation" stroke="#8b5cf6" name="Participation %" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="totalVotes" stroke="#10b981" name="Total Votes" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grant Details Table */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Grant Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grant ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quarter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grantData.grants.map((grant) => (
                    <tr key={grant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grant.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.quarter}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grant.tier === 3 ? 'bg-red-100 text-red-800' :
                          grant.tier === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Tier {grant.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{grant.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(grant.value / 1e6).toFixed(2)}M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grant.status === 'completed' ? 'bg-green-100 text-green-800' :
                          grant.status === 'receiving' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {grant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.voterParticipation.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.totalVotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Tier Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Tier 3 ($1M+)</span>
                    <span className="text-sm font-semibold text-gray-900">5 grants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '41.7%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Tier 2 ($250K+)</span>
                    <span className="text-sm font-semibold text-gray-900">7 grants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '58.3%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Tier 1 ($50K+)</span>
                    <span className="text-sm font-semibold text-gray-900">9 grants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Status Overview</h3>
              <div className="space-y-4">
                <DetailRow label="Completed Projects" value="9" />
                <DetailRow label="Active Projects" value="7" />
                <DetailRow label="Applications Pending" value="15" />
                <DetailRow label="Success Rate" value="56.3%" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Participation Trends</h3>
              <div className="space-y-4">
                <DetailRow label="Highest Participation" value="56.7% (G-2025-008)" />
                <DetailRow label="Lowest Participation" value="39.5% (G-2025-003)" />
                <DetailRow label="Average Votes/Grant" value="298" />
                <DetailRow label="Growth Q2→Q4" value="+25.8%" />
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div className="max-w-7xl mx-auto bg-purple-50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-purple-700">
                  <strong>Manual Data Entry:</strong> Grant data can be manually updated through the admin panel. 
                  Current data represents mock projections based on the ASIP governance framework.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const MetricCard = ({ title, value, subtitle, trend, positive }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
    {trend && (
      <span className={`text-xs font-semibold ${positive ? 'text-green-600' : 'text-gray-600'}`}>
        {trend}
      </span>
    )}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default SAITGovernanceDashboard;