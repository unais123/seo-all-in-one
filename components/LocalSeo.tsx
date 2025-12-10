import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '../types';
import { generateLocalStrategy } from '../services/geminiService';
import { MapPin, Globe, Layout, Share2 } from 'lucide-react';

interface LocalSeoProps {
  profile: BusinessProfile;
}

const LocalSeo: React.FC<LocalSeoProps> = ({ profile }) => {
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStrategy = async () => {
        setLoading(true);
        const data = await generateLocalStrategy(profile);
        setStrategy(data);
        setLoading(false);
    };
    fetchStrategy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !strategy) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Local SEO & AEO Strategy</h2>
        <p className="text-gray-500">Dominate local search in <span className="font-semibold">{profile.location}</span>.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Google Business Profile */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 p-4 flex items-center gap-3 text-white">
                <MapPin />
                <h3 className="font-semibold">Google Business Profile Optimizer</h3>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Optimized Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-200">
                        {strategy.googleBusinessProfile?.description}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Weekly Post Ideas</h4>
                    <ul className="space-y-3">
                        {strategy.googleBusinessProfile?.posts.map((post: string, i: number) => (
                            <li key={i} className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg">
                                <Share2 size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-800">{post}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Local Landing Page */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-purple-600 p-4 flex items-center gap-3 text-white">
                <Layout />
                <h3 className="font-semibold">Local Landing Page Structure</h3>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Recommended H1</h4>
                    <div className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
                        {strategy.landingPageStructure?.h1}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">Content Sections</h4>
                    <div className="space-y-2">
                         {strategy.landingPageStructure?.sections.map((sec: string, i: number) => (
                             <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                 <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                     {i + 1}
                                 </div>
                                 {sec}
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Hyperlocal Keywords */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <div className="flex items-center gap-2 mb-4">
                <Globe className="text-green-600" size={20} />
                <h3 className="font-bold text-gray-800">Hyperlocal Keywords</h3>
             </div>
             <div className="flex flex-wrap gap-2">
                {strategy.localKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                        {kw}
                    </span>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default LocalSeo;