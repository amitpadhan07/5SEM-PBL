import { Metadata } from 'next';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/shared/DashboardLayout';

export const metadata: Metadata = {
  title: 'Dashboard | Venue Management System',
  description: 'Manage your venue requests and bookings',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
