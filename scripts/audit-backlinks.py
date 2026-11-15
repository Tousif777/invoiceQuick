#!/usr/bin/env python3
"""Check listed pages for real HTML links; never equate requests with backlinks."""
import concurrent.futures
import datetime
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'backlink-work'

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.matches = []
        self.robots = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta' and a.get('name', '').lower() in ('robots', 'googlebot'):
            self.robots.append(a.get('content', ''))
        if tag == 'a':
            href = a.get('href', '')
            try:
                host = urllib.parse.urlsplit(href).hostname
            except ValueError:
                return
            if host in ('quickbillfree.com', 'www.quickbillfree.com'):
                self.matches.append({'href': href, 'rel': a.get('rel', '')})

def check(url):
    result = {'url': url, 'checked_at': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    if 'web.archive.org/web/*/' in url:
        return dict(result, status='archive-search-not-snapshot', links=[])
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'QuickBillFree-LinkAudit/1.0 (+https://quickbillfree.com/contact.html)'})
        with urllib.request.urlopen(request, timeout=18) as response:
            body = response.read(2_000_000).decode('utf-8', errors='replace')
            result.update(http_status=response.status, final_url=response.url,
                          content_type=response.headers.get('Content-Type', ''),
                          x_robots_tag=response.headers.get('X-Robots-Tag', ''))
        parser = Links()
        parser.feed(body)
        result.update(links=parser.matches, robots=parser.robots)
        result['status'] = 'backlink-observed' if parser.matches else 'no-backlink-observed'
        if 'html' not in result['content_type'].lower():
            result['status'] = 'non-html-response'
    except urllib.error.HTTPError as exc:
        result.update(status='http-error', http_status=exc.code, links=[])
    except Exception as exc:
        result.update(status='request-failed', error=str(exc)[:240], links=[])
    return result

def main():
    urls = list(dict.fromkeys(re.findall(r'\]\((https?://[^\s)]+)\)', (ROOT / 'backlinks-report.md').read_text())))
    OUTPUT.mkdir(exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        results = list(pool.map(check, urls))
    (OUTPUT / 'audit.json').write_text(json.dumps(results, indent=2) + '\n')
    counts = {}
    for row in results:
        counts[row['status']] = counts.get(row['status'], 0) + 1
    lines = ['# QuickBillFree backlink verification', '',
             'Checked at ' + datetime.datetime.now(datetime.timezone.utc).isoformat(), '',
             'An observed backlink means an HTML anchor points to QuickBillFree. It does not establish search indexing, ranking value, independent editorial approval, or domain authority. Blocked and failed requests remain unverified. Archive searches are not confirmed snapshots. No links were created by this audit.', '',
             '| Result | Unique URLs |', '| --- | ---: |']
    lines += [f'| {key} | {value} |' for key, value in sorted(counts.items())]
    lines += ['', '| Listed page | Result | HTTP | Links observed |', '| --- | --- | --- | ---: |']
    lines += [f"| {r['url']} | {r['status']} | {r.get('http_status', '—')} | {len(r.get('links', []))} |" for r in results]
    (OUTPUT / 'audit.md').write_text('\n'.join(lines) + '\n')
    print(json.dumps({'unique_urls': len(results), 'counts': counts}))

if __name__ == '__main__':
    main()
