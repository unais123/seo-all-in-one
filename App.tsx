import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Audit from './components/Audit';
import Keywords from './components/Keywords';
import Content from './components/Content';
import LocalSeo from './components/LocalSeo';
import Backlinks from './components/Backlinks';
import { AppView, BusinessProfile, AuditResult } from './types';
import { Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [profile, setProfile] = useState<BusinessProfile>({
    websiteUrl: '',
    businessName: '',
    industry: '',
    location: '',
    primaryKeywords: '',
    competitors: ''
  });
  
  // Lifted state for Audit so it persists when navigating
  const [auditResults, setAuditResults] = useState<AuditResult | null>(null);
  
  // State to pass keyword to content generator
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.websiteUrl && profile.businessName) {
      setView(AppView.DASHBOARD);
    }
  };

  const handleGenerateContentFromKeyword = (topic: string) => {
    setSelectedTopic(topic);
    setView(AppView.CONTENT);
  };

  if (view === AppView.ONBOARDING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Rocket size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">SEOBox</h1>
            <p className="text-gray-500 mt-2">Your AI-powered SEO Agency. Set up your project to get started.</p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input 
                type="url" 
                required
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.websiteUrl}
                onChange={e => setProfile({...profile, websiteUrl: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. GoDrive Rentals"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.businessName}
                onChange={e => setProfile({...profile, businessName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input 
                  type="text" 
                  placeholder="e.g. Car Rental"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.industry}
                  onChange={e => setProfile({...profile, industry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mangalore"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.location}
                  onChange={e => setProfile({...profile, location: e.target.value})}
                />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Focus Keyword</label>
                <input 
                  type="text" 
                  placeholder="e.g. self drive cars"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.primaryKeywords}
                  onChange={e => setProfile({...profile, primaryKeywords: e.target.value})}
                />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
            >
              Launch Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} onChangeView={setView}>
      {view === AppView.DASHBOARD && <Dashboard profile={profile} auditResults={auditResults} />}
      {view === AppView.AUDIT && (
        <Audit 
          profile={profile} 
          auditResults={auditResults} 
          setAuditResults={setAuditResults} 
        />
      )}
      {view === AppView.KEYWORDS && (
        <Keywords 
            profile={profile} 
            onGenerateContent={handleGenerateContentFromKeyword}
        />
      )}
      {view === AppView.CONTENT && <Content profile={profile} initialTopic={selectedTopic} />}
      {view === AppView.LOCAL_SEO && <LocalSeo profile={profile} />}
      {view === AppView.BACKLINKS && <Backlinks profile={profile} />}
    </Layout>
  );
};

export default App;