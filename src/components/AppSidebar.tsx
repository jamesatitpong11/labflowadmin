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

// Mobile Bottom Navigation Component
function MobileBottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 ios-safe-area">
      <div className="flex justify-around items-center py-2">
        {allNavItems.map((item) => {
          const IconComponent = item.mobileIcon || item.icon;
          const active = isActive(item.url);
          
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-200 active:scale-95 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-blue-100 shadow-sm' 
                  : 'hover:bg-gray-100'
              }`}>
                <IconComponent className={`h-5 w-5 transition-colors duration-200 ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              <span className={`text-xs mt-1 font-medium transition-colors duration-200 truncate max-w-full ${
                active ? 'text-blue-600' : 'text-gray-500'
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
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 rounded-xl"
      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200";

  // Desktop sidebar
  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200/50 bg-white/80 backdrop-blur-md">
      <SidebarContent className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <img src="https://img2.pic.in.th/pic/logo9a23fce12053a876.png" className="h-5 w-5 text-primary" />
            </div>
            {state === "expanded" && (
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  LabFlow Admin
                </h2>
                <p className="text-sm text-gray-600">
                  ระบบจัดการทางการแพทย์
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 space-y-6">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              เมนูหลัก
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${getNavClass({ isActive: isActive(item.url) })}`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              รายงาน
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {reportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${getNavClass({ isActive: isActive(item.url) })}`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
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