import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  BarChart3,
  CreditCard,
  Banknote,
  Building2,
} from "lucide-react";
import { apiService } from "@/services/api";

interface SalesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  paymentMethodData?: any;
  departmentName?: string;
}

export function SalesDetailsModal({ isOpen, onClose, title, value, paymentMethodData, departmentName }: SalesDetailsModalProps) {
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch department-specific data or overall data
  const fetchDepartmentData = async () => {
    if (!isOpen) return;
    
    try {
      setIsLoading(true);
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString();
      
      if (departmentName) {
        // Fetch specific department data
        console.log('🏥 Fetching department data:', { departmentName, year, month });
        
        const response = await apiService.getDepartmentSales({
          year,
          month,
          department: departmentName
        });
        
        if (response.success) {
          setDepartmentData(response.data);
          console.log('🏥 Department data received:', response.data);
        }
      } else {
        // Fetch overall data (all departments combined)
        console.log('🏥 Fetching overall data for all departments:', { year, month });
        
        const response = await apiService.getMonthlySales({
          year,
          month
        });
        
        if (response.success) {
          setDepartmentData({
            totalSales: response.data.totalSales,
            paymentMethods: response.data.salesByPaymentMethod,
            topServices: response.data.topServices || []
          });
          console.log('🏥 Overall data received:', response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when modal opens or department changes
  useEffect(() => {
    fetchDepartmentData();
  }, [isOpen, departmentName]);

  // Use department-specific data or fallback to general data
  const salesDetails = {
    totalSales: departmentData ? formatCurrency(departmentData.totalSales) : value,
    paymentMethods: {
      cash: departmentData?.paymentMethods?.['เงินสด'] || paymentMethodData?.['เงินสด'] || { amount: 0, percentage: "0%", count: 0 },
      transfer: departmentData?.paymentMethods?.['เงินโอน'] || paymentMethodData?.['เงินโอน'] || { amount: 0, percentage: "0%", count: 0 },
      nhso: departmentData?.paymentMethods?.['สปสช.'] || paymentMethodData?.['สปสช.'] || { amount: 0, percentage: "0%", count: 0 }
    },
    topProducts: departmentData?.topServices?.map((service: any) => ({
      name: service.name,
      sales: formatCurrency(service.totalAmount),
      percentage: `${service.percentage}%`,
      count: service.count,
      avgPrice: formatCurrency(service.avgPrice)
    })) || [
      { name: "ไม่มีข้อมูล", sales: "฿0", percentage: "0%", count: 0, avgPrice: "฿0" }
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-green-600" />
            รายละเอียด{title}
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
          </DialogTitle>
          <DialogDescription>
            {departmentName ? `ข้อมูลเฉพาะ${departmentName}` : 'ข้อมูลรายละเอียดและสถิติการขายประจำเดือน'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ยอดขายรวม</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{salesDetails.totalSales}</div>
                <p className="text-xs text-muted-foreground">เดือนปัจจุบัน</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                รูปแบบการชำระเงิน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cash Payment */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Banknote className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">เงินสด</p>
                      <p className="text-sm text-green-600">{salesDetails.paymentMethods.cash.count} รายการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{formatCurrency(salesDetails.paymentMethods.cash.amount)}</p>
                    <p className="text-xs text-green-600">{salesDetails.paymentMethods.cash.percentage}</p>
                  </div>
                </div>

                {/* Transfer Payment */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">เงินโอน</p>
                      <p className="text-sm text-blue-600">{salesDetails.paymentMethods.transfer.count} รายการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-700">{formatCurrency(salesDetails.paymentMethods.transfer.amount)}</p>
                    <p className="text-xs text-blue-600">{salesDetails.paymentMethods.transfer.percentage}</p>
                  </div>
                </div>

                {/* NHSO Payment */}
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-800">สปสช.</p>
                      <p className="text-sm text-orange-600">{salesDetails.paymentMethods.nhso.count} รายการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-700">{formatCurrency(salesDetails.paymentMethods.nhso.amount)}</p>
                    <p className="text-xs text-orange-600">{salesDetails.paymentMethods.nhso.percentage}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  บริการยอดนิยม
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {salesDetails.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-blue-600 font-medium">{product.count} ครั้ง</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-green-600 font-medium">{product.percentage} ของการใช้บริการ</p>
                      </div>
                      {product.avgPrice && (
                        <p className="text-xs text-gray-500 mt-1">ราคาเฉลี่ย: {product.avgPrice}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">{product.sales}</div>
                      <div className="text-xs text-gray-500">ยอดรวม</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Action Items */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-orange-800">ข้อเสนะแนะ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-orange-800">
                  ยังไม่มีข้อมูลการขายในเดือนนี้ ควรเริ่มบันทึกรายการขายเพื่อติดตามผลงาน
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-orange-800">
                  ตั้งเป้าหมายการขายรายเดือนเพื่อวัดผลการดำเนินงาน
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
