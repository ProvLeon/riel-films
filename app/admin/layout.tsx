"use client";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar"; // For Desktop
import AdminHeader from "@/components/admin/AdminHeader"; // Add Header
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-film-black-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Render layout only if the user is authenticated
  if (!user) {
    return null; // Return null or a minimal placeholder while redirecting
  }


  // const renderAdminSideBar = () => {
  //   if (user && !isLoading) {
  //     return <AdminSidebar /> // Or a minimal placeholder, useEffect handles the redirect
  //   }
  // }

  // Render the main admin layout
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-film-black-950">
      {/* {renderAdminSideBar()} */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Optional: Global Admin Header could go here if needed */}
        <AdminHeader />

        <main className="flex-1 overflow-y-auto">
          {/* Use a consistent container for padding */}
          <motion.div
            initial={{ opacity: 0, y: 5 }} // Subtle entrance
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-4 md:p-6 lg:p-8" // Consistent padding
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
