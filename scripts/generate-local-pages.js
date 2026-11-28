#!/usr/bin/env node
// generate-local-pages.js - Programmatic city+niche invoice generator pages for local SEO
// Usage: node scripts/generate-local-pages.js [limit]

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..');

const TRADES = [
  { slug: 'plumber', name: 'Plumber', icon: '🚰', desc: 'Itemize pipe repairs, drain cleaning, emergency dispatch surcharges, and customer sign-offs for plumbing jobs.' },
  { slug: 'electrician', name: 'Electrician', icon: '⚡', desc: 'Itemize panel upgrades, safety inspections, EV charger installs, and wire supplies for electrical work.' },
  { slug: 'hvac', name: 'HVAC Technician', icon: '❄️', desc: 'Itemize heating, ventilation, air conditioning service, EPA certifications, and parts for HVAC jobs.' },
  { slug: 'handyman', name: 'Handyman', icon: '🔧', desc: 'Mobile billing for home repairs, carpentry, odd jobs, materials, and trip fees.' },
  { slug: 'mechanic', name: 'Auto Mechanic', icon: '🚗', desc: 'Itemize VIN, odometer readings, parts markups, labor, and shop supplies for auto repair.' },
  { slug: 'trucking', name: 'Trucking & Freight', icon: '🚛', desc: 'Manage Bills of Lading, rate confirmations, fuel surcharges, and factoring for owner-operators.' },
  { slug: 'cleaning', name: 'Cleaning Service', icon: '🧼', desc: 'Residential flat rates, commercial janitorial per-square-foot billing, deep clean extras.' },
  { slug: 'lawn-care', name: 'Lawn Care', icon: '🌱', desc: 'Mowing schedules, seasonal cleanups, chemical treatments, and monthly recurring contracts.' },
  { slug: 'landscaping', name: 'Landscaping', icon: '🌳', desc: 'Hardscaping, softscaping, seasonal contracts, and materials billing for landscapers.' },
  { slug: 'photography', name: 'Photographer', icon: '📷', desc: 'Separate creative day rates from commercial image licensing rights, gear fees, and assistants.' },
  { slug: 'consulting', name: 'Consultant', icon: '💼', desc: 'Hourly billing, monthly advisory retainers, fixed project milestones, and value-based pricing.' },
  { slug: 'contractor', name: 'General Contractor', icon: '🏗️', desc: 'Progress draws, permits, retainage deductions, and itemized labor and materials.' },
  { slug: 'commercial', name: 'Commercial / Export', icon: '📦', desc: 'Customs declarations, HS tariff codes, and Incoterms 2020 export templates.' },
];

