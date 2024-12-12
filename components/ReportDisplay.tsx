import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Activity, ArrowRight, FileText, CheckCircle, XCircle, Shield } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ReportDisplayProps {
  reportData: string
  companyName: string
}

export function ReportDisplay({ reportData, companyName }: ReportDisplayProps) {
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
          h1: ({node, ...props}) => (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold flex items-center" {...props}>
                  {getIcon(props.children as string)}
                  {props.children}
                </h2>
              </CardContent>
            </Card>
          ),
          h2: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
          h3: ({node, ...props}) => <h4 className="text-md font-semibold mt-3 mb-1" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
          ),
          code({node, inline, className, children, ...props}: {
            node?: any;
            inline?: boolean;
            className?: string;
            children: React.ReactNode;
          }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
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
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200" {...props} />
            </div>
          ),
          th: ({node, ...props}) => (
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />
          ),
          strong: ({node, ...props}) => {
            const content = props.children as string
            if (content.toLowerCase().includes('status:')) {
              const status = content.split(':')[1].trim()
              return (
                <strong {...props}>
                  Status: {getComplianceStatus(status)}
                </strong>
              )
            }
            return <strong {...props} />
          },
        }}
        className="markdown-content"
      >
        {reportData}
      </ReactMarkdown>
    </div>
  )
}

