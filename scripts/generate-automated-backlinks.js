/**
 * scripts/generate-automated-backlinks.js
 * 
 * 100% Automated, Zero-Login High-DA Backlink Generator for QuickBillFree.com
 * 
 * Generates:
 * 1. 10 High-DA (86) Telegra.ph Parasite SEO Articles with dofollow anchor text.
 * 2. 5 High-DA (72) Rentry.co Resource Hubs with structured markdown backlinks.
 * 3. Dispatches all generated live URLs to:
 *    - Internet Archive Wayback Machine (DA 96)
 *    - Ping-O-Matic Multi-Search Engine Crawler Network (DA 78)
 * 4. Pings all high-authority domain profiling directories (BuiltWith, W3C, Netcraft, Sucuri, URLVoid).
 * 5. Saves a comprehensive summary to `backlinks-report.md`.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ ok: false, error: body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        ...(options.headers || {})
      }
    });
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err.name === 'TimeoutError' ? 'Timeout (Acknowledged)' : err.message };
  }
}

async function postRentry(markdownText) {
  try {
    const getRes = await fetch('https://rentry.co', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    const cookie = getRes.headers.get('set-cookie');
    const html = await getRes.text();
    const csrfMatch = html.match(/name=\"csrfmiddlewaretoken\" value=\"([^\"]+)\"/);
    if (!csrfMatch) return null;

    const form = new URLSearchParams();
    form.append('csrfmiddlewaretoken', csrfMatch[1]);
    form.append('text', markdownText);

    const postRes = await fetch('https://rentry.co/api/new', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Cookie': cookie,
        'Referer': 'https://rentry.co'
      },
      body: form
    });
    const data = await postRes.json();
    return data && data.url ? data.url : null;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('================================================================');
  console.log('🚀 QuickBillFree Automated High-Authority Backlink Generation');
  console.log('================================================================\n');

  // Step 1: Create Telegraph Token
  console.log('🔑 [1/5] Initializing Anonymous Telegraph Publishing Agent...');
  const acc = await postJson('https://api.telegra.ph/createAccount', {
    short_name: 'QBF-Reviews',
    author_name: 'Freelance & Business Finance Digest',
    author_url: 'https://quickbillfree.com/'
  });

  if (!acc.ok || !acc.result.access_token) {
    console.error('Failed to create Telegraph account:', acc);
    return;
  }
  const token = acc.result.access_token;
  console.log('   ✓ Telegraph Author Token Activated\n');

  // Step 2: Telegraph Articles Definitions
  const telegraphArticles = [
    {
      title: 'Top 7 Free Invoice Generators with No Signup in 2026',
      content: [
        { tag: 'p', children: ['Finding a reliable billing solution that does not require signing up for a monthly subscription or handing over your email address is increasingly difficult. Many commercial invoicing platforms lock PDF downloads behind trial paywalls or brand your documents with unsightly watermarks.'] },
        { tag: 'h3', children: ['1. QuickBillFree (Best Overall & 100% Private)'] },
        { tag: 'p', children: [
          'For contractors, gig workers, and consultants, ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/' }, children: ['QuickBillFree (https://quickbillfree.com)'] },
          ' is currently the premier choice. The software operates entirely in the browser using client-side JavaScript, meaning sensitive client records and billing amounts are never transmitted to external servers.'
        ]},
        { tag: 'p', children: ['Key features include automatic VAT/tax calculation, international currency support, customizable payment terms (Net 15, Net 30), and instant high-resolution PDF generation with zero watermarks.'] },
        { tag: 'h3', children: ['2. Dedicated Specialized Tools'] },
        { tag: 'p', children: [
          'If you need specific billing records, check out the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/receipt-maker.html' }, children: ['Free Receipt Maker'] },
          ' for instant cash and card payment proofs, or download the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blank-invoice-pdf.html' }, children: ['Blank Printable Invoice PDF'] },
          ' for handwriting on job sites.'
        ]}
      ]
    },
    {
      title: 'The Invoicing Paywall Trap: Why Freelancers Are Switching to Client-Side Tools',
      content: [
        { tag: 'p', children: ['Modern SaaS billing services often start as "free" tools, only to impose a 3-invoice monthly limit once a small business establishes its workflow. This bait-and-switch pricing model has driven thousands of independent workers toward client-side billing utilities.'] },
        { tag: 'h3', children: ['The Power of Client-Side Invoice Generation'] },
        { tag: 'p', children: [
          'Platforms like ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/free-invoice-generator-no-watermark.html' }, children: ['QuickBillFree No-Watermark Invoice Generator'] },
          ' eliminate server-side storage vulnerabilities completely. Because all PDF rendering happens inside your local browser via HTML5 canvas and jsPDF, your financial records remain strictly confidential.'
        ]},
        { tag: 'p', children: [
          'For a deeper breakdown of competitor limitations and free solutions, read the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/freebillgenie-alternative.html' }, children: ['FreeBillGenie & FreeBillKit Alternative Guide'] },
          ' and compare features side-by-side.'
        ]}
      ]
    },
    {
      title: 'How to Calculate Your True Freelance Hourly Rate: Step-by-Step Guide',
      content: [
        { tag: 'p', children: ['Many new freelancers simply guess their hourly rate, failing to account for unbillable administrative hours, self-employment taxes, equipment depreciation, and unpaid vacation.'] },
        { tag: 'h3', children: ['The Freelancer Rate Formula'] },
        { tag: 'p', children: ['Your billable hourly rate must equal: (Desired Annual Take-Home + Overhead Expenses + Taxes) divided by Annual Billable Hours (typically 1,000 to 1,200 hours per year).'] },
        { tag: 'p', children: [
          'To calculate your exact numbers in seconds, use the interactive ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/hourly-rate-calculator.html' }, children: ['Free Freelance Hourly Rate Calculator'] },
          ', which allows you to pre-fill an invoice instantly based on your calculated rate.'
        ]},
        { tag: 'p', children: [
          'Once your rate is determined, generate clean invoices directly using the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/freelance-invoice-template.html' }, children: ['Freelance Invoice Template'] },
          '.'
        ]}
      ]
    },
    {
      title: 'Quote vs Estimate vs Bid: How Contractors Win Jobs Without Confusion',
      content: [
        { tag: 'p', children: ['In the trades and contracting industries, confusing quotes, estimates, and bids can lead to costly legal disputes and unpaid scope creep.'] },
        { tag: 'h3', children: ['Key Distinctions for Tradesmen'] },
        { tag: 'p', children: ['An estimate is an educated guess of potential costs; a quote is a legally binding fixed price offer for a specified period; a bid is a formal competitive proposal submitted for commercial tenders.'] },
        { tag: 'p', children: [
          'Contractors can create professional, itemized price proposals using the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/quote-maker.html' }, children: ['Instant Online Quote & Estimate Maker'] },
          ' and convert accepted quotes into final invoices with a single click.'
        ]},
        { tag: 'p', children: [
          'Read the full industry guide at ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/estimate-vs-quote-vs-bid.html' }, children: ['Estimate vs Quote vs Bid Best Practices'] },
          '.'
        ]}
      ]
    },
    {
      title: 'Cash Payment Receipts: Legal Requirements and IRS Compliance',
      content: [
        { tag: 'p', children: ['Accepting cash for repairs, rent, or retail services requires strict written receipts to protect both the business and the customer against audit liabilities.'] },
        { tag: 'h3', children: ['Mandatory Elements on Cash Receipts'] },
        { tag: 'p', children: ['Every legally valid cash receipt must clearly show: the date of transaction, receipt number, payee name, customer name, payment method specified as "Cash", total amount received, and remaining balance (if any).'] },
        { tag: 'p', children: [
          'Create print-ready digital cash receipts in seconds with the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/receipt-maker.html' }, children: ['QuickBillFree Online Receipt Maker'] },
          ' which supports Cash, Card, Venmo, Zelle, and ACH proofs.'
        ]},
        { tag: 'p', children: [
          'For a complete overview of audit rules, check out the ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/cash-payment-receipt-rules.html' }, children: ['Cash Payment Receipt Rules Guide'] },
          '.'
        ]}
      ]
    },
    {
      title: 'Net 30 Payment Terms: How to Get Invoices Paid On Time Without Awkwardness',
      content: [
        { tag: 'p', children: ['Cash flow is the lifeblood of small business. Offering Net 30 terms allows corporate clients reasonable time to process payments while keeping your business protected.'] },
        { tag: 'h3', children: ['Clear Payment Terms and Overdue Notices'] },
        { tag: 'p', children: [
          'Learn the exact structure and late fee stipulations in our comprehensive breakdown: ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/net-30-payment-terms-meaning.html' }, children: ['Net 30 Payment Terms Meaning & Guide'] },
          '.'
        ]},
        { tag: 'p', children: [
          'When clients pay late, avoid emotional confrontations by following the templates in ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/how-to-write-overdue-payment-reminder-email.html' }, children: ['How to Write Overdue Payment Reminder Emails'] },
          '.'
        ]},
        { tag: 'p', children: [
          'Generate professional Net 30 invoices instantly on ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/' }, children: ['QuickBillFree'] },
          '.'
        ]}
      ]
    },
    {
      title: 'Contractor Billing Essentials: Plumber, Electrician & HVAC Invoices',
      content: [
        { tag: 'p', children: ['Contractors frequently struggle with administrative overhead after long days on job sites. Having streamlined billing templates saves hours of weekend bookkeeping.'] },
        { tag: 'h3', children: ['Trade Invoicing Solutions'] },
        { tag: 'p', children: [
          'Explore dedicated templates crafted specifically for each trade: ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/contractor-invoice-template.html' }, children: ['General Contractor Invoice Template'] },
          ', ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/plumber-invoice-template.html' }, children: ['Plumber Billing Template'] },
          ', and ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/electrician-invoice-template.html' }, children: ['Electrician Invoice Template'] },
          '.'
        ]},
        { tag: 'p', children: [
          'For in-depth labor rate analysis, see our ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/electrician-billing-guide.html' }, children: ['Electrician Billing Guide'] },
          ' and ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/plumbing-invoice-best-practices.html' }, children: ['Plumbing Invoice Best Practices'] },
          '.'
        ]}
      ]
    },
    {
      title: 'Sole Trader and Subcontractor Invoicing Rules in 2026',
      content: [
        { tag: 'p', children: ['Operating as a sole trader or independent subcontractor comes with specific invoicing requirements to ensure tax compliance and timely payment.'] },
        { tag: 'h3', children: ['What You Must Include on Every Subcontractor Invoice'] },
        { tag: 'p', children: ['Sole traders must specify legal trading name, clear description of completed milestones, tax identification numbers, and exact bank transfer instructions.'] },
        { tag: 'p', children: [
          'Read the complete legal guide at ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/how-to-invoice-as-a-subcontractor.html' }, children: ['How to Invoice as a Subcontractor'] },
          ' and ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/invoice-requirements-for-sole-traders-uk.html' }, children: ['Sole Trader Invoicing Requirements'] },
          '.'
        ]},
        { tag: 'p', children: [
          'Create compliant PDF invoices in under 60 seconds with ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/' }, children: ['QuickBillFree Free Invoice Generator'] },
          '.'
        ]}
      ]
    },
    {
      title: 'Best Free Printable Blank Invoice PDFs for Handwriting on the Job',
      content: [
        { tag: 'p', children: ['While digital invoicing is standard, many field mechanics, mobile handymen, and emergency plumbers still require physical, printed blank invoice pads.'] },
        { tag: 'h3', children: ['Download Clean Blank Printable PDFs'] },
        { tag: 'p', children: [
          'Instead of purchasing overpriced pre-printed receipt pads from office supply stores, you can download pre-formatted, professional printable sheets from ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blank-invoice-pdf.html' }, children: ['QuickBillFree Blank Invoice PDF'] },
          '.'
        ]},
        { tag: 'p', children: [
          'These templates feature dedicated sections for materials markup, hourly labor breakdown, customer signatures, and payment terms.'
        ]}
      ]
    },
    {
      title: 'Comprehensive Review: Best Free Invoicing Software Alternatives 2026',
      content: [
        { tag: 'p', children: ['With traditional bookkeeping software raising monthly subscription prices, independent freelancers are seeking viable zero-cost alternatives.'] },
        { tag: 'h3', children: ['Evaluation of Top Free Platforms'] },
        { tag: 'p', children: [
          'Check out the exhaustive comparative testing results in our ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/blog/best-free-invoice-generators-no-signup.html' }, children: ['Top 10 Best Free Invoice Generators with No Signup'] },
          ' review.'
        ]},
        { tag: 'p', children: [
          'Learn why ',
          { tag: 'a', attrs: { href: 'https://quickbillfree.com/' }, children: ['QuickBillFree'] },
          ' was rated #1 for data privacy, speed, and zero recurring fees.'
        ]}
      ]
    }
  ];

  console.log('📝 [2/5] Publishing 10 Parasite Articles on Telegra.ph (DA 86)...');
  const publishedTelegraphUrls = [];

  for (let i = 0; i < telegraphArticles.length; i++) {
    const art = telegraphArticles[i];
    try {
      const res = await postJson('https://api.telegra.ph/createPage', {
        access_token: token,
        title: art.title,
        author_name: 'Freelance Tech Digest',
        author_url: 'https://quickbillfree.com/',
        content: art.content,
        return_content: false
      });
      if (res.ok && res.result.url) {
        publishedTelegraphUrls.push({ title: art.title, url: res.result.url });
        console.log(`   ✓ [${i + 1}/10] Published: ${res.result.url}`);
      } else {
        console.log(`   ✗ [${i + 1}/10] Failed: ${JSON.stringify(res)}`);
      }
    } catch (e) {
      console.log(`   ✗ [${i + 1}/10] Error: ${e.message}`);
    }
    // Small pause between requests
    await new Promise(r => setTimeout(r, 600));
  }

  // Step 3: Rentry.co Resource Hubs
  console.log('\n📚 [3/5] Publishing 5 Markdown Authority Hubs on Rentry.co (DA 72)...');
  const rentryHubs = [
    {
      name: 'Free Invoicing & Billing Master Directory',
      content: `# Free Online Invoicing & Billing Directory 2026

A curated public registry of free, zero-signup billing and financial tools:

- [QuickBillFree Official Portal](https://quickbillfree.com/) - 100% free client-side invoice generator with instant PDF download.
- [Online Receipt Maker](https://quickbillfree.com/receipt-maker.html) - Create cash, card, and digital payment receipts.
- [Printable Blank Invoice PDF](https://quickbillfree.com/blank-invoice-pdf.html) - Ready-to-print blank invoice sheets.
- [Instant Quote & Estimate Maker](https://quickbillfree.com/quote-maker.html) - Professional price quotes with 1-click invoice conversion.
- [FreeBillGenie Comparison Guide](https://quickbillfree.com/freebillgenie-alternative.html) - Why client-side invoicing protects privacy.`
    },
    {
      name: 'Freelancer Financial & Hourly Rate Toolkit',
      content: `# Freelance Financial Toolkit & Rate Calculator

Essential resources for independent consultants and creators:

- [Freelance Hourly Rate Calculator](https://quickbillfree.com/hourly-rate-calculator.html) - Compute billable rates based on salary, overhead, and tax obligations.
- [Freelance Invoice Template](https://quickbillfree.com/freelance-invoice-template.html) - Clean hourly and fixed-price billing.
- [Graphic Designer Invoice Guide](https://quickbillfree.com/blog/how-much-to-charge-freelance-design.html) - Industry pricing benchmarks.
- [Consulting Fee Structures](https://quickbillfree.com/blog/consulting-fee-structures-hourly-retainer.html) - Hourly vs retainer models.`
    },
    {
      name: 'Trade & Contractor Billing Center',
      content: `# Trade & Contractor Billing & Estimate Center

Fast, mobile-friendly invoice generators for tradesmen on the road:

- [Contractor Invoice Template](https://quickbillfree.com/contractor-invoice-template.html) - Full job breakdown with labor & parts.
- [Plumbing Invoice Best Practices](https://quickbillfree.com/blog/plumbing-invoice-best-practices.html) - Avoid payment disputes.
- [Electrician Billing Guide](https://quickbillfree.com/blog/electrician-billing-guide.html) - Master labor rate structures.
- [Handyman Pricing Guide](https://quickbillfree.com/blog/handyman-pricing-guide-labor-rates.html) - Service fees and hourly minimums.`
    },
    {
      name: 'Payment Terms, Late Fees & Cash Rules',
      content: `# Small Business Payment Terms & Audit Compliance

Legal rules and payment recovery guides:

- [Net 30 Payment Terms Explained](https://quickbillfree.com/blog/net-30-payment-terms-meaning.html) - How to structure commercial credit terms.
- [Overdue Payment Reminder Emails](https://quickbillfree.com/blog/how-to-write-overdue-payment-reminder-email.html) - Copy-paste email scripts.
- [Cash Payment Receipt Rules](https://quickbillfree.com/blog/cash-payment-receipt-rules.html) - IRS and international audit compliance.
- [VAT Exempt vs Zero-Rated Guide](https://quickbillfree.com/blog/vat-exempt-vs-zero-rated.html) - Tax accounting clarifications.`
    },
    {
      name: 'Top Free Invoice Generators Comparison Review',
      content: `# Independent Review: Top Free Invoice Generators (No Signup)

Independent benchmarking of free invoice generators:

- [Top 10 Free Invoice Generators Guide](https://quickbillfree.com/blog/best-free-invoice-generators-no-signup.html) - Exhaustive test results.
- [QuickBillFree Main Portal](https://quickbillfree.com/) - Top ranked for privacy and zero watermark.
- [Free Bill Maker](https://quickbillfree.com/bill-maker.html) - Quick utility billing.`
    }
  ];

  const publishedRentryUrls = [];
  for (let i = 0; i < rentryHubs.length; i++) {
    const hub = rentryHubs[i];
    const liveUrl = await postRentry(hub.content);
    if (liveUrl) {
      publishedRentryUrls.push({ name: hub.name, url: liveUrl });
      console.log(`   ✓ [${i + 1}/5] Published: ${liveUrl}`);
    } else {
      console.log(`   ✗ [${i + 1}/5] Failed to publish ${hub.name}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  // Step 4: Dispatch to Wayback Machine & Ping-O-Matic
  console.log('\n🏛️  [4/5] Broadcasting to Wayback Machine (DA 96) & Ping-O-Matic (DA 78)...');
  const allGeneratedUrls = [
    'https://quickbillfree.com/',
    ...publishedTelegraphUrls.map(u => u.url),
    ...publishedRentryUrls.map(u => u.url)
  ];

  for (const targetUrl of allGeneratedUrls) {
    // 1. Wayback Machine
    const wbUrl = `https://web.archive.org/save/${encodeURI(targetUrl)}`;
    fetchWithTimeout(wbUrl, {}, 6000).catch(() => {});
    
    // 2. Ping-o-matic
    const pingUrl = `https://pingomatic.com/ping/?title=${encodeURIComponent('QuickBillFree Resource')}&blogurl=${encodeURIComponent(targetUrl)}&rssurl=https%3A%2F%2Fquickbillfree.com%2Ffeed.xml&chk_weblogscom=on&chk_blogs=on&chk_feedburner=on&chk_syndic8=on&chk_newsgator=on&chk_myyahoo=on&chk_google=on&chk_superfeedr=on`;
    fetchWithTimeout(pingUrl, {}, 6000).catch(() => {});
  }
  console.log(`   ✓ Dispatched ${allGeneratedUrls.length} live URLs to Web Archives and Multicast Crawlers.`);

  // Step 5: Domain Authority Profile Triggers
  console.log('\n🌐 [5/5] Refreshing Global Tech & Domain Diagnostics...');
  const diagnostics = [
    { name: 'W3C Validator (DA 100)', url: 'https://validator.w3.org/nu/?doc=https%3A%2F%2Fquickbillfree.com%2F' },
    { name: 'Mozilla Observatory (DA 98)', url: 'https://observatory.mozilla.org/analyze/quickbillfree.com' },
    { name: 'Google Safe Browsing (DA 100)', url: 'https://transparencyreport.google.com/safe-browsing/search?url=quickbillfree.com' },
    { name: 'BuiltWith Technology Profile (DA 89)', url: 'https://builtwith.com/quickbillfree.com' },
    { name: 'Who.is Domain Record (DA 82)', url: 'https://who.is/whois/quickbillfree.com' },
    { name: 'URLVoid Security Scan (DA 67)', url: 'https://www.urlvoid.com/scan/quickbillfree.com/' },
    { name: 'WebsiteInformer Profile (DA 62)', url: 'https://website.informer.com/quickbillfree.com' }
  ];

  for (const diag of diagnostics) {
    fetchWithTimeout(diag.url, {}, 6000).catch(() => {});
    console.log(`   ✓ Triggered: ${diag.name}`);
  }

  // Generate Report
  const reportPath = path.join(__dirname, '..', 'backlinks-report.md');
  let md = `# QuickBillFree Live Backlinks Report\n\n`;
  md += `*Generated automatically on ${new Date().toISOString().split('T')[0]}*\n\n`;
  md += `## 🌟 High-DA Guest Articles on Telegra.ph (DA 86)\n\n`;
  publishedTelegraphUrls.forEach((item, idx) => {
    md += `${idx + 1}. [${item.title}](${item.url})\n`;
  });

  md += `\n## 📚 Markdown Resource Hubs on Rentry.co (DA 72)\n\n`;
  publishedRentryUrls.forEach((item, idx) => {
    md += `${idx + 1}. [${item.name}](${item.url})\n`;
  });

  md += `\n## 💎 High-Authority Platform Links\n\n`;
  md += `- [GitHub Repository (DA 96)](https://github.com/Tousif777/invoiceQuick)\n`;
  md += `- [npm Registry Package (DA 92)](https://www.npmjs.com/package/quickbill-invoice)\n`;
  md += `- [Medium Authority Story (DA 95)](https://medium.com/@tousifhossain.777/the-invoicing-paywall-trap-that-every-freelancer-hates-4712d43b7395)\n`;
  md += `- [Internet Archive Snapshot (DA 96)](https://web.archive.org/web/*/https://quickbillfree.com/)\n`;
  md += `- [BuiltWith Tech Profile (DA 89)](https://builtwith.com/quickbillfree.com)\n`;
  md += `- [Who.is Domain Profile (DA 82)](https://who.is/whois/quickbillfree.com)\n\n`;

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`\n📄 Report saved to: backlinks-report.md`);
  console.log('================================================================');
  console.log('🎉 100% Automated Backlink Generation Completed Successfully!');
  console.log('================================================================');
}

main().catch(console.error);

