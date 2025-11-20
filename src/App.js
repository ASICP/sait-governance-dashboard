import React from 'react';
import SAITGovernanceDashboard from './components/GovernanceDashboard';
import './App.css';

function App() {
  const SAIT_CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbE';

  return (
    <div className="App">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">ASIP Governance</h1>
                <p className="text-xs text-gray-500">Aligned Sovereign Intelligence Protocol</p>
              </div>
            </div>

            {/* Contract Address */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-xs text-gray-600 mr-2">Contract:</span>
              <code className="text-xs font-mono text-gray-900">{SAIT_CONTRACT_ADDRESS}</code>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <SAITGovernanceDashboard />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">About ASIP</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The Aligned Sovereign Intelligence Protocol provides perpetual, non-dilutive funding 
                for AI safety research through transparent governance and treasury-backed economics.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/Mbastidas001/SAIToken_v2" className="text-xs text-blue-600 hover:text-blue-800">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#whitepaper" className="text-xs text-blue-600 hover:text-blue-800">
                    ASIP White Paper
                  </a>
                </li>
                <li>
                  <a href="#economics" className="text-xs text-blue-600 hover:text-blue-800">
                    SAIT/SAT Economics
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
              <p className="text-xs text-gray-600 mb-2">
                For questions or support:
              </p>
              <a href="mailto:amonroy@asi2.org" className="text-xs text-blue-600 hover:text-blue-800">
                amonroy@asi2.org
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              © 2025 ASIP. All rights reserved. | 
              <span className="ml-2">
                Dashboard Version 1.0.0
              </span>
            </p>
            <p className="text-xs text-center text-gray-400 mt-2">
              This dashboard is for informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
