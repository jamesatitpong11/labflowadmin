import { Request, Response } from 'express';
import connectToDatabase from '@/lib/database';
import Patient from '@/models/Patient';
import MedicalRecord from '@/models/MedicalRecord';
import { createSuccessResponse, handleApiError, ApiError } from '@/lib/api-response';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export interface DashboardStats {
  totalPatients: number;
  todayPatients: number;
  todaySales: number;
  monthlyRegistrations: number;
  dailySales: Array<{
    name: string;
    sales: number;
    registrations: number;
  }>;
  monthlyData: Array<{
    month: string;
    sales: number;
    registrations: number;
  }>;
  programData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    patient: string;
    time: string;
  }>;
}

export default async function dashboardStatsHandler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json(handleApiError(new ApiError('Method not allowed', 405)));
  }

  try {
    // Verify authentication
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      throw new ApiError('Authorization token required', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new ApiError('Invalid or expired token', 401);
    }

    await connectToDatabase();

    // Get current date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total patients
    const totalPatients = await Patient.countDocuments({ isActive: true });

    // Get today's patients
    const todayPatients = await Patient.countDocuments({
      registrationDate: { $gte: startOfToday },
      isActive: true
    });

    // Get today's sales
    const todaySalesData = await MedicalRecord.aggregate([
      {
        $match: {
          visitDate: { $gte: startOfToday },
          paymentStatus: 'ชำระแล้ว'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCost' }
        }
      }
    ]);
    const todaySales = todaySalesData[0]?.total || 0;

    // Get monthly registrations
    const monthlyRegistrations = await Patient.countDocuments({
      registrationDate: { $gte: startOfMonth },
      isActive: true
    });

    // Get daily sales (last 7 days)
    const dailySalesData = await MedicalRecord.aggregate([
      {
        $match: {
          visitDate: { $gte: startOfWeek },
          paymentStatus: 'ชำระแล้ว'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitDate' } },
          sales: { $sum: '$totalCost' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get daily registrations (last 7 days)
    const dailyRegistrationsData = await Patient.aggregate([
      {
        $match: {
          registrationDate: { $gte: startOfWeek },
          isActive: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$registrationDate' } },
          registrations: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format daily data
    const dailySales = [];
    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      
      const salesData = dailySalesData.find(d => d._id === dateStr);
      const registrationData = dailyRegistrationsData.find(d => d._id === dateStr);
      
      dailySales.push({
        name: dayName,
        sales: salesData?.sales || 0,
        registrations: registrationData?.registrations || 0
      });
    }

    // Get monthly data (last 6 months)
    const monthlyData = [];
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      
      const monthlySales = await MedicalRecord.aggregate([
        {
          $match: {
            visitDate: { $gte: date, $lt: nextMonth },
            paymentStatus: 'ชำระแล้ว'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalCost' }
          }
        }
      ]);
      
      const monthlyRegs = await Patient.countDocuments({
        registrationDate: { $gte: date, $lt: nextMonth },
        isActive: true
      });
      
      monthlyData.push({
        month: monthNames[date.getMonth()],
        sales: monthlySales[0]?.total || 0,
        registrations: monthlyRegs
      });
    }

    // Get program distribution
    const programDistribution = await MedicalRecord.aggregate([
      {
        $group: {
          _id: '$visitType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalVisits = programDistribution.reduce((sum, item) => sum + item.count, 0);
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];
    
    const programData = programDistribution.map((item, index) => ({
      name: item._id,
      value: Math.round((item.count / totalVisits) * 100),
      color: colors[index % colors.length]
    }));

    // TODO: Implement real recent activity data from database
    const recentActivity: any[] = [];

    const stats: DashboardStats = {
      totalPatients,
      todayPatients,
      todaySales,
      monthlyRegistrations,
      dailySales,
      monthlyData,
      programData,
      recentActivity
    };

    const response = createSuccessResponse(stats, 'Dashboard stats retrieved successfully');
    res.status(200).json(response);

  } catch (error) {
    const errorResponse = handleApiError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'เมื่อสักครู่';
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} วันที่แล้ว`;
}
