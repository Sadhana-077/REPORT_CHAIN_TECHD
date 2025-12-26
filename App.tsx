import React, { useState } from 'react';
import Hero from './components/Hero';
import ReportForm from './components/ReportForm';
import ReportFeed from './components/ReportFeed';
import Stats from './components/Stats';
import { Report, ReportCategory } from './types';
import { Layout, PlusCircle, Activity } from 'lucide-react';

// Dummy Initial Data to populate the feed
const INITIAL_REPORTS: Report[] = [
  {
    id: '9xa8s7d',
    timestamp: Date.now() - 3600000,
    description: "Illegal dumping of chemical waste near the river bank observed.",
    category: ReportCategory.ILLEGAL_ACTIVITY,
    location: "River Rd, Sector 4",
    authenticityScore: 0.92,
    aiAnalysis: "Image shows industrial drums consistent with chemical waste containers.",
    txHash: "0x7d8f...",
    ipfsCid: "QmX7y...",
    status: 'Verified',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2kd9s8a',
    timestamp: Date.now() - 86400000,
    description: "Deep pothole on the main highway causing vehicle damage.",
    category: ReportCategory.INFRASTRUCTURE,
    location: "Highway 42, Mile 12",
    authenticityScore: 0.88,
    aiAnalysis: "Road damage pattern consistent with descriptions.",
    txHash: "0x2a9c...",
    ipfsCid: "QmZ9w...",
    status: 'Verified',
    image: 'https://picsum.photos/400/300?random=2'
  }
];

function App() {
  const [view, setView] = useState<'home' | 'report' | 'feed'>('home');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  const handleReportSuccess = (newReport: Report) => {
    setReports([newReport, ...reports]);
    setView('feed');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer font-bold text-xl tracking-tight text-white"
            onClick={() => setView('home')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            ReportChain
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('feed')}
              className={`text-sm font-medium transition-colors ${view === 'feed' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              Public Ledger
            </button>
            <button 
              onClick={() => setView('report')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/50"
            >
              <PlusCircle className="w-4 h-4" />
              New Report
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {view === 'home' && (
          <Hero onStartReporting={() => setView('report')} />
        )}

        {view === 'report' && (
          <div className="container mx-auto px-6 py-12">
            <ReportForm onSuccess={handleReportSuccess} />
          </div>
        )}

        {view === 'feed' && (
          <div className="container mx-auto px-6 py-12">
            {/* Dashboard Stats */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                 <Activity className="w-6 h-6 text-purple-400" />
                 <h2 className="text-3xl font-bold text-white">Network Activity</h2>
               </div>
               <Stats reports={reports} />
            </div>

            {/* Reports List */}
            <ReportFeed reports={reports} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2025 Blockchain Report Chain DApp. Secure. Anonymous. Immutable.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="text-xs text-slate-600">IPFS Node: Active</span>
            <span className="text-xs text-slate-600">Smart Contract: 0x8a...4b12</span>
            <span className="text-xs text-slate-600">Gas Sponsor: Govt/NGO Wallet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;