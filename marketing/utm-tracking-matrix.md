# Campaign UTM Tracking Matrix & Measurement Guide
### Goal: Measure 20 Completed Invoices Across All Acquisition Channels

This matrix maps every promotional link to its tracked UTM parameters. UTMs label visits that reach Google Analytics 4 (`G-WH81YDKPS6`). They do not guarantee attribution: consent choices, blockers, redirects, sharing and repeat visits can affect measurement. Prepared links do not establish publication or traffic.

---

## 📊 Master UTM Parameter Catalog

| Channel | Platform / Target | Destination Page | Full Tracked URL |
|---|---|---|---|
| **Short Video** | YouTube channel profile (promoted by Short) | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=youtube_shorts&utm_medium=video&utm_campaign=first_invoice&utm_content=channel_profile` |
| **Short Video** | Shorts comment reference (plain text, non-clickable) | App with Preset | `https://quickbillfree.com/?preset=freelance&utm_source=youtube_shorts&utm_medium=video_comment&utm_campaign=first_invoice&utm_content=v1_first_invoice` |
| **Short Video** | TikTok Bio / Desc | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=tiktok&utm_medium=video&utm_campaign=first_invoice&utm_content=v1_quick_invoice` |
| **Short Video** | Instagram Reels (Bio / Story) | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=instagram&utm_medium=reels&utm_campaign=first_invoice&utm_content=v1_quick_invoice` |
| **Short Video** | LinkedIn Video Post | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=linkedin&utm_medium=video&utm_campaign=first_invoice&utm_content=v1_quick_invoice` |
| **Community** | Reddit `r/SideProject` Post | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=reddit&utm_medium=community_post&utm_campaign=first_invoice&utm_content=r_sideproject` |
| **Community** | Reddit `r/freelance` Promo Thread | App with Preset | `https://quickbillfree.com/?preset=freelance&utm_source=reddit&utm_medium=promo_thread&utm_campaign=first_invoice&utm_content=r_freelance_weekly` |
| **Community** | Indie Hackers Post | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=indiehackers&utm_medium=community_post&utm_campaign=first_invoice&utm_content=first_invoice_checklist` |
| **Community** | Hacker News (Show HN) | Homepage | `https://quickbillfree.com/?utm_source=hackernews&utm_medium=show_hn&utm_campaign=first_invoice` |
| **Partnership** | Freelance Newsletter 1 | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=partner_newsletter&utm_medium=resource_link&utm_campaign=freelance_writers_jobs` |
| **Partnership** | Web Design Newsletter 2 | App with Preset | `https://quickbillfree.com/?preset=freelance&utm_source=partner_newsletter&utm_medium=resource_link&utm_campaign=sidebar_io` |
| **Partnership** | Excel Template Syndication | Excel Template Page | `https://quickbillfree.com/excel-invoice-template.html?utm_source=partner_blog&utm_medium=template_download&utm_campaign=free_xlsx_invoice` |
| **Partnership** | Dev Community Link | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=dev_community&utm_medium=referral&utm_campaign=first_invoice` |

---

## Measurement using the implemented events

### Primary signal: `download_invoice_pdf`

The event fires after the PDF library's save promise resolves. It records `doc_type` and `item_count`; it does not send invoice amounts, client names or filenames. This is a successful generation/save-flow signal, not proof the user retained, opened or sent the file. It does not validate the invoice contents.

Use **total users who triggered this event within campaign sessions** as the initial 20-user experiment target, and report event count separately. Twenty events may come from fewer than twenty people. Separate known test activity where possible. GA4 users are measurement identifiers, not verified unique people.

Do not use `generate_lead` alone as PDF success: the app also emits it for an email-draft action. PDF fallback/print activity is separate (`invoice_pdf_fallback`). An event being recorded does not automatically make it a configured GA4 key event.

### Secondary signal: `invoice_template_download_click`

Fires when a marked template link is clicked. The parameter is `template_format`, with `pdf`, `xlsx` or `docx`. It does not confirm the file finished downloading. This is separate from generating a personalized invoice in the editor.

### Validate and report

1. Open a single tracked link and complete a harmless sample invoice. Record when you ran the test.
2. Check whether `download_invoice_pdf` appears in GA4 Realtime. Consent or blockers may prevent collection; do not interpret absence as zero usage without checking.
3. In processed reports, use **Session campaign** = `first_invoice`, broken down by **Session source / medium**. A first-user acquisition dimension answers a different question.
4. Use a GA4 exploration with campaign-session filtering and event name `download_invoice_pdf` to examine event count and total users. Keep sessions and user counts distinct; do not sum overlapping user counts across sources.
5. Report the exact date range, sessions, successful PDF-flow events, users triggering them, and template-link clicks separately. Allow processing time before judging a new placement.

### YouTube Shorts link placement

Ordinary URLs in Shorts descriptions and comments are **not clickable**. Put the tracked destination in a clickable channel profile link, and use the spoken/on-screen CTA “Free invoice tool: link on my channel.” A pinned comment can repeat that instruction, but is not a clickable external-link funnel. Do not attribute a profile click to a particular Short without evidence; use `utm_content=channel_profile` for a shared profile link.

Source: https://support.google.com/youtube/answer/13748639?hl=en

For TikTok, Instagram and other platforms, check the actual account's link placement and eligibility before publishing. A prepared description URL is not proof of a clickable destination. Community placements are candidates until their current rules and account eligibility have been checked.
