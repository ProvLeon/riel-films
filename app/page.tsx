"use client";
import ErrorBoundary from "@/components/ErrorBoundary";
import WLight from "@/components/WLight";
import { coursePageData } from "@/data/coursePageData";
import BackToTop from "@/components/UI/BackToTop";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <WLight data={coursePageData} />
          <BackToTop />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
