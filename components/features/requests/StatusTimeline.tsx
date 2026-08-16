'use client';

import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TimelineItem {
  status: 'completed' | 'pending' | 'rejected' | 'expired';
  label: string;
  timestamp?: Date;
  note?: string;
}

interface StatusTimelineProps {
  items: TimelineItem[];
  vertical?: boolean;
}

const statusConfig = {
  completed: {
    icon: Check,
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  pending: {
    icon: Clock,
    color: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  rejected: {
    icon: X,
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  expired: {
    icon: AlertCircle,
    color: 'bg-slate-500',
    textColor: 'text-slate-700 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
  },
};

export function StatusTimeline({ items, vertical = true }: StatusTimelineProps) {
  if (!vertical) {
    // Horizontal Timeline
    return (
      <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
        {items.map((item, index) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <div key={index} className="flex flex-col items-center flex-shrink-0">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${config.bgColor}`}
              >
                <Icon className={`w-5 h-5 ${config.textColor}`} />
              </motion.div>

              {/* Label */}
              <p className="text-xs font-medium text-center text-foreground">
                {item.label}
              </p>

              {/* Connector */}
              {index < items.length - 1 && (
                <div className="w-12 h-0.5 bg-muted mx-2 -mt-3" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical Timeline (default)
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;
        const isLast = index === items.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            {/* Timeline Line and Circle */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor} ring-4 ring-background`}
              >
                <Icon className={`w-5 h-5 ${config.textColor}`} />
              </div>

              {/* Connecting Line */}
              {!isLast && <div className={`w-1 h-12 ${config.color} mt-2`} />}
            </div>

            {/* Content */}
            <div className="pt-2 flex-1">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-semibold text-foreground">{item.label}</p>
                {item.timestamp && (
                  <p className="text-xs text-muted-foreground flex-shrink-0">
                    {format(item.timestamp, 'MMM dd, yyyy HH:mm')}
                  </p>
                )}
              </div>
              {item.note && (
                <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
