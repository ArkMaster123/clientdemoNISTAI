# NIST AI Security Assessment API Documentation

## Base URL
The API is available at your configured base URL, for example:
```
https://your-domain.replit.dev
```

## Endpoints

### 1. Upload PDF File
`POST /nistai`

Upload and analyze a PDF document directly.

#### Request
- Method: POST
- Content-Type: multipart/form-data
- Body Parameter: 
  - `file`: PDF file (max 10MB)

#### Example
```bash
curl -X POST \
  -H "Accept: application/json" \
  -F "file=@document.pdf" \
  https://your-domain.replit.dev/nistai
```

### 2. Analyze PDF from URL
`POST /nistai_url`

Analyze a PDF document from a URL.

#### Request
- Method: POST
- Headers:
  - Accept: application/json
- Query Parameter:
  - `pdf_url`: URL of the PDF document (URL encoded)
- Body: Empty ('')

#### Example
```bash
curl -X 'POST' \
  'https://your-domain.replit.dev/nistai_url?pdf_url=https%3A%2F%2Fexample.com%2Fdocument.pdf' \
  -H 'accept: application/json' \
  -d ''
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
        "security_gaps": [
            {
                "area": "string",
                "current_state": "string",
                "required_state": "string",
                "priority": "string"
            }
        ],
        "nist_framework_scores": {
            "identify": {
                "score": "string",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "protect": {
                "score": "string",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "detect": {
                "score": "string",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "respond": {
                "score": "string",
                "findings": ["string"],
                "key_gaps": "string"
            },
            "recover": {
                "score": "string",
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
    "detail": "No PDF URL provided." // or other validation errors
}
```

#### 404 Not Found
```json
{
    "detail": "Resource not found"
}
```

#### 405 Method Not Allowed
```json
{
    "detail": "Method Not Allowed"
}
```

#### 422 Validation Error
```json
{
    "detail": [
        {
            "loc": ["string"],
            "msg": "string",
            "type": "string"
        }
    ]
}
```

#### 500 Internal Server Error
```json
{
    "detail": "An unexpected error occurred."
}
```

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:
- Allowed origins: All (`"*"`)
- Allowed credentials: True
- Allowed methods: All (`"*"`)
- Allowed headers: All (`"*"`)

## Important Notes

1. For URL-based analysis:
   - The URL must be provided as a query parameter, not in the request body
   - The request body should be empty
   - The URL must be properly URL-encoded

2. For file uploads:
   - Use multipart/form-data format
   - The file field name must be 'file'
   - Only PDF files are supported

3. Response Handling:
   - Always check the response status code
   - Parse the JSON response carefully
   - Handle errors appropriately

4. Both endpoints return the same response structure
   - The response includes executive summary, security risks, gaps, NIST scores, and recommendations
   - All scores in the NIST framework are strings, not numbers
