import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  FileText,
  ShoppingCart,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "แดชบอร์ด",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "การเงิน",
    url: "/finance",
    icon: DollarSign,
  },
  {
    title: "ผู้ใช้งาน",
    url: "/users",
    icon: Users,
  },
  {
    title: "เวชระเบียน",
    url: "/medical-records",
    icon: FileText,
  },
  {
    title: "รายการขาย",
    url: "/sales",
    icon: ShoppingCart,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Menu className="w-4 h-4 text-primary-foreground" />
            </div>
{state === "expanded" && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Medical Dashboard
                </h2>
                <p className="text-xs text-muted-foreground">
                  ระบบจัดการทางการแพทย์
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={getNavClass}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}