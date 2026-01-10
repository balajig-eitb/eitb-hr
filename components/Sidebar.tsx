import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, LogOut, FileSearch, Workflow } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: ViewState.ROLES, label: 'Roles', icon: <Workflow size={20} /> },
    { id: ViewState.CANDIDATES, label: 'Candidates', icon: <Users size={20} /> },
    { id: ViewState.RECRUITMENT, label: 'Pipeline', icon: <Briefcase size={20} /> },
    { id: ViewState.RESUME_ANALYZER, label: 'Resume Analyzer', icon: <FileSearch size={20} /> },
    { id: ViewState.JD_GENERATOR, label: 'JD Generator', icon: <FileText size={20} /> },
    { id: ViewState.USERS, label: 'Users', icon: <Users size={20} /> },

  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-10 shadow-xl transition-all duration-300">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
        {/* <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">E</div>
        <span className="text-xl font-semibold tracking-tight">EITB HR</span> */}
        <img src='/images/logo.png' className='filter brightness-0 invert'/>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <button 
          onClick={() => onNavigate(ViewState.SETTINGS)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            currentView === ViewState.SETTINGS
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors hover:bg-slate-800 rounded-lg"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
