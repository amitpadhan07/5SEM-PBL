import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendar | Venue Management System',
  description: 'View venue bookings and schedule',
};

export default function CalendarPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Venue Calendar</h1>
          <p className="text-muted-foreground">View all bookings, blocks, and pending requests across venues</p>
        </div>

        {/* Calendar Controls */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="flex gap-2 border border-border rounded-lg p-1">
                <button className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm">
                  Month
                </button>
                <button className="px-3 py-1 rounded hover:bg-accent text-sm">Week</button>
                <button className="px-3 py-1 rounded hover:bg-accent text-sm">Day</button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button className="px-3 py-1 text-sm border border-border rounded hover:bg-accent">
                ← Previous
              </button>
              <span className="text-sm font-medium">July 2026</span>
              <button className="px-3 py-1 text-sm border border-border rounded hover:bg-accent">
                Next →
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="venue" className="block text-sm font-medium mb-2">
                Filter by Venue
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Venues</option>
                <option value="seminar1">Seminar Hall 1</option>
                <option value="seminar2">Seminar Hall 2</option>
                <option value="auditorium">Main Auditorium</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-2">
                Filter by Department
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Departments</option>
                <option value="cse">Computer Science</option>
                <option value="ece">Electronics</option>
                <option value="me">Mechanical</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Filter by Status
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label htmlFor="export" className="block text-sm font-medium mb-2">
                Export
              </label>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border border-border rounded text-sm hover:bg-accent">
                  PDF
                </button>
                <button className="flex-1 px-3 py-2 border border-border rounded text-sm hover:bg-accent">
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <p className="text-3xl mb-4">📅</p>
              <p className="text-muted-foreground mb-2">Calendar view will render here</p>
              <p className="text-xs text-muted-foreground">
                React Big Calendar component with month, week, and day views
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">Approved Requests</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-sm">Pending Requests</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm">Blocked Slots</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-gray-400"></div>
              <span className="text-sm">Closed/Unavailable</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <StatCard label="Total Bookings" value="0" />
          <StatCard label="Pending Requests" value="0" />
          <StatCard label="Blocked Slots" value="0" />
          <StatCard label="Utilization Rate" value="0%" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
