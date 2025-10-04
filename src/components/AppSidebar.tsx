import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  BarChart3,
  UserPlus,
  Home,
  TrendingUp,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "แดชบอร์ด",
    shortTitle: "หน้าหลัก",
    url: "/",
    icon: LayoutDashboard,
    mobileIcon: Home,
  },
];

const reportItems = [
  {
    title: "รายงานยอดขาย",
    shortTitle: "ยอดขาย",
    url: "/sales-report",
    icon: BarChart3,
    mobileIcon: BarChart3,
  },
  {
    title: "รายงานการลงทะเบียน",
    shortTitle: "ลงทะเบียน",
    url: "/registration-report",
    icon: UserPlus,
    mobileIcon: UserPlus,
  },
];

// Combine all navigation items for mobile bottom bar
const allNavItems = [...navigationItems, ...reportItems];

// Enhanced Mobile Bottom Navigation Component
function MobileBottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/30 ios-safe-area shadow-2xl shadow-black/10">
      <div className="flex justify-around items-center py-3 px-2">
        {allNavItems.map((item) => {
          const IconComponent = item.mobileIcon || item.icon;
          const active = isActive(item.url);
          
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={`group flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-300 active:scale-95 rounded-2xl ${
                active ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
                active 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 scale-110' 
                  : 'bg-slate-100 group-hover:bg-blue-50 group-hover:scale-105'
              }`}>
                <IconComponent className={`h-5 w-5 transition-all duration-300 ${
                  active ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'
                }`} />
                {active && (
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl blur opacity-75 animate-pulse"></div>
                )}
              </div>
              <span className={`text-xs mt-2 font-semibold transition-all duration-300 truncate max-w-full ${
                active ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'
              }`}>
                {item.shortTitle || item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();

  // Show mobile bottom navigation on mobile devices
  if (isMobile) {
    return <MobileBottomNav />;
  }

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 rounded-2xl transform scale-105"
      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-slate-700 hover:text-blue-600 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md";

  // Enhanced Desktop sidebar
  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-gradient-to-b from-slate-50 to-white shadow-2xl shadow-black/5">
      <SidebarContent className="bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-xl">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-gray-200/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                <img src="https://img2.pic.in.th/pic/logo9a23fce12053a876.png" className="h-10 w-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl blur opacity-75 animate-pulse"></div>
            </div>
            {state === "expanded" && (
              <div className="space-y-1">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LabFlow Admin
                </h2>
                <p className="text-sm text-slate-600 font-medium">
                  ระบบจัดการทางการแพทย์
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-6 space-y-8">
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 px-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              เมนูหลัก
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink
                        to={item.url}
                        end
                        className={`group flex items-center gap-4 px-4 py-4 text-sm font-semibold transition-all duration-300 ${getNavClass({ isActive: isActive(item.url) })}`}
                      >
                        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(item.url) ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-100'}`}>
                          <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isActive(item.url) ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}`} />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 px-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              รายงาน
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {reportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink
                        to={item.url}
                        end
                        className={`group flex items-center gap-4 px-4 py-4 text-sm font-semibold transition-all duration-300 ${getNavClass({ isActive: isActive(item.url) })}`}
                      >
                        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(item.url) ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-100'}`}>
                          <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isActive(item.url) ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}`} />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}