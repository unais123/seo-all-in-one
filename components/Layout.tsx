import React from 'react';
import { AppView } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  MapPin, 
  Link as LinkIcon, 
  Settings,
  Activity
} from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.AUDIT, label: 'SEO Audit', icon: Activity },
    { id: AppView.KEYWORDS, label: 'Keyword Research', icon: Search },
    { id: AppView.CONTENT, label: 'Content AI', icon: FileText },
    { id: AppView.LOCAL_SEO, label: 'Local SEO', icon: MapPin },
    { id: AppView.BACKLINKS, label: 'Backlinks', icon: LinkIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-all duration-300">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">S</div>
            <h1 className="text-xl font-bold tracking-tight">SEOBox</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Agency-level SEO, automated.</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onChangeView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white w-full transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find(i => i.id === currentView)?.label}
            </h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Welcome, Admin</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    A
                </div>
            </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;