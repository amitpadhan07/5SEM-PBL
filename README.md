# Venue Request & Approval Portal (VRAP)

A production-ready, enterprise-grade venue booking and request management system for educational institutions.

## Features

### Authentication & Security
- Email-based signup with OTP verification
- Google OAuth integration
- JWT-based authentication with secure tokens
- Role-based access control (Student, Faculty, HOD, Exam Cell, Admin)
- Comprehensive audit logging of all actions
- bcrypt password hashing
- CSRF protection and input validation

### Venue Management
- Complete CRUD operations for venues
- Rich venue information (name, code, capacity, facilities, images, location)
- 9+ venue types (Classroom, Lecture Theatre, Seminar Hall, etc.)
- 12 facility options (AC, Projector, WiFi, Smart Board, etc.)
- Multiple images per venue with cover image support
- Venue blocking system with 9 predefined reasons
- Date range and time slot blocking
- Recurring block patterns
- Venue authority assignment

### Venue Requests & Approvals
- Intuitive request submission form
- Smart availability checking with real-time overlap detection
- Automatic conflict prevention
- Authority-based approval workflow
- Email notifications throughout request lifecycle
- Request status tracking (Pending, Approved, Rejected, Cancelled, Expired, Completed)
- Detailed approval history
- Rejection with custom reasons

### Intelligent Scheduling
- Automatic request expiry (default 48 hours, configurable)
- Hourly cron job for cleanup
- TTL-based database indexes
- Reserved slots for pending requests
- Block detection before slot reservation

### Notifications
- 14+ notification types
- Dual notifications (in-app + email)
- Real-time notification center
- Unread count tracking
- Mark as read/delete functionality

### Admin Dashboard
- System-wide statistics and analytics
- User management
- Venue administration
- Authority assignment
- Request tracking
- System configuration
- Email template management
- Audit log viewing and filtering

### Email Service
- Brevo SMTP integration
- Professional HTML email templates
- Multiple email types:
  - Email verification OTP
  - Welcome email
  - Password reset OTP
  - Request submission
  - Approval/rejection notifications
  - Event reminders (24h, 2h before)
  - Booking completion

### Database
- 17 MongoDB collections
- Mongoose ODM with TypeScript
- TTL indexes for automatic data cleanup
- Comprehensive indexing for query optimization
- Role-based access patterns

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Framer Motion
- React Hook Form
- React Big Calendar (prepared)
- Recharts (prepared)

### Backend
- Next.js API Routes
- Mongoose
- JWT Authentication
- bcryptjs
- Node-Cron

### Database
- MongoDB Atlas

### Email
- Brevo SMTP

### Images
- Cloudinary (prepared)

## Installation

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- MongoDB Atlas account
- Brevo account

### Local Setup

1. **Clone and install:**
```bash
git clone <repository>
cd vrap
pnpm install
```

2. **Environment Setup:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vrap
JWT_SECRET=your_secret_key_min_32_chars
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@college.edu
NEXT_PUBLIC_COLLEGE_NAME=Your College Name
```

3. **Run development server:**
```bash
pnpm dev
```

Visit `http://localhost:3000`

### Database Setup

1. **Create MongoDB Atlas cluster:**
   - Go to mongodb.com/cloud/atlas
   - Create a cluster
   - Get connection string
   - Add to .env.local

2. **Run seed script (optional):**
```bash
node scripts/seed.js
```

This creates:
- Sample departments
- Sample buildings
- Admin user (check console for credentials)

## API Documentation

### Authentication Endpoints

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Venue Endpoints

```
GET    /api/venues
POST   /api/venues
GET    /api/venues/[id]
PUT    /api/venues/[id]
DELETE /api/venues/[id]
POST   /api/venues/[id]/blocks
GET    /api/venues/[id]/blocks
POST   /api/venues/assign-authority
DELETE /api/venues/assign-authority
```

### Request Endpoints

```
GET    /api/requests
POST   /api/requests
GET    /api/requests/[id]
POST   /api/requests/[id]/approve
POST   /api/requests/[id]/reject
POST   /api/requests/[id]/cancel
```

### Support Endpoints

