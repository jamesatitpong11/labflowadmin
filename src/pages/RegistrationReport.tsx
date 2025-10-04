import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Users,
  Calendar,
  Download,
  Filter,
  Stethoscope,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiService } from "@/services/api";

const RegistrationReport = () => {
  const isMobile = useIsMobile();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [monthlyVisits, setMonthlyVisits] = useState<number>(0);
  const [departmentVisits, setDepartmentVisits] = useState<{[key: string]: number}>({});
  const [dailyVisitsData, setDailyVisitsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Format month for display
  const formatMonthDisplay = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const monthNames = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiYear = parseInt(year) + 543;
    return `${monthNames[parseInt(month) - 1]} ${thaiYear}`;
  };

  // Fetch monthly visits data
  const fetchMonthlyVisits = async (monthString: string) => {
    try {
      setIsLoading(true);
      console.log('🔄 Fetching visits data for month:', monthString);
      
      // Calculate year and month
      const [year, month] = monthString.split('-');
      
      // Call the new monthly visits API
      const response = await apiService.getMonthlyVisits({
        year: year,
        month: month
      });
      
      if (response.success) {
        // Use the total visits from the new API
        const totalVisits = response.data.totalVisits || 0;
        const departmentData = response.data.visitsByDepartment || {};
        const dailyData = response.data.dailyVisits || [];
        
        setMonthlyVisits(totalVisits);
        setDepartmentVisits(departmentData);
        setDailyVisitsData(dailyData);
        
        console.log('🏥 Monthly visits data:', {
          totalVisits,
          totalCount: response.data.totalCount,
          visitsByStatus: response.data.visitsByStatus,
          visitsByDepartment: departmentData,
          dailyVisits: dailyData
        });
      } else {
        console.error('Failed to fetch monthly visits data');
        setMonthlyVisits(0);
        setDepartmentVisits({});
        setDailyVisitsData([]);
      }
    } catch (error) {
      console.error('Error fetching monthly visits:', error);
      setMonthlyVisits(0);
      setDepartmentVisits({});
      setDailyVisitsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    fetchMonthlyVisits(month);
  };

  // Generate month options (current month + last 11 months)
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthString = date.toISOString().slice(0, 7);
      const option = {
        value: monthString,
        label: formatMonthDisplay(monthString)
      };
      
      options.push(option);
    }
    
    return options;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMonthlyVisits(selectedMonth);
  }, []);

  // Format number
  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH');
  };

  // Visit metrics
  const visitMetrics = [
    {
      title: `การตรวจ${formatMonthDisplay(selectedMonth)}`,
      value: isLoading ? "กำลังโหลด..." : formatNumber(monthlyVisits),
      change: isLoading ? "กำลังโหลด..." : monthlyVisits > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: monthlyVisits > 0 ? "positive" as const : "neutral" as const,
      icon: Stethoscope,
      iconColor: "text-success",
    },
    {
      title: `การตรวจคลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา (${formatMonthDisplay(selectedMonth)})`,
      value: isLoading ? "กำลังโหลด..." : formatNumber(departmentVisits['คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา'] || 0),
      change: isLoading ? "กำลังโหลด..." : (departmentVisits['คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา'] || 0) > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: (departmentVisits['คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา'] || 0) > 0 ? "positive" as const : "neutral" as const,
      icon: Users,
      iconColor: "text-success",
    },
    {
      title: `การตรวจคลินิกเวชกรรมไชยารวมแพทย์ (${formatMonthDisplay(selectedMonth)})`,
      value: isLoading ? "กำลังโหลด..." : formatNumber(departmentVisits['คลินิกเวชกรรมไชยารวมแพทย์'] || 0),
      change: isLoading ? "กำลังโหลด..." : (departmentVisits['คลินิกเวชกรรมไชยารวมแพทย์'] || 0) > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: (departmentVisits['คลินิกเวชกรรมไชยารวมแพทย์'] || 0) > 0 ? "positive" as const : "neutral" as const,
      icon: Users,
      iconColor: "text-success",
    },
    {
      title: `การตรวจ สปสช. (${formatMonthDisplay(selectedMonth)})`,
      value: isLoading ? "กำลังโหลด..." : formatNumber(departmentVisits['สปสช.'] || 0),
      change: isLoading ? "กำลังโหลด..." : (departmentVisits['สปสช.'] || 0) > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: (departmentVisits['สปสช.'] || 0) > 0 ? "positive" as const : "neutral" as const,
      icon: Users,
      iconColor: "text-warning",
    },
  ];

  return (
    <div className="flex-1 ios-safe-area ios-scroll-container bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className={`space-y-6 md:space-y-8 mobile-padding md:p-6 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header Section - Enhanced Luxury Style */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 shadow-2xl shadow-purple-500/25">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="relative mobile-padding md:p-8">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-sm">
                      รายงานการตรวจรายเดือน
                    </h1>
                    <p className="text-purple-100 font-medium text-sm md:text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatMonthDisplay(selectedMonth)}
                    </p>
                  </div>
                </div>
                {/* Controls - Glassmorphism Style */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
                    <Select value={selectedMonth} onValueChange={handleMonthChange}>
                      <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 text-white rounded-xl min-w-[140px] md:min-w-[180px]">
                        <div className="flex items-center">
                          <Filter className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          <SelectValue placeholder="เลือกเดือน" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-0">
                        {generateMonthOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="ghost"
                    size={isMobile ? "sm" : "sm"} 
                    className="text-xs md:text-sm rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    onClick={() => {
                      const currentMonth = new Date().toISOString().slice(0, 7);
                      handleMonthChange(currentMonth);
                    }}
                  >
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    {isMobile ? "เดือนนี้" : "เดือนปัจจุบัน"}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "sm"} 
                    className="text-xs md:text-sm rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    {isMobile ? "ส่งออก" : "ส่งออกรายงาน"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Metrics - iOS Style */}
        <div className="grid mobile-grid-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {visitMetrics.map((metric, index) => (
            <div key={index} className="ios-metric-card ios-bounce" style={{animationDelay: `${index * 0.1}s`}}>
              <MetricCard {...metric} />
            </div>
          ))}
        </div>

        {/* Daily Visits Chart */}
        <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Stethoscope className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    การตรวจรายวัน
                  </h3>
                  <p className="text-sm md:text-base text-blue-600 font-medium mt-1">
                    {formatMonthDisplay(selectedMonth)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatNumber(monthlyVisits)}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  ยอดรวมทั้งเดือน
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-96 md:h-[28rem] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-500 font-medium">กำลังโหลดข้อมูล...</div>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={dailyVisitsData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#e2e8f0" 
                      strokeOpacity={0.5}
                    />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: isMobile ? 11 : 13, 
                        fill: '#64748b',
                        fontWeight: 500
                      }}
                      tickMargin={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: isMobile ? 10 : 12, 
                        fill: '#64748b',
                        fontWeight: 500
                      }}
                      tickFormatter={(value) => value > 0 ? `${value}` : '0'}
                      tickMargin={10}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} ครั้ง`, 'การตรวจ']}
                      labelFormatter={(label) => `วันที่ ${label} ${formatMonthDisplay(selectedMonth).split(' ')[0]}`}
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
                      dataKey="visits" 
                      fill="url(#visitsGradient)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {/* Chart Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {dailyVisitsData.filter(d => d.visits > 0).length}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">วันที่มีการตรวจ</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {Math.max(...dailyVisitsData.map(d => d.visits)) > 0 ? 
                      Math.max(...dailyVisitsData.map(d => d.visits)) : 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">สูงสุด/วัน</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {dailyVisitsData.length > 0 ? 
                      Math.round(monthlyVisits / dailyVisitsData.filter(d => d.visits > 0).length) || 0 : 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">เฉลี่ย/วัน</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {new Date().toISOString().slice(0, 7) === selectedMonth ? 
                      new Date().getDate() : new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">วันในเดือน</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default RegistrationReport;
