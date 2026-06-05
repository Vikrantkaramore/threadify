import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const envPath = path.resolve(process.cwd(), '.env');
const rootEnvPath = path.resolve(process.cwd(), '../.env');

dotenv.config({ path: envPath });

if ((!process.env.EMAIL_USER && !process.env.GMAIL_USER) || (!process.env.EMAIL_PASS && !process.env.GMAIL_APP_PASSWORD)) {
  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true
}));
app.use(express.json());

// MongoDB Connection (New Atlas Cluster)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'tailor'], default: 'customer' },
  businessName: String,
  phone: String,
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  tailorData: {
    earnings: { type: Number, default: 0 },
    services: [String],
    rating: { type: Number, default: 0 }
  },
  customerData: {
    orders: [{
      id: String,
      status: String,
      tailorId: String,
      price: Number
    }]
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
  service: { type: String, required: true },
  notes: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed'], default: 'Pending' },
  customer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  tailor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  messages: [{
    sender: { type: String, enum: ['customer', 'tailor', 'system'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// JWT Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token error' });
  }
};

// Routes

// Public Auth Routes

// Role-specific auth routes for frontend compatibility
app.post('/api/auth/register/customer', async (req, res) => {
  try {
    console.log('Customer register request:', req.body);
    console.log('MongoDB connected:', mongoose.connection.readyState === 1);
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPw, role: 'customer' });
    await user.save();
    
    // Generate token like login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    console.log('Customer registered successfully:', email);
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Customer registration error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

app.post('/api/auth/register/tailor', async (req, res) => {
  try {
    const { name, email, password, businessName, phone } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPw, role: 'tailor', businessName, phone });
    await user.save();
    
    // Generate token like login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, businessName: user.businessName, phone: user.phone } 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login/customer', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.role !== 'customer') {
      return res.status(403).json({ message: 'Use tailor login' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login/tailor', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.role !== 'tailor') {
      return res.status(403).json({ message: 'Use customer login' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, businessName: user.businessName, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Mock reset token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    // Nodemailer setup (configure EMAIL_USER/PASS in .env)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `Reset link: http://localhost:5173/reset-password?token=${token}`
    });

    res.json({ message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findOne({ 
      _id: decoded.id, 
      resetPasswordExpire: { $gt: Date.now() } 
    });
    if (!user) return res.status(400).json({ message: 'Invalid/expired token' });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Password reset' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/tailors', async (req, res) => {
  try {
    const tailors = await User.find({ role: 'tailor' }).select('name email businessName phone');
    res.json({ tailors });
  } catch (error) {
    console.error('Error fetching tailors:', error);
    res.status(500).json({ message: 'Failed to fetch tailors' });
  }
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create orders' });
    }

    const { tailor_id, service_type, notes } = req.body;
    if (!tailor_id || !service_type) {
      return res.status(400).json({ message: 'Tailor and service type are required' });
    }

    const tailor = await User.findById(tailor_id);
    if (!tailor || tailor.role !== 'tailor') {
      return res.status(404).json({ message: 'Tailor not found' });
    }

    const order = new Order({
      service: service_type,
      notes,
      customer: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      tailor: {
        id: tailor._id,
        name: tailor.name,
        email: tailor.email
      }
    });
    await order.save();

    res.status(201).json({ message: 'Order created', order: {
      id: order._id,
      service: order.service,
      status: order.status,
      customer: order.customer.name,
      date: order.createdAt.toISOString(),
    }});
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get('/api/orders/tailor/:tailorId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'tailor') {
      return res.status(403).json({ message: 'Only tailors can view these orders' });
    }
    if (req.user._id.toString() !== req.params.tailorId) {
      return res.status(403).json({ message: 'Access denied for this tailor' });
    }

    const orders = await Order.find({ 'tailor.id': req.params.tailorId }).sort({ updatedAt: -1 });
    res.json({ orders: orders.map((order) => {
      const messages = order.messages || [];
      const lastMessageData = messages.length ? messages[messages.length - 1] : null;
      return {
        id: order._id.toString(),
        service: order.service,
        customer: order.customer.name,
        customerId: order.customer.id.toString(),
        status: order.status,
        date: order.createdAt.toISOString().split('T')[0],
        description: order.notes || '',
        lastMessage: lastMessageData ? lastMessageData.text : order.notes || 'No messages yet',
        unread: lastMessageData && lastMessageData.sender === 'customer' ? 1 : 0,
      };
    }) });
  } catch (error) {
    console.error('Error fetching tailor orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/customer/:customerId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can view these orders' });
    }
    if (req.user._id.toString() !== req.params.customerId) {
      return res.status(403).json({ message: 'Access denied for this customer' });
    }

    const orders = await Order.find({ 'customer.id': req.params.customerId }).sort({ updatedAt: -1 });
    res.json({ orders: orders.map((order) => {
      const messages = order.messages || [];
      const lastMessageData = messages.length ? messages[messages.length - 1] : null;
      return {
        id: order._id.toString(),
        service: order.service,
        tailor: order.tailor.name,
        tailorId: order.tailor.id.toString(),
        status: order.status,
        date: order.createdAt.toISOString().split('T')[0],
        description: order.notes || '',
        lastMessage: lastMessageData ? lastMessageData.text : order.notes || 'No messages yet',
        unread: lastMessageData && lastMessageData.sender === 'tailor' ? 1 : 0,
      };
    }) });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:orderId/messages', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const userId = req.user._id.toString();
    const isCustomer = order.customer.id.toString() === userId;
    const isTailor = order.tailor.id.toString() === userId;

    if (!isCustomer && !isTailor) {
      return res.status(403).json({ message: 'Access denied for this order' });
    }

    const messages = order.messages || [];
    res.json({
      order: {
        id: order._id.toString(),
        service: order.service,
        status: order.status,
        notes: order.notes,
        customer: {
          id: order.customer.id.toString(),
          name: order.customer.name,
          email: order.customer.email,
        },
        tailor: {
          id: order.tailor.id.toString(),
          name: order.tailor.name,
          email: order.tailor.email,
        },
      },
      messages: messages.map((message) => ({
        sender: message.sender,
        text: message.text,
        timestamp: message.timestamp,
      })),
    });
  } catch (error) {
    console.error('Error fetching order messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

app.post('/api/orders/:orderId/messages', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const userId = req.user._id.toString();
    const isCustomer = order.customer.id.toString() === userId;
    const isTailor = order.tailor.id.toString() === userId;

    if (!isCustomer && !isTailor) {
      return res.status(403).json({ message: 'Access denied for this order' });
    }

    order.messages = order.messages || [];
    const sender = req.user.role === 'customer' ? 'customer' : 'tailor';
    order.messages.push({ sender, text: text.trim() });
    await order.save();

    res.json({
      message: 'Message added',
      messages: order.messages.map((message) => ({
        sender: message.sender,
        text: message.text,
        timestamp: message.timestamp,
      })),
    });
  } catch (error) {
    console.error('Error sending order message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

app.put('/api/orders/:orderId/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'tailor') {
      return res.status(403).json({ message: 'Only tailors can approve orders' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.tailor.id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    order.status = 'Approved';
    await order.save();
    res.json({ message: 'Order approved' });
  } catch (error) {
    console.error('Error approving order:', error);
    res.status(500).json({ message: 'Failed to approve order' });
  }
});

app.put('/api/orders/:orderId/reject', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'tailor') {
      return res.status(403).json({ message: 'Only tailors can reject orders' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.tailor.id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    order.status = 'Rejected';
    await order.save();
    res.json({ message: 'Order rejected' });
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Failed to reject order' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, serviceType, message } = req.body;

    // Basic validation
    if (!name || !email || !serviceType || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
    const contactRecipient = process.env.CONTACT_RECIPIENT || process.env.RECIPIENT_EMAIL || 'supportthreadify.in@gmail.com';

    if (!emailUser || !emailPass) {
      return res.status(500).json({ error: 'Email service is not configured. Set EMAIL_USER / GMAIL_USER and EMAIL_PASS / GMAIL_APP_PASSWORD in the backend environment.' });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Email content
    const mailOptions = {
      from: emailUser,
      replyTo: email,
      to: contactRecipient,
      subject: `New Contact Form Submission: ${serviceType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted via Threadify Contact Form</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact form submitted by ${email}`);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form SMTP error:', {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      command: error.command
    });
    res.status(500).json({ error: 'Failed to send message. Check server logs.' });
  }
});

// Protected Routes
app.get('/api/profile', authMiddleware, async (req, res) => {
  res.json(req.user);
});

app.get('/api/dashboard', authMiddleware, async (req, res) => {
  if (req.user.role === 'tailor') {
    res.json({ 
      role: 'tailor', 
      earnings: req.user.tailorData.earnings, 
      services: req.user.tailorData.services 
    });
  } else {
    res.json({ role: 'customer', orders: req.user.customerData.orders });
  }
});

app.post('/api/chat', authMiddleware, (req, res) => {
  // Stub for chat
  res.json({ message: 'Chat message sent', userId: req.user._id });
});

app.get('/api/notifications', authMiddleware, (req, res) => {
  res.json({ notifications: [] }); // Stub
});

app.put('/api/notifications/mark-all-read', authMiddleware, (req, res) => {
  res.json({ message: 'Notifications marked as read' });
});

app.get('/api/earnings', authMiddleware, (req, res) => {
  if (req.user.role !== 'tailor') return res.status(403).json({ message: 'Tailor only' });
  res.json({ earnings: req.user.tailorData.earnings });
});

app.post('/api/support', authMiddleware, (req, res) => {
  res.json({ message: 'Support ticket created' });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