```
GET /api/buildings
POST /api/buildings
GET /api/departments
POST /api/departments
GET /api/notifications
PUT /api/notifications/[id]/read
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages
│   ├── dashboard/        # Dashboard pages
│   └── layout.tsx        # Root layout
├── components/
│   ├── features/         # Feature components
│   ├── shared/           # Shared components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth.ts          # Auth utilities
│   ├── db.ts            # Database connection
│   └── utils.ts         # Common utilities
├── models/              # Mongoose models
├── schemas/             # Zod validation schemas
├── services/            # Business logic services
├── types/               # TypeScript types
├── middleware/          # Express/Next middleware
├── scripts/             # Database seeds
└── emails/              # Email templates
```

## Configuration

### System Settings
Configure via `/dashboard/admin/settings`:
- College information
- Authentication settings
- Booking rules
- Email configuration
- Calendar settings
- Security policies
- Backup schedules

### Email Templates
Customize at `/dashboard/admin/email-templates`:
- Verification OTP
- Welcome
- Password reset
- Request notifications
- Approval/rejection

## Deployment

### Vercel

1. **Connect GitHub repository:**
```bash
git push origin main
```

2. **Deploy to Vercel:**
   - Go to vercel.com
   - Import GitHub repository
   - Set environment variables
   - Deploy

3. **Post-deployment:**
   - Verify database connection
   - Test email sending
   - Create admin user
   - Configure system settings

### Environment Variables for Production

```
MONGODB_URI=<production_mongodb_atlas_uri>
JWT_SECRET=<secure_random_32_char_string>
BREVO_API_KEY=<production_brevo_key>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CRON_SECRET=<secure_random_token>
NODE_ENV=production
```

## Database Models

### User
- Full authentication details
- Role-based access
- Profile completion tracking

### Venue
- Complete venue information
- Multiple images
- Facilities list
- Authority assignments
- Statistics

### VenueRequest
- Request details
- Status tracking
- Approval history
- TTL-based expiry

### VenueBlock
- Block reason and dates
- Recurring patterns
- Supporting documents

### Notification
- User notifications
- Read status tracking
- Related resource references

### AuditLog
- Complete action history
- IP and browser tracking
- Previous/new values for changes

### SystemSettings
- Global configuration
- Email templates
- Security settings
- Backup schedules

## Security Features

- ✅ JWT authentication with secure tokens
- ✅ bcrypt password hashing
- ✅ Rate limiting (configurable)
- ✅ CSRF protection
- ✅ Input validation (Zod)
- ✅ Role-based access control (RBAC)
- ✅ Comprehensive audit logging
- ✅ Secure password reset flow
- ✅ OTP-based email verification
- ✅ Helmet security headers
- ✅ SQL injection prevention (MongoDB native)

## Performance Optimizations

- Image optimization via Cloudinary
- Database query indexing
- TTL-based automatic cleanup
- Request caching with TanStack Query (prepared)
- Code splitting and lazy loading
- Pagination for large datasets
- Efficient MongoDB aggregations

## Future Enhancements

- [ ] Multi-language support
- [ ] Google Calendar integration
- [ ] Outlook calendar sync
- [ ] Mobile app (React Native)
- [ ] QR code check-in system
- [ ] Attendance tracking
- [ ] SMS notifications
- [ ] Zoom/Teams meeting auto-creation
- [ ] Advanced analytics dashboard
- [ ] Capacity utilization prediction
- [ ] Recurring booking patterns
- [ ] Venue recommendations (ML)

## Testing

### Manual Testing Checklist
- [ ] Signup flow
- [ ] Email verification
- [ ] Login/logout
- [ ] Create venue
- [ ] Submit request
- [ ] Approve/reject request
- [ ] Email notifications
- [ ] Availability conflicts
- [ ] Request expiry
- [ ] Admin dashboard

### Load Testing (Prepared)
```bash
npm run load-test
```

## Troubleshooting

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist
- Check .env.local MONGODB_URI
- Ensure cluster is running

### Emails Not Sending
- Verify Brevo API key
- Check sender email verification
- Review email logs in Brevo dashboard

### Auth Token Expired
- Token expires after 7 days by default
- Check JWT_EXPIRY in .env
- Refresh tokens via cookie-based flow

## Support & Contribution

For issues and feature requests, open an issue on GitHub.

For documentation updates or improvements, submit a pull request.

## License

Proprietary - All rights reserved.

## Changelog

### v1.0.0 (Initial Release)
- Complete authentication system
- Venue management
- Request workflow
- Admin dashboard
- Email notifications
- Audit logging

---

**Made with ❤️ by the VRAP Team**
