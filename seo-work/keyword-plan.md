# QuickBillFree keyword research and SEO changes

Researched 15 November 2026. Target: English-language searches by freelancers, contractors and small businesses. No paid keyword database or authenticated Search Console account was available. Search volume, keyword difficulty, Google position and expected traffic are **not measured** here. Priorities reflect product fit and observed search intent, not a claim of low competition.

## Keywords to target

| Priority | Keyword cluster | Existing destination | What the visitor needs |
| --- | --- | --- | --- |
| 1 | free invoice generator; invoice maker online; invoice generator PDF | `/` | An editor that works immediately and exports a PDF |
| 1 | freelance invoice generator; hourly invoice template; invoice for freelance work | `/freelance-invoice-generator.html` | Hours, rates, fixed-price items and an editable example |
| 1 | contractor invoice generator; labor and materials invoice; contractor invoice with deposit | `/contractor-invoice-generator.html` | Separate labor/materials, job reference and balance after a deposit |
| 1 | free receipt maker; cash payment receipt PDF; payment receipt generator | `/receipt-maker.html` | Record an actual payment and export the receipt |
| 1 | printable blank invoice PDF; blank invoice form to print | `/blank-invoice-pdf.html` | A blank form ready to print or fill in |
| 2 | invoice generator without signup; invoice maker without account | `/free-invoice-generator-no-sign-up.html` | Create a document without registration or email capture |
| 2 | free invoice generator without watermark; unbranded invoice PDF | `/free-invoice-generator-no-watermark.html` | Clear instructions for removing the footer before exporting |
| 2 | free quote maker; online estimate maker; job quote PDF | `/quote-maker.html` | Itemized costs, scope and proposal terms |
| 2 | freelance hourly rate calculator; salary to freelance rate | `/hourly-rate-calculator.html` | Estimate a billable rate from explicit assumptions |
| 2 | online bill maker; bill generator PDF | `/bill-maker.html` | Start the bill template and export it |
| 3 | invoice vs bill vs receipt | `/blog/invoice-vs-bill-vs-receipt.html` | Understand which document to use |
| 3 | browser invoice storage; invoice generator privacy; client-side invoicing | `/blog/client-side-invoicing-privacy.html` | Understand draft persistence, backups, tracking and sharing |

The homepage is the main invoice editor. Supporting pages should focus on their own task and link to that editor. The no-signup and no-watermark pages overlap with the homepage; monitor which URL Google shows for those queries before considering consolidation. No existing URLs were removed, redirected or excluded from indexing in this batch.

## What the search results showed

Current product pages commonly pair invoice generation with PDF export and no registration. Their task-specific pages explain hours, fixed project fees, labor/materials and deposits. This supports the keyword-to-task mapping above; it does not establish search demand or competitor traffic.

Examples reviewed:

- [MakeMeABill](https://makemeabill.com/) — immediate invoice editing and PDF export.
- [EasyInvoicePDF](https://easyinvoicepdf.com/) — browser-based generation without login.
- [Billwise freelance invoice generator](https://billwise.dev/freelance-invoice-generator) — hours, projects and browser drafts.
- [Invoice to PDF contractor generator](https://invoice-to-pdf.com/contractor-invoice-generator) — labor, materials and deposits.
- [Contractor Invoice Generator](https://contractorinvoicegenerator.com/) — job and contractor-specific fields.

Descriptions and invoice examples added to QuickBillFree were written for this project; competitor copy was not reused.

## Implemented locally

- Updated titles, descriptions and social metadata on ten pages around their specific tasks. No keyword-volume claims, keyword stuffing or additional near-duplicate landing pages were added.
- Added a concise how-to section and contextual tool links on the homepage.
- Added worked examples for freelance billing and contractor deposits, with illustrative prices explicitly labeled.
- Connected freelance and contractor creation buttons to their existing editor presets.
- Added a blank receipt preset and connected receipt buttons to it. It does not automatically mark an unverified payment as paid.
- Removed unsupported aggregate ratings from 27 HTML pages. No review evidence supporting those counts was present on those pages.
- Synchronized homepage FAQ structured data with its five visible questions, and added WebSite identity markup. This does not guarantee a rich result.
- Rewrote the browser-storage guide to distinguish local drafts from encryption, backups, external tracking and link sharing. Corrected unsupported claims about guaranteed privacy and compliance in that guide.
- Corrected receipt guidance and watermark-removal instructions on the edited pages.
- Updated sitemap modification dates for the 31 HTML pages changed in this batch.
- Fixed 16 unescaped ampersands that made the RSS feed invalid XML.

Guidance used: Google's [title-link recommendations](https://developers.google.com/search/docs/appearance/title-link), [snippet guidance](https://developers.google.com/search/docs/appearance/snippet), [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), and [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Google controls indexing and rankings; these changes do not guarantee the first position.

## Validation and publication status

`python3 scripts/check-seo.py` passed: all 80 sitemap resources exist, 79 HTML pages have the checked metadata and local targets, the RSS XML parses, and 77 JSON-LD blocks parse. The command generates `seo-work/validation.json`, which is ignored by Git. These are structural checks, not a Google Rich Results Test or a visual browser test.

`node --check js/invoice.js` passed. A Node VM check of the actual preset/loading code passed for the blank receipt, freelance and contractor templates, query cleanup, saved drafts and unknown-preset fallback. A browser interaction test was not performed.

**These changes are local and have not been published.** The earlier GitHub dry-run push failed because authentication was unavailable. Existing unrelated changes in `SITE_DOCUMENTATION.md` were preserved. No claim is made that Google has crawled these edits.

## Measure after deployment

Use [Search Console Performance and URL Inspection](https://developers.google.com/search/docs/monitor-debug/search-console-start) to confirm indexing and compare queries, landing pages, impressions, clicks and click-through rate over comparable periods. Check whether the right page is appearing for each task. Use the app's existing PDF-download events to distinguish visitors from people who complete a useful document. No traffic baseline, ranking gain or conversion improvement was available to report in this task.

Broader competitor-comparison pages and jurisdiction-specific tax/legal guides were not independently audited in this batch. They should be fact-checked before treating their claims as a source of authority.
