"use client"; // Add this directive at the top

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container max-w-4xl mx-auto py-6 px-4">
            {children}
          </div>
        </ScrollArea>
      </main>
      {pathname === "/" && <RightPanel />}
    </div>
  );
}
