import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { Users, FileText, Calendar, Clock, TrendingUp, UserCheck, Briefcase } from 'lucide-react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-transform hover:scale-[1.02]">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      {trend && (
        <p className={`text-xs font-medium mt-2 flex items-center ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          <TrendingUp size={14} className={`mr-1 ${!trendUp && 'rotate-180'}`} />
          {trend}
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white shadow-md`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // Data: Pipeline Status Distribution
  const pipelineData = [
    { name: 'New Applied', value: 145 },
    { name: 'Screening', value: 68 },
    { name: 'Interview', value: 24 },
    { name: 'Offer Sent', value: 12 },
  ];

  // Data: Weekly Activity
  const activityData = [
    { day: 'Mon', applications: 24, interviews: 4 },
    { day: 'Tue', applications: 35, interviews: 7 },
    { day: 'Wed', applications: 28, interviews: 5 },
    { day: 'Thu', applications: 42, interviews: 8 },
    { day: 'Fri', applications: 38, interviews: 6 },
    { day: 'Sat', applications: 15, interviews: 2 },
    { day: 'Sun', applications: 10, interviews: 0 },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value="248" 
          trend="+18% this month" 
          trendUp={true} 
          icon={<FileText size={24} />} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Interviews Scheduled" 
          value="24" 
          trend="8 for Today" 
          trendUp={true} 
          icon={<Calendar size={24} />} 
          color="bg-violet-500" 
        />
        <StatCard 
          title="Offers Accepted" 
          value="12" 
          trend="+3 this week" 
          trendUp={true} 
          icon={<UserCheck size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Avg. Time to Hire" 
          value="18 Days" 
          trend="-2 days (Improved)" 
          trendUp={true} 
          icon={<Clock size={24} />} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recruitment Activity</h3>
            <select className="text-sm border-slate-200 border rounded-lg px-2 py-1 bg-slate-50 text-slate-600 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" name="Applications" />
                <Area type="monotone" dataKey="interviews" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInterviews)" name="Interviews" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Funnel / Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pipeline Overview</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2">
             {pipelineData.map((entry, index) => (
               <div key={entry.name} className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
                 </div>
                 <span className="text-sm font-bold text-slate-800">{entry.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity / Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Urgent Actions</h3>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-full text-red-500 shadow-sm"><Clock size={16} /></div>
                     <div>
                        <p className="text-sm font-semibold text-slate-800">Review 3 Pending Offers</p>
                        <p className="text-xs text-red-500 font-medium">Expires in 24 hours</p>
                     </div>
                  </div>
                  <button className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-md font-medium hover:bg-red-50">View</button>
               </div>
               <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-full text-amber-500 shadow-sm"><Users size={16} /></div>
                     <div>
                        <p className="text-sm font-semibold text-slate-800">5 Interviews Today</p>
                        <p className="text-xs text-amber-600 font-medium">Starts at 10:00 AM</p>
                     </div>
                  </div>
                   <button className="text-xs bg-white border border-amber-200 text-amber-600 px-3 py-1.5 rounded-md font-medium hover:bg-amber-50">Join</button>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">AI Insights Ready</h3>
              <p className="text-indigo-100 text-sm mb-6 max-w-xs">
                 Gemini has analyzed 15 new resumes and flagged 3 top candidates for the Senior Frontend Role.
              </p>
              <button className="bg-white text-indigo-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition shadow-lg inline-flex items-center gap-2">
                 <Briefcase size={16} />
                 View Recommendations
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
