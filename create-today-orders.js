const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Order Schema
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

// Create today's orders
const createTodayOrders = async () => {
  try {
    await connectDB();

    console.log('🔄 Creating today\'s sample orders...\n');

    const today = new Date();
    
    // Create some orders for today
    const todayOrders = [
      {
        labOrders: [
          { test: 'ตรวจเลือด', price: 150 },
          { test: 'ตรวจปัสสาวะ', price: 80 }
        ],
        totalAmount: 230,
        paymentMethod: 'เงินสด',
        status: 'completed',
        orderDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30), // 9:30 AM today
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 35)
      },
      {
        labOrders: [
          { test: 'ตรวจสุขภาพทั่วไป', price: 500 }
        ],
        totalAmount: 500,
        paymentMethod: 'โอนเงิน',
        status: 'completed',
        orderDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 15), // 11:15 AM today
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 15),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 20)
      },
      {
        labOrders: [
          { test: 'ตรวจหัวใจ', price: 800 },
          { test: 'ตรวจเลือด', price: 150 }
        ],
        totalAmount: 950,
        paymentMethod: 'บัตรเครดิต',
        status: 'completed',
        orderDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 45), // 2:45 PM today
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 45),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 50)
      },
      {
        labOrders: [
          { test: 'ตรวจสายตา', price: 300 }
        ],
        totalAmount: 300,
        paymentMethod: 'เงินสด',
        status: 'process', // Not completed yet
        orderDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30), // 3:30 PM today
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30)
      }
    ];

    // Insert the orders
    const insertedOrders = await Order.insertMany(todayOrders);
    console.log(`✅ Created ${insertedOrders.length} orders for today\n`);

    // Show what we created
    console.log('📋 Today\'s orders created:');
    insertedOrders.forEach((order, index) => {
      console.log(`${index + 1}. ฿${order.totalAmount} - ${order.status} - ${order.orderDate.toLocaleTimeString('th-TH')}`);
    });

    // Calculate today's sales
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const todaySales = await Order.aggregate([
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

    console.log('\n💰 Today\'s sales summary:');
    if (todaySales.length > 0) {
      console.log(`   Completed orders: ${todaySales[0].count}`);
      console.log(`   Total sales: ฿${todaySales[0].total.toLocaleString()}`);
    } else {
      console.log('   No completed orders found');
    }

    console.log('\n🎉 Sample data for today created successfully!');

  } catch (error) {
    console.error('❌ Error creating today\'s orders:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createTodayOrders();
