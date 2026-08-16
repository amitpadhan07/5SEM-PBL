import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Details | Venue Management System',
  description: 'View request details and status',
};

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Request Details</h1>
          <p className="text-muted-foreground">Request ID will be loaded from params</p>
        </div>

        {/* Placeholder for request detail component */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground">Event Name</label>
              <p className="text-lg font-semibold mt-1">Loading...</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <p className="text-lg font-semibold mt-1">-</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Venue</label>
              <p className="text-lg font-semibold mt-1">-</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Date</label>
              <p className="text-lg font-semibold mt-1">-</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Time</label>
              <p className="text-lg font-semibold mt-1">-</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Expected Participants</label>
              <p className="text-lg font-semibold mt-1">-</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Purpose</label>
            <p className="mt-2 text-foreground">-</p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Approval History</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No approval history yet</p>
            </div>
          </div>
        </div>

        {/* Authority Actions */}
        <div className="mt-6 flex gap-3 justify-end">
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            View Full Request
          </button>
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
            Reject
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
