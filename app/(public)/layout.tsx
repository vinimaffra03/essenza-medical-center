"use client";

import PublicLayout from "@/layouts/PublicLayout";

export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
