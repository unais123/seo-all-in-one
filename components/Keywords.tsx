import React, { useState, useEffect } from 'react';
import { BusinessProfile, KeywordData } from '../types';
import { generateKeywords } from '../services/geminiService';
import { Search, PenTool, BarChart2, Plus } from 'lucide-react';

interface KeywordsProps {
  profile: BusinessProfile;
  onGenerateContent: (keyword: string) => void;
}

const Keywords: React.FC<KeywordsProps> = ({ profile, onGenerateContent }) => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-load keywords if empty
    if (keywords.length === 0) {
      handleLoadKeywords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadKeywords = async () => {
    setLoading(true);
    const data = await generateKeywords(profile);
    setKeywords(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Keyword Strategy</h2>
            <p className="text-gray-500 mt-1">
                Targeting opportunities for <span className="font-semibold text-gray-700">{profile.primaryKeywords}</span> in {profile.location}.
            </p>
        </div>
        <button 
            onClick={handleLoadKeywords} 
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div> : <Plus size={16} />}
            Find More Ideas
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Keyword</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intent</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading && keywords.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                <div className="flex justify-center mb-2">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                                Finding high-value keywords...
                            </td>
                         </tr>
                    ) : keywords.map((kw, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-gray-900">{kw.keyword}</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs px-2 py-1 rounded-full border ${
                                    kw.intent === 'Transactional' ? 'bg-green-50 text-green-700 border-green-200' :
                                    kw.intent === 'Informational' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    kw.intent === 'Local' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                    {kw.intent}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{kw.volume}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${
                                                kw.difficulty > 70 ? 'bg-red-500' : 
                                                kw.difficulty > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`} 
                                            style={{ width: `${kw.difficulty}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{kw.difficulty}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => onGenerateContent(kw.keyword)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <PenTool size={14} /> Write Post
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Keywords;