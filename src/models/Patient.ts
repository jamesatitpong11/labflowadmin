import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'ชาย' | 'หญิง' | 'อื่นๆ';
  address: {
    street?: string;
    city: string;
    province: string;
    postalCode?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  allergies: string[];
  isActive: boolean;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9-+().\s]+$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['ชาย', 'หญิง', 'อื่นๆ'],
    required: [true, 'Gender is required']
  },
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    province: {
      type: String,
      required: [true, 'Province is required']
    },
    postalCode: String
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    }
  },
  medicalHistory: [{
    type: String,
    trim: true
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate patient ID before saving
PatientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `P${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Create indexes
PatientSchema.index({ patientId: 1 });
PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ 'address.province': 1 });
PatientSchema.index({ registrationDate: -1 });
PatientSchema.index({ isActive: 1 });

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
