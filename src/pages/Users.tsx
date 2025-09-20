import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import {
  Users as UsersIcon,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";

const Users = () => {
  const userMetrics = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: "2,547",
      change: "+12% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: UsersIcon,
      iconColor: "text-primary",
    },
    {
      title: "ผู้ใช้ใหม่",
      value: "124",
      change: "+8% จากสัปดาห์ที่แล้ว",
      changeType: "positive" as const,
      icon: UserPlus,
      iconColor: "text-success",
    },
    {
      title: "ผู้ใช้ออนไลน์",
      value: "89",
      change: "ขณะนี้",
      changeType: "neutral" as const,
      icon: UserCheck,
      iconColor: "text-success",
    },
    {
      title: "ผู้ใช้ไม่ใช้งาน",
      value: "23",
      change: "-15% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: UserX,
      iconColor: "text-warning",
    },
  ];

  const recentUsers = [
    { 
      id: 1, 
      name: "คุณสมชาย ใจดี", 
      email: "somchai@email.com", 
      role: "ผู้ป่วย", 
      status: "ออนไลน์",
      joinDate: "วันนี้"
    },
    { 
      id: 2, 
      name: "คุณสมหญิง สวยงาม", 
      email: "somying@email.com", 
      role: "ผู้ป่วย", 
      status: "ออฟไลน์",
      joinDate: "เมื่อวาน"
    },
    { 
      id: 3, 
      name: "นพ.ประยุทธ มั่นคง", 
      email: "doctor@email.com", 
      role: "แพทย์", 
      status: "ออนไลน์",
      joinDate: "3 วันที่แล้ว"
    },
    { 
      id: 4, 
      name: "พยาบาลสุภาพ ดีใจ", 
      email: "nurse@email.com", 
      role: "พยาบาล", 
      status: "ออนไลน์",
      joinDate: "1 สัปดาห์ที่แล้ว"
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "ออนไลน์" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "แพทย์":
        return "bg-primary text-primary-foreground";
      case "พยาบาล":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ผู้ใช้งาน</h1>
        <p className="text-muted-foreground">
          จัดการและติดตามข้อมูลผู้ใช้งานในระบบ
        </p>
      </div>

      {/* User Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {userMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* User Management */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              ผู้ใช้งานล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {user.name.charAt(2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              สถิติการลงทะเบียน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-80 bg-muted/20 rounded-lg">
              <div className="text-center">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  กราฟการลงทะเบียนจะแสดงที่นี่
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  (เชื่อมต่อกับฐานข้อมูลเพื่อแสดงข้อมูลจริง)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;