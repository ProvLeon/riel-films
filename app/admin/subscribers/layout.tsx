import { ReactNode } from "react";

interface SubscribersLayoutProps {
  children: ReactNode;
}

export default function SubscribersLayout({ children }: SubscribersLayoutProps) {
  return <>{children}</>;
}
