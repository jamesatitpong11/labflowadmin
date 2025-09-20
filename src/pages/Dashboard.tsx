import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Stethoscope,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
} from "lucide-react";

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

  const recentActivity = [
    { id: 1, action: "ผู้ป่วยใหม่ลงทะเบียน", patient: "คุณสมชาย ใจดี", time: "10 นาทีที่แล้ว" },
    { id: 2, action: "ตรวจเสร็จสิ้น", patient: "คุณสมหญิง สวยงาม", time: "25 นาทีที่แล้ว" },
    { id: 3, action: "ชำระเงินแล้ว", patient: "คุณประยุทธ มั่นคง", time: "1 ชั่วโมงที่แล้ว" },
    { id: 4, action: "นัดหมายใหม่", patient: "คุณสุภาพ ดีใจ", time: "2 ชั่วโมงที่แล้ว" },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">แดชบอร์ด</h1>
        <p className="text-muted-foreground">
          ภาพรวมข้อมูลของระบบการจัดการทางการแพทย์
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Chart and Activity Section */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              สถิติการใช้งานรายสัปดาห์
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-80 bg-muted/20 rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  แผนภูมิจะแสดงที่นี่
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  (เชื่อมต่อกับฐานข้อมูลเพื่อแสดงข้อมูลจริง)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              กิจกรรมล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
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
  );
};

export default Dashboard;