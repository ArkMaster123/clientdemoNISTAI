'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowRight, Brain, ChevronDown, ClipboardList, Home, LogOut, Menu, Rocket, Shield, Upload, User } from 'lucide-react'
import { CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Activity } from 'lucide-react'
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

  function AnalysisResults({ htmlContent }) {
    const extractContent = (html, tag, className = '') => {
      const regex = className 
        ? new RegExp(`<${tag}[^>]*class="${className}"[^>]*>(.*?)<\/${tag}>`, 'gs')
        : new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gs');
      const matches = html.match(regex);
      return matches ? matches.map(match => {
        // Remove any HTML tags and trim
        return match.replace(/<[^>]*>/g, '').trim();
      }) : [];
    };
  
    // Extract sections
    const originalTitle = extractContent(htmlContent, 'h1')[0];
    // Clean up title - remove any processing text if present
    const title = originalTitle.includes('Security Analysis') 
      ? originalTitle.substring(originalTitle.indexOf('Security Analysis') - 30)
      : originalTitle;
  
    const summary = extractContent(htmlContent, 'p')[0]; // Get first paragraph for summary
    
    // Extract all list items and paragraphs
    const allListItems = extractContent(htmlContent, 'li');
    const allParagraphs = extractContent(htmlContent, 'p');
    
    // Find the Recover index as our anchor point
    const recoverIndex = allListItems.findIndex(item => item.startsWith('Recover:'));
  
    // Extract risks and gaps (everything before NIST scores)
    const firstNistScoreIndex = allListItems.findIndex(item => item.includes('/5'));
    const securityRisks = allListItems.slice(0, 6);
    const securityGaps = allListItems.slice(6, firstNistScoreIndex);
  
    // Extract NIST scores
    const nistScores = allListItems
      .filter(item => item.includes('/5'))
      .map(score => {
        const [scoreText, description] = score.split('-').map(s => s.trim());
        const scoreMatch = scoreText.match(/(\d+)\/5/);
        const scoreNum = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        const category = scoreText.split(':')[0].trim();
        
        return {
          category,
          score: scoreNum,
          description: description || scoreText.split(':')[1]?.trim() || ''
        };
      });
  
    // Get recommendations and overall risk rating
    const riskRating = allParagraphs.find(p => p.includes('Overall Risk Rating'))?.trim();
    
    // Get nested recommendations if they exist
    const nestedRecsIndex = allListItems.findIndex(item => 
      item.includes('Recommended implementation of:')
    );
    
    let recommendations = [];
    if (nestedRecsIndex !== -1) {
      recommendations = allListItems
        .slice(nestedRecsIndex + 1)
        .filter(item => 
          item.includes('Enhanced') ||
          item.includes('Multi-factor') ||
          item.includes('Regular security') ||
          item.includes('Comprehensive') ||
          item.includes('Third-party')
        );
    } else {
      // Otherwise look for class="recommendations" content
      const recsContent = extractContent(htmlContent, 'p', 'recommendations')[0];
      if (recsContent) {
        recommendations = recsContent
          .replace('Priority recommendations:', '')
          .split('-')
          .filter(item => item.trim())
          .map(item => item.trim());
      }
    }
  
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-lg opacity-90">{summary}</p>
          </CardContent>
        </Card>
  
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Risks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="mr-2" /> Security Risks and Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {securityRisks.map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
  
          {/* Security Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Shield className="mr-2" /> Security Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {securityGaps.map((gap, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
  
        {/* NIST Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <Activity className="mr-2" /> NIST Framework Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {nistScores.map(({ category, score, description }, index) => (
                <Card key={index} className="bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={`h-2 w-full rounded ${
                            n <= score ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{score}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
  
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <ArrowRight className="mr-2" /> Priority Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((recommendation, index) => (
                  <Card key={index} className="bg-green-50">
                    <CardContent className="p-4">
                      <p className="flex items-start">
                        <span className="mr-2 font-bold">{index + 1}.</span>
                        <span>{recommendation}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
  
        {/* Overall Risk Rating */}
        {riskRating && (
          <Card className="bg-red-50">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-red-600">{riskRating}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
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
                <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg h-11">
                  <TabsTrigger 
                    value="file" 
                    className="rounded-md py-2 px-3 data-[state=active]:bg-white data-[state=active]:text-foreground"
                  >
                    File Upload
                  </TabsTrigger>
                  <TabsTrigger 
                    value="url" 
                    className="rounded-md py-2 px-3 data-[state=active]:bg-white data-[state=active]:text-foreground"
                  >
                    URL Input
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="pt-2">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-white"
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
{resultHtml ? (
  <Card className="mb-8">
    <CardContent className="p-6">
      <AnalysisResults htmlContent={resultHtml} />
    </CardContent>
  </Card>
) : (
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

function SubMenuItem({ icon, label, isActive = false, isCollapsed = false }) {
  return (
    <button 
      className={cn(
        "w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors",
        isActive && "bg-blue-50 text-blue-600"
      )}
      title={isCollapsed ? label : undefined}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {!isCollapsed && <span>{label}</span>}
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
