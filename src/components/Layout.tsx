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

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 px-6 shadow-sm">
            <SidebarTrigger className="hover:bg-gray-100 rounded-lg transition-colors" />
            <div className="flex-1" />
            
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6 mr-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">ผู้ป่วยวันนี้</p>
                <p className="text-sm font-semibold text-gray-800">0</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500">ยอดขายวันนี้</p>
                <p className="text-sm font-semibold text-green-600">฿0</p>
              </div>
            </div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {user ? getUserInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                        {user ? getUserInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.name || "ผู้ใช้งาน"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {user?.email || ""}
                      </p>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {user?.role || "ผู้ใช้งาน"}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">โปรไฟล์</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="p-3 hover:bg-red-50 rounded-lg cursor-pointer transition-colors text-red-600 hover:text-red-700"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>ออกจากระบบ</span>
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