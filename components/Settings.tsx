import React, { useState, useRef } from 'react';
import { User, Bell, Mail, Lock, Save, Camera, Smartphone, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';

const Settings: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile State
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'hr@elephantintheboardroom.co.in',
    role: 'Senior HR Manager',
    bio: 'Experienced HR professional specializing in technical recruitment and talent acquisition.',
    avatar: '/images/malini.gif'
  });

  // Validation State
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Notification State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newApplications: true,
    interviewReminders: true,
    aiInsights: false,
    marketing: false,
  });

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.role.trim()) newErrors.role = 'Role is required';
    
    if (!profile.email.trim()) {
        newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
        newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size must be less than 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        showToast('Profile photo updated successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    const newState = !notifications[key];
    if (newState) {
       showToast('Notification enabled', 'success');
    }
  };

  const handleSaveProfile = () => {
    if (!validateForm()) {
        showToast('Please correct the errors in the profile form', 'error');
        return;
    }
    showToast('Profile updated successfully', 'success');
  };

  const getInputClass = (error?: string) => {
      const base = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors";
      return error 
        ? `${base} border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50` 
        : `${base} border-slate-200 focus:ring-indigo-500`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User size={20} className="text-indigo-600" />
            Profile Information
          </h2>
          <button 
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Column */}
          <div className="col-span-1 flex flex-col items-center">
            <div 
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
              title="Click to change photo"
            >
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white shadow-lg overflow-hidden">
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button 
              onClick={handleAvatarClick}
              className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Change Photo
            </button>
            <p className="text-xs text-slate-400 mt-1">Max size 2MB</p>
          </div>

          {/* Form Column */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className={getInputClass(errors.firstName)}
                />
                {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className={getInputClass(errors.lastName)}
                />
                {errors.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-2.5 ${errors.email ? 'text-rose-400' : 'text-slate-400'}`} size={16} />
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className={`${getInputClass(errors.email)} pl-10`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role / Title</label>
              <input 
                type="text" 
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                className={getInputClass(errors.role)}
              />
              {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea 
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell size={20} className="text-amber-500" />
            Notification Preferences
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage how and when you receive alerts.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
               <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 h-fit">
                 <Mail size={20} />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-slate-800">Email Notifications</h3>
                 <p className="text-xs text-slate-500">Receive daily summaries and critical alerts via email.</p>
               </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.emailAlerts} 
                onChange={() => handleToggle('emailAlerts')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
             <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity Alerts</h4>
             
             <div className="flex items-center justify-between">
               <div className="ml-11">
                 <h3 className="text-sm font-medium text-slate-800">New Candidate Applications</h3>
                 <p className="text-xs text-slate-500">Get notified when a new application is submitted.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={notifications.newApplications} 
                   onChange={() => handleToggle('newApplications')}
                   className="sr-only peer" 
                 />
                 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
               </label>
             </div>

             <div className="flex items-center justify-between">
               <div className="ml-11">
                 <h3 className="text-sm font-medium text-slate-800">Interview Reminders</h3>
                 <p className="text-xs text-slate-500">1 hour before scheduled interviews.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={notifications.interviewReminders} 
                   onChange={() => handleToggle('interviewReminders')}
                   className="sr-only peer" 
                 />
                 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
               </label>
             </div>

             <div className="flex items-center justify-between">
               <div className="ml-11">
                 <h3 className="text-sm font-medium text-slate-800">AI Resume Insights</h3>
                 <p className="text-xs text-slate-500">Notify when Gemini flags a high-match candidate.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={notifications.aiInsights} 
                   onChange={() => handleToggle('aiInsights')}
                   className="sr-only peer" 
                 />
                 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
               </label>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
