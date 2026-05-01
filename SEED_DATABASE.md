# Database Seed Script (Optional)

Run this script to populate initial test data in MongoDB.

```javascript
// Save as: backend/seed.js
// Run with: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/team-task-manager');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });

    const memberUser = await User.create({
      name: 'Member User',
      email: 'member@example.com',
      password: 'password123',
      role: 'Member',
    });

    console.log('Created users');

    // Create projects
    const project = await Project.create({
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      owner: adminUser._id,
      members: [adminUser._id, memberUser._id],
    });

    console.log('Created project');

    // Create tasks
    await Task.create([
      {
        title: 'Design Homepage',
        description: 'Create mockups and designs for homepage',
        projectId: project._id,
        assignedTo: memberUser._id,
        status: 'todo',
        dueDate: new Date('2024-02-15'),
        createdBy: adminUser._id,
      },
      {
        title: 'Setup Development Environment',
        description: 'Setup all necessary tools and libraries',
        projectId: project._id,
        assignedTo: memberUser._id,
        status: 'in-progress',
        dueDate: new Date('2024-02-10'),
        createdBy: adminUser._id,
      },
      {
        title: 'Database Migration',
        description: 'Migrate data from old database',
        projectId: project._id,
        assignedTo: adminUser._id,
        status: 'done',
        dueDate: new Date('2024-01-20'),
        createdBy: adminUser._id,
      },
    ]);

    console.log('Created tasks');
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

const main = async () => {
  await connectDB();
  await seedDatabase();
};

main();
```

## Running the Seed Script

```bash
cd backend
node seed.js
```

This will:
1. Clear existing data
2. Create two test users (Admin and Member)
3. Create a sample project
4. Create sample tasks with different statuses

After seeding, you can login with:
- Admin: `admin@example.com` / `password123`
- Member: `member@example.com` / `password123`
