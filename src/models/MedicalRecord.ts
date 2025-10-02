import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
  _id: string;
  recordId: string;
  patientId: string;
  doctorId: string;
  visitDate: Date;
  visitType: 'ตรวจสุขภาพทั่วไป' | 'ตรวจเลือด' | 'ตรวจหัวใจ' | 'ตรวจสายตา' | 'อื่นๆ';
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  labResults: Array<{
    testName: string;
    result: string;
    normalRange: string;
    unit: string;
  }>;
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  notes: string;
  followUpDate?: Date;
  status: 'รอผลตรวจ' | 'เสร็จสิ้น' | 'ต้องติดตาม';
  totalCost: number;
  paymentStatus: 'รอชำระ' | 'ชำระแล้ว' | 'ชำระบางส่วน';
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema: Schema = new Schema({
  recordId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    ref: 'Patient'
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required'],
    ref: 'User'
  },
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required'],
    default: Date.now
  },
  visitType: {
    type: String,
    enum: ['ตรวจสุขภาพทั่วไป', 'ตรวจเลือด', 'ตรวจหัวใจ', 'ตรวจสายตา', 'อื่นๆ'],
    required: [true, 'Visit type is required']
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms are required'],
    trim: true
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true
  },
  treatment: {
    type: String,
    required: [true, 'Treatment is required'],
    trim: true
  },
  medications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    frequency: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    }
  }],
  labResults: [{
    testName: {
      type: String,
      required: true,
      trim: true
    },
    result: {
      type: String,
      required: true,
      trim: true
    },
    normalRange: {
      type: String,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    }
  }],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  notes: {
    type: String,
    trim: true
  },
  followUpDate: Date,
  status: {
    type: String,
    enum: ['รอผลตรวจ', 'เสร็จสิ้น', 'ต้องติดตาม'],
    default: 'รอผลตรวจ'
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['รอชำระ', 'ชำระแล้ว', 'ชำระบางส่วน'],
    default: 'รอชำระ'
  }
}, {
  timestamps: true
});

// Generate record ID before saving
MedicalRecordSchema.pre('save', async function(next) {
  if (!this.recordId) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('MedicalRecord').countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }
    });
    this.recordId = `MR${dateStr}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Create indexes
MedicalRecordSchema.index({ recordId: 1 });
MedicalRecordSchema.index({ patientId: 1 });
MedicalRecordSchema.index({ doctorId: 1 });
MedicalRecordSchema.index({ visitDate: -1 });
MedicalRecordSchema.index({ visitType: 1 });
MedicalRecordSchema.index({ status: 1 });
MedicalRecordSchema.index({ paymentStatus: 1 });

export default mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
