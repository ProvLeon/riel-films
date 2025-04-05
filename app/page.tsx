// Main imports are fine, assuming Main component is correctly implemented
import Layout from "@/components/layout/Layout";
import Main from "@/components/layout/Main";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import PageViewTracker from "@/components/analytics/PageViewTracker";

// Fallback component for Suspense
const AnalyticsFallback = () => null;

export default function Home() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong loading the homepage. Please try again.</div>}>
      {/* Layout already includes Header/Footer logic via Providers */}
      <Layout>
        {/* The Main component now fetches its own data using hooks */}
        <Main />
      </Layout>
      <Suspense fallback={<AnalyticsFallback />}>
        {/* PageViewTracker specific to the homepage */}
        <PageViewTracker pageType="home" />
      </Suspense>
    </ErrorBoundary>
  );
}
