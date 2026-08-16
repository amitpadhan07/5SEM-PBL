'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Users,
  Wifi,
  Projector,
  Zap,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface VenueCardProps {
  id: string;
  name: string;
  code: string;
  capacity: number;
  building: string;
  floor: number;
  imageUrl?: string;
  status: 'available' | 'unavailable' | 'maintenance';
  facilities: string[];
  authority?: string;
  onRequest?: () => void;
  onDetails?: () => void;
}

const facilityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  projector: <Projector className="w-4 h-4" />,
  ac: <Zap className="w-4 h-4" />,
};

const statusClasses = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  unavailable: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
};

export function VenueCard({
  id,
  name,
  code,
  capacity,
  building,
  floor,
  imageUrl,
  status,
  facilities,
  authority,
  onRequest,
  onDetails,
}: VenueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{code}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-semibold text-foreground">{capacity}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{building}</p>
            <p className="font-semibold text-foreground">Floor {floor}</p>
          </div>
        </div>

        {/* Facilities */}
        {facilities.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Facilities</p>
            <div className="flex flex-wrap gap-2">
              {facilities.slice(0, 3).map((facility) => (
                <div
                  key={facility}
                  className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs flex items-center gap-1"
                >
                  {facilityIcons[facility.toLowerCase()] || <Clock className="w-3 h-3" />}
                  <span className="capitalize">{facility}</span>
                </div>
              ))}
              {facilities.length > 3 && (
                <div className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs">
                  +{facilities.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Authority */}
        {authority && (
          <div className="mb-4 p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Authority</p>
            <p className="text-sm font-medium text-foreground">{authority}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onRequest && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRequest}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 font-medium text-sm hover:shadow-lg transition-shadow"
            >
              Request
            </motion.button>
          )}
          {onDetails && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDetails}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
