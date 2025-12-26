import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Report, ReportCategory } from '../types';

interface StatsProps {
  reports: Report[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'];

const Stats: React.FC<StatsProps> = ({ reports }) => {
  // Aggregate data for Pie Chart (Categories)
  const categoryData = Object.values(ReportCategory).map(cat => ({
    name: cat,
    value: reports.filter(r => r.category === cat).length
  })).filter(d => d.value > 0);

  // Aggregate data for Bar Chart (Authenticity Scores)
  // Grouping into buckets: High (>0.8), Medium (0.5-0.8), Low (<0.5)
  const scoreData = [
    { name: 'Verified', count: reports.filter(r => r.authenticityScore >= 0.8).length },
    { name: 'Pending', count: reports.filter(r => r.authenticityScore >= 0.5 && r.authenticityScore < 0.8).length },
    { name: 'Flagged', count: reports.filter(r => r.authenticityScore < 0.5).length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* Category Distribution */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Report Categories</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {categoryData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              {entry.name} ({entry.value})
            </div>
          ))}
        </div>
      </div>

      {/* Trustworthiness Metrics */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">AI Verification Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
              <Tooltip
                cursor={{fill: '#334155', opacity: 0.2}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {scoreData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          Reports are automatically analyzed by Gemini AI to filter spam and deepfakes.
        </p>
      </div>
    </div>
  );
};

export default Stats;