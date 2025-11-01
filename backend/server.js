const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');
const http = require('http');
const Redis = require('redis');
const twilio = require('twilio');
require('dotenv').config();

// Import routes
const vulnerabilityRoutes = require('./routes/vulnerabilities');
const cronRoutes = require('./routes/cron');
const authRoutes = require('./routes/auth');
const alertService = require('./utils/alerts');
const User = require('./models/User'); // Add User model import

const authMiddleware = require('./middleware/auth'); // Import your auth middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Trust first proxy (important for correct IP detection with proxies)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vulnscraper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Connect Redis
const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(err => console.error('Redis connection error:', err));

// Setup Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe-alerts', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} subscribed to alerts`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io and redisClient available to routes or elsewhere if needed
app.set('io', io);
app.set('redisClient', redisClient);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/cron', cronRoutes);

// New route: POST /api/send-sms-otp (publicly accessible)
app.post('/api/send-sms-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const key = `otp:${phone}`;

  try {
    // Save OTP with expiration 5 minutes (300 seconds)
    await redisClient.setEx(key, 300, otp);

    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_FROM_NUMBER,
      to: phone
    });

    console.log(`OTP ${otp} sent to ${phone}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Protected route: POST /api/verify-sms-otp (requires auth)
app.post('/api/verify-sms-otp', authMiddleware, async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

  const key = `otp:${phone}`;

  try {
    const savedOtp = await redisClient.get(key);
    if (!savedOtp) return res.status(400).json({ error: 'OTP expired or not found' });

    if (savedOtp === otp) {
      // Delete OTP after verification
      await redisClient.del(key);

      // Find user by ID from JWT and update phone + smsVerified
      const user = await User.findById(req.user.id);
      if (!user) {
        // User not found - should be rare since authenticated
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user's phone and smsVerified
      user.phone = phone;
      user.smsVerified = true;
      await user.save();

      return res.json({ verified: true, message: 'OTP verified and phone number saved' });
    } else {
      return res.status(401).json({ verified: false, error: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start vulnerability monitoring
alertService.startMonitoring(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
