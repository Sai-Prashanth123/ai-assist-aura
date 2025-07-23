import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background w-full">
      <Header 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        
        <main className={`flex-1 transition-smooth ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}