import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'My Requests | VRAP',
  description: 'View and manage your venue requests',
};

export default function MyRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your venue booking requests
        </p>
      </div>

      <div className="grid gap-4">
        {/* Filters */}
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search requests..."
            className="flex-1 px-3 py-2 border rounded-md border-input bg-background text-foreground"
          />
          <select className="px-3 py-2 border rounded-md border-input bg-background">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Cancelled</option>
            <option>Expired</option>
          </select>
        </div>

        {/* Requests Table Placeholder */}
        <div className="border rounded-lg border-border p-8 text-center">
          <p className="text-muted-foreground">No requests found. Create your first request to get started.</p>
        </div>
      </div>
    </div>
  );
}
