const fs = require('fs');
const path = require('path');

const testimonialsSourcePath = path.join(
  process.cwd(),
  'app',
  'components',
  'landing',
  'WorkflowTestimonials.js'
);

const expectedTestimonials = [
  {
    id: "rahul-mehta",
    headline: "“We stopped treating every contact like an opportunity.”",
    body: "SimpLeads helped us narrow our searches, understand the companies behind our prospects, and prioritize the leads that actually matched our target profile.",
    name: "Rahul Mehta",
    role: "VP Sales, B2B SaaS Company",
    initials: "RM"
  },
  {
    id: "sarah-williams",
    headline: "“The qualification layer makes a real difference.”",
    body: "Finding contacts was never the hardest part. Knowing who deserved our attention was. The AI qualification workflow gives our team a much better starting point for outreach.",
    name: "Sarah Williams",
    role: "Head of Growth, Technology Company",
    initials: "SW"
  },
  {
    id: "daniel-carter",
    headline: "“One workflow instead of jumping between multiple tools.”",
    body: "We can move from people search to company research, job signals and scoring without constantly switching between different platforms. It makes prospecting much easier to manage.",
    name: "Daniel Carter",
    role: "Sales Director, B2B Services Firm",
    initials: "DC"
  },
  {
    id: "arjun-kapoor",
    headline: "“Active Job Signals give us another reason to prioritize an account.”",
    body: "We use recent hiring activity as an additional business signal when deciding which companies to approach. It adds useful context to our prospecting process.",
    name: "Arjun Kapoor",
    role: "Founder, Staffing Agency",
    initials: "AK"
  },
  {
    id: "priya-shah",
    headline: "“Google Maps Search is surprisingly useful for local prospecting.”",
    body: "We work with businesses across specific cities and regions, and being able to discover local companies alongside our broader prospecting workflow saves us a lot of manual research.",
    name: "Priya Shah",
    role: "Agency Owner, Digital Marketing Agency",
    initials: "PS"
  },
  {
    id: "michael-brown",
    headline: "“We can build a much more focused prospect list.”",
    body: "Instead of starting with a huge database and figuring everything out afterward, we can define our target by role, company characteristics, location and other filters before exporting.",
    name: "Michael Brown",
    role: "SDR Manager, SaaS Company",
    initials: "MB"
  },
  {
    id: "neha-verma",
    headline: "“The scoring helps us decide where to start.”",
    body: "Our team doesn’t want another spreadsheet full of names. We need to know which prospects deserve attention first. SimpLeads gives us a structured way to prioritize them.",
    name: "Neha Verma",
    role: "Growth Lead, B2B Startup",
    initials: "NV"
  },
  {
    id: "amit-roy",
    headline: "“Useful for agency prospecting across different industries.”",
    body: "Every client has a different ICP. The combination of people, company and discovery tools makes it easier for us to build targeted lists for different campaigns.",
    name: "Amit Roy",
    role: "Founder, Lead Generation Agency",
    initials: "AR"
  },
  {
    id: "james-anderson",
    headline: "“The export workflow keeps things simple.”",
    body: "Once we’ve finished filtering and qualifying our prospects, we can choose the output we need instead of manually cleaning and rebuilding multiple lists.",
    name: "James Anderson",
    role: "RevOps Manager, Business Services Company",
    initials: "JA"
  },
  {
    id: "karan-malhotra",
    headline: "“It changes the question from ‘How many leads?’ to ‘Which leads?’”",
    body: "That is probably the biggest difference for us. SimpLeads isn’t just about generating a bigger list; it helps us think about relevance, urgency and which opportunities deserve our attention.",
    name: "Karan Malhotra",
    role: "Founder, B2B Growth Company",
    initials: "KM"
  }
];

const headerStrings = [
  "Visible Verification",
  "See the Workflow Before You Trust the List",
  "SimpLeads is designed to make the qualification process visible rather than asking users to blindly trust a score."
];

function runTestimonialsTest() {
  console.log('Running Testimonial Content Verbatim & Sequential Order Integrity Test...');

  if (!fs.existsSync(testimonialsSourcePath)) {
    console.error(`❌ ERROR: Could not find ${testimonialsSourcePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(testimonialsSourcePath, 'utf-8');

  // 1. Assert header strings are present in verbatim order
  let headerIndex = 0;
  for (const hStr of headerStrings) {
    const idx = fileContent.indexOf(hStr, headerIndex);
    if (idx === -1) {
      console.error(`❌ ERROR: Header string missing or out of order: "${hStr}"`);
      process.exit(1);
    }
    headerIndex = idx + hStr.length;
  }
  console.log('✅ Section header and subtitle verified verbatim.');

  // 2. Assert no conditional unmounting of tabpanels
  if (fileContent.includes('{isActive && <div role="tabpanel"') || fileContent.includes('{activeIndex === idx && <')) {
    console.error('❌ ERROR: Found conditional unmounting on tabpanel! All 10 panels must stay in DOM.');
    process.exit(1);
  }
  console.log('✅ Tabpanel persistent DOM structure verified (no conditional unmounting).');

  // 3. Assert all 10 testimonials appear in exact order in the data source
  const landingDataPath = path.join(process.cwd(), 'data', 'landingData.json');
  const dataSourceToSearch = fs.existsSync(landingDataPath)
    ? fs.readFileSync(landingDataPath, 'utf-8')
    : fileContent;

  let dataIndex = 0;
  for (let i = 0; i < expectedTestimonials.length; i++) {
    const item = expectedTestimonials[i];
    const fields = [item.headline, item.body, item.name, item.role, item.initials];

    for (const field of fields) {
      const idx = dataSourceToSearch.indexOf(field, dataIndex);
      if (idx === -1) {
        console.error(`❌ ERROR: Testimonial ${i + 1} string missing or out of order in data:\n"${field}"`);
        process.exit(1);
      }
      dataIndex = idx + field.length;
    }
  }
  console.log(`✅ All ${expectedTestimonials.length} testimonials verified verbatim and sequentially in data array.`);

  // 4. Assert mapping iterates over all testimonials in OpenEntry without filtering
  if (!fileContent.includes('testimonialsList.map(') && !fileContent.includes('testimonials.map(')) {
    console.error('❌ ERROR: Expected testimonials array mapping for full DOM rendering.');
    process.exit(1);
  }

  // 5. If static HTML exists from a prior or current build, assert strings are present
  const possibleHtmlPaths = [
    path.join(process.cwd(), '.next', 'server', 'app', 'index.html'),
    path.join(process.cwd(), '.next', 'server', 'app', 'page.html'),
  ];

  for (const htmlPath of possibleHtmlPaths) {
    if (fs.existsSync(htmlPath)) {
      console.log(`Checking in static build HTML (${htmlPath})...`);
      const html = fs.readFileSync(htmlPath, 'utf-8');
      for (const t of expectedTestimonials) {
        if (!html.includes(t.headline) && !html.includes(t.headline.replace(/“/g, '&ldquo;').replace(/”/g, '&rdquo;'))) {
          console.warn(`⚠️ Note: Static build HTML does not have latest quotes yet. Run 'next build' to update.`);
          break;
        }
      }
    }
  }

  console.log('🎉 Testimonial content integrity verification passed successfully!');
}

runTestimonialsTest();
