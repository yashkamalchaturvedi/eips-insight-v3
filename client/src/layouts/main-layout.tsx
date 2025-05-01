import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block md:w-64 md:flex-shrink-0">
          <div className="fixed inset-y-0 z-50 w-64 border-r bg-background">
            <SidebarNav />
          </div>
        </div>

        {/* Mobile sidebar - only visible when toggled */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          position="left"
        >
          <SidebarNav onNavItemClick={() => setSidebarOpen(false)} />
        </Sidebar>

        {/* Main content area */}
        <div className="flex flex-1 flex-col md:pl-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className={cn("flex-1 p-4 md:p-6", className)}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
