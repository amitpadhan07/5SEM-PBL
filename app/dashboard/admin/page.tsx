import { Metadata } from 'next';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StatCard } from '@/components/features/dashboard/StatCard';
import { WelcomeHero } from '@/components/features/dashboard/WelcomeHero';
import {
  Building2,
  FileText,
  CheckCircle2,
  Users,
  BarChart3,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard | VRAP',
  description: 'Manage venues, users, and requests',
};

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Hero */}
        <WelcomeHero
          name="Admin"
          pendingRequests={18}
          upcomingEvents={8}
          notifications={5}
        />

        {/* Key Metrics */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">System Overview</h2>
          <div className="dashboard-grid">
            <StatCard
              title="Total Venues"
              value="24"
              icon={<Building2 className="w-6 h-6" />}
              trend={{ value: 12, isPositive: true }}
              color="blue"
            />
            <StatCard
              title="Active Users"
              value="156"
              icon={<Users className="w-6 h-6" />}
              trend={{ value: 8, isPositive: true }}
              color="teal"
            />
            <StatCard
              title="Pending Requests"
              value="12"
              icon={<FileText className="w-6 h-6" />}
              trend={{ value: 3, isPositive: false }}
              color="amber"
            />
            <StatCard
              title="Approval Rate"
              value="87%"
              icon={<CheckCircle2 className="w-6 h-6" />}
              trend={{ value: 5, isPositive: true }}
              color="green"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-2 card-pro p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Requests
              </h3>
              <Link href="/dashboard/admin/requests" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Auditorium Booking</p>
                    <p className="text-sm text-muted-foreground">Computer Science Department • Today</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium whitespace-nowrap ml-4">
                    Pending
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Analytics */}
          <div className="card-pro p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-secondary" />
              Analytics
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-foreground">Approval Rate</p>
                  <p className="text-sm font-bold text-primary">87%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-foreground">Utilization</p>
                  <p className="text-sm font-bold text-secondary">72%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-emerald-500" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-foreground">Avg Response</p>
                  <p className="text-sm font-bold">2.3h</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-pro p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Building2,
                title: 'Manage Venues',
                description: 'Create, edit, and manage venues',
                href: '/dashboard/admin/venues',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Users,
                title: 'Manage Users',
                description: 'View and manage user accounts',
                href: '/dashboard/admin/users',
                color: 'from-teal-500 to-teal-600',
              },
              {
                icon: BarChart3,
                title: 'View Reports',
                description: 'Access detailed analytics',
                href: '/dashboard/admin/analytics',
                color: 'from-amber-500 to-amber-600',
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-semibold mb-1">{action.title}</h4>
                  <p className="text-sm text-white/80">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="card-pro p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            System Health
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Database', status: 'Healthy' },
              { label: 'API Server', status: 'Healthy' },
              { label: 'Email Service', status: 'Healthy' },
              { label: 'Storage', status: 'Healthy' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                <p className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold inline-block">
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
