import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  businessName: String,
  phone: String
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  service: String,
  notes: String,
  status: String,
  customer: Object,
  tailor: Object,
  createdAt: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const tailors = await User.find({ role: 'tailor' }).select('name email businessName phone').lean();
    const orders = await Order.find().lean();
    console.log('tailors', tailors.length);
    console.log(JSON.stringify(tailors, null, 2));
    console.log('orders', orders.length);
    console.log(JSON.stringify(orders.slice(0, 5), null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
