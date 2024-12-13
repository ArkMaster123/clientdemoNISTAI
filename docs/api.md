# NIST AI Security Assessment API Documentation

## Base URL
```
http://localhost:8080
```

## Endpoints

### Upload PDF File
`POST /nistai`

Upload and analyze a PDF document directly.

#### Request
- Method: POST
- Content-Type: multipart/form-data
- Body Parameter: 
  - `file`: PDF file (max 10MB)

#### Example
```bash
curl -X POST -F "file=@document.pdf" http://localhost:8080/nistai
```

### Analyze PDF from URL
`POST /nistai`

Analyze a PDF document from a URL.

#### Request
- Method: POST
- Content-Type: application/json
- Body:
```json
{
    "pdf_url": "https://example.com/document.pdf"
}
```

#### Example
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"pdf_url":"https://example.com/document.pdf"}' \
  http://localhost:8080/nistai
```

### Response Format

Both endpoints return the same JSON response structure:

```json
{
    "response": {
        "executive_summary": "string",
        "security_risks": [
            {
                "title": "string",
                "details": ["string"],
                "impact": "string",
                "severity": "string"
            }
        ],
        "nist_framework_scores": {
            "identify": {
                "score": "number",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "protect": {
                "score": "number",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "detect": {
                "score": "number",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "respond": {
                "score": "number",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "recover": {
                "score": "number",
                "findings": ["string"],
                "key_gaps": "string"
            }
        },
        "recommendations": [
            {
                "title": "string",
                "priority": "string",
                "implementation_complexity": "string",
                "expected_impact": "string"
            }
        ]
    }
}
```

### Error Responses

#### 400 Bad Request
```json
{
    "error": "Invalid request format or missing required fields"
}
```

#### 404 Not Found
```json
{
    "error": "Resource not found"
}
```

#### 413 Payload Too Large
```json
{
    "error": "File size exceeds maximum limit of 10MB"
}
```

#### 415 Unsupported Media Type
```json
{
    "error": "Unsupported file format. Only PDF files are accepted"
}
```

#### 500 Internal Server Error
```json
{
    "error": "Internal server error",
    "details": "Error details if available"
}
```

## Rate Limiting

- Maximum 100 requests per hour per IP address
- Maximum file size: 10MB
- Supported file format: PDF only

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:
- Allowed origins: All
- Allowed methods: POST
- Allowed headers: Content-Type, Accept
- Max age: 600 seconds

## Authentication

Currently, the API does not require authentication. However, rate limiting is applied based on IP address.

## Best Practices

1. Always check response status codes
2. Implement proper error handling
3. Respect rate limits
4. Keep PDF files under 10MB
5. Use secure HTTPS URLs for PDF submission
