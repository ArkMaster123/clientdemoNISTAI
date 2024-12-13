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

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API base URL not configured');
    }
    
    let apiResponse: Response;

    if (pdfFile) {
      console.log(`Processing PDF file: ${pdfFile.name}`);
      const formData = new FormData();
      formData.append('pdf_file', pdfFile);
      
      apiResponse = await fetch(`${baseUrl}/nistai`, {
        method: 'POST',
        body: formData
      });
    } else {
      console.log(`Processing PDF URL: ${pdfUrl}`);
      apiResponse = await fetch(`${baseUrl}/nistai_url?pdf_url=${encodeURIComponent(pdfUrl as string)}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });
    }

    console.log('Backend request completed');

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Backend error: ${errorText}`);
      throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
    }

    const result = await apiResponse.text();
    
    // Parse and validate JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(result);
      if (!jsonResponse.response || !jsonResponse.response.executive_summary) {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to parse response:', result);
      throw new Error('Invalid JSON response from backend');
    }

    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Processing completed in ${processingTime.toFixed(2)}s`);

    // Return the JSON response
    return NextResponse.json(jsonResponse, {
      headers: {
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
