import { NextRequest, NextResponse } from 'next/server';

// Configure for edge runtime and longer duration
export const config = {
  runtime: 'edge',
  maxDuration: 60,
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('Starting PDF processing request');

  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf_file') as File | null;
    const pdfUrl = formData.get('pdf_url') as string | null;

    if (!pdfFile && !pdfUrl) {
      console.error('No PDF file or URL provided');
      return NextResponse.json({ error: 'No PDF file or URL provided' }, { status: 400 });
    }

    const apiUrl = 'https://318aff70-02da-4da3-b9c1-5738277e6249-00-3pllg8z3mv4vc.riker.replit.dev/process';
    let body: FormData | URLSearchParams;

    // Prepare request body
    if (pdfFile) {
      console.log(`Processing PDF file: ${pdfFile.name}`);
      body = new FormData();
      body.append('pdf_file', pdfFile);
    } else {
      console.log(`Processing PDF URL: ${pdfUrl}`);
      body = new URLSearchParams();
      body.append('pdf_url', pdfUrl as string);
    }

    // Make request to FastAPI backend
    console.log('Sending request to backend');
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: body,
      headers: pdfUrl ? { 
        'Content-Type': 'application/x-www-form-urlencoded',
      } : {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Read the streaming response
    console.log('Reading response stream');
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let finalResult = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode and accumulate the response chunks
        const chunk = decoder.decode(value, { stream: true });
        finalResult += chunk;
        
        console.log(`Received chunk of ${chunk.length} bytes`);
      }
    }

    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Processing completed in ${processingTime.toFixed(2)}s`);

    // Return the complete HTML response
    return new NextResponse(finalResult, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    const processingTime = (Date.now() - startTime) / 1000;
    console.error(`Error after ${processingTime.toFixed(2)}s:`, error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred while processing the request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