const CITIES = [
  { slug: 'new-york', name: 'New York', state: 'NY', taxNote: 'New York City sales tax is 8.875%. Include it as a line item on taxable services.' },
  { slug: 'los-angeles', name: 'Los Angeles', state: 'CA', taxNote: 'California state sales tax is 7.25% plus local district taxes. Verify your local rate.' },
  { slug: 'chicago', name: 'Chicago', state: 'IL', taxNote: 'Chicago combined sales tax is among the highest in the U.S. Check the current Cook County rate.' },
  { slug: 'houston', name: 'Houston', state: 'TX', taxNote: 'Texas has no state income tax, but sales tax applies to taxable goods and some services.' },
  { slug: 'phoenix', name: 'Phoenix', state: 'AZ', taxNote: 'Arizona transaction privilege tax (TPT) applies. Check your city\'s specific rate.' },
  { slug: 'philadelphia', name: 'Philadelphia', state: 'PA', taxNote: 'Philadelphia sales tax is 8%. Include it as a line item on taxable goods and services.' },
  { slug: 'san-antonio', name: 'San Antonio', state: 'TX', taxNote: 'Texas sales tax rate is 6.25% plus local taxes. Confirm your combined rate.' },
  { slug: 'san-diego', name: 'San Diego', state: 'CA', taxNote: 'California state sales tax is 7.25% plus San Diego district taxes.' },
  { slug: 'dallas', name: 'Dallas', state: 'TX', taxNote: 'Texas sales tax applies to taxable goods. No state income tax for individuals.' },
  { slug: 'san-jose', name: 'San Jose', state: 'CA', taxNote: 'California state sales tax is 7.25% plus Santa Clara County district taxes.' },
  { slug: 'austin', name: 'Austin', state: 'TX', taxNote: 'Texas sales tax rate is 6.25% plus local taxes. Confirm your combined rate.' },
  { slug: 'jacksonville', name: 'Jacksonville', state: 'FL', taxNote: 'Florida sales tax is 6% plus local discretionary surtaxes.' },
  { slug: 'fort-worth', name: 'Fort Worth', state: 'TX', taxNote: 'Texas sales tax applies to taxable goods and some services.' },
  { slug: 'columbus', name: 'Columbus', state: 'OH', taxNote: 'Ohio sales tax is 5.75% plus county and regional transit taxes.' },
  { slug: 'charlotte', name: 'Charlotte', state: 'NC', taxNote: 'North Carolina sales tax is 4.75% plus local and county taxes.' },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function generatePage(trade, city) {
  const title = `${trade.name} Invoice Generator in ${city.name} (${city.state}) — Free, No Signup`;
  const desc = `Free ${trade.slug} invoice generator for ${city.name}, ${city.state}. ${trade.desc} Instant PDF download, zero signup, no watermarks, client-side privacy.`;
  const canonical = `https://quickbillfree.com/invoice-generator-${trade.slug}-${city.slug}.html`;
  const fileName = `invoice-generator-${trade.slug}-${city.slug}.html`;

  const ogTitle = `${trade.name} Invoice Generator in ${city.name} — Free`;
  const ogDesc = `Create free ${trade.slug} invoices in ${city.name}, ${city.state}. No signup, no watermarks, instant PDF download.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WH81YDKPS6"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });
    gtag('js', new Date());
    gtag('config', 'G-WH81YDKPS6');
  </script>
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7599767103475954" crossorigin="anonymous"></script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <meta name="author" content="MD Tousif">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(ogTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDesc)}">
  <meta property="og:image" content="https://quickbillfree.com/assets/og-image.png">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml(ogDesc)}">

  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="shortcut icon" href="favicon.ico">
  <meta name="theme-color" content="#4f46e5">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="blog.css">

  <style>
    .local-card {
      background: #ffffff;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .local-card h3 { margin: 0 0 8px 0; font-size: 1.15rem; color: #0f172a; }
    .local-card p { color: #475569; font-size: 0.92rem; line-height: 1.6; margin: 0 0 14px 0; }
    .tax-tip {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 10px;
      padding: 14px 18px;
      margin-top: 16px;
      font-size: 0.88rem;
      color: #92400e;
    }
    .tax-tip strong { color: #78350f; }
    .btn-social {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.15s, transform 0.1s;
    }
    .btn-social:hover { opacity: 0.92; transform: translateY(-1px); }
  </style>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "QuickBillFree ${escapeHtml(trade.name)} Invoice Generator — ${escapeHtml(city.name)}",
        "url": "${canonical}",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "${escapeHtml(desc)}",
        "areaServed": {
          "@type": "City",
          "name": "${escapeHtml(city.name)}",
          "addressCountry": "US"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is this invoice generator free for ${escapeHtml(trade.name)}s in ${escapeHtml(city.name)}?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. QuickBillFree provides unlimited invoice creation, PDF downloads, and client-side storage with zero subscription costs, no credit card, and no signup required."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to sign up to create invoices in ${escapeHtml(city.name)}, ${escapeHtml(city.state)}?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No signup or account is required. Open the tool in your browser, enter your client and job details, and download a PDF invoice immediately."
            }
          }
        ]
      }
    ]
  }
  </script>
</head>
<body class="blog-page">

  <!-- Navigation -->
  <nav class="blog-nav">
    <div class="container blog-nav-container">
      <a href="./" class="blog-brand">
        <img src="assets/favicon.svg" alt="QuickBillFree" width="30" height="30">
        <span>Quick<span style="color: var(--blog-primary);">Bill</span><span style="color: #10b981; font-weight: 800; font-size: 0.95em;">Free</span></span>
      </a>
      <div class="blog-nav-links">
        <a href="invoice-tracker.html" class="btn-nav-ghost">📊 Invoice Tracker</a>
        <a href="payment-reminder-generator.html" class="btn-nav-ghost">✉️ Reminder Generator</a>
        <a href="./" class="btn-nav-primary">⚡ New Invoice</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="blog-hero">
    <div class="container">
      <span class="hero-badge" style="background: #ecfdf5; color: #047857; border: 1px solid #6ee7b7; padding: 6px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; display: inline-block; margin-bottom: 14px;">
        ${trade.icon} Free ${trade.name} Invoice Generator — ${city.name}, ${city.state}
      </span>
      <h1 class="blog-hero-title">${trade.name} Invoice Generator in ${city.name}</h1>
      <p class="blog-hero-subtitle">
        ${trade.desc} Create professional invoices for your ${city.name} clients. Instant PDF download, zero signup, no watermarks.
      </p>
      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 18px;">
        <a href="./" class="btn-nav-primary" style="padding: 14px 28px; font-size: 1.05rem; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">⚡ Create Free Invoice Now</a>
      </div>
    </div>
  </header>

  <main class="container" style="max-width: 860px; margin: 0 auto 60px; padding: 0 20px;">

    <section class="local-card">
      <h3>${trade.icon} ${trade.name} Invoice Generator — ${city.name}, ${city.state}</h3>
      <p>${trade.desc}</p>
      <p>Whether you're a solo ${trade.name.toLowerCase()} or run a small crew in ${city.name}, QuickBillFree lets you create, customize, and download professional PDF invoices in seconds — no account, no credit card, no monthly fees.</p>
      <div class="tax-tip">
        <strong>💡 ${city.name} Tax Tip:</strong> ${escapeHtml(city.taxNote)}
      </div>
      <ul>
        <li><strong>Zero signup:</strong> Open and bill instantly. No email, no password, no credit card.</li>
        <li><strong>No watermarks:</strong> Clean, professional PDFs with zero forced branding.</li>
        <li><strong>Client-side privacy:</strong> All data stays in your browser's localStorage. Nothing is uploaded.</li>
        <li><strong>Works offline:</strong> PWA support means you can invoice even without internet access.</li>
        <li><strong>QR code payments:</strong> Add Venmo, PayPal, Wise, or Stripe QR codes directly to your invoice.</li>
      </ul>
      <p style="margin-top: 16px;"><a href="./" class="btn-nav-primary" style="padding: 12px 24px; font-size: 1rem; display: inline-block;">⚡ Create Free ${trade.name} Invoice</a></p>
    </section>

    <section class="local-card">
      <h3>Related Free Tools</h3>
      <p style="color: #475569; font-size: 0.92rem; margin-bottom: 14px;">More tools for ${trade.name}s and small business owners:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
        <a href="invoice-tracker.html" class="btn-social" style="background:#4f46e5;color:#ffffff;">Invoice Tracker Dashboard</a>
        <a href="payment-reminder-generator.html" class="btn-social" style="background:#4f46e5;color:#ffffff;">Payment Reminder Generator</a>
        <a href="late-fee-calculator.html" class="btn-social" style="background:#4f46e5;color:#ffffff;">Late Fee Calculator</a>
        <a href="receipt-maker.html" class="btn-social" style="background:#4f46e5;color:#ffffff;">Receipt Maker</a>
        <a href="quote-maker.html" class="btn-social" style="background:#4f46e5;color:#ffffff;">Quote Maker</a>
        <a href="bill-maker.html" class="btn-social" style="background:#4f46e5;color:#ffffff;">Online Bill Maker</a>
      </div>
    </section>

    <section class="prose" style="background: #ffffff; padding: 36px; border-radius: var(--radius-lg); border: 1px solid var(--blog-border); margin-top: 40px; max-width: 860px; margin-left: auto; margin-right: auto;">
      <h2 style="font-size: 1.35rem; margin-bottom: 10px; text-align: center;">Share This Tool</h2>
      <p style="text-align: center; color: #64748b; margin-bottom: 22px;">Help other ${trade.name}s in ${city.name} invoice for free.</p>
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <a href="https://twitter.com/intent/tweet?text=Free%20${escapeHtml(trade.name)}%20invoice%20generator%20in%20${escapeHtml(city.name)}%2C%20${escapeHtml(city.state)}.%20Zero%20signup%2C%20no%20watermarks%2C%20unlimited%20PDFs.%0A%0A👉%20${encodeURIComponent(canonical)}&via=QuickBillFree" target="_blank" rel="noopener" class="btn-social" style="background:#1da1f2;color:#ffffff;">𝕏 Twitter</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener" class="btn-social" style="background:#0077b5;color:#ffffff;">LinkedIn</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}" target="_blank" rel="noopener" class="btn-social" style="background:#1877f2;color:#ffffff;">Facebook</a>
        <button type="button" id="btnCopyToolLink" class="btn-social" style="background:#475569;color:#ffffff;">📋 Copy Link</button>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 0.8rem; margin-top: 12px;">Sharing opens a new window/tab to the social platform. QuickBillFree never sees your social accounts.</p>
    </section>

    <footer class="site-footer print-hide">
      <div class="container">
        <div class="footer-links" style="margin-bottom: 10px;">
          <a href="./">Invoice Generator</a>
          <a href="invoice-tracker.html">Invoice Tracker</a>
          <a href="payment-reminder-generator.html">Payment Reminder Generator</a>
          <a href="late-fee-calculator.html">Late Fee Calculator</a>
          <a href="vat-calculator.html">VAT Calculator</a>
          <a href="hourly-rate-calculator.html">Hourly Rate Calculator</a>
          <a href="receipt-maker.html">Receipt Maker</a>
          <a href="quote-maker.html">Quote Maker</a>
        </div>
        <p>&copy; 2026 QuickBillFree.com — 100% Free Client-Side Invoicing Tools. <a href="privacy.html">Privacy</a> • <a href="terms.html">Terms</a></p>
      </div>
    </footer>

  </main>

  <!-- Copy tool link for social sharing -->
  <script>
    (function () {
      var btn = document.getElementById('btnCopyToolLink');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var url = "${canonical}";
        try {
          navigator.clipboard.writeText(url).then(function () {
            var old = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = old; }, 1600);
          });
        } catch (_) {}
      });
    })();
  </script>
</body>
</html>`;
}

const args = process.argv.slice(2);
const limit = args[0] ? parseInt(args[0], 10) : Infinity;

let count = 0;
const created = [];

for (const trade of TRADES) {
  for (const city of CITIES) {
    if (count >= limit) break;
    const content = generatePage(trade, city);
    const fileName = `invoice-generator-${trade.slug}-${city.slug}.html`;
    const filePath = path.join(PAGES_DIR, fileName);
    fs.writeFileSync(filePath, content);
    created.push(fileName);
    count++;
  }
  if (count >= limit) break;
}

console.log(`Generated ${count} local invoice generator pages:`);
created.forEach((f) => console.log(`  - ${f}`));
