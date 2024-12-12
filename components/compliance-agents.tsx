'use client'


import React, { useState, useRef } from 'react'
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
  ArrowRight
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

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    setUploadProgress(prev => ({...prev, [fileName]: progress}))
  }

  const updateUploadStatus = (fileName: string, status: 'pending' | 'uploading' | 'completed' | 'failed') => {
    setUploadStatus(prev => ({...prev, [fileName]: status}))
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
    if (files.length === 0) return
    setIsProcessing(true)
    setErrorMessage(null)
    
    // Initialize progress tracking
    const initialProgress = {}
    const initialStatus = {}
    files.forEach(file => {
      initialProgress[file.name] = 0
      initialStatus[file.name] = 'pending'
    })
    setUploadProgress(initialProgress)
    setUploadStatus(initialStatus)

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', API_ENDPOINT)
      
      // Set required headers
      xhr.setRequestHeader('accept', 'application/json')
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          files.forEach(file => {
            updateUploadProgress(file.name, progress)
            updateUploadStatus(file.name, 'uploading')
          })
        }
      }

      xhr.onerror = () => {
        files.forEach(file => {
          updateUploadStatus(file.name, 'failed')
        })
        setErrorMessage("Network error occurred while uploading files. Please try again.")
      }

      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            setReportData(response)
            files.forEach(file => {
              updateUploadProgress(file.name, 100)
              updateUploadStatus(file.name, 'completed')
            })
          } catch (error) {
            setErrorMessage("Invalid response format from server")
            files.forEach(file => updateUploadStatus(file.name, 'failed'))
          }
        } else {
          let errorMessage = "Server error occurred"
          try {
            const errorData = JSON.parse(xhr.responseText)
            errorMessage = errorData.message || errorMessage
          } catch (e) {
            // Use default error message if response isn't valid JSON
          }
          setErrorMessage(errorMessage)
          files.forEach(file => updateUploadStatus(file.name, 'failed'))
        }
      }

      xhr.send(formData)
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage("There was an error uploading your files. Please try again.")
      const failedStatus = {}
      files.forEach(file => {
        failedStatus[file.name] = 'failed'
      })
      setUploadStatus(failedStatus)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cyber Insurance Compliance Assessment</h1>
      
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

      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
            {files.map((file) => (
              <div key={file.name} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {file.name}
                  </span>
                  <Badge
                    variant={uploadStatus[file.name] === 'failed' ? 'destructive' : 'secondary'}
                  >
                    {uploadStatus[file.name]}
                  </Badge>
                </div>
                <Progress value={uploadProgress[file.name]} className="w-full" />
              </div>
            ))}
            <p className="text-sm text-gray-600 mt-4">
              Analyzing company documents for cyber insurance compliance... This may take a few minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {reportData && !isProcessing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cyber Insurance Compliance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportDisplay reportData={reportData} companyName={companyName} />
          </CardContent>
        </Card>
      )}

      {/* Progress Tracking */}
      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
            {files.map((file) => (
              <div key={file.name} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {file.name}
                  </span>
                  <Badge
                    variant={uploadStatus[file.name] === 'failed' ? 'destructive' : 'secondary'}
                  >
                    {uploadStatus[file.name]}
                  </Badge>
                </div>
                <Progress value={uploadProgress[file.name]} className="w-full" />
              </div>
            ))}
            <p className="text-sm text-gray-600 mt-4">
              Analyzing company documents for cyber insurance compliance... This may take a few minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Display */}
      {reportData && !isProcessing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cyber Insurance Compliance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportDisplay reportData={reportData} companyName={companyName} />
          </CardContent>
        </Card>
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
  )
}

interface ReportDisplayProps {
  reportData: string
  companyName: string
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
          code({node, inline, className, children, ...props}) {
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
