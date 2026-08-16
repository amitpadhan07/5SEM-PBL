'use client';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 animate-fade-in-up">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-4 px-6 md:px-8 text-xs text-muted-foreground text-center">
          <p>© 2024 Venue Request & Approval Portal v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
