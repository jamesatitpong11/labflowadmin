import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/services/api";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  UserPlus,
  Stethoscope,
  DollarSign,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [hourlyRegistrationData, setHourlyRegistrationData] = useState<any[]>([]);
  const [hourlySalesData, setHourlySalesData] = useState<any[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on dateRange and selectedDate
  const getDateRangeInfo = () => {
    const today = new Date();
    const selected = selectedDate;
    
    switch (dateRange) {
      case 'today':
        return {
          start: selected,
          end: selected,
          display: format(selected, 'dd MMMM yyyy', { locale: th })
        };
      
      case 'week':
        // Calculate start of week (Monday) and end of week (Sunday)
        const startOfWeek = new Date(selected);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return {
          start: startOfWeek,
          end: endOfWeek,
          display: `${format(startOfWeek, 'dd', { locale: th })} - ${format(endOfWeek, 'dd MMMM yyyy', { locale: th })}`
        };
      
      case 'month':
        // Calculate start and end of month
        const startOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
        const endOfMonth = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
        
        return {
          start: startOfMonth,
          end: endOfMonth,
          display: format(selected, 'MMMM yyyy', { locale: th })
        };
      
      case 'custom':
        return {
          start: selected,
          end: selected,
          display: format(selected, 'dd MMMM yyyy', { locale: th })
        };
      
      default:
        return {
          start: selected,
          end: selected,
          display: format(selected, 'dd MMMM yyyy', { locale: th })
        };
    }
  };

  const dateRangeInfo = getDateRangeInfo();

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        dateRange,
        selectedDate: selectedDate.toISOString()
      };
      
      console.log('🔄 Fetching dashboard data with params:', {
        dateRange,
        selectedDate: selectedDate.toISOString(),
        selectedDateLocal: selectedDate.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
        dateRangeInfo: dateRangeInfo
      });
      
      const response = await apiService.getDashboardStats(params);
      
      if (response.success) {
        console.log('📊 Dashboard data received:', response.data);
        console.log('🔍 Specific values:', {
          newPatients: response.data?.newPatients,
          todayVisits: response.data?.todayVisits,
          todaySales: response.data?.todaySales,
          totalPatients: response.data?.totalPatients
        });
        setDashboardData(response.data);
      } else {
        setError('ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchDashboardData();
    fetchHourlyRegistrationData();
    fetchHourlySalesData();
    fetchAgeGroupData();
  }, [dateRange, selectedDate]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      fetchDashboardData();
      fetchHourlyRegistrationData();
      fetchHourlySalesData();
      fetchAgeGroupData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [dateRange, selectedDate]);

  // Fetch hourly registration data from API
  const fetchHourlyRegistrationData = async () => {
    try {
      const params = {
        selectedDate: selectedDate.toISOString()
      };
      
      const response = await apiService.getHourlyRegistrations(params);
      
      if (response.success) {
        console.log('📊 Hourly registration data received:', response.data);
        setHourlyRegistrationData(response.data.hourlyData || []);
      } else {
        console.error('Failed to fetch hourly registration data');
        // Set default empty data
        const defaultData = [];
        for (let hour = 7; hour <= 18; hour++) {
          const hourStr = hour.toString().padStart(2, '0') + ':00';
          defaultData.push({ hour: hourStr, registrations: 0 });
        }
        setHourlyRegistrationData(defaultData);
      }
    } catch (err) {
      console.error('Hourly registration data fetch error:', err);
      // Set default empty data on error
      const defaultData = [];
      for (let hour = 7; hour <= 18; hour++) {
        const hourStr = hour.toString().padStart(2, '0') + ':00';
        defaultData.push({ hour: hourStr, registrations: 0 });
      }
      setHourlyRegistrationData(defaultData);
    }
  };

  // Fetch hourly sales data from API
  const fetchHourlySalesData = async () => {
    try {
      const params = {
        selectedDate: selectedDate.toISOString()
      };
      
      const response = await apiService.getHourlySales(params);
      
      if (response.success) {
        console.log('💰 Hourly sales data received:', response.data);
        setHourlySalesData(response.data.hourlyData || []);
      } else {
        console.error('Failed to fetch hourly sales data');
        // Set default empty data
        const defaultData = [];
        for (let hour = 7; hour <= 18; hour++) {
          const hourStr = hour.toString().padStart(2, '0') + ':00';
          defaultData.push({ hour: hourStr, sales: 0 });
        }
        setHourlySalesData(defaultData);
      }
    } catch (err) {
      console.error('Hourly sales data fetch error:', err);
      // Set default empty data on error
      const defaultData = [];
      for (let hour = 7; hour <= 18; hour++) {
        const hourStr = hour.toString().padStart(2, '0') + ':00';
        defaultData.push({ hour: hourStr, sales: 0 });
      }
      setHourlySalesData(defaultData);
    }
  };

  // Fetch age group data from API
  const fetchAgeGroupData = async () => {
    try {
      console.log('🔄 Fetching age group data for date:', selectedDate.toISOString());
      
      const params = {
        selectedDate: selectedDate.toISOString()
      };
      
      const response = await apiService.getAgeGroups(params);
      
      console.log('📡 Age group API response:', response);
      
      if (response.success) {
        console.log('👥 Age group data received:', response.data);
        console.log('👥 Age group array:', response.data.ageGroupData);
        console.log('👥 Total patients:', response.data.totalPatients);
        
        const ageData = response.data.ageGroupData || [];
        
        // Always set the data, even if it's all zeros
        setAgeGroupData(ageData);
        
        // Check if all values are 0 for logging
        const totalValue = ageData.reduce((sum: number, item: any) => sum + item.value, 0);
        console.log('👥 Total percentage value:', totalValue);
        console.log('👥 All counts:', ageData.map((item: any) => ({ name: item.name, count: item.count })));
        
      } else {
        console.error('Failed to fetch age group data');
        // Set default empty data
        const defaultData = [
          { name: "0-7 ปี", value: 0, count: 0, color: "#8884d8" },
          { name: "8-17 ปี", value: 0, count: 0, color: "#82ca9d" },
          { name: "18-35 ปี", value: 0, count: 0, color: "#ffc658" },
          { name: "36-60 ปี", value: 0, count: 0, color: "#ff7300" },
          { name: "60+ ปี", value: 0, count: 0, color: "#00ff88" },
        ];
        setAgeGroupData(defaultData);
      }
    } catch (err) {
      console.error('Age group data fetch error:', err);
      // Set default empty data on error
      const defaultData = [
        { name: "0-7 ปี", value: 0, count: 0, color: "#8884d8" },
        { name: "8-17 ปี", value: 0, count: 0, color: "#82ca9d" },
        { name: "18-35 ปี", value: 0, count: 0, color: "#ffc658" },
        { name: "36-60 ปี", value: 0, count: 0, color: "#ff7300" },
        { name: "60+ ปี", value: 0, count: 0, color: "#00ff88" },
      ];
      setAgeGroupData(defaultData);
    }
  };

  return (
    <div className="flex-1 ios-safe-area ios-scroll-container bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className={`space-y-6 md:space-y-8 mobile-padding md:p-6 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header Section - Enhanced Luxury Style */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl shadow-blue-500/25">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="relative mobile-padding md:p-8">
            <div className="space-y-6">
              {/* First Row: Title left, Buttons right */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-sm">
                      Dashboard
                    </h1>
                    <p className="text-blue-100 font-medium text-sm md:text-base">
                      ภาพรวมข้อมูลของระบบการจัดการทางการแพทย์
                    </p>
                  </div>
                </div>
              
                {/* Date Range Controls - Glassmorphism Style */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
                    <Button
                      variant={dateRange === 'today' ? 'default' : 'ghost'}
                      size={isMobile ? 'sm' : 'sm'}
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        setDateRange('today');
                        console.log('🔄 Clicked "วันนี้" button - Reset to today');
                      }}
                      className={`text-xs md:text-sm rounded-xl transition-all duration-300 ${
                        dateRange === 'today' 
                          ? 'bg-white text-blue-600 shadow-lg hover:shadow-xl' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      วันนี้
                    </Button>
                    <Button
                      variant={dateRange === 'week' ? 'default' : 'ghost'}
                      size={isMobile ? 'sm' : 'sm'}
                      onClick={() => setDateRange('week')}
                      className={`text-xs md:text-sm rounded-xl transition-all duration-300 ${
                        dateRange === 'week' 
                          ? 'bg-white text-purple-600 shadow-lg hover:shadow-xl' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      สัปดาห์
                    </Button>
                    <Button
                      variant={dateRange === 'month' ? 'default' : 'ghost'}
                      size={isMobile ? 'sm' : 'sm'}
                      onClick={() => setDateRange('month')}
                      className={`text-xs md:text-sm rounded-xl transition-all duration-300 ${
                        dateRange === 'month' 
                          ? 'bg-white text-indigo-600 shadow-lg hover:shadow-xl' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      เดือน
                    </Button>
                  </div>
                  
                  {/* Custom Date Picker - Enhanced */}
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size={isMobile ? 'sm' : 'sm'}
                        className={`text-xs md:text-sm justify-between min-w-[140px] md:min-w-[180px] transition-all duration-300 rounded-xl ${
                          dateRange === 'custom' 
                            ? 'bg-white text-emerald-600 shadow-lg hover:shadow-xl' 
                            : 'text-white hover:bg-white/20 bg-white/10 backdrop-blur-md border border-white/20'
                        }`}
                      >
                        <CalendarDays className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        <span className="hidden md:inline">
                          {format(selectedDate, 'dd MMM yyyy', { locale: th })}
                        </span>
                        <span className="md:hidden">
                          {format(selectedDate, 'dd/MM', { locale: th })}
                        </span>
                        <ChevronDown className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setDateRange('custom');
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                        locale={th}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {/* Manual Refresh Button - Enhanced */}
                  <Button
                    variant="ghost"
                    size={isMobile ? 'sm' : 'sm'}
                    onClick={() => {
                      console.log('🔄 Manual refresh triggered');
                      fetchDashboardData();
                      fetchHourlyRegistrationData();
                      fetchHourlySalesData();
                      fetchAgeGroupData();
                    }}
                    disabled={isLoading}
                    className="text-xs md:text-sm rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Activity className={`h-3 w-3 md:h-4 md:w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isMobile ? 'รีเฟรช' : 'รีเฟรชข้อมูล'}
                  </Button>
                </div>
              </div>
              
              {/* Date Info - Floating Card Style */}
              <div className="flex justify-center md:justify-end">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 shadow-lg">
                  <div className="text-center md:text-right">
                    <p className="text-xs text-blue-100">
                      {dateRange === 'today' ? 'ข้อมูล ณ วันที่' : 
                       dateRange === 'week' ? 'ข้อมูลสัปดาห์' :
                       dateRange === 'month' ? 'ข้อมูลเดือน' : 'ข้อมูล ณ วันที่'}
                    </p>
                    <p className="text-sm md:text-lg font-bold text-white">
                      {dateRangeInfo.display}
                    </p>
                    {dateRange === 'week' && (
                      <p className="text-xs text-blue-200 mt-1">
                        จันทร์ - อาทิตย์
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section - Enhanced with Gradient Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1: ยอดการลงทะเบียนใหม่ */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10"></div>
            <CardHeader className="relative pb-3 md:pb-4">
              <CardTitle className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <UserPlus className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">ยอดการลงทะเบียนใหม่</span>
                  <p className="text-xs md:text-sm text-blue-600 font-medium">New Registrations</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {isLoading ? '...' : (dashboardData?.newPatients || 0)}
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-gray-600">
                  ผู้ป่วยใหม่ที่ลงทะเบียน
                </p>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 text-blue-500" />
                  <p className="text-xs font-medium text-blue-600">
                    {dateRangeInfo.display}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: ยอดการตรวจวันนี้ */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={() => {
              const today = new Date();
              setSelectedDate(today);
              setDateRange('today');
              console.log('🔄 Clicked "การตรวจวันนี้" - Reset to today');
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10"></div>
            <CardHeader className="relative pb-3 md:pb-4">
              <CardTitle className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <Stethoscope className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">ยอดการตรวจวันนี้</span>
                  <p className="text-xs md:text-sm text-emerald-600 font-medium">Medical Examinations</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {isLoading ? '...' : (dashboardData?.todayVisits || 0)}
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-gray-600">
                  จำนวนการตรวจที่ดำเนินการ
                </p>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 text-green-500" />
                  <p className="text-xs font-medium text-green-600">
                    {dateRangeInfo.display}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: ยอดการขายวันนี้ */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/10"></div>
            <CardHeader className="relative pb-3 md:pb-4">
              <CardTitle className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300">
                  <DollarSign className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">ยอดการขายวันนี้</span>
                  <p className="text-xs md:text-sm text-orange-600 font-medium">Daily Revenue</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {isLoading ? '...' : `฿${(dashboardData?.todaySales || 0).toLocaleString('th-TH')}`}
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-gray-600">
                  รายได้จากการขาย
                </p>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 text-orange-500" />
                  <p className="text-xs font-medium text-orange-600">
                    {dateRangeInfo.display}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Data Warning */}
        {dashboardData?.dateRange?.hasDataToday === false && (
          <div className="ios-card bg-orange-50/80 border-orange-200/50">
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 mb-1">
                    ไม่มีข้อมูลสำหรับวันนี้
                  </h3>
                  <p className="text-sm text-orange-700">
                    {dashboardData.dateRange.noDataMessage}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    ข้อมูลที่แสดงเป็นค่าจริงของวันที่ {format(selectedDate, 'dd MMMM yyyy', { locale: th })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section - Enhanced with Beautiful Gradients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Chart 1: การตรวจรายชั่วโมง */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10"></div>
            <CardHeader className="relative pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <Stethoscope className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">การตรวจรายชั่วโมง</span>
                  <p className="text-xs md:text-sm text-blue-600 font-medium">Hourly Examinations</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="h-72 md:h-96 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-2xl"></div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyRegistrationData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="registrationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="50%" stopColor="#1d4ed8" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#1e40af" stopOpacity={0.5} />
                      </linearGradient>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#e2e8f0" 
                      strokeOpacity={0.3}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 11 : 13, fill: '#64748b', fontWeight: 500 }}
                      tickMargin={15}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748b', fontWeight: 500 }}
                      tickMargin={10}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} ครั้ง`, 'การตรวจ']}
                      labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                        border: 'none', 
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    />
                    <Bar 
                      dataKey="registrations" 
                      fill="url(#registrationGradient)" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={isMobile ? 35 : 55}
                      filter="url(#shadow)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: การขายรายชั่วโมง */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10"></div>
            <CardHeader className="relative pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <TrendingUp className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">การขายรายชั่วโมง</span>
                  <p className="text-xs md:text-sm text-emerald-600 font-medium">Hourly Sales</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="h-72 md:h-96 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-2xl"></div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlySalesData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                      </linearGradient>
                      <filter id="salesGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4"/>
                      </filter>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#e2e8f0" 
                      strokeOpacity={0.3}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 11 : 13, fill: '#64748b', fontWeight: 500 }}
                      tickMargin={15}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748b', fontWeight: 500 }}
                      tickFormatter={(value) => value > 0 ? `฿${(value/1000).toFixed(0)}k` : '฿0'}
                      tickMargin={10}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดขาย']}
                      labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                        border: 'none', 
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#059669" 
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={{ 
                        fill: '#059669', 
                        strokeWidth: 3, 
                        r: isMobile ? 5 : 6,
                        stroke: '#ffffff'
                      }}
                      activeDot={{ 
                        r: isMobile ? 7 : 9, 
                        stroke: '#059669', 
                        strokeWidth: 4,
                        fill: '#ffffff',
                        style: { filter: 'drop-shadow(0 2px 4px rgba(5, 150, 105, 0.3))' }
                      }}
                      connectNulls={false}
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(5, 150, 105, 0.2))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Group Chart Section - Enhanced Pie Chart */}
        <div className="grid grid-cols-1">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/10"></div>
            <CardHeader className="relative pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <Activity className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">สัดส่วนอายุที่มาใช้บริการ</span>
                  <p className="text-xs md:text-sm text-purple-600 font-medium">Age Distribution</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enhanced Pie Chart */}
                <div className="h-80 md:h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent rounded-2xl"></div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {ageGroupData.map((entry, index) => (
                          <filter key={`shadow-${index}`} id={`pieSliceShadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor={entry.color} floodOpacity="0.3"/>
                          </filter>
                        ))}
                      </defs>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 50 : 70}
                        outerRadius={isMobile ? 90 : 140}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            filter={`url(#pieSliceShadow-${index})`}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => {
                          const count = props.payload?.count || 0;
                          if (count === 0) {
                            return ['ไม่มีข้อมูล', 'สัดส่วน'];
                          }
                          return [`${value}% (${count} คน)`, 'สัดส่วน'];
                        }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                          border: 'none', 
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                        labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
                      <div className="text-lg md:text-xl font-bold text-gray-800">
                        {ageGroupData.reduce((sum, item) => sum + (item.count || 0), 0)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">
                        ผู้ป่วยทั้งหมด
                      </div>
                    </div>
                  </div>
                  
                  {/* No Data Message */}
                  {ageGroupData.every(item => item.count === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                        <div className="text-gray-400 text-sm md:text-base font-medium mb-2">
                          ไม่มีข้อมูล
                        </div>
                        <div className="text-gray-300 text-xs md:text-sm">
                          ยังไม่มีผู้ป่วยลงทะเบียน
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Legend */}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">รายละเอียดตามช่วงอายุ</h3>
                    <p className="text-sm text-gray-600">สัดส่วนผู้ป่วยแยกตามกลุ่มอายุ</p>
                  </div>
                  
                  {ageGroupData.map((item, index) => (
                    <div key={index} className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div 
                              className="w-5 h-5 rounded-full shadow-lg ring-2 ring-white" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <div 
                              className="absolute inset-0 w-5 h-5 rounded-full animate-pulse opacity-30" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                          </div>
                          <div>
                            <span className="text-sm md:text-base font-semibold text-gray-800">
                              {item.name}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Age Group
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-lg md:text-xl font-bold text-gray-800">
                                {item.value}%
                              </span>
                              <p className="text-xs text-gray-500">
                                {item.count || 0} คน
                              </p>
                            </div>
                            <div 
                              className="w-1 h-8 rounded-full opacity-60" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: item.color, 
                            width: `${item.value}%`,
                            boxShadow: `0 0 10px ${item.color}40`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary Card */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-purple-800">สรุปข้อมูล</h4>
                        <p className="text-sm text-purple-600">ผู้ป่วยทั้งหมดในระบบ</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-800">
                          {ageGroupData.reduce((sum, item) => sum + (item.count || 0), 0)}
                        </div>
                        <p className="text-sm text-purple-600">คน</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
