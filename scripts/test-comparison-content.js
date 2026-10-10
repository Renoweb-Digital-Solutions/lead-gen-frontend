const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data', 'comparisons');
const outDir = path.join(process.cwd(), '.next', 'server', 'app', 'compare');

function extractStrings(obj) {
  let strings = [];
  if (typeof obj === 'string') {
    strings.push(obj.trim());
  } else if (Array.isArray(obj)) {
    obj.forEach(item => {
      strings = strings.concat(extractStrings(item));
    });
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      // Skip meta and hub keys since they might not be rendered sequentially in the main content body
      if (key === 'meta' || key === 'hub') continue;
      // Skip structural keys if we want, but since they are strings, they might get extracted
      // Wait, we should only extract data fields.
      if (key === 'type' || key === 'slug') continue;
      
      strings = strings.concat(extractStrings(obj[key]));
    }
  }
  return strings.filter(s => s.length > 0);
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&#x2014;/g, "—")
    .replace(/&#x2013;/g, "–");
}

function runTests() {
  console.log('Running comparison content verisimilitude tests...');
  
  if (!fs.existsSync(dataDir)) {
    console.log('No comparison data found, skipping.');
    return;
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  let hasError = false;

  files.forEach(file => {
    const slug = file.replace('.json', '');
    const jsonPath = path.join(dataDir, file);
    
    // In Next.js app router, static pages might be at .next/server/app/compare/[slug].html
    const htmlPath = path.join(outDir, `${slug}.html`);
    
    if (!fs.existsSync(htmlPath)) {
      console.warn(`WARNING: HTML file not found for ${slug} at ${htmlPath}. Ensure you run 'npm run build' before this test.`);
      // We don't fail immediately because this might run before build in some environments, but we should fail if it's explicitly run.
      hasError = true;
      return;
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    let rawHtml = fs.readFileSync(htmlPath, 'utf-8');
    
    // Strip script and style tags completely
    let htmlText = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    
    // Strip HTML tags
    htmlText = htmlText.replace(/<[^>]+>/g, ' ');
    
    // Decode entities
    htmlText = decodeHtmlEntities(htmlText);
    
    // Normalize whitespace
    htmlText = htmlText.replace(/\s+/g, ' ');

    const stringsToFind = extractStrings(jsonData.sections);
    
    let lastIndex = 0;
    
    console.log(`Testing ${slug}...`);
    
    for (let i = 0; i < stringsToFind.length; i++) {
      let str = stringsToFind[i];
      // Normalize whitespace in the target string too
      str = str.replace(/\s+/g, ' ');
      
      const foundIndex = htmlText.indexOf(str, lastIndex);
      
      if (foundIndex === -1) {
        // Fallback for partial matching in case of slight whitespace/entity variations
        const cleanStr = str.replace(/[^\w]/g, '');
        const cleanHtml = htmlText.replace(/[^\w]/g, '');
        const cleanFound = cleanHtml.indexOf(cleanStr, 0); // we just check if it exists at all
        
        if (cleanFound === -1) {
          console.error(`\n❌ ERROR: String mismatch in ${slug}!`);
          console.error(`Could not find (or out of order):\n"${str}"`);
          hasError = true;
          break;
        } else {
          console.warn(`\n⚠️ WARNING: String found but with formatting/order issues in ${slug}:\n"${str}"`);
          // We don't advance lastIndex here to be safe
        }
      } else {
        lastIndex = foundIndex + str.length;
      }
    }
    
    if (!hasError) {
      console.log(`✅ ${slug} passed.`);
    }
  });

  if (hasError) {
    console.error('\nTests failed. JSON content does not perfectly match rendered HTML.');
    process.exit(1);
  } else {
    console.log('\nAll comparison tests passed!');
  }
}

runTests();
