import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, MoreVertical, ThumbsUp, ThumbsDown, Eye, Download, X, Edit, Trash2, FileText, Plus, AlertTriangle } from 'lucide-react';
import { Roles, Users, ViewState } from '../types';
import { useToast } from './Toast';

interface UsersProps {
  user: Users[];
  setUsers: React.Dispatch<React.SetStateAction<Users[]>>;
  onNavigate: (view: ViewState) => void;
}

interface EditUserFormProps {
  user: Users;
  onSave: (updatedUser: Users) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState(user);
  const { showToast } = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };    
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/users/update-user/${formData.id}`, {
        method: 'PUT', // or PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          active: formData.active,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Request failed (${res.status})`);
      }
      const updatedUser = await res.json();
      showToast('user updated successfully', 'success');
      onSave(updatedUser.data);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Something went wrong', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-slate-500">Role Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500">Code</label>
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};


const UsersDirectory: React.FC<UsersProps> = ({ user, setUsers, onNavigate }) => {

// ✅ ADD HERE
const handleUpdateUser = async () => {
  if (!selectedUser) return;

  try {
    const res = await fetch(`${baseUrl}/api/users/update-user/${selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedUser),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Update failed');
    }

    const data = await res.json();

    setUsers(prev =>
      prev.map(u => (u.id === selectedUser.id ? data.data : u))
    );

    showToast('User updated successfully', 'success');

    setModalType(null);
    setSelectedUser(null);

  } catch (err: any) {
    showToast(err.message, 'error');
  }
};
    

  //const [candidates, setUserss] = useState<Candidate[]>([]);
const [loading, setLoading] = useState(true);

 const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    useEffect(() => {
      const fethcUsers = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/get-users`);
          console.log("Response status:", res.status);
          const data = await res.json();
          console.log(data.data);
          setUsers(data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fethcUsers();
    }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | null>(null);

  // Delete Confirmation State
  const [userToDeactivate, setUsersToDeactive] = useState<{id: string, name: string} | null>(null);

  const handleDeactivateUser = async () => {

      if (!userToDeactivate) return;

      // call API here
      try {
          await fetch(`/api/users/${userToDeactivate.id}/deactivate`, {
            method: "PATCH", // NOT DELETE
            headers: {
              "Content-Type": "application/json"
            }
          });

          // update UI
          setUsers(users =>
            users.map(u =>
              u.id === userToDeactivate.id
                ? { ...u, status: "inactive" }
                : u
            )
          );

          setUsersToDeactive(null);
        } catch (err) {
          console.error("Failed to deactivate user", err);
        }
  };
  
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
  //const uniqueRoles = Array.from(new Set(user.map(c => c.job_role)));

  const filteredUsers = user.filter(c => {
    const name = c.name?.toLowerCase() || '';
    const username = c.user_name?.toLowerCase() || '';
    //const role = c.job_role || '';

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      username.includes(searchTerm.toLowerCase());

    // const matchesStatus = statusFilter === 'All' || c.active === statusFilter;
    // const matchesRole = roleFilter === 'All' || c.role === roleFilter;

    return matchesSearch; // && matchesStatus && matchesRole;
  });

  const handleStatusChange = (id: string, newStatus: any, message: string) => {
    setUsers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(message, newStatus === 'Rejected' ? 'error' : 'success');
  };

  const initiateDelete = (id: string, name: string) => {
    setUsersToDeactive({ id, name });
    setActiveActionMenuId(null);
  };

  const confirmDelete = () => {
    if (userToDeactivate) {
      setUsers(prev => prev.filter(c => c.id !== userToDeactivate.id));
      showToast(`${userToDeactivate.name} has been permanently deleted.`, 'success');
      setUsersToDeactive(null);
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
          <h2 className="text-xl font-bold text-slate-800">Users Directory</h2>
          <p className="text-slate-500 text-sm">View and manage all users</p>
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
            onClick={() => onNavigate(ViewState.ADD_USER)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Add Users</span>
          </button>
        </div>
      </div>

    

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Profile</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Id</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}`} alt="" />
                      {/* <div className="ml-4">
                      </div> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-800">{candidate.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-800">{candidate.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-800">{candidate.user_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {candidate.active? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className={`flex items-center justify-end gap-2 transition-opacity ${activeActionMenuId === candidate.id ? 'opacity-100' : 'opacity-100 sm:opacity-0 group-hover:opacity-100'}`}>
                      {/* <button 
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
                      </button> */}
                      {/* <button 
                         onClick={() => showToast(`Email draft opened for ${candidate.name}`, 'info')}
                         className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                         title="Email"
                      >
                        <Mail size={18} />
                      </button>
                       */}
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
                            <button onClick={() => {
                              setSelectedUser(candidate);
                              setModalType('view');
                              setActiveActionMenuId(null);
                            }} className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                              <Eye size={14} /> View Profile
                            </button>
                            <button onClick={() => {
                                setSelectedUser(candidate);
                                setModalType('edit');
                                setActiveActionMenuId(null);
                              }} 
                              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                              <Edit size={14} /> Edit Details
                            </button>
                            
                             <div className="border-t border-slate-50 my-1"></div>
                             <button 
                                onClick={() => initiateDelete(candidate.id, candidate.name)} 
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                             >
                                <Trash2 size={14} /> Deactivate User
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


      {/* View/Edit Modal */}
      {selectedUser && modalType && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in">

              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setModalType(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              {/* VIEW MODE */}
              {modalType === 'view' && (
                <>
                  <h2 className="text-xl font-bold mb-4">User Profile</h2>

                  <div className="space-y-3">
                    <p><strong>ID:</strong> {selectedUser.id}</p>

                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        value={selectedUser.name}
                        className="w-full mt-1 border rounded-lg px-3 py-2"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <input
                        type="text"
                        value={selectedUser.user_name}
                        className="w-full mt-1 border rounded-lg px-3 py-2"
                        disabled
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox"
                        checked={selectedUser.active}
                          onChange={(e) => setSelectedUser({
                              ...selectedUser,
                              active: e.target.checked
                          })}
                      />
                      <label>Active</label>
                    </div>

                    
                    {/* <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Username:</strong> {selectedUser.user_name}</p>
                    <p><strong>Status:</strong> {selectedUser.active ? 'Active' : 'Inactive'}</p> */}
                  </div>
                </>
              )}

              {/* EDIT MODE */}
              {modalType === 'edit' && (
                <>
                  <h2 className="text-xl font-bold mb-4">Edit User</h2>

                  {/* <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      setUsers(prev =>
                        prev.map(u =>
                          u.id === selectedUser.id ? selectedUser : u
                        )
                      );

                      setModalType(null);
                      setSelectedUser(null);
                    }}
                    className="space-y-4"
                  > */}
                  <form
  onSubmit={(e) => {
    e.preventDefault();
    handleUpdateUser(); // ✅ CALL API HERE
  }}
>
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        value={selectedUser.name}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, name: e.target.value })
                        }
                        className="w-full mt-1 border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <input
                        type="text"
                        value={selectedUser.user_name}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, user_name: e.target.value })
                        }
                        className="w-full mt-1 border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUser.active}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, active: e.target.checked })
                        }
                      />
                      <label>Active</label>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setModalType(null);
                          setSelectedUser(null);
                        }}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>

                      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </>
              )}
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {userToDeactivate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Deactivate User?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to deactivate the user <span className="font-semibold text-slate-700">{userToDeactivate.name}</span>? 
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeactivateUser()}
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

export default UsersDirectory;
