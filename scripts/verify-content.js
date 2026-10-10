/**
 * verify-content.js
 * 
 * Content-integrity test for SimpLeads Tool Pages.
 * Asserts that every original string from toolsData.js appears verbatim
 * in the exact same order in the final rendered page source.
 * 
 * Usage: node verify-content.js
 * 
 * NOTE: For full integration, this would use a tool like Puppeteer, Playwright, 
 * or Cheerio on the built static HTML files. For this example, we demonstrate 
 * the assertion logic against a mocked or statically loaded DOM payload.
 */

const assert = require('assert');

// In a real test, this would be imported from the actual toolsData.js
// const { toolsData } = require('../app/features/toolsData');

console.log('Running SEO Content Integrity Check...');

function extractTextNodes(htmlString) {
  // Simple extraction for demonstration. 
  // In production: const $ = cheerio.load(htmlString); return $('body').text();
  return htmlString.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function verifyStringsInOrder(sourceData, renderedHTML) {
  const pageText = extractTextNodes(renderedHTML);
  let currentIndex = 0;

  const checkString = (str) => {
    // Clean string (e.g., removing HTML tags if present in the JSON source)
    const cleanStr = str.replace(/<[^>]+>/g, '').trim();
    if (!cleanStr) return;

    const foundIndex = pageText.indexOf(cleanStr, currentIndex);
    if (foundIndex === -1) {
      throw new Error(\`SEO INTEGRITY FAILURE: Could not find string verbatim or out of order: "\${cleanStr}"\`);
    }
    currentIndex = foundIndex + cleanStr.length;
  };

  // Traverse JSON structure
  const traverse = (obj) => {
    if (typeof obj === 'string') {
      checkString(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (obj !== null && typeof obj === 'object') {
      // Exclude structural keys that aren't rendered text (like layout, scene, tag, accent)
      const keysToIgnore = ['layout', 'scene', 'tag', 'accent', 'metaTitle', 'metaDescription'];
      for (const key of Object.keys(obj)) {
        if (!keysToIgnore.includes(key)) {
          traverse(obj[key]);
        }
      }
    }
  };

  traverse(sourceData);
}

console.log('✔ Verification script prepared. Integrate with your CI/CD pipeline against the static build output.');
// example: verifyStringsInOrder(toolsData['youtube-lead-scraper'], fetchHtmlFor('/features/youtube-lead-scraper'))
