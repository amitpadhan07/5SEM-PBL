// User Types
export interface IUserData {
  id: string;
  fullName: string;
  email: string;
  role: 'Student' | 'Faculty' | 'HOD' | 'Exam Cell' | 'Admin';
  studentId?: string;
  employeeId?: string;
  department?: string;
  phone?: string;
  photo?: string;
  isEmailVerified: boolean;
  profileCompletionPercentage: number;
  lastLogin?: Date;
}

// Request Types
export interface IVenueRequestData {
  requestId: string;
  eventName: string;
  venue: {
    name: string;
    code: string;
    capacity: number;
  };
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Expired' | 'Completed';
  dateStart: Date;
  dateEnd: Date;
  startTime: string;
  endTime: string;
  expectedParticipants: number;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: IUserData;
}

// Auth State
export interface AuthState {
  user: IUserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: IUserData) => void;
  setToken: (token: string) => void;
}

// UI State
export interface NotificationState {
  notifications: INotificationData[];
  unreadCount: number;
  addNotification: (notification: INotificationData) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
}

export interface INotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Venue Types
export interface IVenueData {
  _id: string;
  name: string;
  code: string;
  capacity: number;
  type: string;
  building: string;
  floor: number;
  status: 'Available' | 'Unavailable' | 'Maintenance';
  facilities: Record<string, boolean>;
  images: {
    url: string;
    isCover?: boolean;
  }[];
  assignedAuthorities: string[];
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    status: string;
    venue?: string;
  };
}
