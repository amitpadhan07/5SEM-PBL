# VRAP Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment (Local)

### Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Generate JWT_SECRET: `openssl rand -base64 32`
- [ ] Add MONGODB_URI (MongoDB Atlas)
- [ ] Add BREVO_API_KEY
- [ ] Add CLOUDINARY credentials
- [ ] Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (if using OAuth)
- [ ] Set CRON_SECRET for scheduled jobs
- [ ] Verify all required variables are present

### Database Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Create database user with strong password
- [ ] Add IP whitelist entries
- [ ] Verify connection string works locally
- [ ] Run `pnpm seed` to create initial data
- [ ] Run `pnpm seed:admin` to create admin user
- [ ] Verify data in MongoDB Atlas

### Build & Test
- [ ] Run `pnpm install` successfully
- [ ] Run `pnpm build` successfully (no errors)
- [ ] Start dev server: `pnpm dev`
- [ ] Access http://localhost:3000
- [ ] Test login with admin credentials
- [ ] Test creating a venue request
- [ ] Test calendar functionality
- [ ] Test email notifications (check Brevo logs)

### Code Quality
- [ ] Run `pnpm lint` (fix any warnings)
- [ ] No TypeScript errors in critical files
- [ ] All imports resolve correctly
- [ ] No console errors in browser

---

## Vercel Setup

### Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or Vercel has access
- [ ] Main branch is stable
- [ ] No uncommitted changes

### Vercel Project
- [ ] Create new Vercel project
- [ ] Connect GitHub repository
- [ ] Select framework: Next.js
- [ ] Build command: `pnpm build`
- [ ] Install command: `pnpm install`
- [ ] Output directory: `.next`

### Environment Variables (Vercel)
- [ ] Add MONGODB_URI
- [ ] Add JWT_SECRET
- [ ] Add JWT_REFRESH_SECRET
- [ ] Add BREVO_API_KEY
- [ ] Add BREVO_SENDER_EMAIL
- [ ] Add BREVO_SENDER_NAME
- [ ] Add CLOUDINARY_CLOUD_NAME
- [ ] Add CLOUDINARY_API_KEY
- [ ] Add CLOUDINARY_API_SECRET
- [ ] Add CRON_SECRET
- [ ] Add SESSION_SECRET
- [ ] Verify all variables in Production environment

### Cron Jobs
- [ ] Set up request expiry cron in vercel.json
- [ ] Schedule: `0 * * * *` (hourly)
- [ ] Path: `/api/cron/expire-requests`
- [ ] Verify cron secret is set

---

## External Services Configuration

### MongoDB Atlas
- [ ] Set up automated backups
- [ ] Enable backup snapshots (daily)
- [ ] Configure backup retention (30 days)
- [ ] Enable monitoring and alerts
- [ ] Set up IP access alerts
- [ ] Test restore procedure

### Brevo Configuration
- [ ] Verify sender email address
- [ ] Add sender domain if using custom domain
- [ ] Set up SPF and DKIM records
- [ ] Create email templates for:
  - OTP verification
  - Welcome email
  - Password reset
  - Request confirmation
  - Approval/rejection
  - Reminders (24h, 2h)
- [ ] Test email delivery
- [ ] Monitor bounce rates

### Cloudinary Setup
- [ ] Create folder structure
- [ ] Set up image optimization
- [ ] Configure CDN caching
- [ ] Test image uploads
- [ ] Verify CORS settings

### Google OAuth (If Using)
- [ ] Create OAuth 2.0 credentials in Google Cloud
- [ ] Add Vercel domain to authorized redirect URIs
- [ ] Add localhost for testing
- [ ] Verify client ID and secret are correct

---

## Pre-Production Testing

### Authentication
- [ ] Test email signup flow
- [ ] Test OTP verification (check email)
- [ ] Test email + password login
- [ ] Test Google OAuth login (if enabled)
- [ ] Test password reset flow
- [ ] Test logout functionality
- [ ] Test session persistence
- [ ] Test token refresh

### Venue Management
- [ ] Admin can create venue
- [ ] Admin can edit venue
- [ ] Admin can delete venue
- [ ] Admin can archive/restore venue
- [ ] Can assign authorities to venues
- [ ] Can block venues
- [ ] Can create recurring blocks
- [ ] Blocked venues don't appear in search

### Request Workflow
- [ ] User can submit venue request
- [ ] Availability checking works
- [ ] Conflict detection prevents double-booking
- [ ] Email sent to authority
- [ ] Authority receives request in dashboard
- [ ] Authority can approve request
- [ ] Authority can reject with reason
- [ ] User receives email notification

### Notifications
- [ ] In-app notifications appear
- [ ] Email notifications are sent
- [ ] Unread badge count works
- [ ] Mark as read functionality works
- [ ] All 14+ notification types trigger

### Calendar
- [ ] Calendar loads without errors
- [ ] Month/week/day/agenda views work
- [ ] Events display with correct colors
- [ ] Can click event to see details
- [ ] Filters work correctly
- [ ] Export to PDF works
- [ ] Export to Excel works

