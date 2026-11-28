#!/usr/bin/env node
// update-sitemap.js - Keep hub pages in sitemap.xml and exclude noindex programmatic local pages
const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');
let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Remove any programmatic local SEO pages (marked noindex, follow)
sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/quickbillfree\.com\/invoice-generator-[^<]+<\/loc>[\s\S]*?<\/url>/g, '');

const DATE = '2026-11-28';
const hubPages = [
  { loc: 'https://quickbillfree.com/best-free-invoice-generator.html', lastmod: DATE, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://quickbillfree.com/changelog.html', lastmod: DATE, changefreq: 'weekly', priority: '0.8' }
];

const closingTag = '</urlset>';
let base = sitemap.replace(closingTag, '').trimEnd();

let added = 0;
for (const page of hubPages) {
  if (!base.includes(`<loc>${page.loc}</loc>`)) {
    base += `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    added++;
  }
}

fs.writeFileSync(SITEMAP_PATH, base + '\n' + closingTag + '\n');
console.log(`Updated sitemap.xml cleanly (added ${added} missing hub URLs, excluded noindex local pages).`);
