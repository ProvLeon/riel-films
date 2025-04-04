"use client";
import { useState, useCallback } from "react"; // Added useCallback
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert"; // Import Alert

const CreateUserPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" // Default to editor, more common than 'user' for admin panel
  });

  // Use useCallback for stable event handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // Clear error on change
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required.");
      setIsSubmitting(false);
      return;
    }
    if (formData.password.length < 6) { // Example password policy
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="max-w-3xl mx-auto"> {/* Centered content */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors" aria-label="Go back">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserPlus className="h-6 w-6 mr-2 text-film-red-600" /> Create New User
          </h1>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Creating User</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="label-style">Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input-style" required />
            </div>
            <div>
              <label htmlFor="email" className="label-style">Email <span className="text-red-500">*</span></label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="input-style" required />
            </div>
            <div>
              <label htmlFor="password" className="label-style">Password <span className="text-red-500">*</span></label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="input-style" required />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum 6 characters.</p>
            </div>
            <div>
              <label htmlFor="role" className="label-style">Role <span className="text-red-500">*</span></label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="input-style" required>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                {/* Consider removing 'user' if not applicable for admin panel */}
                {/* <option value="user">User</option> */}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-film-black-800 flex justify-end gap-4">
            <Button variant="secondary" type="button" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              {!isSubmitting && <Save className="mr-2 h-4 w-4" />} Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Shared Styles (can be global)
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default CreateUserPage;
