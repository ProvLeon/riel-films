import { PageSkeletonProvider } from "@/components/UI/PageSkeletonProvider";

export default function FilmsLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { slug?: string }
}) {
  // Determine skeleton type based on route params
  const skeletonType = params.slug ? 'storyDetail' : 'stories';

  return (
    <PageSkeletonProvider type={skeletonType}>
      {children}
    </PageSkeletonProvider>
  );
}
