import { UserWithoutPassword } from '@/lib/users';
import { useUsers } from '@/hooks/useUsers';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, AlertTriangle, UserPlus, Mail, Calendar, Shield, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, useMemo } from 'react'; // Added useMemo
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/UI/Button'; // Ensure Button component is imported

export function UserSection() {
  const { users, isLoading, error, refetch } = useUsers();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Filter users by role
  const filteredUsers = useMemo(() => {
    if (!selectedRole) return users;
    return users.filter(user => user.role === selectedRole);
  }, [users, selectedRole]);

  // Calculate role counts
  const roleCount = useMemo(() => {
    return users.reduce((acc, user) => {
      const role = user.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [users]);

  // Get role-specific styling
  const getRoleStyles = useCallback((role: string) => {
    switch (role.toLowerCase()) {
      case "admin": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "editor": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 min-h-[300px] flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-800 min-h-[300px] flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <p className="text-gray-700 dark:text-gray-300 mb-4">There was an error loading team members.</p>
        <Button onClick={refetch} variant="secondary" size="sm">Try Again</Button>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-film-red-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
          </div>
          <Link href="/admin/users/create">
            <Button variant="primary" size="sm" icon={<UserPlus className="h-4 w-4" />}>Add User</Button>
          </Link>
        </div>

        {/* Role filter tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-film-black-800 overflow-x-auto scrollbar-hide -mb-px">
          <button
            onClick={() => setSelectedRole(null)}
            className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedRole === null
              ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
              : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200 dark:hover:border-gray-700"
              }`}
          >
            All <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-film-black-800">{users.length}</span>
          </button>
          {Object.entries(roleCount).map(([role, count]) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${selectedRole === role
                ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200 dark:hover:border-gray-700"
                }`}
            >
              {role} <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-film-black-800">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="divide-y divide-gray-100 dark:divide-film-black-800">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            No users found matching the criteria.
          </div>
        ) : (
          <AnimatePresence>
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors group"
              >
                {/* Left Side: Avatar, Name, Email */}
                <div className="flex items-center space-x-4 min-w-0 flex-1"> {/* Added min-w-0 */}
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden relative border border-gray-200 dark:border-film-black-700">
                    {user.image ? (
                      <Image src={user.image} alt={user.name || 'User'} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 dark:bg-film-black-700 flex items-center justify-center">
                        <span className="text-base font-medium text-gray-600 dark:text-gray-400">{user.name?.charAt(0) || 'U'}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1"> {/* Added min-w-0 */}
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={user.name || 'No Name'}>{user.name || 'No Name Provided'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={user.email}> {/* Truncate email */}
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Middle: Role & Joined Date (Adjust based on screen size if needed) */}
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <span className={`status-badge capitalize ${getRoleStyles(user.role)}`}>
                    <Shield className="h-3.5 w-3.5 mr-1" />
                    {user.role || 'User'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    {user.createdAt ? formatDate(user.createdAt.toString()) : 'N/A'}
                  </span>
                </div>

                {/* Right Side: Actions (Show on Hover) */}
                {/* <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/users/edit/${user.id}`} passHref>
                    <Button variant="ghost" size="icon" className="action-button text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 w-8 h-8" title="Edit User">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="action-button text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 w-8 h-8" title="Delete User" onClick={() => alert(`(Placeholder) Delete user ${user.name}?`)}>
                    <Trash2 size={16} />
                  </Button>
                </div> */}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Link */}
      <div className="p-4 border-t border-gray-200 dark:border-film-black-800 mt-auto">
        <Link href="/admin/users" className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group justify-center">
          Manage All Users
          <svg className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" /></svg>
        </Link>
      </div>
    </div>
  );
}

// Add shared styles if not global
const styles = `
  .table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
  .status-badge { @apply px-2.5 py-1 text-xs rounded-full inline-flex items-center font-medium; }
  .action-button { /* Can likely remove if Button component handles styles */ }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }
