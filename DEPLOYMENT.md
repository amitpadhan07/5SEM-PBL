# Venue Request & Approval Portal (VRAP) - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Deployment to Vercel](#deployment-to-vercel)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before deploying VRAP, ensure you have:

- Node.js 18.x or higher
- pnpm package manager (v10.0+)
- MongoDB Atlas account (or self-hosted MongoDB)
- Vercel account
- Brevo (Sendinblue) account for emails
- Cloudinary account for image storage
- Google OAuth credentials (optional, for social login)

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd vrap
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Create Environment File
```bash
cp .env.example .env.local
```

### 4. Configure Environment Variables
Edit `.env.local` with your actual credentials (see section below).

### 5. Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Configuration

### Essential Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vrap?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars

# Brevo Email Service
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@college.edu
BREVO_SENDER_NAME="College Name"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Setup
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Admin@12345

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Cron Job Secret
CRON_SECRET=your-cron-secret-key

# Session
SESSION_SECRET=your-session-secret-key
```

### Development vs Production

For **development** (`NODE_ENV=development`):
- Use local MongoDB or MongoDB Atlas dev cluster
- Less strict SSL validation
- Enhanced error logging

For **production** (`NODE_ENV=production`):
- Use MongoDB Atlas production cluster with backups
- Enable SSL/TLS for all connections
- Minimal logging (security)
- Enable rate limiting

---

## Database Setup

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 free tier for testing, M2+ for production)
3. Create a database user with strong password
4. Whitelist your IP addresses
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/vrap`

### 2. Create Indexes

MongoDB will automatically create indexes based on Mongoose schemas, but you can manually create them for performance:

```javascript
// Run this in MongoDB shell or Atlas
db.users.createIndex({ email: 1 }, { unique: true });
db.venues.createIndex({ code: 1 }, { unique: true });
db.veneuerequests.createIndex({ dateStart: 1, venueId: 1 });
db.auditlogs.createIndex({ timestamp: -1 });
```

### 3. Seed Initial Data

```bash
# Seed departments, buildings, and venues
pnpm seed

# Create admin user
ADMIN_EMAIL=admin@college.edu ADMIN_PASSWORD=Admin@12345 pnpm seed:admin

# Create demo users for testing (optional)
pnpm seed:demo
```

---

## Deployment to Vercel

### 1. Connect GitHub Repository

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Select "Import Git Repository"
4. Choose your VRAP repository
5. Click "Import"

### 2. Configure Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.example`
3. Set different values for each environment (Development, Preview, Production)

### 3. Configure Build & Output Settings

In Vercel dashboard → Settings → General:
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 4. Deploy

Click "Deploy" to start the deployment process.

### 5. Configure Cron Jobs

For automatic request expiry, set up Vercel Cron:

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/expire-requests",
    "schedule": "0 * * * *"
  }]
}
```

---

## Production Checklist

Before going live:

### Security
- [ ] Change all default passwords and API keys
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Use environment-specific secrets

### Database
- [ ] Enable MongoDB backups (automatic on Atlas)
- [ ] Configure automated backup snapshots
- [ ] Test database restore process
- [ ] Set appropriate retention periods
- [ ] Monitor database performance

### Email Service
- [ ] Verify sender domain in Brevo
- [ ] Test all email templates
- [ ] Configure email headers with college branding
- [ ] Set up email bounce handling
- [ ] Monitor email delivery rates

### Image Storage
- [ ] Configure Cloudinary transformations
- [ ] Set up automatic image optimization
- [ ] Configure CDN caching
- [ ] Set up folder structure in Cloudinary

### Monitoring & Logging
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring
- [ ] Enable performance monitoring
- [ ] Set up alerting for errors
- [ ] Configure log retention

### Performance
- [ ] Run Lighthouse audit (target: >90)
- [ ] Enable caching headers
- [ ] Configure CDN caching
- [ ] Optimize images
- [ ] Test API response times

### Testing
- [ ] Test all authentication flows
- [ ] Test venue request workflow
- [ ] Test approval/rejection flow
- [ ] Test email notifications
- [ ] Test calendar functionality
- [ ] Test on mobile devices
- [ ] Test error scenarios

---

## Monitoring & Maintenance

### Daily Tasks
- Monitor error logs
- Check email delivery status
- Verify scheduled cron jobs ran
- Monitor database performance

### Weekly Tasks
- Review user feedback
- Check system performance metrics
- Review audit logs for suspicious activity
- Test critical workflows

### Monthly Tasks
- Review database backups
- Analyze usage analytics
- Update security patches
- Review and optimize slow queries

### Quarterly Tasks
- Full security audit
- Database optimization
- Performance benchmarking
- Capacity planning

---

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database exists
- Test connection string in MongoDB Compass

**Email Not Sending**
- Verify BREVO_API_KEY is correct
- Check sender email is verified in Brevo
- Review Brevo activity log for bounces
- Check rate limits

**Images Not Loading**
- Verify CLOUDINARY credentials
- Check image URLs are accessible
- Verify CORS settings
- Check Cloudinary account storage limits

**API Timeouts**
- Check database query performance
- Review slow query logs
- Optimize MongoDB indexes
- Increase timeout limits if needed

---

## Rollback Procedure

If something goes wrong after deployment:

1. **Identify Issue**: Check error logs in Vercel dashboard
2. **Rollback to Previous Version**: 
   - Go to Vercel dashboard
   - Select deployment
   - Click "Rollback"
3. **Fix Issue Locally**: 
   - Debug the problem
   - Test thoroughly
   - Commit fix to main branch
4. **Redeploy**: Push to main to trigger redeployment

---

## Contact & Support

For issues or questions:
- Check documentation in README.md
- Review API documentation in /api directory
- Contact development team at dev@college.edu

---

## License

This project is proprietary and intended for use by the College only.
