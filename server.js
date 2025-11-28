import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection 
let User;
let isDbConnected = false;

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      // No deprecated options needed for Atlas
    });
    isDbConnected = true;
    console.log('Connected to MongoDB Atlas');

    // User schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password_hash: { type: String, required: true },
      role: { type: String, required: true, enum: ['customer', 'tailor'] },
      name: { type: String, required: true },
      business_name: { type: String },
      phone: { type: String },
      resetToken: { type: String },
      resetTokenExpiry: { type: Date },
      created_at: { type: Date, default: Date.now }
    });

    // Order schema
    const orderSchema = new mongoose.Schema({
      customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      tailor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      service_type: { type: String, required: true },
      status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
      notes: { type: String },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    });

    // Notification schema
    const notificationSchema = new mongoose.Schema({
      tailor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      is_read: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now }
    });

    User = mongoose.model('User', userSchema);
    const Order = mongoose.model('Order', orderSchema);
    const Notification = mongoose.model('Notification', notificationSchema);
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    console.log('Server will continue without database functionality. Some features may not work.');
  }
})();

// Create nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD 
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, serviceType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission - ${serviceType || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF94B4;">New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Service Type:</strong> ${serviceType || 'Not specified'}</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This email was sent from the Threadify contact form.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
//End of nodemailer setup

// Authentication endpoints

// Customer registration
app.post('/api/auth/register/customer', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password_hash: passwordHash,
      role: 'customer',
      name
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, email, role: 'customer' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      user: { id: savedUser._id, email, role: 'customer', name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tailor registration
app.post('/api/auth/register/tailor', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { name, email, password, businessName, phone } = req.body;

    // Validate input
    if (!name || !email || !password || !businessName || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password_hash: passwordHash,
      role: 'tailor',
      name,
      business_name: businessName,
      phone
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, email, role: 'tailor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Tailor registered successfully',
      token,
      user: { id: savedUser._id, email, role: 'tailor', name, businessName, phone }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer login
app.post('/api/auth/login/customer', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email, role: 'customer' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tailor login
app.post('/api/auth/login/tailor', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email, role: 'tailor' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.name, businessName: user.business_name, phone: user.phone }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile endpoint
app.put('/api/auth/update-profile', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: { id: updatedUser._id, email: updatedUser.email, role: updatedUser.role, name: updatedUser.name }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tailors
app.get('/api/tailors', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const tailors = await User.find({ role: 'tailor' }).select('name email business_name phone created_at');

    res.json({ tailors });
  } catch (error) {
    console.error('Get tailors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate secure token
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Set token and expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Threadify',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF94B4;">Password Reset Request</h2>
          <p>You requested a password reset for your Threadify account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #FF94B4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p style="color: #666; font-size: 12px;">This email was sent from Threadify.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Find user
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear token
    user.password_hash = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book service endpoint
app.post('/api/orders', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'customer') {
      return res.status(403).json({ error: 'Only customers can book services' });
    }

    const { tailor_id, service_type, notes } = req.body;

    if (!tailor_id || !service_type) {
      return res.status(400).json({ error: 'Tailor ID and service type are required' });
    }

    // Verify tailor exists
    const tailor = await User.findById(tailor_id);
    if (!tailor || tailor.role !== 'tailor') {
      return res.status(404).json({ error: 'Tailor not found' });
    }

    // Create order
    const Order = mongoose.model('Order');
    const newOrder = new Order({
      customer_id: decoded.id,
      tailor_id,
      service_type,
      notes: notes || ''
    });

    const savedOrder = await newOrder.save();

    // Create notification for tailor
    const Notification = mongoose.model('Notification');
    const notification = new Notification({
      tailor_id,
      message: `New service booking from ${decoded.name || 'Customer'}: ${service_type}`,
      order_id: savedOrder._id
    });

    await notification.save();

    res.status(201).json({
      message: 'Service booked successfully',
      order: {
        id: savedOrder._id,
        service_type: savedOrder.service_type,
        status: savedOrder.status,
        created_at: savedOrder.created_at
      }
    });
  } catch (error) {
    console.error('Book service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get notifications for tailor
app.get('/api/notifications/:tailorId', async (req, res) => {
  try {
    if (!isDbConnected || !User) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'tailor') {
      return res.status(403).json({ error: 'Only tailors can access notifications' });
    }

    const { tailorId } = req.params;
    if (decoded.id !== tailorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const Notification = mongoose.model('Notification');
    const notifications = await Notification.find({ tailor_id: tailorId })
      .sort({ created_at: -1 })
      .select('message created_at is_read order_id');

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
