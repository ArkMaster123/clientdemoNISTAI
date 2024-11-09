import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf_file') as File | null;
    const pdfUrl = formData.get('pdf_url') as string | null;

    if (!pdfFile && !pdfUrl) {
      return NextResponse.json({ error: 'No PDF file or URL provided' }, { status: 400 });
    }

    let apiUrl = 'https://318aff70-02da-4da3-b9c1-5738277e6249-00-3pllg8z3mv4vc.riker.replit.dev/process';
    let body: FormData | URLSearchParams;

    if (pdfFile) {
      body = new FormData();
      body.append('pdf_file', pdfFile);
    } else {
      body = new URLSearchParams();
      body.append('pdf_url', pdfUrl as string);
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: body,
      headers: pdfUrl ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();

    return new NextResponse(result, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
  }
}