import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | VRAP',
  description: 'Manage your profile information',
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="border rounded-lg border-border p-6">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                defaultValue="john@college.edu"
                disabled
                className="w-full px-3 py-2 border rounded-md border-input bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                defaultValue="Student"
                disabled
                className="w-full px-3 py-2 border rounded-md border-input bg-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <input
                type="text"
                defaultValue="STU001"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              defaultValue="Computer Science"
              className="w-full px-3 py-2 border rounded-md border-input bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full px-3 py-2 border rounded-md border-input bg-background"
            />
          </div>
        </div>

        <button className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
          Update Profile
        </button>
      </div>

      {/* Profile Completion */}
      <div className="border rounded-lg border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Completion Status</span>
              <span className="text-sm font-semibold">85%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Add a profile photo to complete your profile
        </p>
      </div>
    </div>
  );
}
