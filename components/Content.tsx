import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '../types';
import { generateBlogPost } from '../services/geminiService';
import { PenTool, Download, Copy, Check } from 'lucide-react';

interface ContentProps {
  profile: BusinessProfile;
  initialTopic?: string;
}

const Content: React.FC<ContentProps> = ({ profile, initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || '');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const result = await generateBlogPost(topic, profile);
    setContent(result);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex gap-4">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a blog topic or keyword..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !topic}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <PenTool size={18} />
          )}
          {isGenerating ? 'Writing...' : 'Generate Article'}
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
        {!content ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <PenTool size={32} className="text-gray-300" />
            </div>
            <p>Enter a topic above to generate a full SEO-optimized blog post with correct headings, FAQs, and meta tags.</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Editor</span>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Download">
                  <Download size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-blue max-w-none">
                {/* Simple rendering of markdown-like text */}
                <div className="whitespace-pre-wrap font-serif text-lg text-gray-800 leading-relaxed">
                  {content}
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Content;