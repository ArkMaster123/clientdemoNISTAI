'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Shield, Brain, User, ChevronDown, FileCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isExpandable?: boolean;
  isActive?: boolean;
  isCollapsed?: boolean;
  children?: React.ReactNode;
}

interface SubMenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

function MenuItem({ icon, label, isExpandable = false, isActive = false, isCollapsed = false, children }: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    } else {
      switch (label) {
        case 'Dashboard':
          router.push('/dashboard');
          break;
        case 'Support':
          router.push('/');
          break;
      }
    }
  };

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
          isActive && "bg-blue-50 text-blue-600"
        )}
        onClick={handleClick}
        title={isCollapsed ? label : undefined}
      >
        <span className="mr-3">{icon}</span>
        {!isCollapsed && (
          <>
            <span className="flex-grow text-left">{label}</span>
            {isExpandable && (
              <ChevronDown
                size={16}
                className={cn("transition-transform", isExpanded && "transform rotate-180")}
              />
            )}
          </>
        )}
      </button>
      {isExpandable && isExpanded && !isCollapsed && (
        <div className="ml-6 mt-1">
          {children}
        </div>
      )}
    </div>
  );
}

function SubMenuItem({ icon, label, isActive = false, isCollapsed = false }: SubMenuItemProps) {
  const router = useRouter();

  const handleClick = () => {
    switch (label) {
      case 'NISTAI':
        router.push('/nistai');
        break;
      case 'Compliance Agents':
        router.push('/compliance-agents');
        break;
    }
  };

  return (
    <button
      className={cn(
        "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
        isActive && "bg-blue-50 text-blue-600"
      )}
      title={isCollapsed ? label : undefined}
      onClick={handleClick}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {!isCollapsed && <span>{label}</span>}
    </button>
  );
}

export function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <aside
      className={cn(
        "bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out flex flex-col",
        isSidebarCollapsed ? "w-16" : "w-[280px]"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB]">
        <div className={isSidebarCollapsed ? "w-8" : "w-32"}>
          <img
            src="https://cdn.prod.website-files.com/6459501a1911cd7b5655f077/646a2f2db39363e2e38e31f4_logo-white-goldi.svg"
            alt="Goldilock"
            className={`h-8 w-full object-contain invert`}
          />
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-grow py-4">
        <MenuItem
          icon={<Home size={20} />}
          label="Dashboard"
          isActive={pathname === '/dashboard'}
          isCollapsed={isSidebarCollapsed}
        />
        <MenuItem
          icon={<Shield size={20} />}
          label="Products"
          isExpandable
          isCollapsed={isSidebarCollapsed}
        >
          <SubMenuItem
            icon={<Brain size={20} />}
            label="NISTAI"
            isActive={pathname === '/nistai'}
            isCollapsed={isSidebarCollapsed}
          />
          <SubMenuItem
            icon={<FileCheck size={20} />}
            label="Compliance Agents"
            isCollapsed={isSidebarCollapsed}
          />
        </MenuItem>
        <MenuItem
          icon={<User size={20} />}
          label="Support"
          isCollapsed={isSidebarCollapsed}
        />
      </nav>

      {/* User Profile and Collapse Button */}
      <div className="h-16 border-t border-[#E5E7EB] flex items-center px-4">
        {!isSidebarCollapsed && (
          <>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
            <span className="ml-3 font-medium">John Doe</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="ml-auto"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Button>
          </>
        )}
        {isSidebarCollapsed && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <svg
              className="w-4 h-4 transform rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Button>
        )}
      </div>
    </aside>
  );
}
