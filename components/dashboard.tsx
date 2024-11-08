'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Brain, ChevronDown, ClipboardList, Home, LogOut, Menu, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

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


export function DashboardComponent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  const ncscScores = [
    { category: "Risk Management", score: 85 },
    { category: "Asset Management", score: 78 },
    { category: "Supply Chain Security", score: 92 },
    { category: "Cyber Security Architecture", score: 88 },
    { category: "Identity and Access Management", score: 95 },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out flex flex-col",
        isSidebarCollapsed ? "w-16" : "w-[280px]"
      )}>
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
    isActive 
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
      isActive 
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
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-4 w-4" />
          </Button>
          {!isSidebarCollapsed && (
            <>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <span className="ml-3 font-medium">John Doe</span>
              <LogOut size={20} className="ml-auto" />
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Welcome Card with Animation */}
          <Card className="bg-indigo-800 text-white mb-6 overflow-hidden">
            <CardContent className="p-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-2">Welcome, John Doe</h2>
                <p className="text-xl">Your AI-Powered NIST Compliance Engine</p>
                
              </motion.div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="mb-8 bg-indigo-100">
            <CardContent className="p-6">
              <p className="text-blue-800">Stop struggling with compliance documentation. NISTAI equips you with deep intelligence.</p>
            </CardContent>
          </Card>

          {/* NISTAI Capabilities */}
          <h2 className="text-2xl font-semibold mb-4">What NISTAI Can Do For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <CapabilityCard
              icon={<Brain size={24} />}
              title="AI-Powered Analysis"
              description="Leverage advanced AI to analyze your compliance documentation and practices."
            />
            <CapabilityCard
              icon={<ClipboardList size={24} />}
              title="Compliance Tracking"
              description="Keep track of your compliance status across various NIST frameworks and standards."
            />
            <CapabilityCard
              icon={<Shield size={24} />}
              title="Risk Assessment"
              description="Identify potential vulnerabilities and receive actionable recommendations."
            />
          </div>

          {/* NCSC Scores */}
          <h2 className="text-2xl font-semibold mb-4">Your NCSC Compliance Scores</h2>
          <Card className="mb-8">
            <CardContent className="p-6">
              {ncscScores.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className="font-semibold">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Assessments */}
          <h2 className="text-2xl font-semibold mb-4">Recent Assessments</h2>
          <Card className="mb-8">
            <CardContent className="p-6">
              <ul className="space-y-4">
                <AssessmentItem
                  title="Q2 2023 NIST CSF Assessment"
                  date="June 15, 2023"
                  score={92}
                />
                <AssessmentItem
                  title="Annual NIST 800-53 Review"
                  date="May 1, 2023"
                  score={88}
                />
                <AssessmentItem
                  title="NIST Privacy Framework Evaluation"
                  date="April 10, 2023"
                  score={95}
                />
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function MenuItem({ icon, label, isExpandable = false, isActive = false, isCollapsed = false, children }: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <button 
        className={cn(
          "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
          isActive && "bg-blue-50 text-blue-600"
        )}
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
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
  )
}

function SubMenuItem({ icon, label, isActive = false, isCollapsed = false }: SubMenuItemProps) {
  const router = useRouter()

  return (
    <button 
      className={cn(
        "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
        isActive && "bg-blue-50 text-blue-600"
      )}
      title={isCollapsed ? label : undefined}
      onClick={() => label === "NISTAI" ? router.push('/nistai') : null}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {!isCollapsed && <span>{label}</span>}
    </button>
  )
}

function CapabilityCard({ icon, title, description }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-indigo-600 bg-blue-100 p-4 rounded-full">{icon}</div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AssessmentItem({ title, date, score }) {
  return (
    <li className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex items-center">
        <span className="font-semibold mr-2">{score}%</span>
        <div className={cn(
          "w-3 h-3 rounded-full",
          score >= 90 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : "bg-red-500"
        )}></div>
      </div>
    </li>
  )
}