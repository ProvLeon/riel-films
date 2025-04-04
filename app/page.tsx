import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/layout/Layout";
import Main from "@/components/layout/Main";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { Suspense } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner"; // Optional: For a more visible fallback

// Fallback component for PageViewTracker Suspense
const AnalyticsFallback = () => {
  // Render nothing, or a minimal placeholder if needed for layout
  return null;
  // Or for debugging: return <div style={{ position: 'fixed', bottom: 0, right: 0, background: 'red', color: 'white', padding: '2px', fontSize: '10px' }}>Analytics Loading...</div>;
};

export default function Home() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong loading the homepage.</div>}>
      <div className="flex flex-col min-h-screen">
        {/* Layout wraps the main content, providing header/footer potentially */}
        {/* The specific data (`coursePageData`) might need adjustment based on final design */}
        <Layout>
          {/* Main content component, potentially receiving data */}
          <Main />
        </Layout>
        {/* Suspense for the PageViewTracker to handle potential async operations within it */}
        <Suspense fallback={<AnalyticsFallback />}>
          <PageViewTracker pageType="home" />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
