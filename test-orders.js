const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Order Schema - matching your data structure
const OrderSchema = new mongoose.Schema({
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit' },
  labOrders: [{ type: mongoose.Schema.Types.Mixed }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String },
  status: { type: String },
  orderDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Test orders data
const testOrders = async () => {
  try {
    await connectDB();

    console.log('🔍 Testing orders data...\n');

    // Get all orders
    const allOrders = await Order.find().limit(5);
    console.log('📋 Sample orders from database:');
    allOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order._id}`);
      console.log(`   Total Amount: ฿${order.totalAmount}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Order Date: ${order.orderDate}`);
      console.log(`   Payment Method: ${order.paymentMethod || 'N/A'}`);
      console.log('');
    });

    // Test today's sales calculation
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    console.log('📅 Date range for today:');
    console.log(`   Start: ${startOfToday}`);
    console.log(`   End: ${endOfToday}\n`);

    // Count orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    console.log('📊 Orders by status:');
    ordersByStatus.forEach(status => {
      console.log(`   ${status._id || 'null'}: ${status.count} orders, ฿${status.totalAmount} total`);
    });

    // Today's completed orders
    const todayCompletedOrders = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfToday, $lt: endOfToday },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n💰 Today\'s completed orders:');
    if (todayCompletedOrders.length > 0) {
      console.log(`   Count: ${todayCompletedOrders[0].count}`);
      console.log(`   Total Sales: ฿${todayCompletedOrders[0].total}`);
    } else {
      console.log('   No completed orders found for today');
    }

    // All orders today (any status)
    const todayAllOrders = await Order.find({
      orderDate: { $gte: startOfToday, $lt: endOfToday }
    });

    console.log(`\n📋 All orders today (${todayAllOrders.length} total):`);
    todayAllOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ฿${order.totalAmount} - ${order.status} - ${order.orderDate}`);
    });

  } catch (error) {
    console.error('❌ Error testing orders:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the test
testOrders();
