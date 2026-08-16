import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import { Department } from '@/models/Department';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vrap';

async function seedDemo() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const departments = await Department.find().limit(4);

    if (departments.length === 0) {
      console.log('❌ No departments found. Run seed.ts first!');
      process.exit(1);
    }

    const demoUsers = [
      {
        name: 'John Student',
        email: 'student@college.edu',
        password: 'Student@123',
        role: 'Student',
        designation: 'Student',
        studentId: 'STU001',
        department: departments[0]._id,
      },
      {
        name: 'Jane Faculty',
        email: 'faculty@college.edu',
        password: 'Faculty@123',
        role: 'Faculty',
        designation: 'Faculty',
        employeeId: 'EMP001',
        department: departments[0]._id,
      },
      {
        name: 'Dr. Robert HOD',
        email: 'hod@college.edu',
        password: 'HOD@123',
        role: 'HOD',
        designation: 'HOD',
        employeeId: 'EMP002',
        department: departments[1]._id,
      },
      {
        name: 'Exam Cell Admin',
        email: 'examcell@college.edu',
        password: 'ExamCell@123',
        role: 'Exam Cell',
        designation: 'Exam Cell Coordinator',
        employeeId: 'EMP003',
        department: departments[2]._id,
      },
    ];

    console.log('🌱 Creating demo users...');
    for (const userData of demoUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          ...userData,
          password: hashedPassword,
          emailVerified: true,
          verifiedAt: new Date(),
          profileComplete: true,
        });
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`ℹ️  ${userData.role} already exists: ${userData.email}`);
      }
    }

    console.log('\n✨ Demo users created!');
    console.log('\nDemo Credentials:');
    console.log('-------------------');
    demoUsers.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Demo seeding failed:', error);
    process.exit(1);
  }
}

seedDemo();
