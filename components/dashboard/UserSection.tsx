import { UserWithoutPassword } from '@/lib/users';
import { useUsers } from '@/hooks/useUsers';
import { motion } from 'framer-motion';
import { Users, Loader2, AlertTriangle, UserPlus, Mail, Calendar, Shield } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export function UserSection() {
  const { users, isLoading, error, refetch } = useUsers();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Filter users by role if a role is selected
  const filteredUsers = selectedRole
    ? users.filter(user => user.role === selectedRole)
    : users;

  // Get user role counts for the filter tabs
  const roleCount = users.reduce((acc, user) => {
    const role = user.role || 'unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-8 text-gray-500 dark:text-gray-400">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
        <p>There was an error loading users.</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-film-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center px-3 py-1.5 bg-film-red-600 text-white text-sm rounded-md hover:bg-film-red-700 transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add User
        </Link>
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-film-black-800 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setSelectedRole(null)}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedRole === null
            ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
            : "text-gray-600 dark:text-gray-300 border-transparent hover:text-film-red-600 dark:hover:text-film-red-500"
            }`}
        >
          All Users ({users.length})
        </button>
        {Object.entries(roleCount).map(([role, count]) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${selectedRole === role
              ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
              : "text-gray-600 dark:text-gray-300 border-transparent hover:text-film-red-600 dark:hover:text-film-red-500"
              }`}
          >
            {role} ({count})
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No users found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-gray-50 dark:bg-film-black-800 rounded-lg p-4 border border-gray-100 dark:border-film-black-700"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden relative border-2 border-film-red-500">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'Team member'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300 dark:bg-film-black-700 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Joined {user.createdAt ? formatDate(user.createdAt.toString()) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                        <span className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          {user.role || 'User'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/admin/users"
          className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group"
        >
          Manage all team members
          <svg
            className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
