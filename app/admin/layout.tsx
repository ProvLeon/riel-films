"use client";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-film-black-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // if (!user) {
  //   return null; // Let the useEffect handle the redirect
  // }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-film-black-950">
      {/* {user && <AdminSidebar />} */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {user && <AdminHeader />}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
