import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Stethoscope,
  Calendar,
  Clock,
} from "lucide-react";

const MedicalRecords = () => {
  const recordMetrics = [
    {
      title: "เวชระเบียนทั้งหมด",
      value: "1,892",
      change: "+15% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: FileText,
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
      title: "นัดหมายวันนี้",
      value: "24",
      change: "คงที่",
      changeType: "neutral" as const,
      icon: Calendar,
      iconColor: "text-warning",
    },
    {
      title: "รอผลตรวจ",
      value: "12",
      change: "-8% จากเมื่อวาน",
      changeType: "positive" as const,
      icon: Clock,
      iconColor: "text-warning",
    },
  ];

  const recentRecords = [
    {
      id: 1,
      patientName: "คุณสมชาย ใจดี",
      diagnosis: "ตรวจสุขภาพประจำปี",
      doctor: "นพ.ประยุทธ มั่นคง",
      date: "วันนี้ 14:30",
      status: "เสร็จสิ้น"
    },
    {
      id: 2,
      patientName: "คุณสมหญิง สวยงาม",
      diagnosis: "ตรวจเลือด",
      doctor: "นพ.สมบัติ ดีใจ",
      date: "วันนี้ 13:15",
      status: "รอผลตรวจ"
    },
    {
      id: 3,
      patientName: "คุณประยุทธ มั่นคง",
      diagnosis: "รักษาโรคเบาหวาน",
      doctor: "นพ.สุภาพ ใจดี",
      date: "เมื่อวาน 16:45",
      status: "เสร็จสิ้น"
    },
    {
      id: 4,
      patientName: "คุณสุภาพ ดีใจ",
      diagnosis: "ฉีดวัคซีนไข้หวัดใหญ่",
      doctor: "พยาบาลสมหญิง",
      date: "เมื่อวาน 15:20",
      status: "เสร็จสิ้น"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "เสร็จสิ้น":
        return "bg-success text-success-foreground";
      case "รอผลตรวจ":
        return "bg-warning text-warning-foreground";
      case "กำลังตรวจ":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">เวชระเบียน</h1>
        <p className="text-muted-foreground">
          จัดการและติดตามข้อมูลเวชระเบียนผู้ป่วย
        </p>
      </div>

      {/* Medical Record Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recordMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Medical Records Management */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              เวชระเบียนล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {record.patientName}
                      </h4>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-1">
                      {record.diagnosis}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      แพทย์: {record.doctor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {record.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              สถิติการตรวจ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">89</h3>
                <p className="text-sm text-muted-foreground">การตรวจวันนี้</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ตรวจเลือด</span>
                  <span className="text-sm font-medium">34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ตรวจสุขภาพ</span>
                  <span className="text-sm font-medium">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ฉีดวัคซีน</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">อื่นๆ</span>
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalRecords;