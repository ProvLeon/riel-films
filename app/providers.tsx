"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminLayout from "@/app/admin/layout"; // Import AdminLayout
import { usePathname } from "next/navigation";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Conditionally render layout based on route
  // const LayoutComponent = isAdminRoute ? AdminLayout : React.Fragment;
  const showPublicHeaderFooter = !isAdminRoute && pathname !== '/admin/login'; // Don't show on login

  return (
    <SessionProvider>
      <ThemeProvider storageKey="riel-films-theme" defaultTheme="system">
        <AuthProvider>
          <DataProvider>
            {showPublicHeaderFooter && <Header />}
            {/* Wrap content with appropriate layout */}
            {isAdminRoute && pathname !== '/admin/login' ? (
              <AdminLayout>{children}</AdminLayout>
            ) : (
              <main className="main-content-area">{children}</main> // Simple wrapper for public
            )}
            {showPublicHeaderFooter && <Footer />}
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
