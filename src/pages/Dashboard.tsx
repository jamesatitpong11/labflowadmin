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
    <div className="flex-1 ios-safe-area ios-scroll-container bg-gradient-to-br from-slate-50/50 to-blue-50/30 min-h-screen">
      <div className={`space-y-4 md:space-y-8 mobile-padding md:p-6 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header Section - iOS Style */}
        <div className="ios-header mobile-padding md:p-6 mb-4 md:mb-8">
          <div className="space-y-4">
            {/* First Row: Title left, Buttons right */}
            <div className="flex items-center justify-between">
              <div className="space-y-1 md:space-y-2">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-sm md:text-lg mobile-hidden md:block">
                  ภาพรวมข้อมูลของระบบการจัดการทางการแพทย์
                </p>
                <div className="w-20 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Date Range Selector */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                  {/* Quick Date Range Buttons */}
                  <div className="flex gap-1 md:gap-2">
                    <Button
                      variant={dateRange === 'today' ? 'default' : 'outline'}
                      size={isMobile ? 'sm' : 'sm'}
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        setDateRange('today');
                        console.log('🔄 Clicked "วันนี้" button - Reset to today');
                      }}
                      className={`text-xs md:text-sm ios-button ${
                        dateRange === 'today' 
                          ? 'bg-green-500 text-white hover:bg-green-600 border-green-500' 
                          : 'text-green-500 bg-white hover:bg-green-50 border-green-500'
                      }`}
                    >
                      วันนี้
                    </Button>
                    <Button
                      variant={dateRange === 'week' ? 'default' : 'outline'}
                      size={isMobile ? 'sm' : 'sm'}
                      onClick={() => setDateRange('week')}
                      className={`text-xs md:text-sm ios-button ${
                        dateRange === 'week' 
                          ? 'bg-green-500 text-white hover:bg-green-600 border-green-500' 
                          : 'text-green-500 bg-white hover:bg-green-50 border-green-500'
                      }`}
                    >
                      สัปดาห์
                    </Button>
                    <Button
                      variant={dateRange === 'month' ? 'default' : 'outline'}
                      size={isMobile ? 'sm' : 'sm'}
                      onClick={() => setDateRange('month')}
                      className={`text-xs md:text-sm ios-button ${
                        dateRange === 'month' 
                          ? 'bg-green-500 text-white hover:bg-green-600 border-green-500' 
                          : 'text-green-500 bg-white hover:bg-green-50 border-green-500'
                      }`}
                    >
                      เดือน
                    </Button>
                  </div>
                  
                  {/* Custom Date Picker */}
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={dateRange === 'custom' ? 'default' : 'outline'}
                        size={isMobile ? 'sm' : 'sm'}
                        className={`text-xs md:text-sm ios-button justify-between min-w-[120px] md:min-w-[150px] ${
                          dateRange === 'custom' 
                            ? 'bg-green-500 text-white hover:bg-green-600 border-green-500' 
                            : 'text-green-500 bg-white hover:bg-green-50 border-green-500'
                        }`}
                      >
                        <CalendarDays className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        <span className="hidden md:inline">
                          {format(selectedDate, 'dd MMM yyyy', { locale: th })}
                        </span>
                        <span className="md:hidden">
                          {format(selectedDate, 'dd/MM', { locale: th })}
                        </span>
                        <ChevronDown className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 ios-card" align="end">
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
                  
                  {/* Manual Refresh Button */}
                  <Button
                    variant="outline"
                    size={isMobile ? 'sm' : 'sm'}
                    onClick={() => {
                      console.log('🔄 Manual refresh triggered');
                      fetchDashboardData();
                      fetchHourlyRegistrationData();
                      fetchHourlySalesData();
                      fetchAgeGroupData();
                    }}
                    disabled={isLoading}
                    className="text-xs md:text-sm ios-button text-blue-500 bg-white hover:bg-blue-50 border-blue-500"
                  >
                    <Activity className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isMobile ? 'รีเฟรช' : 'รีเฟรชข้อมูล'}
                  </Button>
                </div>
                
                <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Activity className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </div>
              </div>
            </div>
            
            {/* Second Row: Date right aligned */}
            <div className="flex justify-end">
              <div className="text-right mobile-hidden md:block">
                <p className="text-xs md:text-sm text-gray-500">
                  {dateRange === 'today' ? 'ข้อมูล ณ วันที่' : 
                   dateRange === 'week' ? 'ข้อมูลสัปดาห์' :
                   dateRange === 'month' ? 'ข้อมูลเดือน' : 'ข้อมูล ณ วันที่'}
                </p>
                <p className="text-sm md:text-lg font-semibold text-gray-800">
                  {dateRangeInfo.display}
                </p>
                {dateRange === 'week' && (
                  <p className="text-xs text-blue-600 mt-1">
                    จันทร์ - อาทิตย์
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1: ยอดการลงทะเบียนใหม่ */}
          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  <UserPlus className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-sm md:text-xl">ยอดการลงทะเบียนใหม่</span>
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
            className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-pointer"
            onClick={() => {
              const today = new Date();
              setSelectedDate(today);
              setDateRange('today');
              console.log('🔄 Clicked "การตรวจวันนี้" - Reset to today');
            }}
          >
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <Stethoscope className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                </div>
                <span className="text-sm md:text-xl">ยอดการตรวจวันนี้</span>
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
          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-orange-100 to-red-100">
                  <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                </div>
                <span className="text-sm md:text-xl">ยอดการขายวันนี้</span>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Chart 1: การตรวจรายชั่วโมง */}
          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  <Stethoscope className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-sm md:text-xl">การตรวจรายชั่วโมง</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyRegistrationData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} ครั้ง`, 'การตรวจ']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="registrations" 
                      fill="url(#registrationGradient)" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={isMobile ? 30 : 50}
                    />
                    <defs>
                      <linearGradient id="registrationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: การขายรายชั่วโมง */}
          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                </div>
                <span className="text-sm md:text-xl">การขายรายชั่วโมง</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlySalesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                      tickFormatter={(value) => `฿${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดขาย']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                      activeDot={{ r: isMobile ? 5 : 6, stroke: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Group Chart Section */}
        <div className="grid grid-cols-1">
          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                  <Activity className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                </div>
                <span className="text-sm md:text-xl">สัดส่วนอายุที่มาใช้บริการ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-64 md:h-80 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 40 : 60}
                        outerRadius={isMobile ? 80 : 120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => {
                          const count = props.payload?.count || 0;
                          if (count === 0) {
                            return ['ไม่มีข้อมูล', 'สัดส่วน'];
                          }
                          return [`${value}%`, 'สัดส่วน'];
                        }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none', 
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* No Data Message */}
                  {ageGroupData.every(item => item.count === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 text-sm md:text-base font-medium">
                          ไม่มีข้อมูล
                        </div>
                        <div className="text-gray-300 text-xs md:text-sm">
                          ยังไม่มีผู้ป่วยลงทะเบียน
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex flex-col justify-center space-y-3 md:space-y-4">
                  {ageGroupData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm md:text-base font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm md:text-base font-semibold text-gray-800">
                          {item.value}%
                        </span>
                        <p className="text-xs text-gray-500">
                          {item.count || 0} คน
                        </p>
                      </div>
                    </div>
                  ))}
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
