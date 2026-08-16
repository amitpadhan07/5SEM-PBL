import mongoose from 'mongoose';
import { Department } from '@/models/Department';
import { Building } from '@/models/Building';
import { Venue } from '@/models/Venue';
import { Holiday } from '@/models/Holiday';
import { SystemSettings } from '@/models/SystemSettings';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vrap';

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to preserve data)
    // await Department.deleteMany({});
    // await Building.deleteMany({});
    // await Venue.deleteMany({});
    // await Holiday.deleteMany({});

    console.log('🌱 Seeding departments...');
    const departments = await Department.insertMany([
      {
        name: 'Computer Science',
        code: 'CS',
        head: 'Dr. John Smith',
        contactEmail: 'cs@college.edu',
      },
      {
        name: 'Electronics',
        code: 'ECE',
        head: 'Dr. Jane Doe',
        contactEmail: 'ece@college.edu',
      },
      {
        name: 'Mechanical',
        code: 'ME',
        head: 'Dr. Robert Brown',
        contactEmail: 'me@college.edu',
      },
      {
        name: 'Civil',
        code: 'CE',
        head: 'Dr. Alice Johnson',
        contactEmail: 'ce@college.edu',
      },
    ]);
    console.log(`✅ Seeded ${departments.length} departments`);

    console.log('🌱 Seeding buildings...');
    const buildings = await Building.insertMany([
      {
        name: 'Building A',
        code: 'BLD-A',
        floors: 5,
        address: 'Campus Main',
      },
      {
        name: 'Building B',
        code: 'BLD-B',
        floors: 4,
        address: 'Campus North',
      },
      {
        name: 'Building C',
        code: 'BLD-C',
        floors: 3,
        address: 'Campus South',
      },
    ]);
    console.log(`✅ Seeded ${buildings.length} buildings`);

    console.log('🌱 Seeding venues...');
    const venues = await Venue.insertMany([
      {
        name: 'Lecture Theatre - LT101',
        code: 'LT-101',
        building: buildings[0]._id,
        floor: 1,
        capacity: 150,
        type: 'Lecture Theatre',
        description: 'Large lecture hall with AV equipment',
        facilities: ['AC', 'Projector', 'SmartBoard', 'SoundSystem', 'Podium'],
        status: 'Available',
      },
      {
        name: 'Seminar Hall - SH201',
        code: 'SH-201',
        building: buildings[0]._id,
        floor: 2,
        capacity: 80,
        type: 'Seminar Hall',
        description: 'Conference room for seminars and workshops',
        facilities: ['AC', 'WiFi', 'Whiteboard', 'Projector'],
        status: 'Available',
      },
      {
        name: 'Lab - LAB301',
        code: 'LAB-301',
        building: buildings[1]._id,
        floor: 3,
        capacity: 60,
        type: 'Lab',
        description: 'Computer laboratory',
        facilities: ['AC', 'WiFi', 'Projector'],
        status: 'Available',
      },
      {
        name: 'Auditorium',
        code: 'AUD-001',
        building: buildings[2]._id,
        floor: 1,
        capacity: 500,
        type: 'Auditorium',
        description: 'Main auditorium for events',
        facilities: ['AC', 'SoundSystem', 'Microphone', 'Stage', 'Projector'],
        status: 'Available',
      },
    ]);
    console.log(`✅ Seeded ${venues.length} venues`);

    console.log('🌱 Seeding holidays...');
    const holidays = await Holiday.insertMany([
      {
        name: 'Republic Day',
        date: new Date('2025-01-26'),
        recurring: true,
      },
      {
        name: 'Independence Day',
        date: new Date('2025-08-15'),
        recurring: true,
      },
      {
        name: 'Gandhi Jayanti',
        date: new Date('2025-10-02'),
        recurring: true,
      },
    ]);
    console.log(`✅ Seeded ${holidays.length} holidays`);

    console.log('🌱 Seeding system settings...');
    await SystemSettings.updateOne(
      {},
      {
        collegeInfo: {
          name: 'College of Engineering',
          logo: '',
          contactEmail: 'admin@college.edu',
          contactPhone: '+91 1234567890',
          timezone: 'Asia/Kolkata',
        },
        auth: {
          otpExpiry: 10,
          passwordPolicy: 'min:8,uppercase:true,lowercase:true,numbers:true',
          sessionTimeout: 24,
        },
        booking: {
          requestExpiry: 48,
          workingHours: [
            { day: 'Monday', start: '08:00', end: '18:00' },
            { day: 'Tuesday', start: '08:00', end: '18:00' },
            { day: 'Wednesday', start: '08:00', end: '18:00' },
            { day: 'Thursday', start: '08:00', end: '18:00' },
            { day: 'Friday', start: '08:00', end: '18:00' },
          ],
          maxAdvanceBookingDays: 365,
          maxBookingDuration: 8,
        },
        calendar: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          holidays: holidays.map((h: any) => h._id),
        },
      },
      { upsert: true }
    );
    console.log('✅ Seeded system settings');

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
