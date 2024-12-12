import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get the form data from the incoming request
    const formData = await request.formData()
    
    // Forward the request to the actual API
    const response = await fetch('https://dev.api.brain.whataidea.com/api/analysis/cyber-compliance', {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
