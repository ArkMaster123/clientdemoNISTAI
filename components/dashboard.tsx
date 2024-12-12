'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar-nav"
import { Brain, ArrowRight, ClipboardList, Shield } from 'lucide-react'





export function DashboardComponent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Add this useEffect right here
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      }
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
      <Sidebar />

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
