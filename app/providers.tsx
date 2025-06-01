"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// REMOVE: import AdminLayout from "@/app/admin/layout";
import { usePathname } from "next/navigation";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const showPublicHeaderFooter = !isAdminRoute && !isLoginPage;

  return (
    <SessionProvider>
      <ThemeProvider storageKey="riel-films-theme" defaultTheme="system">
        <AuthProvider>
          <DataProvider>
            {showPublicHeaderFooter && <Header />}

            {/*
             Render children directly.
             Next.js will automatically apply app/layout.tsx
             and then app/admin/layout.tsx for admin routes.
             AdminLayout already includes the sidebar.
            */}
            {children}

            {showPublicHeaderFooter && <Footer />}
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
