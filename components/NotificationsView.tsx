import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { Bell, Check, Trash2, Clock, Info, CheckCircle, AlertTriangle, Search, CheckSquare } from 'lucide-react';
import { useToast } from './Toast';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, setNotifications }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'alert'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast('Notification removed', 'info');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      showToast('All notifications cleared', 'info');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !n.isRead :
      filter === 'alert' ? n.type === 'alert' : true;
    
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
      case 'info': return <Info size={20} className="text-blue-500" />;
      default: return <Bell size={20} className="text-slate-400" />;
    }
  };

  const getBgColor = (type: string) => {
     switch (type) {
      case 'alert': return 'bg-amber-50';
      case 'success': return 'bg-emerald-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-indigo-600" /> Notification Center
          </h2>
          <p className="text-slate-500 text-sm">Manage your system alerts and updates</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleMarkAllRead}
             className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
           >
             <CheckSquare size={16} /> Mark all read
           </button>
           <button 
             onClick={handleClearAll}
             className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
           >
             <Trash2 size={16} /> Clear all
           </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
          {['all', 'unread', 'alert'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filter === f 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {filteredNotifications.map((item) => (
              <div 
                key={item.id} 
                className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 group ${!item.isRead ? 'bg-indigo-50/20' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-semibold ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {item.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity self-center sm:self-start">
                  {!item.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(item.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
            <Bell size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">No notifications found</p>
            {filter !== 'all' && (
               <button 
                 onClick={() => setFilter('all')}
                 className="mt-2 text-xs text-indigo-600 hover:underline"
               >
                 Clear filters
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
