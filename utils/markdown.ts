/**
 * Converts Markdown text to HTML
 * Handles:
 * - Links [text](url)
 * - Line breaks (\n)
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Remove bold formatting (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '$1');

  // Handle multiple consecutive line breaks - replace with a single <br>
  html = html.replace(/\n{2,}/g, '<br />');

  // Convert remaining single line breaks to <br> tags
  html = html.replace(/\n/g, '<br />');

  // Convert links: [text](url) to <a href="url">text</a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return html;
}
