'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowRight, Brain, ChevronDown, ClipboardList, Home, LogOut, Menu, Rocket, Router, Shield, Upload, User } from 'lucide-react'
import { CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Activity } from 'lucide-react'
import Image from 'next/image'
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

interface AnalysisResponse {
  response: {
    executive_summary: string;
    security_risks: Array<{
      title: string;
      details: string[];
      impact: string;
      severity: string;
    }>;
    security_gaps: Array<{
      area: string;
      current_state: string;
      required_state: string;
      priority: string;
    }>;
    nist_framework_scores: {
      [key: string]: {
        score: string;
        findings: string[];
        key_gaps: string;
      };
    };
    recommendations: Array<{
      title: string;
      priority: string;
      implementation_complexity: string;
      expected_impact: string;
    }>;
  };
}

export function NistaiFrontend() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('file')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resultData, setResultData] = useState<AnalysisResponse | null>(null)
  const [pdfUrl, setPdfUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(0)
      setAnalysisStep(1)
      setAnalysisStep(2)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('https://dd962088-bc71-4b84-abd1-8bbe309dfff0-00-ikr23jx9t635.spock.replit.dev/nistai', {
          method: 'POST',
          body: formData,
        })
        setAnalysisStep(3)
        await sleep(5000);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AnalysisResponse = await response.json()
        setAnalysisStep(4)
        setResultData(data)
         // Analysis complete
      } catch (error) {
        console.error('Error:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(0)
      setAnalysisStep(1)
      setAnalysisStep(2)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('https://dd962088-bc71-4b84-abd1-8bbe309dfff0-00-ikr23jx9t635.spock.replit.dev/nistai', {
          method: 'POST',
          body: formData,
        })

        setAnalysisStep(3)
        await sleep(5000);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AnalysisResponse = await response.json()
        setAnalysisStep(4) // Analysis complete
        setResultData(data)
      } catch (error) {
        console.error('Error:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleUrlSubmit = async () => {
    if (pdfUrl) {
      setUploadProgress(0)
      setAnalysisStep(1)
      setAnalysisStep(2)

      const formData = new FormData()
      // formData.append('pdf_url', pdfUrl)

      try {
        const response = await fetch(`https://dd962088-bc71-4b84-abd1-8bbe309dfff0-00-ikr23jx9t635.spock.replit.dev/nistai_url?pdf_url=${pdfUrl}`, {
          method: 'POST'        
        })

        setAnalysisStep(3)
        await sleep(5000);


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AnalysisResponse = await response.json()
        
        setAnalysisStep(4) // Analysis complete
        setResultData(data)
      } catch (error) {
        console.error('Error:', error)
        // Handle error
      }
    }
  }

  // function AnalysisResults({ data }: { data: AnalysisResponse }) {
  //   const { response } = data;
    
  //   return (
  //     <div className="space-y-6">
  //       {/* Header Section */}
  //       <Card className="bg-blue-600 text-white">
  //         <CardContent className="p-6">
  //           <h1 className="text-2xl font-bold mb-4">Security Analysis Report</h1>
  //           <p className="text-lg opacity-90">{response.executive_summary}</p>
  //         </CardContent>
  //       </Card>
  
  //       {/* Main Content Grid */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         {/* Security Risks */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center text-red-600">
  //               <AlertTriangle className="mr-2" /> Security Risks and Challenges
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <ul className="space-y-4">
  //               {response.security_risks.map((risk, index) => (
  //                 <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
  //                   <h3 className="font-semibold text-lg mb-2">{risk.title}</h3>
  //                   <ul className="list-disc pl-5 mb-2">
  //                     {risk.details.map((detail, detailIndex) => (
  //                       <li key={detailIndex}>{detail}</li>
  //                     ))}
  //                   </ul>
  //                   <p><strong>Impact:</strong> {risk.impact}</p>
  //                   <p><strong>Severity:</strong> {risk.severity}</p>
  //                 </li>
  //               ))}
  //             </ul>
  //           </CardContent>
  //         </Card>
  
  //         {/* Security Gaps */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center text-orange-600">
  //               <Shield className="mr-2" /> Security Gaps
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <ul className="space-y-4">
  //               {response.security_gaps.map((gap, index) => (
  //                 <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
  //                   <h3 className="font-semibold text-lg mb-2">{gap.area}</h3>
  //                   <p><strong>Current State:</strong> {gap.current_state}</p>
  //                   <p><strong>Required State:</strong> {gap.required_state}</p>
  //                   <p><strong>Priority:</strong> {gap.priority}</p>
  //                 </li>
  //               ))}
  //             </ul>
  //           </CardContent>
  //         </Card>
  //       </div>
  
  //       {/* NIST Scores */}
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="flex items-center text-blue-600">
  //             <Activity className="mr-2" /> NIST Framework Scores
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  //             {Object.entries(response.nist_framework_scores).map(([category, data], index) => {
  //               const getCategoryColor = (cat: string) => {
  //                 switch (cat.toLowerCase()) {
  //                   case 'recover': return '#7df49f';
  //                   case 'identify': return '#4BB2E0';
  //                   case 'protect': return '#918CEA';
  //                   case 'detect': return '#FAB746';
  //                   case 'respond': return '#E57676';
  //                   default: return '#4BB2E0'; // Default to Identify color
  //                 }
  //               };
                
  //               const categoryColor = getCategoryColor(category);
                
  //               return (
  //                 <Card key={index} className="bg-gray-50">
  //                   <CardContent className="p-4">
  //                     <h3 className="font-semibold mb-2 capitalize">{category}</h3>
  //                     <div className="flex space-x-1 mb-2">
  //                       {[1, 2, 3, 4, 5].map((n) => (
  //                         <div
  //                           key={n}
  //                           className={`h-2 w-full rounded ${
  //                             n <= parseInt(data.score) ? `bg-[${categoryColor}]` : 'bg-gray-200'
  //                           }`}
  //                           // style={{ backgroundColor: categoryColor }}
  //                         />
  //                       ))}
  //                     </div>
  //                     <div className="flex justify-between items-center mb-2">
  //                       <span className="text-sm font-medium">{data.score}/5</span>
  //                     </div>
  //                     <div className="text-sm text-gray-600 mt-2">
  //                       <strong>Findings:</strong>
  //                       <ul className="list-disc pl-5">
  //                         {data.findings.map((finding, findingIndex) => (
  //                           <li key={findingIndex}>{finding}</li>
  //                         ))}
  //                       </ul>
  //                       <strong>Key Gaps:</strong> {data.key_gaps}
  //                     </div>
  //                   </CardContent>
  //                 </Card>
  //               );
  //             })}
  //           </div>
  //         </CardContent>
  //       </Card>
  
  //       {/* Recommendations */}
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="flex items-center text-green-600">
  //             <ArrowRight className="mr-2" /> Recommendations
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             {response.recommendations.map((recommendation, index) => (
  //               <Card key={index} className="bg-green-50">
  //                 <CardContent className="p-4">
  //                   <h3 className="font-semibold mb-2">{recommendation.title}</h3>
  //                   <p><strong>Priority:</strong> {recommendation.priority}</p>
  //                   <p><strong>Implementation Complexity:</strong> {recommendation.implementation_complexity}</p>
  //                   <p><strong>Expected Impact:</strong> {recommendation.expected_impact}</p>
  //                 </CardContent>
  //               </Card>
  //             ))}
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  function AnalysisResults({ data }: { data: AnalysisResponse }) {
    const { response } = data;
    const [streamProgress, setStreamProgress] = useState(0);
    
    useEffect(() => {
      const totalSteps = 5; // Executive Summary, Security Risks, Security Gaps, NIST Scores, Recommendations
      const interval = setInterval(() => {
        setStreamProgress(prev => {
          if (prev < totalSteps) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1000); // Adjust this value to control the speed of the streaming effect
      
      return () => clearInterval(interval);
    }, []);

    const getCategoryColor = (cat: string) => {
      switch (cat.toLowerCase()) {
        case 'recover': return '#7df49f';
        case 'identify': return '#4BB2E0';
        case 'protect': return '#918CEA';
        case 'detect': return '#FAB746';
        case 'respond': return '#E57676';
        default: return '#4BB2E0'; // Default to Identify color
      }
    };

    return (
      <div className="space-y-6">
        {/* Header Section */}
        {streamProgress >= 1 && (
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4">Security Analysis Report</h1>
              <p className="text-lg opacity-90">{response.executive_summary}</p>
            </CardContent>
          </Card>
        )}
  
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Risks */}
          {streamProgress >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2" /> Security Risks and Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {response.security_risks.map((risk, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold text-lg mb-2">{risk.title}</h3>
                      <ul className="list-disc pl-5 mb-2">
                        {risk.details.map((detail, detailIndex) => (
                          <li key={detailIndex}>{detail}</li>
                        ))}
                      </ul>
                      <p><strong>Impact:</strong> {risk.impact}</p>
                      <p><strong>Severity:</strong> {risk.severity}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
  
          {/* Security Gaps */}
          {streamProgress >= 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Shield className="mr-2" /> Security Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {response.security_gaps.map((gap, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold text-lg mb-2">{gap.area}</h3>
                      <p><strong>Current State:</strong> {gap.current_state}</p>
                      <p><strong>Required State:</strong> {gap.required_state}</p>
                      <p><strong>Priority:</strong> {gap.priority}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
  
        {/* NIST Scores */}
        {streamProgress >= 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Activity className="mr-2" /> NIST Framework Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(response.nist_framework_scores).map(([category, data], index) => {
                  const categoryColor = getCategoryColor(category);
                  
                  return (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 capitalize">{category}</h3>
                        <div className="flex space-x-1 mb-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className={`h-2 w-full rounded ${
                                n <= parseInt(data.score)
                                ? categoryColor === "#7df49f"
                                   ? 'bg-custom-green'
                                   : categoryColor === "#4BB2E0"
                                   ? 'bg-custom-blue'
                                   : categoryColor === "#918CEA"
                                   ? 'bg-custom-purple'
                                   : categoryColor === "#FAB746"
                                   ? 'bg-custom-yellow'
                                   : 'bg-custom-red'
                                : 'bg-gray-200'
                              }`}
                              // style={{ backgroundColor: categoryColor }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{data.score}/5</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          <strong>Findings:</strong>
                          <ul className="list-disc pl-5">
                            {data.findings.map((finding, findingIndex) => (
                              <li key={findingIndex}>{finding}</li>
                            ))}
                          </ul>
                          <strong>Key Gaps:</strong> {data.key_gaps}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
  
        {/* Recommendations */}
        {streamProgress >= 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <ArrowRight className="mr-2" /> Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {response.recommendations.map((recommendation, index) => (
                  <Card key={index} className="bg-green-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{recommendation.title}</h3>
                      <p><strong>Priority:</strong> {recommendation.priority}</p>
                      <p><strong>Implementation Complexity:</strong> {recommendation.implementation_complexity}</p>
                      <p><strong>Expected Impact:</strong> {recommendation.expected_impact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const router = useRouter()

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
          {!isSidebarCollapsed && (
            <>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <span className="ml-3 font-medium" onClick={()=>{router.push("/profile")}}>John Doe</span>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Button>
            </>
          )}
          {isSidebarCollapsed && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <svg className="w-4 h-4 transform rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Welcome Card */}
          <Card className="bg-[#080415] text-white mb-6 overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-2">Compliance is Complex</h2>
                <p className="text-xl opacity-80">Let&apos;s simplify the terms...</p>
              </div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="mb-8 bg-indigo-100">
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
          {resultData ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <AnalysisResults data={resultData} />
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
  const router = useRouter()

  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded)
    } else {
      switch (label) {
        case 'Dashboard':
          router.push('/dashboard')
          break
        case 'Support':
          router.push('/')
          break
      }
    }
  }

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
  )
}

function SubMenuItem({ icon, label, isActive = false, isCollapsed = false }: SubMenuItemProps) {
  const router = useRouter()

  const handleClick = () => {
    switch (label) {
      case 'NISTAI':
        router.push('/nistai')
        break
    }
  }

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
  )
}

function ProcessStep({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 text-white bg-indigo-600 p-4 rounded-full">{icon}</div>
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