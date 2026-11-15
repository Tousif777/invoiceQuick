#!/usr/bin/env python3
"""Validate crawlable page metadata, JSON-LD, sitemap targets and local links."""
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.in_title = False
        self.title = ''
        self.descriptions = []
        self.canonicals = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.in_title = True
        if tag == 'meta' and a.get('name') == 'description':
            self.descriptions.append(a.get('content', ''))
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonicals.append(a.get('href', ''))
        for attr in ('href', 'src'):
            if a.get(attr):
                self.links.append(a[attr])
    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
    def handle_data(self, data):
        if self.in_title:
            self.title += data

def main():
    errors = []
    pages = []
    canonicals = []
    schema_count = 0
    xml_resources = 0
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    urls = [node.text for node in sitemap.findall('.//{*}loc')]
    if len(urls) != len(set(urls)):
        errors.append('Duplicate sitemap URLs')
    for url in urls:
        path = unquote(urlsplit(url).path)
        if urlsplit(url).netloc != 'quickbillfree.com':
            errors.append(f'Unexpected sitemap host: {url}')
        file = ROOT / path.lstrip('/')
        if path.endswith('/'):
            file /= 'index.html'
        if not file.is_file():
            errors.append(f'Missing sitemap page: {url}')
            continue
        if file.suffix == '.xml':
            try:
                ET.parse(file)
                xml_resources += 1
            except ET.ParseError as exc:
                errors.append(f'{url}: invalid XML: {exc}')
            continue
        source = file.read_text()
        page = Page()
        page.feed(source)
        name = str(file.relative_to(ROOT))
        if page.h1 != 1:
            errors.append(f'{name}: expected one H1, found {page.h1}')
        if not page.title.strip():
            errors.append(f'{name}: missing title')
        if len(page.descriptions) != 1 or not page.descriptions[0].strip():
            errors.append(f'{name}: expected one nonempty description')
        if page.canonicals != [url]:
            errors.append(f'{name}: canonical differs from sitemap: {page.canonicals}')
        canonicals.extend(page.canonicals)
        for raw in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', source, re.S):
            try:
                data = json.loads(raw)
                schema_count += 1
                if not isinstance(data, (dict, list)):
                    errors.append(f'{name}: JSON-LD must be an object or array')
            except ValueError as exc:
                errors.append(f'{name}: invalid JSON-LD: {exc}')
        for link in page.links:
            parsed = urlsplit(link)
            if parsed.scheme and parsed.scheme not in ('http', 'https'):
                continue
            if parsed.netloc and parsed.netloc not in ('quickbillfree.com', 'www.quickbillfree.com'):
                continue
            if not parsed.path:
                continue
            target = (ROOT / unquote(parsed.path).lstrip('/')) if parsed.path.startswith('/') else file.parent / unquote(parsed.path)
            if parsed.path.endswith('/'):
                target /= 'index.html'
            if not target.exists():
                errors.append(f'{name}: missing local target {link}')
        pages.append({'page': name, 'title': page.title, 'description': page.descriptions[0] if page.descriptions else ''})
    for canonical, count in Counter(canonicals).items():
        if count > 1:
            errors.append(f'Duplicate canonical: {canonical}')
    report = {'sitemap_urls': len(urls), 'pages_checked': len(pages), 'xml_resources_checked': xml_resources, 'valid_json_ld_blocks': schema_count, 'errors': sorted(set(errors)), 'pages': pages}
    output = ROOT / 'seo-work'
    output.mkdir(exist_ok=True)
    (output / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'pages'}, indent=2))
    return 1 if errors else 0

if __name__ == '__main__':
    sys.exit(main())
