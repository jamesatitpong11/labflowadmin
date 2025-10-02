const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createSuccessResponse, createErrorResponse, handleApiError } = require('../lib/api-response');

const router = express.Router();

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Keep email for backward compatibility (optional)
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  // Keep name for backward compatibility (optional)
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['ผู้ดูแลระบบ', 'แพทย์', 'พยาบาล', 'เจ้าหน้าที่'],
    default: 'เจ้าหน้าที่'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Note: Password is stored as plain text to match existing database structure
// In production, consider implementing password hashing for security

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('📦 MongoDB already connected');
    return;
  }
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('📦 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error; // Don't exit process, let the route handle the error
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    await connectDB();
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json(createErrorResponse('Username and password are required', 400));
    }

    // Trim whitespace from inputs
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // Find user by username (with or without isActive field)
    const user = await User.findOne({ 
      username: cleanUsername
    });

    console.log('🔍 Login attempt for username:', cleanUsername);
    console.log('🔍 User found:', !!user);
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json(createErrorResponse('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 401));
    }

    console.log('🔍 User data:', {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    });
    console.log('🔍 Database password:', `"${user.password}"`);
    console.log('🔍 Provided password:', `"${cleanPassword}"`);
    console.log('🔍 Password lengths - DB:', user.password.length, 'Provided:', cleanPassword.length);
    console.log('🔍 Password match:', user.password === cleanPassword);

    // Check password (compare plain text password directly since it's stored as plain text in your example)
    if (user.password !== cleanPassword) {
      console.log('❌ Password mismatch');
      return res.status(401).json(createErrorResponse('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 401));
    }

    console.log('✅ Login successful for user:', cleanUsername);

    // Generate token
    const token = generateToken(user);

    res.json(createSuccessResponse({
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        name: `${user.firstName} ${user.lastName}`, // Combine first and last name
        role: 'ผู้ใช้งาน' // Simple default role
      },
      token
    }, 'Login successful'));

  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = handleApiError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    await connectDB();
    
    const { firstName, lastName, phone, username, password, role = 'เจ้าหน้าที่' } = req.body;

    // Validate input
    if (!firstName || !lastName || !phone || !username || !password) {
      return res.status(400).json(createErrorResponse('First name, last name, phone, username, and password are required', 400));
    }

    if (password.length < 6) {
      return res.status(400).json(createErrorResponse('Password must be at least 6 characters long', 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json(createErrorResponse('User with this username already exists', 409));
    }

    // Create user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      username: username.trim(),
      password,
      name: `${firstName.trim()} ${lastName.trim()}`, // For backward compatibility
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json(createSuccessResponse({
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      token
    }, 'User registered successfully', 201));

  } catch (error) {
    console.error('Register error:', error);
    const errorResponse = handleApiError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json(createErrorResponse('Token required', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json(createErrorResponse('Invalid token', 401));
    }

    res.json(createSuccessResponse({
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        name: user.name || `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    }, 'Token valid'));

  } catch (error) {
    console.error('Token verification error:', error);
    const errorResponse = handleApiError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});

module.exports = router;
