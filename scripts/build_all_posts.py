#!/usr/bin/env python3
"""
Complete Builder for 20 New SEO Articles on QuickBillFree.
Builds HTML files, updates blog/index.html, sitemap.xml, feed.xml, and llms.txt.
"""

import json
import os
import re

# Load post configs from batches
with open("scripts/posts_batch1.json", "r") as fp:
    batch1 = json.load(fp)

with open("scripts/posts_batch2.json", "r") as fp:
    batch2 = json.load(fp)

ALL_POSTS = batch1 + batch2
print(f"Total posts to process: {len(ALL_POSTS)}")

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WH81YDKPS6"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    // Google Consent Mode v2 (EEA & GDPR Compliant)
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
  <title>__TITLE__</title>
  <meta name="description" content="__DESCRIPTION__">
  <meta name="keywords" content="__KEYWORDS__">
  <meta name="author" content="MD Tousif">
  <link rel="canonical" href="https://quickbillfree.com/blog/__FILENAME__">

  <!-- Brand Favicon -->
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="shortcut icon" href="../favicon.ico">
  <meta name="theme-color" content="#4f46e5">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://quickbillfree.com/blog/__FILENAME__">
  <meta property="og:title" content="__TITLE__">
  <meta property="og:description" content="__DESCRIPTION__">
  <meta property="og:image" content="https://quickbillfree.com/assets/og-image.png">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="__TITLE__">
  <meta name="twitter:description" content="__DESCRIPTION__">

  <!-- Google Font: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../blog.css">

  <!-- Schema.org JSON-LD Article + FAQPage -->
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "__TITLE__",
      "description": "__DESCRIPTION__",
      "author": {
        "@type": "Person",
        "name": "MD Tousif"
      },
      "publisher": {
        "@type": "Organization",
        "name": "QuickBillFree",
        "logo": {
          "@type": "ImageObject",
          "url": "https://quickbillfree.com/assets/favicon.svg"
        }
      },
      "datePublished": "2026-11-15",
      "dateModified": "2026-11-15",
      "mainEntityOfPage": "https://quickbillfree.com/blog/__FILENAME__"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": __FAQ_JSON__
    }
  ]
  </script>
</head>
<body class="blog-page">
  <!-- Nav -->
  <nav class="blog-nav">
    <div class="container blog-nav-container">
      <a href="../" class="blog-brand">
        <img src="../assets/favicon.svg" alt="QuickBillFree" width="30" height="30">
        <span>Quick<span style="color: var(--blog-primary);">Bill</span><span style="color: #10b981; font-weight: 800; font-size: 0.95em;">Free</span></span>
        <span class="blog-badge-tag">Blog</span>
      </a>

      <div class="blog-nav-links">
        <a href="index.html" class="btn-nav-ghost">← All Guides</a>
        <a href="../" class="btn-nav-primary">⚡ Generate Invoice</a>
      </div>
    </div>
  </nav>

  <main class="article-container">
    <ul class="breadcrumbs">
      <li><a href="../">Home</a></li>
      <li class="breadcrumbs-sep">/</li>
      <li><a href="index.html">Blog</a></li>
      <li class="breadcrumbs-sep">/</li>
      <li aria-current="page">__BREADCRUMB__</li>
    </ul>

    <header class="article-header">
      <span class="article-category-badge">__CATEGORY__</span>
      <h1 class="article-main-title">__H1__</h1>
      <div class="article-byline">
        <div class="author-avatar">MT</div>
        <div>
          <div style="font-weight: 700; color: var(--blog-slate);">MD Tousif</div>
          <div style="font-size: 0.8125rem; color: var(--blog-slate-dim);">Published Nov 15, 2026 • __READ_TIME__ min read</div>
        </div>
      </div>
    </header>

    <article class="prose">
__BODY__

      <h2>Frequently Asked Questions</h2>
      <div style="margin-top: 20px;">
