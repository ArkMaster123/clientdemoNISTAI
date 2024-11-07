'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, FileText, Rocket, History, HelpCircle, User, LogOut, ChevronDown, Upload, Brain, ClipboardList } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const inter = Inter({ subsets: ['latin'] })

const navigationItems = [
  { name: 'Introduction', icon: Home, href: '#' },
  {
    name: 'Products',
    icon: Rocket,
    subItems: [
      { name: 'DocuSight', href: '#' },
      { name: 'CYBERAI', href: '#' },
      { name: 'NISTAI', href: '#', active: true },
    ]
  },
  { name: 'History', icon: History, href: '#' },
  { name: 'Support', icon: HelpCircle, href: '#' },
  { name: 'FAQ', icon: FileText, href: '#' },
  { name: 'Profile', icon: User, href: '#' },
]

export function BlockPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [openProducts, setOpenProducts] = useState(true)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      handleUpload(selectedFile)
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setAnalysisStep(1)

    try {
      // Simulate file upload
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // Simulate analysis steps
      for (let step = 2; step <= 4; step++) {
        setAnalysisStep(step)
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
      
      // Here you would normally send the file to your API and process the response
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setAnalysisStep(0)
    }
  }

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (url) {
      // Process URL submission
      console.log('URL submitted:', url)
    }
  }

  const SidebarContent = () => (
    <>
      <SidebarHeader className="h-[72px] flex items-center px-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600"></div>
          <span className="text-2xl font-semibold">whatAIdea</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              {item.subItems ? (
                <Collapsible open={openProducts} onOpenChange={setOpenProducts}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between pl-4">
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-12 space-y-1">
                    {item.subItems.map((subItem) => (
                      <SidebarMenuButton
                        key={subItem.name}
                        className={subItem.active ? 'bg-blue-50' : ''}
                      >
                        {subItem.name}
                      </SidebarMenuButton>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton className="pl-4">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="h-[72px] border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Doe</p>
                </div>
                <LogOut className="w-5 h-5" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )

  return (
    <div className={`flex h-screen bg-white ${inter.className}`}>
      <SidebarProvider>
        <Sidebar
          className={`hidden lg:flex border-r border-gray-200 ${
            isSidebarExpanded ? 'w-[280px]' : 'w-16'
          } transition-all duration-200 ease-in-out`}
        >
          <SidebarContent />
          <SidebarTrigger
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="absolute top-3 right-3"
          />
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <Card className="bg-blue-600 text-white mb-6">
              <CardContent className="p-8 relative">
                <h1 className="text-2xl font-semibold mb-2">Hi John Doe,</h1>
                <p className="text-lg">I am your AI-Powered NIST Compliance Engine</p>
                <Rocket className="absolute top-8 right-8 w-16 h-16 opacity-40" />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 mb-6">
              <CardContent className="p-6">
                <p>
                  Stop struggling with compliance documentation. NISTAI equips you with deep intelligence to achieve and maintain NIST compliance.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Upload className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Document Upload</h3>
                  <p>Upload your compliance documentation</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Brain className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                  <p>Let our AI analyze NIST alignment</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <ClipboardList className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Assessment Review</h3>
                  <p>Review detailed compliance assessment</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="url">Enter URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center h-60 flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-blue-600 mb-4" />
                        <p className="text-lg font-medium mb-2">
                          {file ? file.name : 'Choose or Drop File'}
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF up to 10MB
                        </p>
                      </label>
                    </div>
                  </TabsContent>
                  <TabsContent value="url">
                    <form onSubmit={handleUrlSubmit} className="space-y-4">
                      <Input
                        type="url"
                        placeholder="Enter document URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="h-11"
                      />
                      <Button type="submit" className="w-full">Submit URL</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {isUploading && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Analyzing Documentation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={analysisStep >= 1 ? 'text-blue-600' : ''}>
                        1. Uploading file...
                      </span>
                      {analysisStep === 1 && (
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                      )}
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                    <div className={analysisStep >= 2 ? 'text-blue-600' : ''}>
                      2. Processing document...
                    </div>
                    <div className={analysisStep >= 3 ? 'text-blue-600' : ''}>
                      3. Analyzing NIST compliance...
                    </div>
                    <div className={analysisStep >= 4 ? 'text-blue-600' : ''}>
                      4. Generating assessment...
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">Cancel</Button>
                </CardContent>
              </Card>
            )}

            {/* Results container would be rendered here */}
            {/* <Card className="mb-8">
              <CardContent className="p-6">
                <div dangerouslySetInnerHTML={{ __html: resultHtml }} />
              </CardContent>
            </Card> */}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}