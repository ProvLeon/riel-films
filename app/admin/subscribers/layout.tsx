import { ReactNode } from "react";

// This layout wraps all pages under /admin/subscribers/*
export default function SubscribersLayout({ children }: { children: ReactNode }) {
  return (
    // You could add subscriber-specific layout elements here if needed
    // e.g., a sub-navigation bar for different subscriber views
    <div className="subscriber-section-layout">
      {children}
    </div>
  );
}