__FAQ_HTML__
      </div>

      <div class="blog-cta-banner">
        <h2 class="blog-cta-title">__CTA_TITLE__</h2>
        <p class="blog-cta-desc">__CTA_DESC__</p>
        <a href="__CTA_LINK__" class="btn-cta-white">__CTA_BTN__</a>
      </div>

      <div class="author-box">
        <div class="author-box-avatar">MT</div>
        <div>
          <div class="author-box-name">Written by MD Tousif</div>
          <p class="author-box-bio">Founder of QuickBillFree. Building fast, transparent web software that eliminates forced subscriptions and protects digital privacy.</p>
        </div>
      </div>

      <div class="related-posts-section">
        <h3 class="related-posts-title">Related Invoicing Guides</h3>
        <div class="articles-grid" style="margin-top: 16px;">
          <article class="article-card">
            <span class="article-tag tag-guides">Accounting</span>
            <h4 class="article-card-title"><a href="invoice-vs-bill-vs-receipt.html">Invoice vs. Bill vs. Receipt: Timing & Key Differences</a></h4>
            <p class="article-card-excerpt">Learn the legal and bookkeeping distinctions between invoices, bills, and receipts.</p>
            <a href="invoice-vs-bill-vs-receipt.html" class="read-more-link">Read Guide →</a>
          </article>
          <article class="article-card">
            <span class="article-tag tag-guides">Cash Flow</span>
            <h4 class="article-card-title"><a href="payment-terms-guide.html">Invoice Payment Terms: Net 30, Due on Receipt</a></h4>
            <p class="article-card-excerpt">How to structure your payment deadlines and late fees to get paid on time.</p>
            <a href="payment-terms-guide.html" class="read-more-link">Read Guide →</a>
          </article>
        </div>
      </div>
    </article>
  </main>

  <footer class="blog-footer">
    <div class="container">
      <div class="blog-footer-links">
        <a href="../">Free Invoice Generator</a>
        <a href="../bill-maker.html">Online Bill Maker</a>
        <a href="../quote-maker.html">Online Quote Maker</a>
        <a href="../receipt-maker.html">Receipt Maker</a>
        <a href="../hourly-rate-calculator.html">Hourly Rate Calculator</a>
        <a href="../blank-invoice-pdf.html">Blank Invoice PDF</a>
        <a href="index.html">All Guides</a>
        <a href="../#faq">FAQ</a>
        <a href="../privacy.html">Privacy Policy</a>
      </div>
      <p class="blog-copyright">© 2026 QuickBillFree.com • Fast, Secure & Free Client-Side Invoicing</p>
    </div>
  </footer>
</body>
</html>
"""

# 1. Render all 20 HTML files into blog/
for p in ALL_POSTS:
    faq_schema = []
    faq_html = ""
    for item in p.get("faqs", []):
        faq_schema.append({
            "@type": "Question",
            "name": item["q"],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item["a"]
            }
        })
        faq_html += f"""        <h4 style="margin-bottom: 6px;">{item['q']}</h4>\n        <p>{item['a']}</p>\n\n"""

    page = HTML_TEMPLATE
    page = page.replace("__TITLE__", p["title"])
    page = page.replace("__DESCRIPTION__", p["description"])
    page = page.replace("__KEYWORDS__", p["keywords"])
    page = page.replace("__FILENAME__", p["filename"])
    page = page.replace("__BREADCRUMB__", p["breadcrumb"])
    page = page.replace("__CATEGORY__", p["category"])
    page = page.replace("__H1__", p["h1"])
    page = page.replace("__READ_TIME__", str(p["read_time"]))
    page = page.replace("__BODY__", p["content"])
    page = page.replace("__FAQ_JSON__", json.dumps(faq_schema, indent=4))
    page = page.replace("__FAQ_HTML__", faq_html.rstrip())
    page = page.replace("__CTA_TITLE__", p["cta_title"])
    page = page.replace("__CTA_DESC__", p["cta_desc"])
    page = page.replace("__CTA_LINK__", p["cta_link"])
    page = page.replace("__CTA_BTN__", p["cta_btn"])

    filepath = os.path.join("blog", p["filename"])
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(page)
    print(f"Created: {filepath}")

# 2. Update blog/index.html
with open("blog/index.html", "r", encoding="utf-8") as f:
    blog_index = f.read()

# Add cards to articles-grid
new_cards_html = ""
new_itemlist_entries = []
start_pos = 9 # previously positions 1-8

for i, p in enumerate(ALL_POSTS):
    new_cards_html += f"""
        <!-- Article: {p['breadcrumb']} -->
        <article class="article-card">
          <div class="article-card-header">
            <span class="article-tag tag-guides">{p['category']}</span>
            <span class="article-read-time">{p['read_time']} min read</span>
          </div>
          <h3 class="article-card-title">
            <a href="{p['filename']}" style="text-decoration: none; color: inherit;">{p['title']}</a>
          </h3>
          <p class="article-card-excerpt">{p['description']}</p>
          <div class="article-card-footer">
            <span>By MD Tousif</span>
            <a href="{p['filename']}" class="read-more-link">Read Guide →</a>
          </div>
        </article>
