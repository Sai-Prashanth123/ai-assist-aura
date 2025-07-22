import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Meetings", href: "/meetings", icon: Video },
  { name: "Knowledge Base", href: "/knowledge", icon: FileText },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const [isCollapsing, setIsCollapsing] = useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border shadow-medium transition-smooth z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover-scale",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
        
        <div className="p-3 border-t border-border">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground",
            collapsed && "justify-center"
          )}>
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <span className="text-xs text-accent-foreground font-medium">JS</span>
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="font-medium text-foreground">John Smith</p>
                <p className="text-xs">Sales Manager</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}