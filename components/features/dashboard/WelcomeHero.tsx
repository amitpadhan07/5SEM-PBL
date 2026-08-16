'use client';

import { motion } from 'framer-motion';
import { Calendar, FileText, Bell } from 'lucide-react';
import Link from 'next/link';

interface WelcomeHeroProps {
  name?: string;
  pendingRequests?: number;
  upcomingEvents?: number;
  notifications?: number;
}

export function WelcomeHero({
  name = 'User',
  pendingRequests = 0,
  upcomingEvents = 0,
  notifications = 0,
}: WelcomeHeroProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const stats = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Pending Requests',
      value: pendingRequests,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Upcoming Events',
      value: upcomingEvents,
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notifications',
      value: notifications,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      {/* Main Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-primary/20 rounded-3xl p-8 md:p-12 shadow-soft">
        <div className="flex items-start justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-2"
            >
              {greeting}, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{name}</span> 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Welcome back to the Venue Request & Approval Portal
            </motion.p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            href="/dashboard/venues/request"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Request a Venue
          </Link>
          <Link
            href="/dashboard/calendar"
            className="px-6 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-all"
          >
            View Calendar
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
