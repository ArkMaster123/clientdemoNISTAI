// utils/formatHTMLResponse.ts
export function formatHTMLResponse(content: string): string {
    if (!content.includes('<h1>')) {
      return `
        <h1>Security Analysis Report</h1>
        <div class="analysis-content">
          ${content}
        </div>
      `;
    }
    return content;
  }
  