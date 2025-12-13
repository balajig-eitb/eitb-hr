import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RolesView from './components/RolesView';
import CandidateDirectory from './components/CandidateDirectory';
import Recruitment from './components/Recruitment';
import AIJobGenerator from './components/AIJobGenerator';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import Settings from './components/Settings';
import NotificationsView from './components/NotificationsView';
import AddCandidateForm from './components/AddCandidateForm';
import Login from './components/Login';
import { ViewState, NotificationItem, Candidate, Roles } from './types';
import { ToastProvider } from './components/Toast';
import { Bell, Check, Clock, Info, X } from 'lucide-react';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'New Application', message: 'Sarah Connor applied for Frontend Dev', time: '10 min ago', isRead: false, type: 'info' },
  { id: '2', title: 'Interview Reminder', message: 'Interview with David Chen at 2:00 PM', time: '1 hour ago', isRead: false, type: 'alert' },
  { id: '3', title: 'AI Analysis Complete', message: 'Resume parsing for 5 candidates finished', time: '3 hours ago', isRead: true, type: 'success' },
  { id: '4', title: 'Offer Accepted', message: 'Mike Ross accepted the offer letter', time: 'Yesterday', isRead: true, type: 'success' },
];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: '1', name: 'David Chen', role: 'Full Stack Developer', experience: 5, skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'], status: 'Screening', email: 'david.chen@example.com', avatar: 'https://picsum.photos/105/105', appliedDate: '2024-03-01', matchScore: 88, location: 'New York, NY', currentCompany: 'TechSoft Inc.' },
  { id: '2', name: 'Maria Rodriguez', role: 'UI/UX Designer', experience: 3, skills: ['Figma', 'Tailwind', 'Vue.js'], status: 'New', email: 'm.rodriguez@example.com', avatar: 'https://picsum.photos/106/106', appliedDate: '2024-03-02', matchScore: 92, location: 'San Francisco, CA', currentCompany: 'Design Co.' },
  { id: '3', name: 'James Smith', role: 'DevOps Engineer', experience: 7, skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], status: 'Interview', email: 'james.s@example.com', avatar: 'https://picsum.photos/107/107', appliedDate: '2024-02-28', matchScore: 75, location: 'Austin, TX', currentCompany: 'Cloud Net' },
  { id: '4', name: 'Anita Patel', role: 'Product Manager', experience: 6, skills: ['Agile', 'Jira', 'Product Strategy'], status: 'Offer', email: 'anita.p@example.com', avatar: 'https://picsum.photos/108/108', appliedDate: '2024-02-15', matchScore: 95, location: 'Chicago, IL', currentCompany: 'FinTech Corp' },
  { id: '5', name: 'Robert Fox', role: 'Frontend Developer', experience: 2, skills: ['React', 'CSS'], status: 'Rejected', email: 'robert.f@example.com', avatar: 'https://picsum.photos/109/109', appliedDate: '2024-03-03', matchScore: 45, location: 'Remote', currentCompany: 'Freelance' },
];


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [roles, setRoles] = useState<Roles[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addCandidate = (candidate: Candidate) => {
    setCandidates([candidate, ...candidates]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <Clock size={16} className="text-amber-500" />;
      case 'success': return <Check size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.CANDIDATES:
        return <CandidateDirectory candidates={candidates} setCandidates={setCandidates} onNavigate={setCurrentView} />;
      case ViewState.ROLES:
        return <RolesView roles={roles} setRoles={setRoles} onNavigate={setCurrentView} />;
        case ViewState.RECRUITMENT:
        return <Recruitment candidates={candidates} setCandidates={setCandidates} onNavigate={setCurrentView} />;
      case ViewState.RESUME_ANALYZER:
        return <ResumeAnalyzer />;
      case ViewState.JD_GENERATOR:
        return <AIJobGenerator />;
      case ViewState.SETTINGS:
        return <Settings />;
      case ViewState.NOTIFICATIONS:
        return <NotificationsView notifications={notifications} setNotifications={setNotifications} />;
      case ViewState.ADD_CANDIDATE:
        return <AddCandidateForm onNavigate={setCurrentView} />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
          onLogout={() => setIsLoggedIn(false)}
        />
        
        <main className="flex-1 ml-64 p-8 transition-all duration-300">
          <header className="flex justify-between items-center mb-8 relative">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {currentView === ViewState.DASHBOARD && 'Dashboard Overview'}
                {currentView === ViewState.CANDIDATES && 'Candidate Directory'}
                {currentView === ViewState.ROLES && 'Roles Directory'}
                {currentView === ViewState.RECRUITMENT && 'Recruitment Pipeline'}
                {currentView === ViewState.RESUME_ANALYZER && 'Resume Analyzer'}
                {currentView === ViewState.JD_GENERATOR && 'Job Description Generator'}
                {currentView === ViewState.SETTINGS && 'Settings & Preferences'}
                {currentView === ViewState.NOTIFICATIONS && 'Notification Center'}
                {currentView === ViewState.ADD_CANDIDATE && 'Add Candidate'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {currentView === ViewState.SETTINGS 
                  ? 'Manage your profile details and application notifications.'
                  : currentView === ViewState.NOTIFICATIONS
                  ? 'View and manage all your system alerts.'
                  : currentView === ViewState.ADD_CANDIDATE
                  ? 'Manually add a new candidate to the recruitment pipeline.'
                  : 'Welcome back, Admin. Here\'s what\'s happening today.'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-semibold text-slate-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map(item => (
                          <div key={item.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!item.isRead ? 'bg-indigo-50/30' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`mt-0.5 min-w-[24px] h-6 rounded-full flex items-center justify-center bg-white border shadow-sm`}>
                                {getNotificationIcon(item.type)}
                              </div>
                              <div>
                                <h4 className={`text-sm ${!item.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                  {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.message}</p>
                                <p className="text-[10px] text-slate-400 mt-1.5">{item.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                         <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-50 text-center">
                      <button 
                        onClick={() => { setShowNotifications(false); setCurrentView(ViewState.NOTIFICATIONS); }}
                        className="text-xs text-slate-500 hover:text-indigo-600 font-medium py-1 w-full"
                      >
                        View All Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile - Clickable */}
              <div 
                onClick={() => setCurrentView(ViewState.SETTINGS)}
                className="flex items-center gap-4 cursor-pointer group p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                title="Edit Profile"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Admin User</p>
                  <p className="text-xs text-slate-500">Human Resources</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm group-hover:border-indigo-200 transition-colors overflow-hidden">
                   <img src="/images/malini.gif" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
};

export default App;
