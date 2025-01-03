'use client'

import React, { useState, useRef } from 'react'
import { Sidebar } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { 
  AlertTriangle, 
  Upload, 
  FileText, 
  File, 
  Trash2, 
  Shield,
  CheckCircle,
  Activity,
  ArrowRight,
  Brain
} from 'lucide-react'

const API_ENDPOINT = "/api/cyber-analysis"

interface UploadProgress {
  [filename: string]: number
}

interface UploadStatus {
  [filename: string]: 'pending' | 'uploading' | 'completed' | 'failed'
}

export function ComplianceAgents() {
  const [files, setFiles] = useState<File[]>([])
  const [companyName, setCompanyName] = useState('')
  const [reportData, setReportData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fileUploadProgress, setFileUploadProgress] = useState<Record<string, number>>({})
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  type ProgressStage = 'ready' | 'uploading' | 'validating' | 'processing' | 'completed' | 'error';
  const [stage, setStage] = useState<ProgressStage>('ready')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetForm = () => {
    setFiles([])
    setCompanyName('')
    setReportData(null)
    setFileUploadProgress({})
    setProcessingProgress(0)
    setStage('ready')
    setIsProcessing(false)
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/json']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type for ${file.name}. Only PDF and JSON files are allowed.`)
    }

    if (file.size > maxSize) {
      throw new Error(`File size exceeds the 10MB limit for ${file.name}.`)
    }
  }

  const updateUploadProgress = (fileName: string, progress: number) => {
    setFileUploadProgress(prev => ({...prev, [fileName]: progress}))
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const simulateProgress = async (
    stage: ProgressStage,
    duration: number,
    startPercent: number,
    endPercent: number
  ) => {
    const steps = (endPercent - startPercent);
    const stepDuration = duration / steps;
    
    for (let i = startPercent; i <= endPercent; i++) {
      setProcessingProgress(i);
      await delay(stepDuration);
    }
  }

  const simulateFileUpload = async (file: File) => {
    const duration = 3000; // 3 seconds per file
    const steps = 100;
    const stepDuration = duration / steps;
    
    for (let progress = 0; progress <= 100; progress++) {
      setFileUploadProgress(prev => ({
        ...prev,
        [file.name]: progress
      }));
      await delay(stepDuration);
    }
  }

  const simulateProcessingStages = async (stages: Array<{duration: number, start: number, end: number}>) => {
    for (const stage of stages) {
      await simulateProgress('processing', stage.duration, stage.start, stage.end);
    }
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      newFiles.forEach(validateFile)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    droppedFiles.forEach(validateFile)
    setFiles(prevFiles => [...prevFiles, ...droppedFiles])
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const analyzeFiles = async () => {
    if (files.length === 0 || !companyName) return;
    
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProcessingProgress(0);
      
      // Initial upload state
      setStage('uploading');
      
      // Initialize progress for each file
      const initialProgress = {};
      files.forEach(file => {
        initialProgress[file.name] = 0;
      });
      setFileUploadProgress(initialProgress);

      // File validation phase
      setStage('validating');
      await simulateProgress('validating', 2000, 0, 10);

      // Upload phase
      setStage('uploading');
      for (const file of files) {
        await simulateFileUpload(file);
      }

      const formData = new FormData();
      formData.append('companyName', companyName);
      files.forEach(file => {
        formData.append('files', file);
      });

      // Processing phase
      setStage('processing');
      await simulateProcessingStages([
        { duration: 10000, start: 10, end: 30 }, // Initial analysis
        { duration: 15000, start: 30, end: 60 }, // Deep processing
        { duration: 10000, start: 60, end: 85 }, // Final analysis
        { duration: 5000, start: 85, end: 95 }   // Report generation
      ]);
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Small delay before showing results for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage('completed');
      
      // Process consolidated response with source attribution
      const reportContent = result.response.response;
      const sourceInfo = buildSourceAttribution(result.response.sources);
      const fullReport = `${reportContent}\n\n## Source Documents\n${sourceInfo}`;
      
      setReportData(fullReport);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("There was an error uploading your files. Please try again.");
      setStage('error');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        {/* Welcome Card with Animation */}
        <Card className="bg-[#080415] text-white mb-6 overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-2">Compliance in Seconds</h2>
              <p className="text-xl opacity-80">Let&apos;s clarify the state...</p>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <ProcessStep 
            icon={<Upload size={24} />} 
            title="Document Upload" 
            description="Upload your compliance documentation" 
          />
          <ProcessStep 
            icon={<Brain size={24} />} 
            title="AI Assessment" 
            description="Let our AI assess your compliance status" 
          />
          <ProcessStep 
            icon={<FileText size={24} />} 
            title="Report Ready" 
            description="Review your detailed compliance report" 
          />
        </div>

        <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Company Documents for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full"
            />
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.json"
              multiple
            />
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Click to upload or drag and drop company documents
            </p>
            <p className="text-sm text-gray-500">
              Upload questionnaires, cyber incident response plans, and other relevant documents (PDF, JSON)
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Uploaded Files:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div className="flex items-center">
                      {file.type === 'application/pdf' ? (
                        <FileText size={20} className="mr-2 text-red-500" />
                      ) : (
                        <File size={20} className="mr-2 text-blue-500" />
                      )}
                      <span>{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className="mt-4"
            onClick={analyzeFiles}
            disabled={files.length === 0 || !companyName || isProcessing}
          >
            {isProcessing ? 'Analyzing...' : 'Analyze Compliance'}
          </Button>
        </CardContent>
      </Card>

      {errorMessage && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle size={24} />
              <p>{errorMessage}</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setErrorMessage(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {isProcessing && stage !== 'ready' && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {stage !== 'completed' && (
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <h3 className="text-lg font-semibold">
                  {stage === 'uploading' && 'Uploading Files'}
                  {stage === 'validating' && 'Validating Documents'}
                  {stage === 'processing' && 'Processing Documents'}
                  {stage === 'completed' && 'Analysis Complete'}
                </h3>
              </div>

              {stage !== 'completed' && (
                <Progress 
                  value={processingProgress} 
                  className="w-full transition-all duration-300 ease-in-out" 
                />
              )}

              <p className="text-sm text-gray-600 transition-opacity duration-200">
                {stage === 'uploading' && 'Uploading your documents...'}
                {stage === 'validating' && 'Validating document format and content...'}
                {stage === 'processing' && (
                  <>
                    {processingProgress < 30 && "Initializing analysis..."}
                    {processingProgress >= 30 && processingProgress < 60 && "Analyzing compliance requirements..."}
                    {processingProgress >= 60 && processingProgress < 85 && "Evaluating security controls..."}
                    {processingProgress >= 85 && "Generating final report..."}
                    {" "}{Math.round(processingProgress)}%
                  </>
                )}
                {stage === 'completed' && 'Analysis complete!'}
              </p>

              {stage === 'uploading' && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.name} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          {file.name}
                        </span>
                        <span>{Math.round(fileUploadProgress[file.name])}%</span>
                      </div>
                      <Progress 
                        value={fileUploadProgress[file.name]} 
                        className="w-full transition-all duration-300" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Display */}
      {reportData && !isProcessing && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cyber Insurance Compliance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportDisplay reportData={reportData} companyName={companyName} />
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={resetForm}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Start New Analysis
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!reportData && !isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-blue-600">
              <Shield size={24} />
              <p>Upload company documents to assess cyber insurance policy compliance and receive recommendations.</p>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}

interface ReportDisplayProps {
  reportData: string
  companyName: string
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

function buildSourceAttribution(sources: any[]) {
  const usedSources = new Map<string, Set<string>>()
  
  sources.forEach(source => {
    source.raw_output.source_nodes.forEach((node: any) => {
      if (node.node.metadata?.file_name) {
        const key = node.node.metadata.file_name
        if (!usedSources.has(key)) {
          usedSources.set(key, new Set())
        }
        if (node.node.metadata.page_label) {
          usedSources.get(key)?.add(node.node.metadata.page_label)
        }
      }
    })
  })

  return Array.from(usedSources.entries())
    .map(([file, pages]) => {
      const pageList = Array.from(pages).sort((a, b) => Number(a) - Number(b)).join(', ')
      return `- ${file} (Pages: ${pageList})`
    })
    .join('\n')
}

function ReportDisplay({ reportData, companyName }: ReportDisplayProps) {
  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'executive summary':
        return <FileText className="mr-2" />
      case 'compliance status':
        return <CheckCircle className="mr-2" />
      case 'risk assessment':
        return <AlertTriangle className="mr-2" />
      case 'policy gaps':
        return <Activity className="mr-2" />
      case 'recommendations':
        return <ArrowRight className="mr-2" />
      default:
        return <Shield className="mr-2" />
    }
  }

  const getComplianceStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Compliant</Badge>
      case 'partially compliant':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Partially Compliant</Badge>
      case 'non-compliant':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Non-Compliant</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="mb-4">
        <CardContent className="p-4">
          <h1 className="text-2xl font-bold flex items-center mb-2">
            <Shield className="mr-2" />
            Cyber Insurance Compliance Report for {companyName}
          </h1>
          <p className="text-gray-600">Assessment Date: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <ReactMarkdown
        components={{
          h1: ({node, children, ...props}) => (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold flex items-center">
                  {getIcon(String(children))}
                  {children}
                </h2>
              </CardContent>
            </Card>
          ),
          h2: ({node, children, ...props}) => (
            <h3 className="text-lg font-semibold mt-4 mb-2" {...props}>
              {children}
            </h3>
          ),
          h3: ({node, children, ...props}) => (
            <h4 className="text-md font-semibold mt-3 mb-1" {...props}>
              {children}
            </h4>
          ),
          p: ({node, children, ...props}) => (
            <p className="mb-4" {...props}>
              {children}
            </p>
          ),
          ul: ({node, children, ...props}) => (
            <ul className="list-disc pl-5 mb-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({node, children, ...props}) => (
            <ol className="list-decimal pl-5 mb-4" {...props}>
              {children}
            </ol>
          ),
          li: ({node, children, ...props}) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          ),
          blockquote: ({node, children, ...props}) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>
              {children}
            </blockquote>
          ),
          code({node, inline, className, children, ...props}: {
            node?: any;
            inline?: boolean;
            className?: string;
            children: React.ReactNode;
            [key: string]: any;
          }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vs}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
                {children}
              </code>
            )
          },
          table: ({node, children, ...props}) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({node, children, ...props}) => (
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
              {children}
            </th>
          ),
          td: ({node, children, ...props}) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props}>
              {children}
            </td>
          ),
          strong: ({node, children}) => {
            const content = String(children)
            if (content.toLowerCase().includes('status:')) {
              const status = content.split(':')[1].trim()
              return (
                <strong>
                  Status: {getComplianceStatus(status)}
                </strong>
              )
            }
            return <strong>{children}</strong>
          },
        }}
        className="markdown-content"
      >
        {reportData}
      </ReactMarkdown>
    </div>
  )
}
