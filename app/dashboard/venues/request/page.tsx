import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Venue | Venue Management System',
  description: 'Submit a venue request',
};

export default function RequestVenuePage() {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Request a Venue</h1>
          <p className="text-muted-foreground">Fill in the details below to request a venue for your event</p>
        </div>

        {/* Venue Request Form */}
        <form className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Event Details Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Event Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  id="eventName"
                  placeholder="e.g., Annual Technology Conference"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium mb-2">
                    Purpose *
                  </label>
                  <select
                    id="purpose"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select purpose...</option>
                    <option value="academic">Academic Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="conference">Conference</option>
                    <option value="exam">Exam</option>
                    <option value="cultural">Cultural Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium mb-2">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="participants" className="block text-sm font-medium mb-2">
                    Expected Participants *
                  </label>
                  <input
                    type="number"
                    id="participants"
                    placeholder="e.g., 100"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select department...</option>
                    <option value="cse">Computer Science</option>
                    <option value="ece">Electronics</option>
                    <option value="me">Mechanical</option>
                    <option value="ce">Civil</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="chiefGuest" className="block text-sm font-medium mb-2">
                  Chief Guest / VIP (if any)
                </label>
                <input
                  type="text"
                  id="chiefGuest"
                  placeholder="Name of chief guest"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold mb-4">Date & Time</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateStart" className="block text-sm font-medium mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="dateStart"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="allDay" className="block text-sm font-medium mb-2">
                    Duration
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="allDay"
                      className="w-4 h-4 rounded border border-border"
                    />
                    <span className="text-sm">All Day</span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Venue Selection */}
          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold mb-4">Venue Selection</h2>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium mb-2">
                Preferred Venue *
              </label>
              <select
                id="venue"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a venue...</option>
                <option value="seminar1">Seminar Hall 1</option>
                <option value="seminar2">Seminar Hall 2</option>
                <option value="auditorium">Main Auditorium</option>
                <option value="classroom">Classroom A101</option>
              </select>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold mb-4">Special Requirements</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border border-border" />
                <span className="text-sm">Projector & Screen</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border border-border" />
                <span className="text-sm">Sound System</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border border-border" />
                <span className="text-sm">WiFi Access</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border border-border" />
                <span className="text-sm">Refreshments Required</span>
              </label>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium mb-2">
                Remarks / Special Instructions
              </label>
              <textarea
                id="remarks"
                rows={4}
                placeholder="Any additional information or special instructions for the venue authority..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="border-t border-border pt-6 flex gap-3 justify-end">
            <button
              type="button"
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
