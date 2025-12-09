import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Mail } from 'lucide-react';
import { Employee } from '../types';

// Mock Data
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Arjun Kapoor', role: 'Senior Frontend Engineer', department: 'Engineering', status: 'Active', email: 'arjun.k@nexus.com', avatar: 'https://picsum.photos/100/100', joinDate: '2022-03-15' },
  { id: '2', name: 'Sarah Jenkins', role: 'Product Manager', department: 'Product', status: 'Active', email: 'sarah.j@nexus.com', avatar: 'https://picsum.photos/101/101', joinDate: '2023-01-10' },
  { id: '3', name: 'Priya Sharma', role: 'UX Designer', department: 'Design', status: 'On Leave', email: 'priya.s@nexus.com', avatar: 'https://picsum.photos/102/102', joinDate: '2021-11-05' },
  { id: '4', name: 'Mike Ross', role: 'Sales Lead', department: 'Sales', status: 'Active', email: 'mike.r@nexus.com', avatar: 'https://picsum.photos/103/103', joinDate: '2020-08-20' },
  { id: '5', name: 'Rachel Zane', role: 'Legal Consultant', department: 'Legal', status: 'Remote', email: 'rachel.z@nexus.com', avatar: 'https://picsum.photos/104/104', joinDate: '2022-06-12' },
];

const EmployeeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => 
    (filter === 'All' || emp.department === filter) &&
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'On Leave': return 'bg-amber-100 text-amber-700';
      case 'Remote': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Team Members</h2>
          <p className="text-slate-500 text-sm">Manage your workforce access and details</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-600">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Dept</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={emp.avatar} alt="" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{emp.role}</div>
                  <div className="text-xs text-slate-500">{emp.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(emp.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-slate-400 hover:text-indigo-600 mx-2">
                    <Mail size={18} />
                  </button>
                  <button className="text-slate-400 hover:text-indigo-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No employees found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