### Analytics
- [ ] Admin analytics dashboard loads
- [ ] Charts display correctly
- [ ] Statistics are accurate
- [ ] Reports generate correctly
- [ ] Export works for all formats

### Search
- [ ] Global search works (Ctrl+K)
- [ ] Search finds venues
- [ ] Search finds users
- [ ] Search finds requests
- [ ] Results are accurate

### Admin Features
- [ ] Admin dashboard accessible
- [ ] Settings can be updated
- [ ] Email templates can be edited
- [ ] Audit logs show all actions
- [ ] User management works
- [ ] Role assignment works

---

## Performance Checks

### Page Load
- [ ] Homepage loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] API responses < 200ms average
- [ ] Images load and optimize
- [ ] No layout shift (CLS < 0.1)

### Lighthouse Audit
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

### Load Testing
- [ ] System handles 100+ concurrent users
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Error rate < 0.1%

---

## Security Checks

### Authentication
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens signed securely
- [ ] No sensitive data in cookies
- [ ] Session timeout configured
- [ ] Token refresh working

### API Security
- [ ] All endpoints protected
- [ ] Role-based access enforced
- [ ] Input validation on all endpoints
- [ ] Rate limiting active
- [ ] CORS configured correctly

### Data Protection
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Database backups encrypted
- [ ] Sensitive env vars not in code
- [ ] No API keys in logs
- [ ] SQL injection prevented

### Audit Trail
- [ ] All actions logged
- [ ] Audit logs include user, IP, timestamp
- [ ] Admin can view audit logs
- [ ] Logs retained for compliance

---

## Error Handling

### Error Scenarios
- [ ] Test network disconnection
- [ ] Test invalid inputs
- [ ] Test missing required fields
- [ ] Test concurrent requests
- [ ] Test database connection failure
- [ ] Test email service failure
- [ ] Test file upload failure

### Error Messages
- [ ] Users see helpful error messages
- [ ] Technical errors not exposed to users
- [ ] Errors logged for debugging
- [ ] Error monitoring configured (optional: Sentry)

---

## Monitoring & Alerts

### Vercel Monitoring
- [ ] Enable performance monitoring
- [ ] Set up error alerts
- [ ] Configure deployment notifications
- [ ] Monitor function execution
- [ ] Check build logs regularly

### Database Monitoring
- [ ] Set up MongoDB Atlas alerts
- [ ] Monitor query performance
- [ ] Track connection count
- [ ] Monitor storage usage
- [ ] Set up backup alerts

### Application Monitoring
- [ ] Set up error tracking (Sentry optional)
- [ ] Monitor API response times
- [ ] Track user activity
- [ ] Monitor email delivery
- [ ] Check cron job execution

---

## Post-Deployment

### Immediate After Deploy
- [ ] Access production URL
- [ ] Verify all pages load
- [ ] Test critical workflows
- [ ] Check logs for errors
- [ ] Verify database connection
- [ ] Test email notifications
- [ ] Monitor for first-hour issues

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Monitor email delivery
- [ ] Check user feedback
- [ ] Review audit logs

### Ongoing
- [ ] Daily: Check error logs
- [ ] Daily: Verify backups completed
- [ ] Weekly: Review analytics
- [ ] Weekly: Check security logs
- [ ] Monthly: Full system audit
- [ ] Monthly: Database optimization
- [ ] Quarterly: Security review

---

## Rollback Procedure

If issues occur:

1. **Immediate**: Rollback Vercel deployment
   - Go to Vercel dashboard
   - Select previous working deployment
   - Click "Rollback"

2. **Investigation**: Check what went wrong
   - Review build logs
   - Check error tracking
   - Review code changes

3. **Fix**: Address the issue
   - Debug locally
   - Test thoroughly
   - Commit fix to git

4. **Redeploy**: Deploy fixed version
   - Push to main branch
   - Vercel auto-deploys
   - Monitor deployment

---

## Success Criteria

Deployment is successful when:

- ✅ All pages load without errors
- ✅ Authentication works for all roles
- ✅ Venue requests can be created
- ✅ Approvals work correctly
- ✅ Emails are sent and delivered
- ✅ Calendar displays properly
- ✅ Analytics show correct data
- ✅ Search functionality works
- ✅ Notifications display correctly
- ✅ Audit logs record actions
- ✅ Performance meets targets
- ✅ No critical errors in logs
- ✅ Users report positive experience
- ✅ System is stable for 24 hours

---

## Contact & Support

For deployment issues:
- Check DEPLOYMENT.md for detailed guide
- Review Vercel documentation
- Check MongoDB Atlas documentation
- Consult Brevo email documentation

---

## Final Notes

- Keep this checklist for future deployments
- Update checklist as system evolves
- Document any changes to production
- Keep deployment credentials secure
- Maintain regular backups
- Monitor system continuously

**Deployment Date**: ______________  
**Deployed By**: ______________  
**Approval**: ______________  

---

**Status**: Ready for Production Deployment ✅
