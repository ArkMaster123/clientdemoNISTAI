'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowRight, Brain, ChevronDown, ClipboardList, Home, LogOut, Menu, Rocket, Upload, User } from 'lucide-react'

export function NistaiFrontend() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('file')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resultHtml, setResultHtml] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(0)
      setAnalysisStep(1)

      // Simulate file upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setAnalysisStep(2)
        }
      }, 500)

      // Send fetch request
      const formData = new FormData()
      formData.append('pdf_file', file)

      fetch('https://318aff70-02da-4da3-b9c1-5738277e6249-00-3pllg8z3mv4vc.riker.replit.dev/process', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(data => {
          setResultHtml(data)
          setAnalysisStep(4) // Analysis complete
        })
        .catch(error => {
          console.error('Error:', error)
          // Handle error (e.g., show error message to user)
        })
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(0)
      setAnalysisStep(1)

      // Simulate file upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setAnalysisStep(2)
        }
      }, 500)

      // Send fetch request
      const formData = new FormData()
      formData.append('pdf_file', file)

      fetch('https://318aff70-02da-4da3-b9c1-5738277e6249-00-3pllg8z3mv4vc.riker.replit.dev/process', {
        method: 'POST',
        headers: {"Accept":"text/html"},
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(data => {
          setResultHtml(data)
          setAnalysisStep(4) // Analysis complete
        })
        .catch(error => {
          console.error('Error:', error)
          // Handle error (e.g., show error message to user)
        })
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleUrlSubmit = () => {
    if (pdfUrl) {
      setUploadProgress(0)
      setAnalysisStep(1)

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setAnalysisStep(2)
        }
      }, 500)

      // Send fetch request
      const formData = new FormData()
      formData.append('pdf_url', pdfUrl)

      fetch('https://318aff70-02da-4da3-b9c1-5738277e6249-00-3pllg8z3mv4vc.riker.replit.dev/process', {
        method: 'POST',
        headers: {"Accept":"text/html"},
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(data => {
          setResultHtml(data)
          setAnalysisStep(4) // Analysis complete
        })
        .catch(error => {
          console.error('Error:', error)
          // Handle error
        })
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out flex flex-col",
        isSidebarCollapsed ? "w-16" : "w-[280px]"
      )}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 bg-blue-600 rounded flex-shrink-0"></div>
          {!isSidebarCollapsed && (
            <span className="ml-3 text-xl font-semibold">whatAIdea</span>
          )}
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-grow py-4">
          <MenuItem icon={<Home size={20} />} label="Introduction" />
          <MenuItem icon={<ChevronDown size={20} />} label="Products" isExpandable>
            <SubMenuItem label="DocuSight" />
            <SubMenuItem label="CYBERAI" />
            <SubMenuItem label="NISTAI" isActive />
          </MenuItem>
          <MenuItem icon={<ClipboardList size={20} />} label="History" />
          <MenuItem icon={<User size={20} />} label="Support" />
          <MenuItem icon={<User size={20} />} label="FAQ" />
          <MenuItem icon={<User size={20} />} label="Profile" />
        </nav>

        {/* User Profile */}
        <div className="h-16 border-t border-[#E5E7EB] flex items-center px-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
          {!isSidebarCollapsed && (
            <>
              <span className="ml-3 font-medium">Username</span>
              <LogOut size={20} className="ml-auto" />
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header with Navigation Toggle */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" className="mr-4 hidden lg:flex" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">NISTAI Dashboard</h1>
          </div>

          {/* Welcome Card */}
          <Card className="bg-blue-600 text-white mb-6">
            <CardContent className="p-8 relative">
              <h2 className="text-3xl font-bold mb-2">Hi Username,</h2>
              <p className="text-xl">I am your AI-Powered NIST Compliance Engine</p>
              <Rocket className="absolute top-4 right-4 opacity-40" size={80} />
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="mb-8 bg-blue-50">
            <CardContent className="p-6">
              <p className="text-blue-800">Stop struggling with compliance documentation. NISTAI equips you with deep intelligence to achieve and maintain NIST compliance.</p>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <ProcessStep icon={<Upload size={24} />} title="Document Upload" description="Upload your compliance documentation" />
            <ProcessStep icon={<Brain size={24} />} title="AI Analysis" description="Let our AI analyze NIST alignment" />
            <ProcessStep icon={<ClipboardList size={24} />} title="Assessment Review" description="Review detailed compliance assessment" />
          </div>

          {/* Upload Interface */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <Tabs defaultValue="file" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="file" className="text-center py-2">File Upload</TabsTrigger>
                  <TabsTrigger value="url" className="text-center py-2">URL Input</TabsTrigger>
                </TabsList>
                <TabsContent value="file">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={openFileDialog}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf"
                    />
                    <Upload size={48} className="text-blue-500 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {selectedFile ? selectedFile.name : "Choose or Drop File"}
                    </p>
                    <p className="text-sm text-gray-500">PDF up to 10MB</p>
                  </div>
                </TabsContent>
                <TabsContent value="url">
                  <div className="flex">
                    <Input
                      placeholder="Enter URL"
                      className="flex-1"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                    />
                    <Button className="ml-2" onClick={handleUrlSubmit}>Submit</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Processing States */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
                <Progress value={uploadProgress} className="w-full mb-2" />
                <div className="flex justify-between items-center">
                  <span>{uploadProgress}%</span>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisStep > 0 && analysisStep < 4 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Analyzing Documentation</h3>
                <div className="space-y-4">
                  <AnalysisStep step={1} currentStep={analysisStep} label="Uploading file..." />
                  <AnalysisStep step={2} currentStep={analysisStep} label="Processing document..." />
                  <AnalysisStep step={3} currentStep={analysisStep} label="Analyzing NIST compliance..." />
                  <AnalysisStep step={4} currentStep={analysisStep} label="Generating assessment..." />
                </div>
                <Button variant="outline" className="mt-6">Cancel</Button>
              </CardContent>
            </Card>
          )}

          {/* Results Container */}
          {resultHtml && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Assessment Results</h3>
                <div id="results-container">
                  <div dangerouslySetInnerHTML={{ __html: resultHtml }} />
                </div>
              </CardContent>
            </Card>
          )}
          {!resultHtml && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Assessment Results</h3>
                <div id="results-container">
                  <p className="text-gray-500">No results available yet. Complete the analysis to see your assessment.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

function MenuItem({ icon, label, isExpandable = false, isActive = false, children }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
          isActive && "bg-blue-50 text-blue-600"
        )}
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
      >
        <span className="mr-3">{icon}</span>
        <span className="flex-grow text-left">{label}</span>
        {isExpandable && <ChevronDown size={16} className={cn("transition-transform", isExpanded && "transform rotate-180")} />}
      </button>
      {isExpandable && isExpanded && (
        <div className="ml-6 mt-1">
          {children}
        </div>
      )}
    </div>
  )
}

function SubMenuItem({ label, isActive = false }) {
  return (
    <button
      className={cn(
        "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
        isActive && "bg-blue-50 text-blue-600"
      )}
    >
      <span>{label}</span>
    </button>
  )
}

function ProcessStep({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 text-blue-500 bg-blue-100 p-4 rounded-full">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function AnalysisStep({ step, currentStep, label }) {
  const isComplete = currentStep > step
  const isInProgress = currentStep === step

  return (
    <div className="flex items-center">
      <div className={cn(
        "w-6 h-6 rounded-full mr-4 flex items-center justify-center",
        isComplete ? "bg-green-500" : isInProgress ? "bg-blue-500" : "bg-gray-300"
      )}>
        {isComplete && <ArrowRight size={16} className="text-white" />}
      </div>
      <span className={cn(
        "flex-grow",
        isComplete ? "text-green-500" : isInProgress ? "text-blue-500" : "text-gray-500"
      )}>
        {label}
      </span>
      {isInProgress && <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>}
    </div>
  )
}
