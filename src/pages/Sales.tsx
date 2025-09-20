import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

const Sales = () => {
  const salesMetrics = [
    {
      title: "ยอดขายวันนี้",
      value: "฿45,231",
      change: "+8% จากเมื่อวาน",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-success",
    },
    {
      title: "รายการขาย",
      value: "127",
      change: "+12% จากเมื่อวาน",
      changeType: "positive" as const,
      icon: ShoppingCart,
      iconColor: "text-primary",
    },
    {
      title: "สินค้าคงเหลือ",
      value: "1,234",
      change: "-5% จากเดือนที่แล้ว",
      changeType: "negative" as const,
      icon: Package,
      iconColor: "text-warning",
    },
    {
      title: "ยอดขายเดือนนี้",
      value: "฿1,245,890",
      change: "+15% จากเดือนที่แล้ว",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-success",
    },
  ];

  const recentSales = [
    {
      id: 1,
      item: "ยาแก้เจ็บ Paracetamol",
      quantity: 2,
      price: "฿120",
      customer: "คุณสมชาย ใจดี",
      time: "14:30",
      status: "ชำระแล้ว"
    },
    {
      id: 2,
      item: "วิตามินซี 1000mg",
      quantity: 1,
      price: "฿350",
      customer: "คุณสมหญิง สวยงาม",
      time: "13:45",
      status: "ชำระแล้ว"
    },
    {
      id: 3,
      item: "ยาแก้แพ้ Loratadine",
      quantity: 3,
      price: "฿180",
      customer: "คุณประยุทธ มั่นคง",
      time: "12:20",
      status: "รอชำระ"
    },
    {
      id: 4,
      item: "ครีมทาแผล",
      quantity: 1,
      price: "฿85",
      customer: "คุณสุภาพ ดีใจ",
      time: "11:15",
      status: "ชำระแล้ว"
    },
    {
      id: 5,
      item: "ยาบรรเลงอาการไอ",
      quantity: 2,
      price: "฿240",
      customer: "คุณมานี ใจดี",
      time: "10:30",
      status: "ชำระแล้ว"
    },
  ];

  const topProducts = [
    { name: "ยาแก้เจ็บ", sales: 145, revenue: "฿8,700" },
    { name: "วิตามินซี", sales: 98, revenue: "฿34,300" },
    { name: "ยาแก้แพ้", sales: 87, revenue: "฿5,220" },
    { name: "ครีมทาแผล", sales: 76, revenue: "฿6,460" },
  ];

  const getStatusColor = (status: string) => {
    return status === "ชำระแล้ว" 
      ? "bg-success text-success-foreground" 
      : "bg-warning text-warning-foreground";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">รายการขาย</h1>
        <p className="text-muted-foreground">
          จัดการและติดตามข้อมูลการขายสินค้าและยา
        </p>
      </div>

      {/* Sales Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {salesMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Sales Management */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              รายการขายล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {sale.item}
                      </h4>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      ลูกค้า: {sale.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      จำนวน: {sale.quantity} ชิ้น
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">
                      {sale.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sale.time}
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
              <Package className="h-5 w-5 text-primary" />
              สินค้าขายดี
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ขายได้ {product.sales} ชิ้น
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">
                      {product.revenue}
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

export default Sales;