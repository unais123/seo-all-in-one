import React, { useState } from 'react';
import { BusinessProfile, AuditResult, SeoIssue } from '../types';
import { generateAudit, fixIssueWithAI } from '../services/geminiService';
import { AlertTriangle, CheckCircle, Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface AuditProps {
  profile: BusinessProfile;
  auditResults: AuditResult | null;
  setAuditResults: (res: AuditResult) => void;
}

const Audit: React.FC<AuditProps> = ({ profile, auditResults, setAuditResults }) => {
  const [loading, setLoading] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [fixes, setFixes] = useState<Record<string, string>>({});
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const runAudit = async () => {
    setLoading(true);
    const results = await generateAudit(profile);
    setAuditResults(results);
    setLoading(false);
  };

  const handleFix = async (issue: SeoIssue) => {
    setFixingId(issue.id);
    const fix = await fixIssueWithAI(issue, profile);
    setFixes(prev => ({ ...prev, [issue.id]: fix }));
    setFixingId(null);
  };

  if (!auditResults && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <RefreshCw size={48} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Audit?</h2>
        <p className="text-gray-500 max-w-md mb-8">
          We will scan your pages, check technical signals, and analyze your content structure to find SEO opportunities.
        </p>
        <button 
          onClick={runAudit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Start Full SEO Audit
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <div>
            <h3 className="text-xl font-semibold text-gray-800">Analyzing {profile.websiteUrl}...</h3>
            <p className="text-gray-500 mt-2">Checking meta tags, crawling structure, and generating insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Technical & On-Page Audit</h2>
            <p className="text-gray-500">Last updated: Just now</p>
        </div>
        <button onClick={runAudit} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <RefreshCw size={16} /> Re-run Audit
        </button>
      </div>

      {/* Score Summary */}
      {auditResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Overall Score</p>
                    <div className="text-4xl font-bold text-gray-900 mt-1">{auditResults.score}</div>
                </div>
                <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center font-bold text-lg ${
                    auditResults.score > 75 ? 'border-green-500 text-green-600' : 
                    auditResults.score > 50 ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-600'
                }`}>
                    {auditResults.score}%
                </div>
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Executive Summary</p>
                <p className="text-gray-700 leading-relaxed">{auditResults.summary}</p>
            </div>
        </div>
      )}

      {/* Issues List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Identified Issues ({auditResults?.issues.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
            {auditResults?.issues.map((issue) => (
                <div key={issue.id} className="p-6 transition-colors hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${
                            issue.type === 'CRITICAL' ? 'bg-red-100 text-red-600' : 
                            issue.type === 'WARNING' ? 'bg-orange-100 text-orange-600' : 
                            'bg-blue-100 text-blue-600'
                        }`}>
                            <AlertTriangle size={20} />
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="text-base font-semibold text-gray-900">{issue.title}</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                                    issue.type === 'CRITICAL' ? 'bg-red-100 text-red-800' : 
                                    issue.type === 'WARNING' ? 'bg-orange-100 text-orange-800' : 
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {issue.type}
                                </span>
                            </div>
                            
                            <p className="text-gray-600 mt-1 text-sm">{issue.description}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button 
                                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                    className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700"
                                >
                                    {expandedIssue === issue.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                    {expandedIssue === issue.id ? "Hide Details" : "View Details & Fix"}
                                </button>
                            </div>

                            {expandedIssue === issue.id && (
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recommendation</h5>
                                    <p className="text-sm text-gray-700 mb-4">{issue.recommendation}</p>
                                    
                                    {!fixes[issue.id] ? (
                                        <button 
                                            onClick={() => handleFix(issue)}
                                            disabled={fixingId === issue.id}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {fixingId === issue.id ? (
                                                <RefreshCw className="animate-spin" size={16} />
                                            ) : (
                                                <Zap size={16} />
                                            )}
                                            {fixingId === issue.id ? "Generating Fix..." : "Fix with AI"}
                                        </button>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                            <div className="flex items-center gap-2 mb-2 text-green-800 font-semibold text-sm">
                                                <CheckCircle size={16} /> AI Suggested Fix:
                                            </div>
                                            <div className="bg-white p-2 rounded border border-green-100 font-mono text-xs text-gray-800 overflow-x-auto">
                                                {fixes[issue.id]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Audit;