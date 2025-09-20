import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
} from "lucide-react";

const Finance = () => {
  const financialMetrics = [
    {
      title: "รายได้วันนี้",
      value: "฿45,231",
      change: "+8% จากเมื่อวาน",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-success",
    },
    {
      title: "รายได้เดือนนี้",
      value: "฿1,245,890",
      change: "+15% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-primary",
    },
    {
      title: "ค่าใช้จ่าย",
      value: "฿234,567",
      change: "-5% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: CreditCard,
      iconColor: "text-warning",
    },
    {
      title: "กำไรสุทธิ",
      value: "฿1,011,323",
      change: "+22% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: Receipt,
      iconColor: "text-success",
    },
  ];

  const recentTransactions = [
    { id: 1, description: "ค่าตรวจเลือด", amount: "฿1,500", patient: "คุณสมชาย ใจดี", time: "09:30" },
    { id: 2, description: "ค่ายา", amount: "฿2,200", patient: "คุณสมหญิง สวยงาม", time: "10:15" },
    { id: 3, description: "ค่าตรวจสุขภาพ", amount: "฿3,500", patient: "คุณประยุทธ มั่นคง", time: "11:45" },
    { id: 4, description: "ค่าฉีดวัคซีน", amount: "฿800", patient: "คุณสุภาพ ดีใจ", time: "14:20" },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">การเงิน</h1>
        <p className="text-muted-foreground">
          จัดการและติดตามข้อมูลทางการเงิน
        </p>
      </div>

      {/* Financial Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {financialMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Financial Charts and Transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              กราฟรายได้รายเดือน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-80 bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  แผนภูมิรายได้จะแสดงที่นี่
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  (เชื่อมต่อกับฐานข้อมูลเพื่อแสดงข้อมูลจริง)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              รายการเงินเข้าล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.patient}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">
                      {transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Finance;