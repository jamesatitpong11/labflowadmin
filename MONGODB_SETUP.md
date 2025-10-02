# MongoDB Atlas Setup Guide

## 🚀 การตั้งค่า MongoDB Atlas

### 1. สร้าง MongoDB Atlas Account
1. ไปที่ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. สร้าง Organization และ Project ใหม่

### 2. สร้าง Database Cluster
1. คลิก "Build a Database"
2. เลือก "M0 Sandbox" (ฟรี)
3. เลือก Cloud Provider และ Region ที่ใกล้ที่สุด
4. ตั้งชื่อ Cluster (เช่น "labflow-cluster")

### 3. ตั้งค่า Database Access
1. ไปที่ "Database Access" ในเมนูด้านซ้าย
2. คลิก "Add New Database User"
3. เลือก "Password" authentication
4. สร้าง username และ password (จดไว้ให้ดี!)
5. เลือก "Built-in Role" เป็น "Read and write to any database"
6. คลิก "Add User"

### 4. ตั้งค่า Network Access
1. ไปที่ "Network Access" ในเมนูด้านซ้าย
2. คลิก "Add IP Address"
3. เลือก "Allow Access from Anywhere" (0.0.0.0/0)
   - **หมายเหตุ**: สำหรับ production ควรจำกัด IP addresses
4. คลิก "Confirm"

### 5. รับ Connection String
1. ไปที่ "Database" และคลิก "Connect" ที่ cluster ของคุณ
2. เลือก "Connect your application"
3. เลือก "Node.js" และเวอร์ชันล่าสุด
4. คัดลอก Connection String
5. แทนที่ `<password>` ด้วยรหัสผ่านของ database user

### 6. อัปเดต Environment Variables
แก้ไขไฟล์ `.env` ในโปรเจค:

```env
# แทนที่ connection string ด้วยของคุณ
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/labflow-admin?retryWrites=true&w=majority

# สร้าง JWT secret ที่แข็งแกร่ง
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

NODE_ENV=development
VITE_API_URL=http://localhost:3002/api
PORT=3002
```

## 🔧 การรันระบบ

### รัน Backend และ Frontend แยกกัน:
```bash
# Terminal 1 - รัน API Server
npm run server

# Terminal 2 - รัน Frontend
npm run dev
```

### รัน Backend และ Frontend พร้อมกัน:
```bash
npm run dev:full
```

## 📊 การทดสอบ API

### Health Check:
```bash
curl http://localhost:3002/api/health
```

### ทดสอบ Registration:
```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@labflow.com",
    "password": "admin123",
    "name": "ผู้ดูแลระบบ",
    "role": "ผู้ดูแลระบบ"
  }'
```

### ทดสอบ Login:
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@labflow.com",
    "password": "admin123"
  }'
```

## 🛡️ Security Best Practices

1. **Environment Variables**: ไม่เคยเปิดเผย `.env` file
2. **JWT Secret**: ใช้ secret key ที่แข็งแกร่งและยาว
3. **Password Hashing**: ระบบใช้ bcrypt สำหรับ hash passwords
4. **Network Access**: จำกัด IP addresses ใน production
5. **Database User**: สร้าง user แยกสำหรับแต่ละ environment

## 🔍 การ Debug

### ตรวจสอบ MongoDB Connection:
```javascript
// ใน server console จะแสดง:
📦 MongoDB connected successfully
```

### ตรวจสอบ API Server:
```javascript
// ใน server console จะแสดง:
🚀 LabFlow Admin API Server running on port 3002
📊 Environment: development
🔗 API URL: http://localhost:3002/api
❤️  Health check: http://localhost:3002/api/health
```

## 📝 Database Schema

### Users Collection:
- email (String, unique, required)
- password (String, hashed, required)
- name (String, required)
- role (Enum: ผู้ดูแลระบบ, แพทย์, พยาบาล, เจ้าหน้าที่)
- isActive (Boolean, default: true)
- createdAt, updatedAt (Timestamps)

### Patients Collection:
- patientId (String, auto-generated, unique)
- firstName, lastName (String, required)
- email, phone (String)
- dateOfBirth (Date, required)
- gender (Enum: ชาย, หญิง, อื่นๆ)
- address (Object: street, city, province, postalCode)
- emergencyContact (Object: name, relationship, phone)
- medicalHistory, allergies (Array of Strings)
- isActive (Boolean, default: true)
- registrationDate (Date, default: now)

### MedicalRecords Collection:
- recordId (String, auto-generated, unique)
- patientId, doctorId (References)
- visitDate (Date, required)
- visitType (Enum: ตรวจสุขภาพทั่วไป, ตรวจเลือด, etc.)
- symptoms, diagnosis, treatment (String, required)
- medications (Array of Objects)
- labResults (Array of Objects)
- vitalSigns (Object: bloodPressure, heartRate, etc.)
- totalCost (Number, required)
- paymentStatus (Enum: รอชำระ, ชำระแล้ว, ชำระบางส่วน)

## 🚨 Troubleshooting

### ปัญหาที่พบบ่อย:

1. **Connection Timeout**:
   - ตรวจสอบ Network Access settings
   - ตรวจสอบ internet connection

2. **Authentication Failed**:
   - ตรวจสอบ username/password ใน connection string
   - ตรวจสอบ Database User permissions

3. **API ไม่ทำงาน**:
   - ตรวจสอบว่า server รันอยู่ที่ port 3002
   - ตรวจสอบ CORS settings

4. **Frontend ไม่เชื่อมต่อ API**:
   - ตรวจสอบ VITE_API_URL ใน .env
   - ตรวจสอบ network tab ใน browser devtools
