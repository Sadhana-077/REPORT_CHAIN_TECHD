import React from 'react';
import { ShieldCheck, FileLock, Eye, Globe } from 'lucide-react';

interface HeroProps {
  onStartReporting: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartReporting }) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white min-h-[80vh] flex items-center">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[40%] bg-indigo-600/20 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200">
            Report Chain <br/>
            <span className="text-3xl md:text-5xl font-medium text-slate-400">Using Blockchain</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            A decentralized, anonymous platform empowering citizens to report issues securely. 
            We use <span className="text-blue-400 font-semibold">Blockchain</span> for immutability and <span className="text-purple-400 font-semibold">AI</span> for verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={onStartReporting}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 transition-all transform hover:scale-105"
            >
              Report an Issue Anonymously
            </button>
            <button className="px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all">
              View Public Ledger
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800 pt-8">
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-500/10 rounded-lg mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-200">Anonymity</h3>
              <p className="text-sm text-slate-400">Identity protected via cryptographic protocols.</p>
            </div>
            <div className="flex flex-col items-start">
              <div className="p-3 bg-purple-500/10 rounded-lg mb-3">
                <FileLock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-200">Immutability</h3>
              <p className="text-sm text-slate-400">Records cannot be altered once on-chain.</p>
            </div>
            <div className="flex flex-col items-start">
              <div className="p-3 bg-pink-500/10 rounded-lg mb-3">
                <Eye className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-semibold text-slate-200">Transparency</h3>
              <p className="text-sm text-slate-400">Publicly verifiable proof of existence.</p>
            </div>
            <div className="flex flex-col items-start">
              <div className="p-3 bg-green-500/10 rounded-lg mb-3">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-200">Gas-Free</h3>
              <p className="text-sm text-slate-400">Govt/NGO system wallets cover costs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;