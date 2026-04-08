import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, MoreVertical, ThumbsUp, ThumbsDown, Eye, Download, X, Edit, Trash2, FileText, Plus, AlertTriangle } from 'lucide-react';
import { Candidate, ViewState } from '../types';
import { useToast } from './Toast';
import { json } from 'stream/consumers';

interface CandidateDirectoryProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  onNavigate: (view: ViewState) => void;
}

const CandidateDirectory: React.FC<CandidateDirectoryProps> = ({ candidates, setCandidates, onNavigate }) => {

    

  //const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    console.log('baseUrl:', baseUrl);

    useEffect(() => {
      const fetchCandidates = async () => {
        try {
          const res = await fetch(`${baseUrl}/api/get-candidates`);
          console.log("Response status:", res.status);
          const data = await res.json();
           if (!res.ok) {
            throw new Error(data.message || "Something went wrong");
          }
          setCandidates(data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCandidates();
    }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  
  // Delete Confirmation State
  const [candidateToDelete, setCandidateToDelete] = useState<{id: string, name: string} | null>(null);
  
  const { showToast } = useToast();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).closest('.action-menu-container')) return;
      setActiveActionMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique roles for the filter dropdown
  const uniqueRoles = Array.from(new Set(candidates.map(c => c.job_role)));

  const filteredCandidates = candidates.filter(c => {
    const first = c.firstname?.toLowerCase() || '';
    const last = c.lastname?.toLowerCase() || '';
    const role = c.job_role || '';

    const matchesSearch =
      first.includes(searchTerm.toLowerCase()) ||
      last.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesRole = roleFilter === 'All' || role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = (id: string, newStatus: any, message: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(message, newStatus === 'Rejected' ? 'error' : 'success');
  };

  const initiateDelete = (id: string, name: string) => {
    setCandidateToDelete({ id, name });
    setActiveActionMenuId(null);
  };

  const confirmDelete = () => {
    if (candidateToDelete) {
      setCandidates(prev => prev.filter(c => c.id !== candidateToDelete.id));
      showToast(`${candidateToDelete.name} has been permanently deleted.`, 'success');
      setCandidateToDelete(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Screening': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Interview': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Offer': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setRoleFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Candidate Directory</h2>
          <p className="text-slate-500 text-sm">View and manage all applicants</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => onNavigate(ViewState.ADD_CANDIDATE)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
           <div>
             <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Application Status</label>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
             >
               <option value="All">All Statuses</option>
               <option value="New">New</option>
               <option value="Screening">Screening</option>
               <option value="Interview">Interview</option>
               <option value="Offer">Offer</option>
               <option value="Rejected">Rejected</option>
             </select>
           </div>
           <div>
             <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Job Role</label>
             <select 
               value={roleFilter}
               onChange={(e) => setRoleFilter(e.target.value)}
               className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
             >
               <option value="All">All Roles</option>
               {uniqueRoles.map(role => (
                 <option key={role} value={role}>{role}</option>
               ))}
             </select>
           </div>
           <div className="flex items-end">
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors py-2 px-3 hover:bg-slate-100 rounded-lg"
              >
                <X size={16} /> Clear Filters
              </button>
           </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate Profile</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied For</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}`} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-800">{candidate.name}</div>
                        <div className="text-xs text-slate-500">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-800">{candidate.role}</div>
                    <div className="text-xs text-slate-500">{candidate.experience} Years Exp</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {candidate.appliedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${getScoreColor(candidate.matchScore)}`}>
                      {candidate.matchScore ? `${candidate.matchScore}%` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className={`flex items-center justify-end gap-2 transition-opacity ${activeActionMenuId === candidate.id ? 'opacity-100' : 'opacity-100 sm:opacity-0 group-hover:opacity-100'}`}>
                      <button 
                        onClick={() => handleStatusChange(candidate.id, 'Interview', `Shortlisted ${candidate.name} for Interview`)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" 
                        title="Shortlist"
                      >
                        <ThumbsUp size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(candidate.id, 'Rejected', `Rejected ${candidate.name}`)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        title="Reject"
                      >
                        <ThumbsDown size={18} />
                      </button>
                      <button 
                         onClick={() => showToast(`Email draft opened for ${candidate.name}`, 'info')}
                         className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                         title="Email"
                      >
                        <Mail size={18} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="relative action-menu-container">
                        <button 
                          onClick={() => setActiveActionMenuId(activeActionMenuId === candidate.id ? null : candidate.id)}
                          className={`p-1.5 rounded-md transition-colors ${activeActionMenuId === candidate.id ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeActionMenuId === candidate.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-fade-in text-left overflow-hidden">
                             <button 
                                onClick={() => { showToast(`Viewing profile of ${candidate.name}`, 'info'); setActiveActionMenuId(null); }} 
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                             >
                                <Eye size={14} /> View Profile
                             </button>
                             <button 
                                onClick={() => { showToast(`Editing ${candidate.name}`, 'info'); setActiveActionMenuId(null); }} 
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                             >
                                <Edit size={14} /> Edit Details
                             </button>
                             <button 
                                onClick={() => { showToast(`Resume downloaded for ${candidate.name}`, 'success'); setActiveActionMenuId(null); }} 
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                             >
                                <FileText size={14} /> Download Resume
                             </button>
                             <div className="border-t border-slate-50 my-1"></div>
                             <button 
                                onClick={() => initiateDelete(candidate.id, candidate.name)} 
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                             >
                                <Trash2 size={14} /> Delete Candidate
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search size={32} className="text-slate-300 mb-2" />
                    <p className="text-base font-medium">No candidates found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {candidateToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Candidate?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to remove <span className="font-semibold text-slate-700">{candidateToDelete.name}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCandidateToDelete(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDirectory;
