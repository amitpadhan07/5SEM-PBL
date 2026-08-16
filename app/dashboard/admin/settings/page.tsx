import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Settings | VRAP',
  description: 'Configure global system settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure global system parameters
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="border rounded-lg border-border p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">College Name</label>
              <input
                type="text"
                defaultValue="Your College Name"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="contact@college.edu"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <select className="w-full px-3 py-2 border rounded-md border-input bg-background">
                <option>Asia/Kolkata</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="border rounded-lg border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Request Expiry (Hours)
              </label>
              <input
                type="number"
                defaultValue="48"
                min="24"
                max="72"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Advance Booking (Days)
              </label>
              <input
                type="number"
                defaultValue="365"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Booking Duration (Hours)
              </label>
              <input
                type="number"
                defaultValue="8"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
          Save Settings
        </button>
      </div>
    </div>
  );
}
