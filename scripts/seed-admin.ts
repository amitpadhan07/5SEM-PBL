import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vrap';

async function seedAdmin() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    console.log(`🌱 Checking for existing admin with email: ${adminEmail}`);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      process.exit(0);
    }

    console.log('🌱 Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = new User({
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
      designation: 'Admin',
      emailVerified: true,
      verifiedAt: new Date(),
      profileComplete: true,
      department: 'Administration',
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔐 Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Admin seeding failed:', error);
    process.exit(1);
  }
}

seedAdmin();
