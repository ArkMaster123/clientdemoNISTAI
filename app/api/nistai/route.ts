// app/api/nistai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { formatHTMLResponse } from '@/utils/formatHTMLResponse';
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Types
interface NISTAIResponse {
  html: string;
  raw?: string;
  metadata?: {
    processingTime: number;
    requestId: string;
  }
}

// Prompts
const SYSTEM_PROMPT = `You are an expert cybersecurity consultant specializing in NIST framework analysis. 
Provide detailed security assessments with clear justifications for all findings and scores.`;

const ANALYSIS_PROMPT = `Analyze this document comprehensively for security and compliance issues.
Structure your response in HTML format with the following specific sections:

1. SECURITY RISKS AND CHALLENGES
- Identify at least 6 specific security risks
- For each risk, explain the potential impact
- Categorize risks by severity (High/Medium/Low)

2. SECURITY GAPS
- Identify at least 4 major security control gaps
- For each gap, explain why it's significant
- Include specific recommendations to address each gap

3. NIST FRAMEWORK DETAILED ANALYSIS
For each NIST function, provide detailed analysis including:

a) IDENTIFY (/5)
- Asset Management assessment
- Business Environment analysis
- Governance structure evaluation
- Risk Assessment methodology review
- Detailed justification for score

b) PROTECT (/5)
- Access Control measures
- Data Security protocols
- Information Protection processes
- Protective Technology evaluation
- Detailed justification for score

c) DETECT (/5)
- Anomalies and Events monitoring
- Security Continuous Monitoring
- Detection Processes assessment
- Detailed justification for score

d) RESPOND (/5)
- Response Planning evaluation
- Communications assessment
- Analysis capabilities
- Mitigation measures
- Detailed justification for score

e) RECOVER (/5)
- Recovery Planning assessment
- Improvement recommendations
- Communications strategies
- Detailed justification for score

4. PRIORITY RECOMMENDATIONS
- List at least 5 specific, actionable recommendations
- Prioritize by impact and implementation effort
- Include estimated implementation timeframes
- Provide success metrics for each recommendation

5. OVERALL RISK RATING
- Provide a final risk rating (High/Medium/Low)
- Include detailed justification for the rating
- List key factors influencing the rating`;

export async function POST(request: NextRequest) {
  const requestId = new Date().toISOString();
  console.log(`[${requestId}] Starting new NISTAI analysis`);
  
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf_file') as File | null;
    const pdfUrl = formData.get('pdf_url') as string | null;
    const shouldStream = formData.get('stream') === 'true';

    if (!pdfFile && !pdfUrl) {
      return NextResponse.json(
        { error: 'No PDF file or URL provided' },
        { status: 400 }
      );
    }

    // Convert PDF to base64
    let pdfBase64: string;
    try {
      if (pdfFile) {
        console.log(`[${requestId}] Processing uploaded file`);
        const buffer = await pdfFile.arrayBuffer();
        pdfBase64 = Buffer.from(buffer).toString('base64');
      } else {
        console.log(`[${requestId}] Downloading PDF from URL`);
        const response = await fetch(pdfUrl as string);
        const buffer = await response.arrayBuffer();
        pdfBase64 = Buffer.from(buffer).toString('base64');
      }
    } catch (error) {
      console.error(`[${requestId}] Error processing PDF:`, error);
      return NextResponse.json(
        { error: 'Error processing PDF file' },
        { status: 400 }
      );
    }

    if (shouldStream) {
      console.log(`[${requestId}] Initiating streaming response`);
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      
      const messageStream = await anthropic.beta.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        betas: ["pdfs-2024-09-25"],
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64
              }
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT
            }
          ]
        }],
        stream: true
      });

      (async () => {
        try {
          for await (const chunk of messageStream) {
            if ('type' in chunk && 
                chunk.type === 'content_block_delta' && 
                chunk.delta && 
                typeof chunk.delta === 'object' &&
                'text' in chunk.delta &&
                typeof chunk.delta.text === 'string') {
              await writer.write(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (error) {
          console.error(`[${requestId}] Stream error:`, error);
          await writer.write(
            new TextEncoder().encode(
              '<div class="error">Analysis interrupted. Please try again.</div>'
            )
          );
        } finally {
          await writer.close();
        }
      })();

      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    } else {
      console.log(`[${requestId}] Processing regular request`);
      const startTime = Date.now();
      
      const response = await anthropic.beta.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        betas: ["pdfs-2024-09-25"],
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64
              }
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT
            }
          ]
        }]
      });

      const processingTime = Date.now() - startTime;
      console.log(`[${requestId}] Request completed in ${processingTime}ms`);

      // Extract text content safely
      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => ('text' in block ? block.text : ''))
        .join('');

      const result: NISTAIResponse = {
        html: textContent,
        metadata: {
          processingTime,
          requestId
        }
      };

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

// Utility function for frontend use
// export function formatHTMLResponse(content: string): string {
//   if (!content.includes('<h1>')) {
//     return `
//       <h1>Security Analysis Report</h1>
//       <div class="analysis-content">
//         ${content}
//       </div>
//     `;
//   }
//   return content;
// }