"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            {/* Render Header and Footer only for non-admin routes */}
            {!isAdminRoute && <Header />}

            <main className={isAdminRoute ? "admin-layout" : "main-layout"}>
              {children}
            </main>

            {!isAdminRoute && <Footer />}
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
