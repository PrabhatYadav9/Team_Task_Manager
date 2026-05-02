const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

// Initialize app
const app = express();

// Connect to database
const seedFallbackData = async () => {
  const [adminUser, memberUser] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    },
    {
      name: 'Member User',
      email: 'member@example.com',
      password: 'password123',
      role: 'Member',
    },
  ]);

  const project = await Project.create({
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles and responsive design',
    owner: adminUser._id,
    members: [adminUser._id, memberUser._id],
  });

  await Task.create([
    {
      title: 'Design Homepage',
      description: 'Create mockups for the new homepage layout',
      projectId: project._id,
      assignedTo: memberUser._id,
      status: 'todo',
      createdBy: adminUser._id,
    },
    {
      title: 'Implement Navigation',
      description: 'Build the responsive navigation component',
      projectId: project._id,
      assignedTo: memberUser._id,
      status: 'todo',
      createdBy: adminUser._id,
    },
    {
      title: 'Setup Database',
      description: 'Configure MongoDB and seed initial data',
      projectId: project._id,
      assignedTo: adminUser._id,
      status: 'in-progress',
      createdBy: adminUser._id,
    },
    {
      title: 'Create User API',
      description: 'Build REST endpoints for user management',
      projectId: project._id,
      assignedTo: adminUser._id,
      status: 'in-progress',
      createdBy: adminUser._id,
    },
    {
      title: 'Write Tests',
      description: 'Add unit tests for all API endpoints',
      projectId: project._id,
      assignedTo: memberUser._id,
      status: 'done',
      createdBy: adminUser._id,
    },
  ]);

  console.log('Seeded fallback demo data');
};

(async () => {
  await connectDB();

  if (connectDB.usingFallback()) {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await seedFallbackData();
    }
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // or if origin is explicitly allowed, or if it's ANY localhost port, or ANY vercel preview domain
      if (
        !origin || 
        allowedOrigins.includes(origin) || 
        origin.startsWith('http://localhost:') || 
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin ${origin}`));
      }
    },
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);
