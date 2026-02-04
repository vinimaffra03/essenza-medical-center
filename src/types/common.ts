import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}
