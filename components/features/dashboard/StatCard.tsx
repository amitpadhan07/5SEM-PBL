'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'teal' | 'green' | 'amber' | 'red';
}

const colorClasses = {
  blue: 'from-blue-500/10 to-blue-400/5 border-blue-200 dark:border-blue-900/30',
  teal: 'from-teal-500/10 to-teal-400/5 border-teal-200 dark:border-teal-900/30',
  green: 'from-green-500/10 to-green-400/5 border-green-200 dark:border-green-900/30',
  amber: 'from-amber-500/10 to-amber-400/5 border-amber-200 dark:border-amber-900/30',
  red: 'from-red-500/10 to-red-400/5 border-red-200 dark:border-red-900/30',
};

const iconBgClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'blue',
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 backdrop-blur-sm shadow-soft hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
              trend.isPositive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}
