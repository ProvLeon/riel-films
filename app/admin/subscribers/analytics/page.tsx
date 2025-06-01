"use client";
import { Suspense } from "react";
import SubscriberAnalytics from "../SubscriberAnalytics"; // Adjust path if needed
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SubscriberAnalyticsPage() {
  return (
    <div>
      {/* Optional: Add a back button or breadcrumbs */}
      <div className="mb-6">
        <Link href="/admin/subscribers" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500">
          <ArrowLeft size={16} className="mr-1" /> Back to Subscribers Overview
        </Link>
      </div>
      <Suspense fallback={
        <div className="h-96 flex items-center justify-center bg-white dark:bg-film-black-900 rounded-xl">
          <LoadingSpinner size="large" />
        </div>
      }>
        {/* SubscriberAnalytics now handles its own data fetching */}
        <SubscriberAnalytics />
      </Suspense>
    </div>
  );
}
