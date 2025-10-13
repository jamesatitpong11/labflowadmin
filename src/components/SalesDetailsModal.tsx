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
  Gift,
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

  // Calculate payment method data with proper grouping
  const paymentMethodsData = {
    cash: departmentData?.paymentMethods?.['เงินสด'] || paymentMethodData?.['เงินสด'] || { amount: 0, percentage: "0%", count: 0 },
    transfer: departmentData?.paymentMethods?.['เงินโอน'] || paymentMethodData?.['เงินโอน'] || { amount: 0, percentage: "0%", count: 0 },
    credit: {
      amount: (departmentData?.paymentMethods?.['เครดิต']?.amount || paymentMethodData?.['เครดิต']?.amount || 0) + 
              (departmentData?.paymentMethods?.['สปสช.']?.amount || paymentMethodData?.['สปสช.']?.amount || 0),
      count: (departmentData?.paymentMethods?.['เครดิต']?.count || paymentMethodData?.['เครดิต']?.count || 0) + 
             (departmentData?.paymentMethods?.['สปสช.']?.count || paymentMethodData?.['สปสช.']?.count || 0),
      percentage: "0%"
    },
    free: departmentData?.paymentMethods?.['ฟรี'] || paymentMethodData?.['ฟรี'] || { amount: 0, percentage: "0%", count: 0 }
  };

  // Calculate total amount for percentage calculation
  const totalPaymentAmount = paymentMethodsData.cash.amount + paymentMethodsData.transfer.amount + 
                            paymentMethodsData.credit.amount + paymentMethodsData.free.amount;

  // Update percentages
  if (totalPaymentAmount > 0) {
    paymentMethodsData.cash.percentage = `${((paymentMethodsData.cash.amount / totalPaymentAmount) * 100).toFixed(1)}%`;
    paymentMethodsData.transfer.percentage = `${((paymentMethodsData.transfer.amount / totalPaymentAmount) * 100).toFixed(1)}%`;
    paymentMethodsData.credit.percentage = `${((paymentMethodsData.credit.amount / totalPaymentAmount) * 100).toFixed(1)}%`;
    paymentMethodsData.free.percentage = `${((paymentMethodsData.free.amount / totalPaymentAmount) * 100).toFixed(1)}%`;
  }

  // Use department-specific data or fallback to general data
  const salesDetails = {
    totalSales: departmentData ? formatCurrency(departmentData.totalSales) : value,
    paymentMethods: paymentMethodsData,
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
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                รายละเอียดยอดขาย
              </span>
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2 inline-block"></div>}
            </div>
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {departmentName ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                ข้อมูลเฉพาะ <span className="font-semibold text-blue-600">{departmentName}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                ข้อมูลรายละเอียดและสถิติการขายประจำเดือน
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-green-800">💰 ยอดขายรวมทั้งหมด</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {salesDetails.totalSales}
                </div>
                <p className="text-sm text-green-600 font-medium mt-1">📊 ยอดขายในช่วงเวลาที่เลือก</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-800">📈 จำนวนรายการ</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {Object.values(salesDetails.paymentMethods).reduce((sum, method) => sum + method.count, 0)}
                </div>
                <p className="text-sm text-blue-600 font-medium mt-1">🧾 รายการทั้งหมด</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-purple-800">💳 วิธีการชำระ</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {Object.values(salesDetails.paymentMethods).filter(method => method.count > 0).length}
                </div>
                <p className="text-sm text-purple-600 font-medium mt-1">🎯 ประเภทที่ใช้</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Payment Methods */}
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold">💳 รูปแบบการชำระเงิน</span>
                  <p className="text-sm text-indigo-100 font-normal mt-1">แยกตามประเภทการชำระเงิน</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cash Payment */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Banknote className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800 text-lg">💵 เงินสด</p>
                        <p className="text-sm text-green-600 font-medium">{salesDetails.paymentMethods.cash.count} รายการ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700 text-xl">{formatCurrency(salesDetails.paymentMethods.cash.amount)}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {salesDetails.paymentMethods.cash.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transfer Payment */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-800 text-lg">🏦 เงินโอน</p>
                        <p className="text-sm text-blue-600 font-medium">{salesDetails.paymentMethods.transfer.count} รายการ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-700 text-xl">{formatCurrency(salesDetails.paymentMethods.transfer.amount)}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {salesDetails.paymentMethods.transfer.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Payment (รวม เครดิต และ สปสช.) */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-purple-800 text-lg">🏛️ เครดิต</p>
                        <p className="text-sm text-purple-600 font-medium">{salesDetails.paymentMethods.credit.count} รายการ</p>
                        <p className="text-xs text-purple-500 font-medium bg-purple-100 px-2 py-0.5 rounded-full inline-block mt-1">
                          รวม เครดิต + สปสช.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-700 text-xl">{formatCurrency(salesDetails.paymentMethods.credit.amount)}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {salesDetails.paymentMethods.credit.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free Payment */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-orange-800 text-lg">🎁 ฟรี</p>
                        <p className="text-sm text-orange-600 font-medium">{salesDetails.paymentMethods.free.count} รายการ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-700 text-xl">{formatCurrency(salesDetails.paymentMethods.free.amount)}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          {salesDetails.paymentMethods.free.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">🏆 บริการยอดนิยม</span>
                    <p className="text-sm text-indigo-100 font-normal mt-1">รายการบริการที่ใช้มากที่สุด</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {salesDetails.topProducts.map((product, index) => (
                  <div key={index} className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-l-xl"></div>
                    <div className="flex items-center justify-between p-4 pl-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-base">{product.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              📊 {product.count} ครั้ง
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              📈 {product.percentage}%
                            </span>
                          </div>
                          {product.avgPrice && (
                            <p className="text-xs text-gray-600 mt-2 font-medium">
                              💰 ราคาเฉลี่ย: <span className="text-indigo-600 font-semibold">{product.avgPrice}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {product.sales}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-1">💵 ยอดรวม</div>
                      </div>
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
