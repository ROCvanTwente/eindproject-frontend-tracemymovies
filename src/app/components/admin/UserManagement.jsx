import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, AlertCircle, Search, Download, AlertTriangle, CheckCircle, Clock, XCircle, MoreVertical, Key } from 'lucide-react';
import { toast } from 'sonner';
import { PaginationControls } from './PaginationControls';
import { BanUserModal } from './BanUserModal';

export function UserManagement() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:7245/api";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [openUserActions, setOpenUserActions] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalServerEntries, setTotalServerEntries] = useState(0);
  const [localEditUser, setLocalEditUser] = useState(null);
  const [localBanUser, setLocalBanUser] = useState(null);
  const itemsPerPage = 10;

  const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const response = await fetch(`${baseUrl}/users?pageNumber=${currentPage}&pageSize=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
          setTotalServerEntries(data.totalEntries || 0);
        } else {
          toast.error("Failed to load users from server.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Network error while loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const filteredUsers = users.filter(u => 
    (u.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalEntries = totalServerEntries;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  
  // Handlers
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (id) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === filteredUsers.length && filteredUsers.length > 0);
  };

  const handleBulkExport = () => toast.success(`Exporting ${selectedUsers.size} users...`);
  const handleBulkBan = () => toast.info(`Bulk ban is coming soon!`);
  
  const handleResetPassword = async (id) => {
    const user = users.find(u => u.id === id);
    setOpenUserActions(null);
    
    if (!user || !user.email) {
      toast.error("Could not find user email.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (res.ok) {
        toast.success(`Password reset email sent to ${user.email}`);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      console.error("Error sending reset email:", err);
      toast.error('Network error while sending reset email');
    }
  };

  const handleEditRole = (id) => {
    const user = users.find(u => u.id === id);
    if (user) setLocalEditUser({ id: user.id, name: user.userName, role: user.role });
    setOpenUserActions(null);
  };

  const handleToggleActions = (e, userId) => {
    e.stopPropagation();
    if (openUserActions === userId) {
      setOpenUserActions(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const dropdownHeight = 220; // approximate height of the dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const showUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
      
      setDropdownPosition({
        top: showUpward 
          ? rect.top - dropdownHeight - 8 
          : rect.bottom + 8,
        left: Math.max(16, rect.right - 256),
      });
      setOpenUserActions(userId);
    }
  };

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-dropdown]')) setOpenUserActions(null);
    };
    const handleScroll = () => {
      setOpenUserActions(null);
    };
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleSaveRole = async (newRole) => {
    if (!localEditUser) return;
    
    try {
      const token = getToken();
      const res = await fetch(`${baseUrl}/admin/users/${localEditUser.id}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newRole })
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (res.ok) {
        toast.success(data.message || `User role updated to ${newRole}`);
        setUsers(prev => prev.map(u => u.id === localEditUser.id ? { ...u, role: newRole } : u));
      } else {
        toast.error(data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error('Network error while updating role');
    } finally {
      setLocalEditUser(null);
    }
  };

  const handleConfirmBan = async (duration, reason, notes) => {
    if (!localBanUser) return;
    
    try {
      const token = getToken();
      const res = await fetch(`${baseUrl}/admin/users/${localBanUser.id}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ duration, reason, notes })
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (res.ok) {
        toast.success(data.message || `User ${localBanUser.name} has been banned`);
        setUsers(prev => prev.map(u => u.id === localBanUser.id ? { ...u, status: 'Suspended' } : u));
      } else {
        toast.error(data.message || 'Failed to ban user');
      }
    } catch (err) {
      console.error("Error banning user:", err);
      toast.error('Network error while banning user');
    } finally {
      setLocalBanUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">User Management</h2>
          <p className="text-[#94A3B8]">Manage user accounts and permissions</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151921] border border-[#BFBCFC]/15 rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#BFBCFC]/40 transition-all"
          />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.size > 0 && (
        <div className="bg-[#BFBCFC]/10 border-2 border-[#BFBCFC]/30 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#BFBCFC] rounded-full flex items-center justify-center">
                <span className="text-[#0B0E14] font-bold text-sm">{selectedUsers.size}</span>
              </div>
              <span className="text-[#F8FAFC] font-medium">
                {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedUsers(new Set());
                setSelectAll(false);
              }}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBulkExport}
              className="px-4 py-2 bg-[#44FFFF]/10 hover:bg-[#44FFFF]/20 text-[#44FFFF] rounded-lg font-medium transition-all flex items-center gap-2 border border-[#44FFFF]/30"
            >
              <Download className="w-4 h-4" />
              Bulk Export
            </button>
            <button
              onClick={handleBulkBan}
              className="px-4 py-2 bg-[#FF61D2]/10 hover:bg-[#FF61D2]/20 text-[#FF61D2] rounded-lg font-medium transition-all flex items-center gap-2 border border-[#FF61D2]/30"
            >
              <AlertTriangle className="w-4 h-4" />
              Bulk Ban <span className="text-[10px] ml-1 px-1.5 py-0.5 bg-[#FF61D2]/20 rounded-md">Soon</span>
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl overflow-hidden shadow-lg min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0E14] border-b border-[#BFBCFC]/10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[#BFBCFC]/30 bg-[#0B0E14] checked:bg-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-[#94A3B8] font-medium text-sm uppercase tracking-wide">ID</th>
                <th className="px-6 py-4 text-left text-[#94A3B8] font-medium text-sm uppercase tracking-wide">User Profile</th>
                <th className="px-6 py-4 text-left text-[#94A3B8] font-medium text-sm uppercase tracking-wide">Role</th>
                <th className="px-6 py-4 text-left text-[#94A3B8] font-medium text-sm uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-left text-[#94A3B8] font-medium text-sm uppercase tracking-wide">Join Date</th>
                <th className="px-6 py-4 text-left text-[#94A3B8] font-medium text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
              {loading ? (
              <tbody><tr><td colSpan="7" className="px-6 py-8 text-center text-[#94A3B8]">Loading users...</td></tr></tbody>
              ) : filteredUsers.length === 0 ? (
              <tbody><tr><td colSpan="7" className="px-6 py-8 text-center text-[#94A3B8]">No users found.</td></tr></tbody>
              ) : (
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-[#BFBCFC]/10 hover:bg-[#BFBCFC]/5 transition-colors ${
                      selectedUsers.has(user.id) ? 'bg-[#BFBCFC]/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 rounded border-[#BFBCFC]/30 bg-[#0B0E14] checked:bg-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#44FFFF] font-mono text-sm font-medium" title={user.id}>#{user.id.slice(0,8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/20">
                          <span className="text-[#0B0E14] font-bold text-sm">{user.userName.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-[#F8FAFC] font-medium">{user.userName}</p>
                          <p className="text-[#94A3B8] text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 ${
                        user.role === 'Admin'
                          ? 'bg-[#FF61D2]/10 text-[#FF61D2] border border-[#FF61D2]/30'
                          : (user.role === 'Mod' || user.role === 'Moderator')
                          ? 'bg-[#44FFFF]/10 text-[#44FFFF] border border-[#44FFFF]/30'
                          : 'bg-[#BFBCFC]/10 text-[#BFBCFC] border border-[#BFBCFC]/30'
                      }`}>
                        {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                        {(user.role === 'Mod' || user.role === 'Moderator') && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 ${
                        user.status === 'Active'
                          ? 'bg-[#44FFFF]/10 text-[#44FFFF] border border-[#44FFFF]/30'
                          : user.status === 'Pending'
                          ? 'bg-[#BFBCFC]/10 text-[#BFBCFC] border border-[#BFBCFC]/30'
                          : 'bg-[#FF61D2]/10 text-[#FF61D2] border border-[#FF61D2]/30'
                      }`}>
                        {user.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                        {user.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {(user.status === 'Suspended' || user.status === 'Banned') && <XCircle className="w-3 h-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8] text-sm">
                      {new Date(user.joinDate || user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative" data-dropdown>
                        <button
                          onClick={(e) => handleToggleActions(e, user.id)}
                          className="group relative p-2.5 hover:bg-gradient-to-br hover:from-[#BFBCFC]/10 hover:to-[#44FFFF]/10 rounded-xl transition-all duration-200 border border-transparent hover:border-[#BFBCFC]/20"
                        >
                          <MoreVertical className="w-5 h-5 text-[#94A3B8] group-hover:text-[#BFBCFC] transition-colors" />
                        </button>

                        {/* Actions Dropdown */}
                        {openUserActions === user.id && (
                          <div 
                            style={{
                              position: 'fixed',
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                              width: '256px'
                            }}
                            className="bg-gradient-to-br from-[#151921] to-[#0B0E14] border border-[#BFBCFC]/20 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 backdrop-blur-xl animate-fade-in"
                          >
                            <div className="px-4 py-3 border-b border-[#BFBCFC]/10 bg-[#BFBCFC]/5">
                              <p className="text-xs font-medium text-[#BFBCFC] uppercase tracking-wide">User Actions</p>
                            </div>

                            <div className="py-1">
                              <button
                                onClick={() => handleEditRole(user.id)}
                                className="w-full px-4 py-3 text-left text-[#F8FAFC] hover:bg-gradient-to-r hover:from-[#BFBCFC]/15 hover:to-[#BFBCFC]/5 transition-all duration-200 flex items-center gap-3 text-sm group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#BFBCFC]/10 group-hover:bg-[#BFBCFC]/20 flex items-center justify-center transition-all">
                                  <Shield className="w-4 h-4 text-[#BFBCFC]" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Edit Role</p>
                                  <p className="text-xs text-[#94A3B8] group-hover:text-[#BFBCFC]/70">Change permissions</p>
                                </div>
                              </button>
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                className="w-full px-4 py-3 text-left text-[#F8FAFC] hover:bg-gradient-to-r hover:from-[#44FFFF]/15 hover:to-[#44FFFF]/5 transition-all duration-200 flex items-center gap-3 text-sm group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#44FFFF]/10 group-hover:bg-[#44FFFF]/20 flex items-center justify-center transition-all">
                                  <Key className="w-4 h-4 text-[#44FFFF]" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Reset Password</p>
                                  <p className="text-xs text-[#94A3B8] group-hover:text-[#44FFFF]/70">Send reset email</p>
                                </div>
                              </button>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[#FF61D2]/30 to-transparent my-1"></div>

                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setLocalBanUser({ id: user.id, name: user.userName });
                                  setOpenUserActions(null);
                                }}
                                className="w-full px-4 py-3 text-left text-[#FF61D2] hover:bg-gradient-to-r hover:from-[#FF61D2]/15 hover:to-[#FF61D2]/5 transition-all duration-200 flex items-center gap-3 text-sm group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#FF61D2]/10 group-hover:bg-[#FF61D2]/20 flex items-center justify-center transition-all">
                                  <AlertTriangle className="w-4 h-4 text-[#FF61D2]" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Ban User</p>
                                  <p className="text-xs text-[#FF61D2]/70 group-hover:text-[#FF61D2]">Restrict access</p>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
                }
              </tbody>
              )}
          </table>
        </div>
        {!loading && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalEntries={totalEntries}
          />
        )}

        <EditUserRoleModal
          isOpen={!!localEditUser}
          onClose={() => setLocalEditUser(null)}
          userName={localEditUser?.name}
          currentRole={localEditUser?.role}
          onSave={handleSaveRole}
        />

        <BanUserModal
          isOpen={!!localBanUser}
          onClose={() => setLocalBanUser(null)}
          userName={localBanUser?.name}
          onBan={handleConfirmBan}
        />
      </div>
    </div>
  );
}

export function EditUserRoleModal({ isOpen, onClose, userName, currentRole, onSave }) {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedRole);
  };

  const getRoleWarning = (role) => {
    switch (role) {
      case 'Admin':
        return 'Admins have full access to all features including user management and system settings.';
      case 'Mod':
      case 'Moderator':
        return 'Moderators can flag content but cannot delete users.';
      case 'User':
        return 'Regular users have standard access without administrative privileges.';
      default:
        return '';
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#BFBCFC]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#BFBCFC]/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#BFBCFC]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">Edit User Role</h2>
              <p className="text-sm text-[#94A3B8]">{userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 hover:bg-[#BFBCFC]/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
            >
              <option value="User">User</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Warning Message */}
          <div className="bg-[#BFBCFC]/5 border border-[#BFBCFC]/20 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#BFBCFC] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {getRoleWarning(selectedRole)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#BFBCFC]/15">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#BFBCFC]/20 text-[#F8FAFC] hover:bg-[#BFBCFC]/5 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] transition-all font-medium shadow-lg shadow-[#BFBCFC]/30"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}