"use client";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/layout/Layout";
import { coursePageData } from "@/data/coursePageData";
import BackToTop from "@/components/UI/BackToTop";
import Main from "@/components/layout/index";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Layout>
            <Main data={coursePageData} />
          </Layout>
          <BackToTop />
        </main>
      </div>
    </ErrorBoundary >
  );
}
