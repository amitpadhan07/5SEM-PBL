'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-30">
      <div className="ml-64 transition-all duration-300 md:ml-20">
        <div className="flex justify-between items-center h-20 px-6 md:px-8">
          {/* Breadcrumb / Welcome */}
          <div className="flex-1">
            <h1 className="text-sm text-muted-foreground">Welcome back!</h1>
          </div>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search venues, requests... (Ctrl+K)"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon - Mobile */}
            <button className="lg:hidden p-2 hover:bg-muted rounded-lg transition">
              <Search className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-muted rounded-lg transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition group" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-destructive rounded-full animate-pulse" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                5 new notifications
              </span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-1 ml-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition" title="Profile">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium hidden lg:inline">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="ml-20 px-4 py-3 space-y-2">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition"
            >
              <User className="h-5 w-5" />
              <span className="text-sm">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
