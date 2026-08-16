'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  Bell,
  User,
  Users,
  Building2,
  UserCog,
  BarChart3,
  Logs,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isAdmin = pathname.includes('/admin');

  const studentNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Request Venue', href: '/dashboard/venues/request', icon: <FileText className="w-5 h-5" /> },
    { label: 'My Requests', href: '/dashboard/my-requests', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Calendar', href: '/dashboard/calendar', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" />, adminOnly: true },
    { label: 'Users', href: '/dashboard/admin/users', icon: <Users className="w-5 h-5" />, adminOnly: true },
    { label: 'Venues', href: '/dashboard/admin/venues', icon: <Building2 className="w-5 h-5" />, adminOnly: true },
    { label: 'Authorities', href: '/dashboard/admin/authorities', icon: <UserCog className="w-5 h-5" />, adminOnly: true },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, adminOnly: true },
    { label: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: <Logs className="w-5 h-5" />, adminOnly: true },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: <Settings className="w-5 h-5" />, adminOnly: true },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;
  
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || (pathname.startsWith('/dashboard') && !pathname.includes('/admin'));
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-sidebar-foreground leading-none">VRAP</span>
              <span className="text-xs text-sidebar-foreground/60">Portal</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-sidebar-accent/10 rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/15'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!isCollapsed && (
          <>
            <div className="w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
