import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;
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

    const apiUrl = 'https://dd962088-bc71-4b84-abd1-8bbe309dfff0-00-ikr23jx9t635.spock.replit.dev/';

    let body: FormData | URLSearchParams;

    if (pdfFile) {
      console.log(`Processing PDF file: ${pdfFile.name}`);
      body = new FormData();
      body.append('pdf_file', pdfFile);
    } else {
      console.log(`Processing PDF URL: ${pdfUrl}`);
      body = new URLSearchParams();
      body.append('pdf_url', pdfUrl as string);
    }

    console.log('Sending request to backend');
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: body,
      headers: pdfUrl ? { 
        'Content-Type': 'application/x-www-form-urlencoded',
      } : {},
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.text();
    
    // Validate that the response is proper HTML
    if (!result.includes('<div class="analysis-container">')) {
      console.error('Invalid response format:', result);
      throw new Error('Invalid response format from backend');
    }

    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Processing completed in ${processingTime.toFixed(2)}s`);

    // Return the HTML response
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });

  } catch (error) {
    const processingTime = (Date.now() - startTime) / 1000;
    console.error(`Error after ${processingTime.toFixed(2)}s:`, error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'An error occurred while processing the request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime.toFixed(2)}s`
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        }
      }
    );
  }
}
