# QuickBillFree backlink campaign — 15 November 2026

## Completed submissions

| Directory | Submission page | Server result | Placement status |
| --- | --- | --- | --- |
| CareerFlora | https://careerflora.com/open-source-tools | HTTP 201 accepted earlier; November 17 public HTML includes the QuickBillFree tool card and structured data | Published in fetched HTML; browser visit encountered a browser-check page |
| LaunchPedia | https://launchpedia.co/submit/ | HTTP 200, `success: true`; “Your submission was successful.” | Submitted; public placement unverified |
| Lorik Roo | https://lorikroo.com/ | HTTP 200, `ok: true` | Pending editorial approval |
| Totally Free Tools | https://totallyfreetools.com/submit | HTTP 201, submission **603**, `status: pending` | Pending editorial approval |
| FreeNoSignup | https://freenosignup.com/submit/ | Google Forms confirmation: “আপনার প্রতিক্রিয়া রেকর্ড করা হয়েছে৷” (Your response has been recorded.) | Submitted; public placement unverified |
| TechTools Launchpad | https://techtools.cz/tools/launchpad/?tool=10440 | HTTP 201; public listing **10440** retrieved successfully afterward through its public API | Published directory listing; search indexing unverified |
| Startup Collections | https://startupcollections.com/submit-product/ | HTTP 403 | Failed; no accepted submission |

Raw receipts are saved in [submissions.json](submissions.json). Six submissions were accepted: five await public placement verification, and TechTools Launchpad has a publicly retrievable listing. A published listing does not establish Google indexing, ranking value or referral traffic. No payment was made and no account was created. The public business contact already present in the repository was used for submissions requiring contact details. Earlier accepted applications were not resubmitted.

A limited live-site accessibility check and additional route findings are saved in [traffic-check.md](traffic-check.md). Search Console and Analytics metrics were unavailable, so no cause of low traffic or traffic improvement is asserted.

## Existing-link verification

- 284 unique URLs extracted from the historical report.
- HTML anchors to QuickBillFree observed on 103 pages across four domains: 76 Telegraph pages, 25 Rentry pages, one GitHub repository and one Netcraft diagnostic page.
- Netcraft returned a `noindex, nofollow` robots directive.
- 80 archive-search URLs do not prove that a snapshot exists.
- 50 responses contained no observed backlink; 38 returned HTTP errors; 12 requests failed; one returned a non-HTML response.
- Blocked, failed and non-HTML responses remain unverified. A missing backlink in fetched HTML is not proof that a rendered page could never contain one.
- These observations do not establish search indexing, ranking value, independent editorial approval or domain authority.

Recheck using `python3 scripts/audit-backlinks.py` from the repository root. It generates `backlink-work/audit.md` and `backlink-work/audit.json` with each URL, observed target links, `rel` attributes, response status and robots metadata. These reproducible reports are ignored by Git. This command only audits existing listed pages; it does not publish or submit anything.

## Other routes checked

| Route | Finding / next dependency |
| --- | --- |
| Fr. Tools | Its contact page JavaScript prevents submission and displays success after a timer; no network submission is implemented in that handler. Do not treat that as a sent message. Direct email is an alternative, but no email-sending connection is available. |
| AllToolsDirectory | Submission redirects to sign-in. |
| Launching Next | HTTP 403 on the submission page. |
| Startup Stash | HTTP 403 on the submission page. |
| Joinly | Submission requires agreement to terms and a thumbnail; no submission made. |
| Phyco | HTTP 403 on the submission page. |
| SoMuch | HTTP 403 on the submission page. |
| NoUploadTools | Submission-page request timed out. |
| Gampangin / alatbantu.online | Submission-page request timed out. |
| Bluebird | HTTP 403 on the submission page. |
| Ignlab Launch | Submission code requires an anti-bot math challenge; no attempt to solve or bypass it. |
| Tool Commons | Requires no ads/tracking and an OSI-approved license. Current advertising/analytics and missing root LICENSE make this a poor fit. |
| Awesome Invoicing | Relevant free-generator category; submission requires a GitHub contribution and authenticated access. |

GitHub push access was checked with a dry run and failed because no username/credential was available. Chrome computer access was denied. No repository changes were pushed, and no authenticated social posting was performed.

## Prepared material

[listing-copy.json](listing-copy.json) contains reusable, factual listing descriptions. The tool is not presented as an AI product, legally certified billing software, or a tracking-free website. The repository declares MIT in its README but lacks a root LICENSE file; no license file has been invented or added on the owner's behalf.

Prefer relevant reviewed listings and useful contributions. Google identifies links created primarily to manipulate ranking, including automated link creation and low-quality directory links, as link spam: https://developers.google.com/search/docs/essentials/spam-policies#link-spam

## Follow-through

TechTools Launchpad listing 10440 was verified using `GET https://techtools.cz/launchpad-api/tools/10440` after publication. The public API returns QuickBillFree's website and description. A crawlable HTML backlink and Google indexing have not been verified. The other five accepted submissions remain pending public placement verification. Their receipts are retained to avoid duplicate applications.

QuestStack's availability check returned HTTP 403 during the latest batch; no listing or paid extra was submitted there. No votes, reviews or usage figures were fabricated.

## November 17 follow-through

- CareerFlora's public HTML now contains QuickBillFree's product card, official website URL and description. This upgrades its earlier pending status; a browser visit encountered a browser-check interstitial. No Google indexing or referral traffic is established.
- Submitted QuickBillFree to PostLaunchKit as an authorized agent in Finance and money / Web / Free, describing the live PDF, XLSX and DOCX resources and disclosing ads and analytics. The directory's duplicate-search response had no match before submission. The form returned “Submitted for review.” Independently opened status page: https://postlaunchkit.com/directory/status/bb301087-47df-463d-8678-cade91313c7b/ — pending review, not public. The site's displayed date is November 16; the local task date is November 17. No payment or reciprocal badge was added.
- No QuickBillFree text was observed in the fetched homepages of Lorik Roo, FreeNoSignup or Totally Free Tools. That limited check does not prove rejection or absence elsewhere. Existing applications were not duplicated.
- Verified the new A4 PDF download is live (HTTP 200 and valid PDF header).

The campaign now has seven accepted submissions overall: CareerFlora has a public HTML entry, TechTools has a publicly retrievable API listing, and five submissions await public placement verification. These are distribution placements/applications, not measured new users or guaranteed ranking gains.
