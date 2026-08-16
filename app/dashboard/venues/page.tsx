import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venues | Venue Management System',
  description: 'Browse and filter available venues',
};

export default function VenuesPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Venues</h1>
          <p className="text-muted-foreground">Browse venues and submit booking requests</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search venues..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="building" className="block text-sm font-medium mb-2">
                Building
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Buildings</option>
                <option value="building1">Building A</option>
                <option value="building2">Building B</option>
                <option value="building3">Building C</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Type
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Types</option>
                <option value="classroom">Classroom</option>
                <option value="seminar">Seminar Hall</option>
                <option value="lecture">Lecture Theatre</option>
                <option value="auditorium">Auditorium</option>
              </select>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium mb-2">
                Capacity
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Any Capacity</option>
                <option value="small">1-50</option>
                <option value="medium">51-100</option>
                <option value="large">101-200</option>
                <option value="xlarge">200+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-4xl">📍</span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Venue Name {i}</h3>
                <p className="text-sm text-muted-foreground mb-3">Building A • Capacity: 50</p>

                {/* Facilities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">AC</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">WiFi</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Projector</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-green-600 font-medium">Available Today</span>
                </div>

                {/* Button */}
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  Request Venue
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No venues found matching your criteria</p>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
