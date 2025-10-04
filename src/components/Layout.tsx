import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for real-time stats
  const [todayStats, setTodayStats] = useState({
    newPatients: 0,
    todaySales: 0,
    isLoading: true,
    lastUpdated: null as Date | null
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch today's stats
  const fetchTodayStats = async () => {
    try {
      const today = new Date();
      const params = {
        dateRange: 'today',
        selectedDate: today.toISOString()
      };
      
      const response = await apiService.getDashboardStats(params);
      
      if (response.success) {
        setTodayStats({
          newPatients: response.data?.newPatients || 0,
          todaySales: response.data?.todaySales || 0,
          isLoading: false,
          lastUpdated: new Date()
        });
      } else {
        setTodayStats(prev => ({ ...prev, isLoading: false, lastUpdated: new Date() }));
      }
    } catch (error) {
      console.error('Failed to fetch today stats:', error);
      setTodayStats(prev => ({ ...prev, isLoading: false, lastUpdated: new Date() }));
    }
  };

  // Fetch stats on component mount and refresh every 30 seconds
  useEffect(() => {
    fetchTodayStats();
    
    const interval = setInterval(() => {
      fetchTodayStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b-0 bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 backdrop-blur-xl shadow-lg shadow-black/5 px-4">
            <SidebarTrigger className="p-1.5 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-105" />
            <div className="flex-1" />
            
            {/* Real-time Quick Stats */}
            <div className="hidden lg:flex items-center space-x-3 mr-4">
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10"></div>
                <div className="relative text-center">
                  <p className="text-xs font-medium text-blue-600">ผู้ป่วยวันนี้</p>
                  <p className="text-sm font-bold text-slate-800">
                    {todayStats.isLoading ? (
                      <span className="inline-block w-8 h-4 bg-blue-200 rounded animate-pulse"></span>
                    ) : (
                      todayStats.newPatients.toLocaleString('th-TH')
                    )}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10"></div>
                <div className="relative text-center">
                  <p className="text-xs font-medium text-emerald-600">ยอดขายวันนี้</p>
                  <p className="text-sm font-bold text-slate-800">
                    {todayStats.isLoading ? (
                      <span className="inline-block w-12 h-4 bg-emerald-200 rounded animate-pulse"></span>
                    ) : (
                      formatCurrency(todayStats.todaySales)
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Compact User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-200 hover:ring-blue-300 transition-all duration-300 shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs">
                        {user ? getUserInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur opacity-0 hover:opacity-75 transition-opacity duration-300"></div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white/98 backdrop-blur-xl border-0 shadow-xl shadow-black/10 rounded-2xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl mb-2 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-200 shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                          {user ? getUserInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur opacity-75 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col space-y-1 flex-1">
                      <p className="text-sm font-bold text-slate-800">
                        {user?.name || "ผู้ใช้งาน"}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        {user?.email || ""}
                      </p>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm">
                        {user?.role || "ผู้ใช้งาน"}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <DropdownMenuItem className="group p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl cursor-pointer transition-all duration-300">
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-all duration-300 mr-3">
                    <User className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <span className="text-slate-700 group-hover:text-blue-700 font-medium transition-colors duration-300">โปรไฟล์</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="group p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl cursor-pointer transition-all duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-all duration-300 mr-3">
                    <LogOut className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors duration-300" />
                  </div>
                  <span className="text-slate-700 group-hover:text-red-700 font-medium transition-colors duration-300">ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}