import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Stethoscope,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const metrics = [
    {
      title: "ลงทะเบียนใหม่",
      value: "124",
      change: "+12% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: UserPlus,
      iconColor: "text-primary",
    },
    {
      title: "การตรวจวันนี้",
      value: "89",
      change: "+5% จากเมื่อวาน",
      changeType: "positive" as const,
      icon: Stethoscope,
      iconColor: "text-success",
    },
    {
      title: "ยอดขายวันนี้",
      value: "฿45,231",
      change: "+8% จากเมื่อวาน",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-warning",
    },
    {
      title: "รายได้รวม",
      value: "฿1,245,890",
      change: "+15% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-success",
    },
  ];

  const salesData = [
    { name: "จ", sales: 12000, registrations: 15 },
    { name: "อ", sales: 19000, registrations: 22 },
    { name: "พ", sales: 15000, registrations: 18 },
    { name: "พฤ", sales: 25000, registrations: 28 },
    { name: "ศ", sales: 22000, registrations: 25 },
    { name: "ส", sales: 35000, registrations: 35 },
    { name: "อา", sales: 45231, registrations: 42 },
  ];

  const monthlyData = [
    { month: "ม.ค.", sales: 450000, registrations: 180 },
    { month: "ก.พ.", sales: 520000, registrations: 210 },
    { month: "มี.ค.", sales: 480000, registrations: 195 },
    { month: "เม.ย.", sales: 680000, registrations: 250 },
    { month: "พ.ค.", sales: 750000, registrations: 280 },
    { month: "มิ.ย.", sales: 820000, registrations: 320 },
  ];

  const programData = [
    { name: "ตรวจสุขภาพทั่วไป", value: 35, color: "#8884d8" },
    { name: "ตรวจเลือด", value: 25, color: "#82ca9d" },
    { name: "ตรวจหัวใจ", value: 20, color: "#ffc658" },
    { name: "ตรวจสายตา", value: 15, color: "#ff7300" },
    { name: "อื่นๆ", value: 5, color: "#00ff88" },
  ];

  const recentActivity = [
    { id: 1, action: "ผู้ป่วยใหม่ลงทะเบียน", patient: "คุณสมชาย ใจดี", time: "10 นาทีที่แล้ว" },
    { id: 2, action: "ตรวจเสร็จสิ้น", patient: "คุณสมหญิง สวยงาม", time: "25 นาทีที่แล้ว" },
    { id: 3, action: "ชำระเงินแล้ว", patient: "คุณประยุทธ มั่นคง", time: "1 ชั่วโมงที่แล้ว" },
    { id: 4, action: "นัดหมายใหม่", patient: "คุณสุภาพ ดีใจ", time: "2 ชั่วโมงที่แล้ว" },
  ];

  return (
    <div className="flex-1 ios-safe-area ios-scroll-container bg-gradient-to-br from-slate-50/50 to-blue-50/30 min-h-screen">
      <div className="space-y-4 md:space-y-8 mobile-padding md:p-6">
        {/* Header Section - iOS Style */}
        <div className="ios-header mobile-padding md:p-6 mb-4 md:mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                แดชบอร์ด
              </h1>
              <p className="text-gray-600 text-sm md:text-lg mobile-hidden md:block">
                ภาพรวมข้อมูลของระบบการจัดการทางการแพทย์
              </p>
              <div className="w-20 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="text-right mobile-hidden md:block">
                <p className="text-xs md:text-sm text-gray-500">วันที่อัปเดตล่าสุด</p>
                <p className="text-sm md:text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString('th-TH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Activity className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards - iOS Style */}
        <div className="grid mobile-grid-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="ios-metric-card ios-bounce" style={{animationDelay: `${index * 0.1}s`}}>
              <MetricCard {...metric} />
            </div>
          ))}
        </div>

        {/* Charts Section - iOS Style */}
        <div className="grid mobile-grid md:grid-cols-2 gap-4 md:gap-8">
          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  <BarChart3 className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-sm md:text-xl">ยอดขายรายวัน</span>
              </CardTitle>
              <p className="text-xs md:text-sm text-gray-600 ml-8 md:ml-11 mobile-hidden md:block">แนวโน้มการขายในสัปดาห์ที่ผ่านมา</p>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value, name) => [
                    name === 'sales' ? `฿${value.toLocaleString()}` : `${value} คน`,
                    name === 'sales' ? 'ยอดขาย' : 'ลงทะเบียน'
                  ]} />
                  <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="ios-card hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold text-gray-800">
                <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <Calendar className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                </div>
                <span className="text-sm md:text-xl">การลงทะเบียน</span>
              </CardTitle>
              <p className="text-xs md:text-sm text-gray-600 ml-8 md:ml-11 mobile-hidden md:block">จำนวนผู้ป่วยใหม่ในแต่ละวัน</p>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`${value} คน`, 'ลงทะเบียน']} />
                  <Bar dataKey="registrations" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Overview and Program Distribution - iOS Style */}
        <div className="grid mobile-grid md:grid-cols-7 gap-4 md:gap-6">
          <Card className="ios-card md:col-span-4">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-sm md:text-xl">ภาพรวมรายเดือน</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value, name) => [
                    name === 'sales' ? `฿${value.toLocaleString()}` : `${value} คน`,
                    name === 'sales' ? 'ยอดขาย' : 'ลงทะเบียน'
                  ]} />
                  <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="registrations" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="ios-card md:col-span-3">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-sm md:text-xl">สัดส่วนโปรแกรม</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={programData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {programData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'สัดส่วน']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - iOS Style */}
        <div className="grid gap-4 md:gap-6">
          <Card className="ios-card">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-sm md:text-xl">กิจกรรมล่าสุด</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 md:p-3 bg-gray-50/50 rounded-xl">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {activity.patient}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
