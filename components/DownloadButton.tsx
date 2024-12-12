import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

export function DownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleDownload = async (format: string) => {
    setIsDownloading(true)
    setDownloadProgress(0)

    // Simulate download progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setDownloadProgress(i)
    }

    // Simulate successful download
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadProgress(0)
      alert(`Report downloaded successfully in ${format} format`)
    }, 500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleDownload('PDF')}>PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('Word')}>Word</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('HTML')}>HTML</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('Markdown')}>Markdown</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

