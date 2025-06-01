"use client";
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { Button } from "@/components/UI/Button";
import { PlusCircle, Search, UserPlus, Edit, Trash2, Shield, MoreHorizontal, AlertTriangle, ChevronDown, Users, Save, X as CloseIcon } from "lucide-react"; // Added Save, CloseIcon
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { UserWithoutPassword, updateUser } from "@/lib/users"; // Import updateUser
import { formatDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert"; // Import Alert components

// ----- Edit User Modal Component -----
const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithoutPassword | null;
  onSave: (userId: string, data: { role: 'admin' | 'editor' }) => Promise<boolean>; // Make role specific
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor'>(user?.role || 'editor');
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    // Reset role when user changes or modal opens
    if (user) {
      setSelectedRole(user.role);
      setModalError(null); // Clear previous errors
    }
  }, [user]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'admin' | 'editor'; // Assert the type
    setSelectedRole(value);
    setModalError(null); // Clear error on change if needed
  };

  const handleSave = async () => {
    if (!user || !selectedRole) return;
    setIsSaving(true);
    setModalError(null);
    const success = await onSave(user.id, { role: selectedRole });
    setIsSaving(false);
    if (success) {
      onClose(); // Close modal on success
    } else {
      setModalError("Failed to update user role. Please try again."); // Show error in modal
    }
  };

  if (!isOpen || !user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full shadow-xl border border-gray-200 dark:border-film-black-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit User Role</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800">
            <CloseIcon size={20} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">Editing role for:</p>
        <p className="font-medium text-gray-800 dark:text-gray-100 mb-6">{user.name} ({user.email})</p>

        {modalError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{modalError}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Role <span className="text-red-500">*</span></label>
          <select
            id="edit-role"
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving} disabled={isSaving || user.role === selectedRole}>
            {!isSaving && <Save className="mr-2 h-4 w-4" />} Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
// ----- End Edit User Modal Component -----


// ----- Main Page Component -----
const AdminUsersPage = () => {
  const { users, isLoading, error, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithoutPassword | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [userToEdit, setUserToEdit] = useState<UserWithoutPassword | null>(null); // State for user being edited
  const [actionError, setActionError] = useState<string | null>(null); // For delete/edit errors outside modal


  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Handle Edit Click
  const handleEditClick = useCallback((user: UserWithoutPassword) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
    setActionError(null); // Clear previous errors
  }, []);

  // Handle Saving Edit (called from modal)
  const handleSaveEdit = useCallback(async (userId: string, data: { role: 'admin' | 'editor' }): Promise<boolean> => { // Make role specific
    try {
      await updateUser(userId, data); // Now types should match
      refetch();
      return true;
    } catch (err: any) {
      console.error("Error updating user role:", err);
      setActionError(err.message || "Failed to update user role.");
      return false;
    }
  }, [refetch]);


  // Handle delete confirmation click
  const handleDeleteClick = useCallback((user: UserWithoutPassword) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setActionError(null); // Clear previous errors
  }, []);

  // Handle actual delete action
  const handleDelete = useCallback(async () => {
    if (!userToDelete) return;
    try {
      // Directly use the deleteUser function from lib/users if it exists
      // Otherwise, keep the fetch call:
      const response = await fetch(`/api/users/${userToDelete.id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }
      // OR if using lib/users:
      // await deleteUser(userToDelete.id);

      refetch(); // Refetch users list
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setActionError(error.message || "Failed to delete user."); // Show error on main page
      setIsDeleteModalOpen(false); // Close modal even on error
    }
  }, [userToDelete, refetch]); // Include refetch


  const getRoleStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "editor": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="h-6 w-6 text-film-red-600 mr-2" /> Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage admin and editor accounts.</p>
          </div>
          <Link href="/admin/users/create">
            <Button variant="primary" icon={<UserPlus className="h-5 w-5" />}>Add New User</Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-film-black-900 p-4 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-film-black-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search users by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500" />
            </div>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500 appearance-none">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Error Display */}
        {actionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {/* Users Table / Loading / Error / Empty State */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><LoadingSpinner size="large" /></div>
          ) : error && users.length === 0 ? ( // Show error only if no users (maybe fallback) loaded
            <div className="p-8 text-center text-red-600 dark:text-red-400 flex flex-col items-center"><AlertTriangle className="h-10 w-10 mb-2" />{error} <Button onClick={refetch} variant="secondary" className="mt-4">Try Again</Button></div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400"><Users className="h-12 w-12 mx-auto mb-2" />No users found matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-film-black-800">
                  <tr>
                    <th className="table-header">User</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Joined</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-film-black-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-film-black-700 rounded-full flex items-center justify-center">
                            {/* Add user image here if available */}
                            <span className="text-gray-600 dark:text-gray-300 font-medium text-lg">{user.name ? user.name[0].toUpperCase() : '?'}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'No Name'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleStyles(user.role)}`}>{user.role}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(user.createdAt.toString())}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* Edit Button */}
                          <button onClick={() => handleEditClick(user)} className="action-button text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40" title="Edit User Role"><Edit className="h-4 w-4" /></button>
                          {/* Delete Button */}
                          <button onClick={() => handleDeleteClick(user)} className="action-button text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40" title="Delete User"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && userToDelete && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsDeleteModalOpen(false)} // Close on backdrop click
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full shadow-xl border border-gray-200 dark:border-film-black-700"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete User</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete the user "{userToDelete.name || userToDelete.email}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                  <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit User Role Modal */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={userToEdit}
          onSave={handleSaveEdit}
        />

      </div>
    </div>
  );
};

// Add styles (if not global)
const styles = `
  .table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
  .action-button { @apply p-1.5 rounded-lg transition-colors; }
  `;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default AdminUsersPage;
