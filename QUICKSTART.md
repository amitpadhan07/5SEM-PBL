# VRAP Quick Start Guide

Get the Venue Request & Approval Portal running in 10 minutes!

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier OK)
- Brevo account (free tier OK)

## Step 1: Clone & Install

```bash
# Clone repository
git clone <your-repo>
cd vrap

# Install dependencies
pnpm install
```

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - BREVO_API_KEY: Your Brevo API key
# - JWT_SECRET: Generate one with: openssl rand -base64 32
```

## Step 3: Seed Database

```bash
# Seed initial data (departments, buildings, venues)
pnpm seed

# Create admin user
ADMIN_EMAIL=admin@college.edu ADMIN_PASSWORD=Admin@12345 pnpm seed:admin

# Create demo users (optional)
pnpm seed:demo
```

## Step 4: Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Step 5: Login & Explore

### Admin Access
- Email: `admin@college.edu`
- Password: `Admin@12345`

### Demo Users (if seeded)
- **Student**: `student@college.edu` / `Student@123`
- **Faculty**: `faculty@college.edu` / `Faculty@123`
- **HOD**: `hod@college.edu` / `HOD@123`
- **Exam Cell**: `examcell@college.edu` / `ExamCell@123`

## Next Steps

1. **Customize Settings**
   - Go to Admin Dashboard → Settings
   - Update college name, timezone, booking rules

2. **Add Your Venues**
   - Admin Dashboard → Manage Venues
   - Create departments and buildings first

3. **Configure Authorities**
   - Admin Dashboard → Authorities
   - Assign venues to faculty/HOD/Exam Cell

4. **Set Up Email Templates**
   - Admin Dashboard → Email Templates
   - Customize with your college branding

## Common Tasks

### Create a New Venue
```
1. Go to Admin Dashboard
2. Click "Manage Venues"
3. Click "Add Venue"
4. Fill details (name, building, capacity, facilities)
5. Save
```

### Request a Venue (as Student)
```
1. Go to Dashboard → Request Venue
2. Fill event details
3. Select date, time, and venue
4. Review availability
5. Submit request
```

### Approve Request (as Authority)
```
1. Go to Dashboard → Pending Approvals
2. Click on request
3. Review details
4. Click Approve or Reject
5. Add optional note
```

## Troubleshooting

### "Database Connection Error"
- Verify MONGODB_URI in .env.local
- Check IP is whitelisted in MongoDB Atlas
- Test connection: `mongosh "mongodb+srv://..."`

### "BREVO_API_KEY not found"
- Ensure .env.local has BREVO_API_KEY
- Restart dev server after adding to .env

### "Port 3000 already in use"
- Use different port: `pnpm dev -- -p 3001`
- Or kill existing process: `lsof -ti:3000 | xargs kill -9`

## Deployment

Ready for production? See [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick summary:
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## Learn More

- [Full Documentation](./README.md)
- [API Reference](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Support

Need help? Check out:
- GitHub Issues
- Documentation Wiki
- Email: dev@college.edu

Happy booking! 🎉