"""
    new_itemlist_entries.append({
        "@type": "ListItem",
        "position": start_pos + i,
        "name": p["title"],
        "url": f"https://quickbillfree.com/blog/{p['filename']}"
    })

# Insert new cards at the end of the articles-grid
if "</div>\n    </section>\n\n    <!-- Newsletter / Tool CTA -->" in blog_index:
    blog_index = blog_index.replace("</div>\n    </section>\n\n    <!-- Newsletter / Tool CTA -->", new_cards_html + "\n      </div>\n    </section>\n\n    <!-- Newsletter / Tool CTA -->")

# Insert into ItemList schema
itemlist_json_str = ",\n".join(["          " + json.dumps(entry) for entry in new_itemlist_entries])
target_schema_end = 'url": "https://quickbillfree.com/blog/cra-compliant-invoice-requirements.html"\n          }'
if target_schema_end in blog_index:
    blog_index = blog_index.replace(target_schema_end, target_schema_end + ",\n" + itemlist_json_str)

with open("blog/index.html", "w", encoding="utf-8") as f:
    f.write(blog_index)
print("Updated blog/index.html successfully.")

# 3. Update sitemap.xml
with open("sitemap.xml", "r", encoding="utf-8") as f:
    sitemap = f.read()

new_sitemap_entries = ""
for p in ALL_POSTS:
    url_loc = f"https://quickbillfree.com/blog/{p['filename']}"
    if url_loc not in sitemap:
        new_sitemap_entries += f"""  <url>
    <loc>{url_loc}</loc>
    <lastmod>2026-11-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n"""

sitemap = sitemap.replace("</urlset>", new_sitemap_entries + "</urlset>")
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap)
print("Updated sitemap.xml with 20 new URLs.")

# 4. Update feed.xml
with open("feed.xml", "r", encoding="utf-8") as f:
    feed = f.read()

new_feed_items = ""
for p in ALL_POSTS:
    url_loc = f"https://quickbillfree.com/blog/{p['filename']}"
    if url_loc not in feed:
        new_feed_items += f"""  <item>
    <title>{p['title']}</title>
    <link>{url_loc}</link>
    <guid>{url_loc}</guid>
    <description>{p['description']}</description>
    <pubDate>Sun, 15 Nov 2026 12:00:00 GMT</pubDate>
  </item>\n\n"""

feed = feed.replace("</channel>", new_feed_items + "</channel>")
with open("feed.xml", "w", encoding="utf-8") as f:
    f.write(feed)
print("Updated feed.xml with 20 new items.")

# 5. Update llms.txt
with open("llms.txt", "r", encoding="utf-8") as f:
    llms = f.read()

new_llms_lines = ""
for p in ALL_POSTS:
    url_loc = f"https://quickbillfree.com/blog/{p['filename']}"
    if url_loc not in llms:
        new_llms_lines += f"- [{p['breadcrumb']}](https://quickbillfree.com/blog/{p['filename']}): {p['description']}\n"

llms += "\n" + new_llms_lines
with open("llms.txt", "w", encoding="utf-8") as f:
    f.write(llms)
print("Updated llms.txt with 20 new guides.")

print("All 20 posts completely built and syndicated!")

