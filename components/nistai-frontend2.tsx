// app/nistai/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowRight, Brain, ClipboardList, Shield, Upload } from 'lucide-react'
import { SideNav } from '@/components/SideNav'
import { AnalysisResults } from '@/components/AnalysisResults'

interface AnalysisState {
  file: File | null;
  url: string;
  isStreaming: boolean;
  isPending: boolean;
  error: string | null;
}

export default function NISTAIPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    file: null,
    url: '',
    isStreaming: false,
    isPending: false,
    error: null
  });
  const [resultHtml, setResultHtml] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      }
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAnalysisState(prev => ({ ...prev, file, error: null }));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setAnalysisState(prev => ({ ...prev, file, error: null }));
    }
  };

  const handleAnalysis = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!analysisState.file && !analysisState.url) {
      setAnalysisState(prev => ({ 
        ...prev, 
        error: 'Please provide a PDF file or URL' 
      }));
      return;
    }

    setAnalysisState(prev => ({ ...prev, isPending: true, error: null }));
    setResultHtml(null);

    const formData = new FormData();
    if (analysisState.file) {
      formData.append('pdf_file', analysisState.file);
    } else if (analysisState.url) {
      formData.append('pdf_url', analysisState.url);
    }
    formData.append('stream', analysisState.isStreaming.toString());

    try {
      if (analysisState.isStreaming) {
        const response = await fetch('/api/nistai', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let content = '';
        
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          content += chunk;
          setResultHtml(content);
        }
      } else {
        const response = await fetch('/api/nistai', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setResultHtml(result.html);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisState(prev => ({ 
        ...prev, 
        error: 'An error occurred during analysis. Please try again.' 
      }));
    } finally {
      setAnalysisState(prev => ({ ...prev, isPending: false }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-6">
          {/* Header */}
          <Card className="bg-[#080415] text-white">
            <CardContent className="p-8 relative">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-2">NIST Compliance Analysis</h2>
                <p className="text-xl opacity-80">AI-powered security assessment</p>
              </div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Upload />, title: "Upload", desc: "Provide your document" },
              { icon: <Brain />, title: "Analyze", desc: "AI assessment" },
              { icon: <Shield />, title: "Insights", desc: "Security recommendations" }
            ].map(({ icon, title, desc }) => (
              <Card key={title} className="bg-white">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    {icon}
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upload Interface */}
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                  <TabsTrigger value="url">URL Input</TabsTrigger>
                </TabsList>

                <TabsContent value="file">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                      "hover:border-blue-500 cursor-pointer bg-white",
                      analysisState.error ? "border-red-500" : "border-gray-300"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf"
                    />
                    
                    <div className="mb-6">
                      <Upload className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {analysisState.file ? analysisState.file.name : "Choose or Drop PDF"}
                      </p>
                      <p className="text-sm text-gray-500">Maximum size: 32MB</p>
                    </div>

                    {analysisState.error && (
                      <div className="text-red-500 text-sm mb-4">
                        {analysisState.error}
                      </div>
                    )}

                    {analysisState.file && (
                      <div className="space-y-4 max-w-sm mx-auto">
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="checkbox"
                            id="streaming"
                            checked={analysisState.isStreaming}
                            onChange={(e) => setAnalysisState(prev => ({
                              ...prev,
                              isStreaming: e.target.checked
                            }))}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="streaming" className="text-sm text-gray-600">
                            Enable streaming analysis
                          </label>
                        </div>

                        <Button
                          className="w-full"
                          onClick={handleAnalysis}
                          disabled={analysisState.isPending}
                        >
                          {analysisState.isPending ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                              Analyzing...
                            </div>
                          ) : (
                            'Start Analysis'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="url">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter PDF URL"
                        value={analysisState.url}
                        onChange={(e) => setAnalysisState(prev => ({
                          ...prev,
                          url: e.target.value
                        }))}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAnalysis}
                        disabled={analysisState.isPending}
                      >
                        {analysisState.isPending ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                            Analyzing
                          </div>
                        ) : (
                          'Analyze'
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="streaming-url"
                        checked={analysisState.isStreaming}
                        onChange={(e) => setAnalysisState(prev => ({
                          ...prev,
                          isStreaming: e.target.checked
                        }))}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="streaming-url" className="text-sm text-gray-600">
                        Enable streaming analysis
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {resultHtml && (
            <AnalysisResults 
              htmlContent={resultHtml}
              onDownload={() => {/* PDF download logic */}}
            />
          )}
        </div>
      </main>
    </div>
  );
}