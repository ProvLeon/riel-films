"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const CreateUserPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      router.push("/admin/users");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New User</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6 max-w-xl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                required
              >
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-film-black-800 flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
