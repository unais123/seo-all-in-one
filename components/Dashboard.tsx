import React from 'react';
import { BusinessProfile, AuditResult } from '../types';
import { Activity, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  profile: BusinessProfile;
  auditResults: AuditResult | null;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, auditResults }) => {
  const score = auditResults ? auditResults.score : 0;
  
  // Mock data for the chart
  const data = [
    { name: 'Mon', traffic: 120 },
    { name: 'Tue', traffic: 150 },
    { name: 'Wed', traffic: 200 },
    { name: 'Thu', traffic: 180 },
    { name: 'Fri', traffic: 250 },
    { name: 'Sat', traffic: 190 },
    { name: 'Sun', traffic: 160 },
  ];

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Hello, {profile.businessName} 👋</h2>
        <p className="text-blue-100 opacity-90 max-w-2xl">
          Your comprehensive SEO dashboard is ready. We've analyzed your site 
          <span className="font-mono bg-blue-500 bg-opacity-30 px-2 py-0.5 rounded ml-2 text-sm">{profile.websiteUrl}</span> 
          and found several opportunities for growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Overall Health" 
          value={`${score}/100`} 
          sub={score > 70 ? "Good condition" : "Needs attention"} 
          icon={Activity} 
          color={score > 70 ? "bg-green-500" : "bg-orange-500"} 
        />
        <StatCard 
          title="Est. Traffic" 
          value="1.2k" 
          sub="+12% from last month" 
          icon={TrendingUp} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Keyword Ranking" 
          value="24" 
          sub="Keywords in Top 10" 
          icon={Users} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Action Items" 
          value={auditResults?.issues.length || 0} 
          sub="Pending fixes" 
          icon={CheckCircle} 
          color="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Traffic Overview (Simulated)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                />
                <Bar dataKey="traffic" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#3B82F6' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Wins</h3>
          <div className="space-y-4">
            {auditResults?.issues.slice(0, 4).map((issue, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className={`w-2 h-full rounded-full self-stretch flex-shrink-0 ${
                  issue.type === 'CRITICAL' ? 'bg-red-500' : issue.type === 'WARNING' ? 'bg-orange-400' : 'bg-blue-400'
                }`}></div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{issue.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{issue.recommendation}</p>
                </div>
              </div>
            ))}
            {!auditResults && <p className="text-sm text-gray-500">Run an audit to see quick wins.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;