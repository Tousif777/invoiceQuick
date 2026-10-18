# quickbill-invoice

> Lightweight, zero-dependency JavaScript utility for calculating invoice subtotals, tax rates, discounts, and currency formatting. Powered by **[QuickBillFree.com](https://quickbillfree.com)**.

Looking for an instant, interactive web invoice maker without installing packages? Try the live browser generator at **[QuickBillFree.com](https://quickbillfree.com)** (100% free, zero login, instant vector PDF downloads).

---

## 📦 Installation

```bash
npm install quickbill-invoice
```

---

## ⚡ Quick Start

```javascript
const InvoiceCalculator = require('quickbill-invoice');

const items = [
  { description: 'Web Development', rate: 120, quantity: 10 },
  { description: 'UI/UX Design Review', rate: 95, quantity: 4 }
];

const summary = InvoiceCalculator.calculate(items, {
  taxPercent: 8.25,
  discountPercent: 5,
  shipping: 0
});

console.log(summary);
// Output:
// {
//   subtotal: 1580,
//   discountAmount: 79,
//   taxAmount: 123.83,
//   shipping: 0,
//   total: 1624.83
// }

console.log(InvoiceCalculator.formatCurrency(summary.total, 'USD'));
// Output: "$1,624.83"
```

---

## 🌐 Free Web Tools by QuickBillFree

- **[Free Invoice Generator (No Sign Up)](https://quickbillfree.com/free-invoice-generator-no-sign-up.html)** — Instant client-side billing with zero registration.
- **[Google Docs Invoice Template](https://quickbillfree.com/google-docs-invoice-template.html)** — Editable Docs template with automated math alternative.
- **[Google Sheets Invoice Template](https://quickbillfree.com/google-sheets-invoice-template.html)** — Formula-safe spreadsheet invoice maker.
- **[Excel Invoice Template](https://quickbillfree.com/excel-invoice-template.html)** — Free Excel invoice template and vector PDF export.
- **[FreshBooks Alternative](https://quickbillfree.com/freshbooks-alternative.html)** — 100% free zero-subscription invoicing.
- **[QuickBooks Alternative](https://quickbillfree.com/quickbooks-alternative.html)** — Privacy-first freelancer billing tool.

---

## 📄 License
MIT © [QuickBillFree](https://quickbillfree.com)
