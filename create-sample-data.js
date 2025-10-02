const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Patient Schema
const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['ชาย', 'หญิง'] },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Visit Schema
const VisitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visitDate: { type: Date, default: Date.now },
  visitType: { type: String, required: true },
  status: { type: String, enum: ['รอตรวจ', 'กำลังตรวจ', 'เสร็จสิ้น', 'ยกเลิก'], default: 'รอตรวจ' },
  doctor: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit' },
  items: [{
    service: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['รอชำระ', 'ชำระแล้ว', 'ยกเลิก'], default: 'รอชำระ' },
  paymentMethod: { type: String },
  orderDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', PatientSchema);
const Visit = mongoose.model('Visit', VisitSchema);
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

// Create sample data
const createSampleData = async () => {
  try {
    await connectDB();

    console.log('🔄 Creating sample data...');

    // Create sample patients
    const patients = await Patient.insertMany([
      {
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phone: '081-234-5678',
        email: 'somchai@email.com',
        gender: 'ชาย',
        createdAt: new Date() // Today
      },
      {
        firstName: 'สมหญิง',
        lastName: 'สวยงาม',
        phone: '082-345-6789',
        email: 'somying@email.com',
        gender: 'หญิง',
        createdAt: new Date() // Today
      },
      {
        firstName: 'ประยุทธ',
        lastName: 'มั่นคง',
        phone: '083-456-7890',
        email: 'prayuth@email.com',
        gender: 'ชาย',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      }
    ]);

    console.log(`✅ Created ${patients.length} patients`);

    // Create sample visits
    const visits = await Visit.insertMany([
      {
        patientId: patients[0]._id,
        visitType: 'ตรวจสุขภาพทั่วไป',
        status: 'เสร็จสิ้น',
        doctor: 'นพ.สมชาย',
        visitDate: new Date() // Today
      },
      {
        patientId: patients[1]._id,
        visitType: 'ตรวจเลือด',
        status: 'เสร็จสิ้น',
        doctor: 'นพ.สมหญิง',
        visitDate: new Date() // Today
      },
      {
        patientId: patients[2]._id,
        visitType: 'ตรวจหัวใจ',
        status: 'เสร็จสิ้น',
        doctor: 'นพ.ประยุทธ',
        visitDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      }
    ]);

    console.log(`✅ Created ${visits.length} visits`);

    // Create sample orders
    const orders = await Order.insertMany([
      {
        patientId: patients[0]._id,
        visitId: visits[0]._id,
        items: [
          { service: 'ตรวจสุขภาพทั่วไป', price: 1500, quantity: 1 },
          { service: 'ตรวจเลือด', price: 800, quantity: 1 }
        ],
        totalAmount: 2300,
        status: 'ชำระแล้ว',
        paymentMethod: 'เงินสด',
        orderDate: new Date() // Today
      },
      {
        patientId: patients[1]._id,
        visitId: visits[1]._id,
        items: [
          { service: 'ตรวจเลือด', price: 800, quantity: 1 },
          { service: 'ตรวจปัสสาวะ', price: 300, quantity: 1 }
        ],
        totalAmount: 1100,
        status: 'ชำระแล้ว',
        paymentMethod: 'บัตรเครดิต',
        orderDate: new Date() // Today
      },
      {
        patientId: patients[2]._id,
        visitId: visits[2]._id,
        items: [
          { service: 'ตรวจหัวใจ', price: 2500, quantity: 1 }
        ],
        totalAmount: 2500,
        status: 'ชำระแล้ว',
        paymentMethod: 'เงินสด',
        orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        patientId: patients[0]._id,
        items: [
          { service: 'ตรวจสายตา', price: 600, quantity: 1 }
        ],
        totalAmount: 600,
        status: 'รอชำระ',
        orderDate: new Date() // Today - not paid yet
      }
    ]);

    console.log(`✅ Created ${orders.length} orders`);

    // Summary
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const todayStats = await Promise.all([
      Patient.countDocuments({ createdAt: { $gte: startOfToday, $lt: endOfToday } }),
      Visit.countDocuments({ visitDate: { $gte: startOfToday, $lt: endOfToday } }),
      Order.aggregate([
        {
          $match: {
            orderDate: { $gte: startOfToday, $lt: endOfToday },
            status: 'ชำระแล้ว'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ])
    ]);

    const todaySales = todayStats[2].length > 0 ? todayStats[2][0].total : 0;

    console.log('\n📊 Today\'s Summary:');
    console.log(`👥 New Patients: ${todayStats[0]}`);
    console.log(`🏥 Visits: ${todayStats[1]}`);
    console.log(`💰 Sales: ฿${todaySales.toLocaleString()}`);

    console.log('\n🎉 Sample data created successfully!');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createSampleData();
