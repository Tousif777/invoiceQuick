// scripts/ping-indexnow.js - Broadcast URL changes instantly to Bing, Yahoo, Naver via IndexNow
const fs = require('fs');
const https = require('https');

const HOST = 'quickbillfree.com';
const KEY = '29a8f4c1e6b34d7a8e52c93b1d4e0a7f';
const KEY_LOCATION = `https://${HOST}/29a8f4c1e6b34d7a8e52c93b1d4e0a7f.txt`;

// Extract all URLs from sitemap.xml
function getSitemapUrls() {
  const xml = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = [];
  const regex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

const urlList = getSitemapUrls();
console.log(`Found ${urlList.length} URLs in sitemap.xml to ping via IndexNow...`);

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

const req = https.request('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`✓ IndexNow broadcast success (HTTP ${res.statusCode})! ${urlList.length} URLs sent to Bing/Yahoo/Copilot.`);
    } else {
      console.log(`IndexNow response HTTP ${res.statusCode}: ${body || 'Accepted'}`);
    }
  });
});

req.on('error', (err) => {
  console.warn('IndexNow ping error (will retry next build):', err.message);
});

req.write(payload);
req.end();
