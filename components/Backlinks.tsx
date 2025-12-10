import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '../types';
import { generateBacklinkStrategy } from '../services/geminiService';
import { Link as LinkIcon, Mail, ExternalLink } from 'lucide-react';

interface BacklinksProps {
  profile: BusinessProfile;
}

const Backlinks: React.FC<BacklinksProps> = ({ profile }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
        setLoading(true);
        const res = await generateBacklinkStrategy(profile);
        setData(res);
        setLoading(false);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !data) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <LinkIcon /> Backlink Strategy
        </h2>
        <p className="text-slate-300">
            Outreach targets to improve domain authority for <span className="font-semibold text-white">{profile.businessName}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
             <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">High Potential Opportunities</h3>
             </div>
             <div className="divide-y divide-gray-100">
                {data.opportunities?.map((opp: any, i: number) => (
                    <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{opp.type}</span>
                            <h4 className="text-base font-medium text-gray-900 mt-2">{opp.target}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                opp.potential === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {opp.potential} Potential
                            </span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
                  <Mail size={18} /> Outreach Template
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 font-mono whitespace-pre-wrap overflow-y-auto max-h-[400px]">
                  {data.emailTemplate}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(data.emailTemplate)}
                className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                  Copy Template
              </button>
          </div>
      </div>
    </div>
  );
};

export default Backlinks;