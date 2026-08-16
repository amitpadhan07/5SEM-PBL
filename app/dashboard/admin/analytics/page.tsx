import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Venue Management System',
  description: 'System analytics and insights',
};

export default function AnalyticsDashboard() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">System-wide insights and performance metrics</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            Last 7 Days
          </button>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">
            Last 30 Days
          </button>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">
            Last 90 Days
          </button>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">
            Last Year
          </button>
          <button className="ml-auto px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">
            Export Report
          </button>
        </div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Venues" value="12" change="+2" />
          <StatCard label="Total Users" value="245" change="+18" />
          <StatCard label="Total Requests" value="1,340" change="+145" />
          <StatCard label="Approval Rate" value="87.5%" change="+3.2%" />
          <StatCard label="Avg Response Time" value="2.4h" change="-0.5h" />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Requests Over Time */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Requests Over Time</h3>
            <div className="w-full h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground text-sm">Chart: Requests by date (Recharts)</p>
            </div>
          </div>

          {/* Requests by Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Requests by Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Approved</span>
                  <span className="text-sm font-semibold">1,100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '82.1%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Pending</span>
                  <span className="text-sm font-semibold">160</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '11.9%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Rejected</span>
                  <span className="text-sm font-semibold">80</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Venues & Departments */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Top Venues */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Top Venues by Bookings</h3>
            <div className="space-y-3">
              {[
                { name: 'Seminar Hall 1', count: 156, percent: 34 },
                { name: 'Main Auditorium', count: 142, percent: 31 },
                { name: 'Seminar Hall 2', count: 128, percent: 28 },
                { name: 'Classroom A101', count: 45, percent: 10 },
                { name: 'Lecture Theatre', count: 35, percent: 8 },
              ].map((venue, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{venue.name}</span>
                    <span className="text-sm text-muted-foreground">{venue.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${venue.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Departments */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Requests by Department</h3>
            <div className="space-y-3">
              {[
                { name: 'Computer Science', count: 245, percent: 18 },
                { name: 'Electronics', count: 198, percent: 15 },
                { name: 'Mechanical', count: 167, percent: 12 },
                { name: 'Civil', count: 145, percent: 11 },
                { name: 'Others', count: 585, percent: 44 },
              ].map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground">{dept.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${dept.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours & Utilization */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Peak Hours */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Peak Hours</h3>
            <div className="w-full h-48 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground text-sm">Chart: Requests by hour (Recharts)</p>
            </div>
          </div>

          {/* Utilization Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Venue Utilization Rate</h3>
            <div className="space-y-3">
              {[
                { name: 'Seminar Hall 1', rate: 85 },
                { name: 'Main Auditorium', rate: 72 },
                { name: 'Seminar Hall 2', rate: 68 },
                { name: 'Classroom A101', rate: 45 },
              ].map((venue, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{venue.name}</span>
                    <span className="text-sm font-semibold">{venue.rate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        venue.rate > 80
                          ? 'bg-green-500'
                          : venue.rate > 60
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${venue.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} from last period
      </p>
    </div>
  );
}
