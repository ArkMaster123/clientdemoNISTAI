import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('Starting PDF processing request');

  try {
    // Check if the API base URL is configured
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API base URL not configured');
    }

    // Initialize response variable
    let apiResponse: Response;
    const contentType = request.headers.get('content-type') || '';

    // Handle URL-based request vs File upload based on content type
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const pdfFile = formData.get('file') as File | null;

      if (!pdfFile) {
        return NextResponse.json(
          { error: 'No file provided in request' },
          { status: 400 }
        );
      }

      console.log(`Processing PDF file: ${pdfFile.name}`);
      
      // Create new FormData for the API request
      const apiFormData = new FormData();
      apiFormData.append('file', pdfFile);

      // Make request to file upload endpoint
      apiResponse = await fetch(`${baseUrl}/nistai`, {
        method: 'POST',
        body: apiFormData,
        headers: {
          'Accept': 'application/json'
        }
      });
    } else {
      // Handle URL-based request
      const body = await request.json();
      const pdfUrl = body.pdf_url;
      
      if (!pdfUrl) {
        return NextResponse.json(
          { error: 'No PDF URL provided in request body' },
          { status: 400 }
        );
      }

      console.log(`Processing PDF URL: ${pdfUrl}`);
      
      // Log the request details
      console.log('Base URL:', baseUrl);
      console.log('PDF URL:', pdfUrl);
      const apiUrl = `${baseUrl}/nistai_url?pdf_url=${encodeURIComponent(pdfUrl)}`;
      console.log('Full API URL:', apiUrl);

      // Make request to URL endpoint
      apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: ''
      });
    }

    console.log('Backend request completed');

    // Handle API response
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Backend error: ${errorText}`);
      return NextResponse.json(
        { error: `API request failed: ${errorText}` },
        { status: apiResponse.status }
      );
    }

    // Process successful response
    const responseData = await apiResponse.json();
    
    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Processing completed in ${processingTime.toFixed(2)}s`);

    // Return successful response
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });

  } catch (error) {
    const processingTime = (Date.now() - startTime) / 1000;
    console.error(`Error after ${processingTime.toFixed(2)}s:`, error);
    
    return NextResponse.json(
      {
        error: 'Request processing failed',
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
