#!/usr/bin/env node
// update-sitemap.js - Append generated local pages + hub pages to sitemap.xml
const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');
const PAGES_DIR = path.join(__dirname, '..');

const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Remove closing tag to append new URLs
const closingTag = '</urlset>';
const base = sitemap.replace(closingTag, '').trimEnd();

const DATE = '2026-11-28';

// Local generated pages
const localPages = fs.readdirSync(PAGES_DIR)
  .filter(f => f.startsWith('invoice-generator-') && f.endsWith('.html'))
  .sort();

// Hub pages
const hubPages = [
  { loc: 'https://quickbillfree.com/best-free-invoice-generator.html', lastmod: DATE, changefreq: 'weekly', priority: '0.85' },
];

let additions = '';

for (const page of hubPages) {
  additions += `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
}

for (const page of localPages) {
  additions += `
  <url>
    <loc>https://quickbillfree.com/${page}</loc>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

const updated = base + additions + '\n' + closingTag + '\n';
fs.writeFileSync(SITEMAP_PATH, updated);

console.log(`Added ${hubPages.length + localPages.length} URLs to sitemap.xml`);
console.log(`  Hub pages: ${hubPages.length}`);
console.log(`  Local pages: ${localPages.length}`);
