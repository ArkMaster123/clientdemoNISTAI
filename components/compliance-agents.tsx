'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Upload, FileText, File, Trash2, Shield } from 'lucide-react'
import { ReportDisplay } from './components/ReportDisplay'

const API_ENDPOINT = process.env.NEXT_PUBLIC_COMPLIANCE_API_ENDPOINT

export function ComplianceAgents() {
  const [files, setFiles] = useState<File[]>([])
  const [companyName, setCompanyName] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [reportData, setReportData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).filter(
        file => file.type === 'application/pdf' || file.type === 'application/json'
      )
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.type === 'application/json'
    )
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
    if (files.length === 0 || !companyName) return

    setIsProcessing(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('companyName', companyName)
    files.forEach((file, index) => {
      formData.append(`file${index}`, file)
    })

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.text()
      setReportData(result)
    } catch (error) {
      console.error('Error:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsProcessing(false)
      setUploadProgress(100)
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

      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analysis Progress</h3>
            <Progress value={uploadProgress} className="w-full mb-2" />
            <p className="text-sm text-gray-600">
              Analyzing company documents for cyber insurance compliance... This may take a few minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {reportData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cyber Insurance Compliance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportDisplay reportData={reportData} companyName={companyName} />
          </CardContent>
        </Card>
      )}

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

