import React from 'react';
import { Report } from '../types';
import { FileText, MapPin, Shield, Check, Clock, Link as LinkIcon } from 'lucide-react';

interface ReportFeedProps {
  reports: Report[];
}

const ReportFeed: React.FC<ReportFeedProps> = ({ reports }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Recent On-Chain Activity</h2>
        <span className="text-xs font-mono text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-700/50 animate-pulse">
          ● Live Node Connection
        </span>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No reports in the chain yet. Be the first to submit.
          </div>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail / Visual Evidence */}
                <div className="w-full md:w-48 h-32 shrink-0 bg-slate-900 rounded-lg overflow-hidden relative">
                  {report.image ? (
                    <img 
                      src={report.image} 
                      alt="Evidence" 
                      className="w-full h-full object-cover filter blur-sm group-hover:blur-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                    EVIDENCE # {report.id}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${report.category === 'Illegal Activity' ? 'bg-red-500/20 text-red-400' : 
                        report.category === 'Accident' ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-blue-500/20 text-blue-400'}`}>
                      {report.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(report.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="bg-slate-900/50 rounded-lg p-3 text-xs font-mono space-y-2 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location Hash
                      </span>
                      <span className="text-slate-300 truncate max-w-[150px]">{btoa(report.location).substring(0, 16)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" /> IPFS CID
                      </span>
                      <span className="text-blue-400 truncate max-w-[150px] cursor-pointer hover:underline">{report.ipfsCid}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Auth Score
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${report.authenticityScore > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${report.authenticityScore * 100}%` }}
                          />
                        </div>
                        <span className={report.authenticityScore > 0.8 ? 'text-green-400' : 'text-yellow-400'}>
                          {(report.authenticityScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {report.aiAnalysis && (
                    <div className="mt-3 text-xs text-slate-500 italic border-l-2 border-purple-500 pl-3">
                      AI Note: "{report.aiAnalysis}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportFeed;