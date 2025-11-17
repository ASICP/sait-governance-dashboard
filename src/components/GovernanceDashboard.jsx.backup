import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dashboard Component for SAIT Token Ecosystem
const SAITGovernanceDashboard = () => {
  // State for real-time data
  const [dashboardData, setDashboardData] = useState({
    saitCirculating: 0,
    saitTreasury: 30000000,
    satTreasury: 0,
    saitPrice: 150,
    satPrice: 150,
    buybackRate: 0.003,
    totalSupply: 100000000
  });

  const [historicalData, setHistoricalData] = useState([]);
  const [projections, setProjections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data from blockchain (replace with actual Web3 calls)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In production, replace with actual contract calls
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const saitContract = new ethers.Contract(SAIT_ADDRESS, SAIT_ABI, provider);
        
        // Simulated data based on whitepaper Year 1 projections
        const mockData = {
          saitCirculating: 10000000, // 10M SAIT in circulation (Year 1)
          saitTreasury: 28550000, // After Year 1 sales
          satTreasury: 1629000, // Year 1 SAT reserves
          saitPrice: 165, // EOY Year 1 price
          satPrice: 150, // Fixed SAT price
          buybackRate: 0.015, // 1.5% monthly by Year 1 end
          totalSupply: 100000000
        };

        setDashboardData(mockData);
        generateHistoricalData(mockData);
        generateProjections(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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
          <p className="text-blue-100">Real-time Ecosystem Metrics & Projections</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          trend={`${metrics.buybackRate * 100}% monthly buyback`}
        />
        <MetricCard 
          title="Treasury Value" 
          value={`$${metrics.treasuryValue.toFixed(2)}B`}
          subtitle={`${(dashboardData.satTreasury / 1e6).toFixed(2)}M SAT reserves`}
          positive={true}
        />
      </div>

      {/* Main Charts Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
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
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
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
      <div className="max-w-7xl mx-auto mt-8 bg-blue-50 rounded-lg p-4">
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
