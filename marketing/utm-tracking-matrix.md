# Campaign UTM Tracking Matrix & Measurement Guide
### Goal: Measure 20 Completed Invoices Across All Acquisition Channels

This matrix maps every promotional link to its tracked UTM parameters. By using these exact query strings, every visitor, session, and invoice download will be correctly attributed in Google Analytics 4 (`G-WH81YDKPS6`).

---

## 📊 Master UTM Parameter Catalog

| Channel | Platform / Target | Destination Page | Full Tracked URL |
|---|---|---|---|
| **Short Video** | YouTube Shorts (Bio / Desc) | Freelance Landing | `https://quickbillfree.com/freelance-invoice-generator.html?utm_source=youtube_shorts&utm_medium=video&utm_campaign=first_invoice&utm_content=v1_first_invoice` |
| **Short Video** | YouTube Shorts (Pinned Comment) | App with Preset | `https://quickbillfree.com/?preset=freelance&utm_source=youtube_shorts&utm_medium=video_comment&utm_campaign=first_invoice&utm_content=v1_first_invoice` |
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

## 🎯 GA4 Key Event Definitions & Measurement

QuickBillFree has built-in Google Analytics 4 event listeners in `js/invoice.js` and `js/template-downloads.js`.

### 1. Primary Success Metric: `invoice_download_success`
- **When it fires:** Triggered immediately when a visitor clicks "Download PDF" and the PDF file is successfully compiled and downloaded by the user's browser.
- **Payload parameters:**
  - `doc_type`: "INVOICE"
  - `currency`: USD / EUR / GBP / etc.
  - `item_count`: number of line items
  - `total_amount`: total invoiced sum
- **Target:** **20 unique events** from campaign sources over 14 days.

### 2. Secondary Metric: `invoice_template_download_click`
- **When it fires:** Triggered when a visitor clicks to download `quickbillfree-invoice-template.xlsx` or `quickbillfree-invoice-template.docx`.
- **Payload parameters:**
  - `file_type`: "xlsx" or "docx"
  - `file_name`: filename downloaded
- **Signal:** Shows strong bottom-of-funnel intent for offline users.

---

## 🔍 How to Monitor Realtime & Campaign Performance in GA4

### Step 1: Realtime Validation (Before Launch)
1. Open any of the tracked URLs above in your browser (e.g. on mobile or incognito).
2. Open **Google Analytics 4** -> **Realtime**.
3. Verify that `page_view` shows `source = youtube_shorts` or `reddit` and `campaign = first_invoice`.
4. Click **Download PDF** on the app.
5. In the Realtime **Event count by Event name** card, confirm that `invoice_download_success` increments by 1.

### Step 2: Campaign Traffic Report (Days 4–14)
1. Go to GA4 -> **Reports** -> **Acquisition** -> **Traffic acquisition**.
2. Change the primary dimension dropdown to **Session source / medium** or **Session campaign**.
3. In the search box, filter by `first_invoice`.
4. Check columns:
   - **Users** (Total reached)
   - **Sessions** (Visits)
   - **Engaged sessions** (Spent >10 seconds or clicked buttons)
   - **Event count** (Filter by `invoice_download_success`)
