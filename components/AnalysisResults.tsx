// components/AnalysisResults.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Activity, ArrowRight, Download, Shield } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { cn } from "@/lib/utils" 

export interface AnalysisResultsProps {
  htmlContent: string;
}

interface NistScore {
  category: string;
  score: number;
  description: string;
}




export function AnalysisResults({ htmlContent }: AnalysisResultsProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const extractContent = (html: string, tag: string, className = '') => {
    const regex = className 
      ? new RegExp(`<${tag}[^>]*class="${className}"[^>]*>(.*?)<\/${tag}>`, 'gs')
      : new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gs');
    const matches = html.match(regex);
    return matches ? matches.map(match => {
      return match.replace(/<[^>]*>/g, '').trim();
    }) : [];
  };

  // Parse the HTML content
  const originalTitle = extractContent(htmlContent, 'h1')[0];
  const title = originalTitle?.includes('Security Analysis') 
    ? originalTitle.substring(originalTitle.indexOf('Security Analysis'))
    : originalTitle;
  
  const summary = extractContent(htmlContent, 'p')[0];
  const allListItems = extractContent(htmlContent, 'li');
  const allParagraphs = extractContent(htmlContent, 'p');
  
  const firstNistScoreIndex = allListItems.findIndex(item => item.includes('/5'));
  const securityRisks = allListItems.slice(0, 6);
  const securityGaps = allListItems.slice(6, firstNistScoreIndex);
  
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

  const riskRating = allParagraphs.find(p => p.includes('Overall Risk Rating'))?.trim();
  
  const recommendations = extractContent(htmlContent, 'p', 'recommendations')[0]
    ?.replace('Priority recommendations:', '')
    .split('-')
    .filter(item => item.trim())
    .map(item => item.trim()) || [];

  const handleDownloadPDF = async () => {
    const element = document.getElementById('analysis-results');
    if (!element) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm'
      });

      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        0, 
        imgWidth, 
        imgHeight
      );

      pdf.save(`NIST-Security-Analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast notification here
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="analysis-results" className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      {/* Header with Download Button */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-2">{summary}</p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="flex items-center space-x-2"
        >
          {isGeneratingPdf ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download Report</span>
            </>
          )}
        </Button>
      </div>

      {/* Risk Level Indicator */}
      <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall Risk Level</h3>
              <p className="text-2xl font-bold mt-1">{riskRating?.split(':')[1] || 'N/A'}</p>
            </div>
            <AlertTriangle size={40} />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Risks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2" />
              Security Risks and Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {securityRisks.map((risk, index) => (
                <li key={index} className="flex items-start p-2 rounded-lg hover:bg-gray-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Security Gaps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-600">
              <Shield className="mr-2" />
              Security Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {securityGaps.map((gap, index) => (
                <li key={index} className="flex items-start p-2 rounded-lg hover:bg-gray-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{gap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* NIST Framework Scores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-blue-600">
            <Activity className="mr-2" />
            NIST Framework Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {nistScores.map(({ category, score, description }, index) => (
              <Card key={index} className="bg-gray-50 hover:bg-white transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <div className="flex space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "h-2 w-full rounded transition-colors",
                          n <= score ? 'bg-blue-600' : 'bg-gray-200'
                        )}
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
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-600">
              <ArrowRight className="mr-2" />
              Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((recommendation, index) => (
                <Card key={index} className="bg-green-50 hover:bg-green-100 transition-colors">
                  <CardContent className="p-4">
                    <p className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{recommendation}</span>
                    </p>
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