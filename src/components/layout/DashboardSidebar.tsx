import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Phone,
  FileText,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Calls', url: '/dashboard/calls', icon: Phone },
  { title: 'Score Card Forms', url: '/dashboard/scorecards', icon: FileText },
  { title: 'Manage Agents', url: '/dashboard/agents', icon: Users },
  { title: 'Org Settings', url: '/dashboard/settings', icon: Settings },
  { title: 'Reports', url: '/dashboard/reports', icon: BarChart3 },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <motion.div
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {!collapsed && (
              <>
                <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-sidebar-foreground">Enterprise AI</h1>
                  <p className="text-xs text-sidebar-foreground/70">Analytics Dashboard</p>
                </div>
              </>
            )}
          </motion.div>
        </div>

        <SidebarGroup className="flex-1 py-4">
          <SidebarGroupLabel className={`text-sidebar-foreground/70 ${collapsed ? 'sr-only' : ''}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`nav-item ${isActive(item.url) ? 'active' : ''}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="p-4 border-t border-sidebar-border">
          <SidebarTrigger className="w-full flex items-center justify-center p-2 hover:bg-sidebar-accent rounded-md transition-colors">
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
            )}
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}