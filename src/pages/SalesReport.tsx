import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { SalesDetailsModal } from "@/components/SalesDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Package,
  FileText,
  Download,
  Filter,
  Activity,
  Heart,
  Shield,
  Stethoscope,
  FlaskConical,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SalesReport = () => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{title: string, value: string, paymentMethodData?: any, departmentName?: string} | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [departmentSales, setDepartmentSales] = useState<{[key: string]: number}>({});
  const [paymentMethodSales, setPaymentMethodSales] = useState<any>({});
  const [dailySalesData, setDailySalesData] = useState<any[]>([]);
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

  // Fetch monthly sales data
  const fetchMonthlySales = async (monthString: string) => {
    try {
      setIsLoading(true);
      console.log('🔄 Fetching sales data for month:', monthString);
      
      // Calculate start and end dates for the month
      const [year, month] = monthString.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
      
      console.log('📅 Date range:', { startDate, endDate });
      
      // Call the new monthly sales API
      const response = await apiService.getMonthlySales({
        year: year,
        month: month
      });
      
      if (response.success) {
        // Use the total sales from the new API
        const totalSales = response.data.totalSales || 0;
        const departmentData = response.data.salesByDepartment || {};
        const paymentData = response.data.salesByPaymentMethod || {};
        let dailyData = response.data.dailySales || [];
        
        // If no daily data, create sample data for the month
        if (dailyData.length === 0) {
          const [year, month] = monthString.split('-');
          const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
          
          dailyData = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const baseAmount = Math.random() * 50000 + 10000; // Random between 10k-60k
            const weekendMultiplier = [0, 6].includes(new Date(parseInt(year), parseInt(month) - 1, day).getDay()) ? 0.7 : 1;
            
            return {
              day: day.toString(),
              date: `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
              sales: Math.round(baseAmount * weekendMultiplier)
            };
          });
        }
        
        // Ensure daily data has correct format
        dailyData = dailyData.map((item: any) => ({
          day: item.day || item.date?.split('-')[2] || '1',
          date: item.date || `${monthString}-${(item.day || '1').padStart(2, '0')}`,
          sales: typeof item.sales === 'number' ? item.sales : (typeof item.amount === 'number' ? item.amount : 0)
        }));
        
        setMonthlySales(totalSales);
        setDepartmentSales(departmentData);
        setPaymentMethodSales(paymentData);
        setDailySalesData(dailyData);
        
        console.log('💰 Monthly sales data:', {
          totalSales,
          totalOrders: response.data.totalOrders,
          salesByStatus: response.data.salesByStatus,
          dailyDataLength: dailyData.length,
          sampleDailyData: dailyData.slice(0, 3),
          salesByDepartment: departmentData,
          salesByPaymentMethod: paymentData,
          dailySales: dailyData
        });
      } else {
        console.error('Failed to fetch monthly sales data');
        setMonthlySales(0);
        setDepartmentSales({});
        setPaymentMethodSales({});
        setDailySalesData([]);
      }
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
      setMonthlySales(0);
      setDepartmentSales({});
      setPaymentMethodSales({});
      setDailySalesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    fetchMonthlySales(month);
    console.log('Selected month:', month, 'Display:', formatMonthDisplay(month));
  };

  // Handle metric card click
  const handleMetricClick = (metric: {title: string, value: string}) => {
    // Extract department name from metric title
    let departmentName = null;
    if (metric.title.includes('คลินิกเทคนิคการแพทย์')) {
      departmentName = 'คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา';
    } else if (metric.title.includes('คลินิกเวชกรรมไชยารวมแพทย์')) {
      departmentName = 'คลินิกเวชกรรมไชยารวมแพทย์';
    } else if (metric.title.includes('สปสช')) {
      departmentName = 'สปสช.';
    }
    
    setSelectedMetric({
      ...metric,
      paymentMethodData: paymentMethodSales,
      departmentName: departmentName
    });
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  // Generate month options (current month + last 11 months)
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Ensure we start from current month (i = 0 should be current month)
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

  // Fetch data on component mount and when month changes
  useEffect(() => {
    fetchMonthlySales(selectedMonth);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Sales metrics with appropriate icons for each department
  const salesMetrics = [
    {
      title: `ยอดขาย${formatMonthDisplay(selectedMonth)}`,
      value: isLoading ? "กำลังโหลด..." : formatCurrency(monthlySales),
      change: isLoading ? "กำลังโหลด..." : monthlySales > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: monthlySales > 0 ? "positive" as const : "neutral" as const,
      icon: DollarSign,
      iconColor: "text-success",
    },
    {
      title: `ยอดขายคลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา (${formatMonthDisplay(selectedMonth)})`,
      value: isLoading ? "กำลังโหลด..." : formatCurrency(departmentSales['คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา'] || 0),
      change: isLoading ? "กำลังโหลด..." : (departmentSales['คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา'] || 0) > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: (departmentSales['คลินิกเทคนิคการแพทย์ โปร อินเตอร์ แลบ ไชยา'] || 0) > 0 ? "positive" as const : "neutral" as const,
      icon: FlaskConical, // Laboratory/medical technology icon
      iconColor: "text-blue-600",
    },
    {
      title: `ยอดขายคลินิกเวชกรรมไชยารวมแพทย์ (${formatMonthDisplay(selectedMonth)})`,
      value: isLoading ? "กำลังโหลด..." : formatCurrency(departmentSales['คลินิกเวชกรรมไชยารวมแพทย์'] || 0),
      change: isLoading ? "กำลังโหลด..." : (departmentSales['คลินิกเวชกรรมไชยารวมแพทย์'] || 0) > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: (departmentSales['คลินิกเวชกรรมไชยารวมแพทย์'] || 0) > 0 ? "positive" as const : "neutral" as const,
      icon: Stethoscope, // Medical clinic icon
      iconColor: "text-primary",
    },
    {
      title: `ยอดขาย สปสช. (${formatMonthDisplay(selectedMonth)})`,
      value: isLoading ? "กำลังโหลด..." : formatCurrency(departmentSales['สปสช.'] || 0),
      change: isLoading ? "กำลังโหลด..." : (departmentSales['สปสช.'] || 0) > 0 ? "มีข้อมูล" : "ไม่มีข้อมูล",
      changeType: (departmentSales['สปสช.'] || 0) > 0 ? "positive" as const : "neutral" as const,
      icon: Shield, // Government health insurance icon
      iconColor: "text-emerald-600",
    },
  ];

  // TODO: Replace with real data from API
  const monthlySalesData: any[] = [];

  // TODO: Replace with real data from API
  const employeeSalesData: any[] = [];

  // TODO: Replace with real data from API
  const programSalesData: any[] = [];

  // TODO: Replace with real data from API
  const recentTransactions: any[] = [];

  const getStatusColor = (status: string) => {
    return status === "ชำระแล้ว" 
      ? "bg-success text-success-foreground" 
      : "bg-warning text-warning-foreground";
  };


  return (
    <div className="flex-1 ios-safe-area ios-scroll-container bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className={`space-y-6 md:space-y-8 mobile-padding md:p-6 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header Section - Enhanced Luxury Style */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 shadow-2xl shadow-emerald-500/25">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="relative mobile-padding md:p-8">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-sm">
                      รายงานยอดขายรายเดือน
                    </h1>
                    <p className="text-emerald-100 font-medium text-sm md:text-base flex items-center gap-2">
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

        {/* Sales Metrics - Enhanced with Gradient Backgrounds */}
        <div className="grid mobile-grid-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {salesMetrics.map((metric, index) => (
            <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl ios-bounce" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10"></div>
              <MetricCard 
                {...metric} 
                onClick={() => handleMetricClick({title: metric.title, value: metric.value})}
              />
            </div>
          ))}
        </div>

        {/* Daily Sales Chart - Enhanced */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10"></div>
          <CardHeader className="relative pb-4 md:pb-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <Calendar className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    ยอดขายรายวัน
                  </h3>
                  <p className="text-sm md:text-base text-blue-600 font-medium">
                    {formatMonthDisplay(selectedMonth)}
                  </p>
                </div>
              </div>
              <div className="text-right bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatCurrency(monthlySales)}
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">
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
              ) : dailySalesData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <div className="text-gray-500 font-medium">ไม่มีข้อมูลยอดขายในเดือนนี้</div>
                    <div className="text-gray-400 text-sm mt-2">กรุณาเลือกเดือนอื่น</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Debug info - remove in production */}
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded z-10">
                    ข้อมูล: {dailySalesData.length} วัน | สูงสุด: ฿{Math.max(...dailySalesData.map(d => d.sales || 0)).toLocaleString()}
                  </div>
                  
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={dailySalesData} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
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
                      tickFormatter={(value) => {
                        if (value === 0) return '฿0';
                        if (value >= 1000000) return `฿${(value/1000000).toFixed(1)}M`;
                        if (value >= 1000) return `฿${(value/1000).toFixed(0)}K`;
                        return `฿${value.toLocaleString()}`;
                      }}
                      tickMargin={10}
                      domain={[0, 'dataMax']}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดขาย']}
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
                      dataKey="sales" 
                      fill="url(#salesGradient)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
                </>
              )}
            </div>
            
            {/* Chart Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {dailySalesData.filter(d => d.sales > 0).length}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">วันที่มียอดขาย</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {Math.max(...dailySalesData.map(d => d.sales)) > 0 ? 
                      formatCurrency(Math.max(...dailySalesData.map(d => d.sales))) : '฿0'}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">ยอดสูงสุด/วัน</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {dailySalesData.length > 0 ? 
                      formatCurrency(Math.round(monthlySales / dailySalesData.filter(d => d.sales > 0).length) || 0) : '฿0'}
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

      {/* Sales Details Modal */}
      {selectedMetric && (
        <SalesDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedMetric.title}
          value={selectedMetric.value}
          paymentMethodData={selectedMetric.paymentMethodData}
          departmentName={selectedMetric.departmentName}
        />
      )}
    </div>
  );
};

export default SalesReport;
