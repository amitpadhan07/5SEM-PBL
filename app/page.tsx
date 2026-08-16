import Link from 'next/link';
import { ArrowRight, Calendar, Users, Shield, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="font-bold text-lg">VRAP</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Venue Request &{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Approval Portal
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Streamline venue bookings and approvals for your educational institution. Manage requests, track availability, and optimize space utilization with intelligent scheduling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <button className="border border-border hover:bg-muted px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<Calendar size={24} />}
            title="Smart Scheduling"
            description="Real-time venue availability checking with automatic conflict detection"
          />
          <FeatureCard
            icon={<Users size={24} />}
            title="Authority Management"
            description="Role-based approval system with customizable workflows"
          />
          <FeatureCard
            icon={<Shield size={24} />}
            title="Secure Access"
            description="Multi-factor authentication with comprehensive audit logging"
          />
          <FeatureCard
            icon={<BarChart3 size={24} />}
            title="Analytics"
            description="Detailed reports and insights on venue utilization"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Complete Venue Management</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Request submission with detailed event information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Automatic approval/rejection workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Email notifications for all status updates</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Professional calendar views and exports</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
            <div className="space-y-3">
              <div className="h-40 bg-primary/5 rounded-lg"></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-20 bg-primary/5 rounded-lg"></div>
                <div className="h-20 bg-secondary/5 rounded-lg"></div>
                <div className="h-20 bg-primary/5 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              1000+
            </div>
            <p className="text-muted-foreground">Venues Managed</p>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <p className="text-muted-foreground">Requests Processed</p>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <p className="text-muted-foreground">System Uptime</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your venue management?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join educational institutions worldwide using VRAP to efficiently manage venue bookings and approvals.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="font-bold">VRAP</span>
              </div>
              <p className="text-sm text-muted-foreground">Venue Request & Approval Portal</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Venue Request & Approval Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
