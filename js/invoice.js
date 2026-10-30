// js/invoice.js - Super Intuitive Client-Side Invoice Generator Engine

(function(window) {
  'use strict';

  const STORAGE_KEY = 'simple_invoice_data_v1';
  const HISTORY_KEY = 'iq_saved_invoices_v1';
  const CLIENTS_KEY = 'iq_saved_clients_v1';

  const CURRENCIES = {
    USD: { symbol: '$', code: 'USD' },
    EUR: { symbol: '€', code: 'EUR' },
    GBP: { symbol: '£', code: 'GBP' },
    CAD: { symbol: 'CA$', code: 'CAD' },
    AUD: { symbol: 'A$', code: 'AUD' },
    INR: { symbol: '₹', code: 'INR' },
    JPY: { symbol: '¥', code: 'JPY' },
    SGD: { symbol: 'S$', code: 'SGD' },
    NZD: { symbol: 'NZ$', code: 'NZD' },
    HKD: { symbol: 'HK$', code: 'HKD' },
    CNY: { symbol: '¥', code: 'CNY' },
    BDT: { symbol: '৳', code: 'BDT' },
    PKR: { symbol: 'Rs', code: 'PKR' },
    PHP: { symbol: '₱', code: 'PHP' },
    MYR: { symbol: 'RM', code: 'MYR' },
    IDR: { symbol: 'Rp', code: 'IDR' },
    THB: { symbol: '฿', code: 'THB' },
    VND: { symbol: '₫', code: 'VND' },
    CHF: { symbol: 'CHF', code: 'CHF' },
    AED: { symbol: 'AED', code: 'AED' },
    SAR: { symbol: 'SAR', code: 'SAR' },
    QAR: { symbol: 'QAR', code: 'QAR' },
    ILS: { symbol: '₪', code: 'ILS' },
    TRY: { symbol: '₺', code: 'TRY' },
    PLN: { symbol: 'zł', code: 'PLN' },
    SEK: { symbol: 'kr', code: 'SEK' },
    NOK: { symbol: 'kr', code: 'NOK' },
    DKK: { symbol: 'kr', code: 'DKK' },
    BRL: { symbol: 'R$', code: 'BRL' },
    MXN: { symbol: 'Mex$', code: 'MXN' },
    ZAR: { symbol: 'R', code: 'ZAR' },
    NGN: { symbol: '₦', code: 'NGN' },
    KES: { symbol: 'KSh', code: 'KES' },
    EGP: { symbol: 'E£', code: 'EGP' }
  };

  const DEFAULT_CLIENTS = [
    {
      name: 'Global Enterprises Inc.',
      details: 'Attn: Accounting Dept\n456 Market Plaza, Suite 200\naccounts@globalent.com'
    },
    {
      name: 'Nexus Digital Media',
      details: 'Finance Department\n800 Tech Boulevard, Level 4\nbilling@nexusdigital.io'
    }
  ];

  // GA4 Conversion & Engagement Event Tracker
  function trackEvent(eventName, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
    } catch (err) {
      console.debug('Analytics dispatch notice:', err);
    }
  }

  const I18N = {
    en: {
      name: 'English',
      docTitle: 'INVOICE',
      invoiceNumber: 'Invoice #',
      poNumber: 'P.O. #',
      issueDate: 'Issue Date',
      dueDate: 'Due Date',
      terms: 'Terms:',
      billedFrom: 'Billed From (Your Details)',
      billedTo: 'Billed To (Client Details)',
      shipTo: 'Ship To (Delivery Details)',
      colDesc: 'Item Description',
      colQty: 'Quantity',
      colHours: 'Hours',
      colDays: 'Days',
      colRate: 'Unit Price',
      colTotal: 'Line Total',
      addItem: '➕ Add Line Item',
      notesLabel: 'Notes & Instructions',
      termsLabel: 'Payment Methods / Terms',
      signatureLabel: 'Authorized Signature',
      qrLabel: 'Payment QR Code',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      shipping: 'Shipping',
      amountPaid: 'Amount Paid',
      totalDue: 'Total Due:',
      balanceDue: 'Balance Due:',
      btnDownload: '📥 Download PDF',
      btnPrint: '🖨️ Print',
      btnEmail: '✉️ Email',
      btnClear: 'Clear'
    },
    es: {
      name: 'Español',
      docTitle: 'FACTURA',
      invoiceNumber: 'Factura Nº',
      poNumber: 'Nº Pedido',
      issueDate: 'Fecha Emisión',
      dueDate: 'Vencimiento',
      terms: 'Plazo:',
      billedFrom: 'Emisor (Tus Datos)',
      billedTo: 'Facturar a (Cliente)',
      shipTo: 'Enviar a (Entrega)',
      colDesc: 'Descripción',
      colQty: 'Cantidad',
      colHours: 'Horas',
      colDays: 'Días',
      colRate: 'Precio Unitario',
      colTotal: 'Importe Total',
      addItem: '➕ Añadir Línea',
      notesLabel: 'Notas e Instrucciones',
      termsLabel: 'Métodos y Términos de Pago',
      signatureLabel: 'Firma Autorizada',
      qrLabel: 'Código QR de Pago',
      subtotal: 'Subtotal',
      tax: 'IVA / Impuesto',
      discount: 'Descuento',
      shipping: 'Envío',
      amountPaid: 'Importe Pagado',
      totalDue: 'Total a Pagar:',
      balanceDue: 'Saldo Pendiente:',
      btnDownload: '📥 Descargar PDF',
      btnPrint: '🖨️ Imprimir',
      btnEmail: '✉️ Correo',
      btnClear: 'Borrar'
    },
    fr: {
      name: 'Français',
      docTitle: 'FACTURE',
      invoiceNumber: 'Facture N°',
      poNumber: 'N° Commande',
      issueDate: 'Date d\'émission',
      dueDate: 'Date d\'échéance',
      terms: 'Modalités:',
      billedFrom: 'Émetteur (Vos Coordonnées)',
      billedTo: 'Facturé à (Client)',
      shipTo: 'Livrer à (Adresse)',
      colDesc: 'Description',
      colQty: 'Quantité',
      colHours: 'Heures',
      colDays: 'Jours',
      colRate: 'Prix Unitaire',
      colTotal: 'Montant Total',
      addItem: '➕ Ajouter une Ligne',
      notesLabel: 'Notes & Instructions',
      termsLabel: 'Conditions de Paiement',
      signatureLabel: 'Signature Autorisée',
      qrLabel: 'QR Code de Paiement',
      subtotal: 'Sous-total',
      tax: 'TVA',
      discount: 'Remise',
      shipping: 'Frais de Port',
      amountPaid: 'Montant Réglé',
      totalDue: 'Total TTC:',
      balanceDue: 'Reste à Payer:',
      btnDownload: '📥 Télécharger PDF',
      btnPrint: '🖨️ Imprimer',
      btnEmail: '✉️ E-mail',
      btnClear: 'Effacer'
    },
    de: {
      name: 'Deutsch',
      docTitle: 'RECHNUNG',
      invoiceNumber: 'Rechnung Nr.',
      poNumber: 'Bestell-Nr.',
      issueDate: 'Rechnungsdatum',
      dueDate: 'Fälligkeitsdatum',
      terms: 'Zahlungsziel:',
      billedFrom: 'Rechnungssteller (Absender)',
      billedTo: 'Rechnungsempfänger (Kunde)',
      shipTo: 'Lieferadresse',
      colDesc: 'Bezeichnung',
      colQty: 'Menge',
      colHours: 'Stunden',
      colDays: 'Tage',
      colRate: 'Einzelpreis',
      colTotal: 'Gesamtpreis',
      addItem: '➕ Position hinzufügen',
      notesLabel: 'Hinweise & Bemerkungen',
      termsLabel: 'Zahlungsbedingungen & IBAN',
      signatureLabel: 'Unterschrift',
      qrLabel: 'Zahlungs-QR-Code',
      subtotal: 'Zwischensumme',
      tax: 'MwSt.',
      discount: 'Rabatt',
      shipping: 'Versandkosten',
      amountPaid: 'Bezahlt',
      totalDue: 'Gesamtbetrag:',
      balanceDue: 'Offener Betrag:',
      btnDownload: '📥 PDF Herunterladen',
      btnPrint: '🖨️ Drucken',
      btnEmail: '✉️ E-Mail',
      btnClear: 'Zurücksetzen'
    },
    pt: {
      name: 'Português',
      docTitle: 'FATURA',
      invoiceNumber: 'Fatura Nº',
      poNumber: 'Nº Pedido',
      issueDate: 'Data de Emissão',
      dueDate: 'Vencimento',
      terms: 'Termos:',
      billedFrom: 'Emitente (Seus Dados)',
      billedTo: 'Faturar a (Cliente)',
      shipTo: 'Enviar para (Entrega)',
      colDesc: 'Descrição',
      colQty: 'Quantidade',
      colHours: 'Horas',
      colDays: 'Dias',
      colRate: 'Preço Unitário',
      colTotal: 'Valor Total',
      addItem: '➕ Adicionar Item',
      notesLabel: 'Notas e Instruções',
      termsLabel: 'Formas e Termos de Pagamento',
      signatureLabel: 'Assinatura Autorizada',
      qrLabel: 'QR Code de Pagamento',
      subtotal: 'Subtotal',
      tax: 'Imposto / IVA',
      discount: 'Desconto',
      shipping: 'Frete',
      amountPaid: 'Valor Pago',
      totalDue: 'Total a Pagar:',
      balanceDue: 'Saldo Devedor:',
      btnDownload: '📥 Baixar PDF',
      btnPrint: '🖨️ Imprimir',
      btnEmail: '✉️ E-mail',
      btnClear: 'Limpar'
    },
    it: {
      name: 'Italiano',
      docTitle: 'FATTURA',
      invoiceNumber: 'Fattura N°',
      poNumber: 'N° Ordine',
      issueDate: 'Data Emissione',
      dueDate: 'Scadenza',
      terms: 'Termini:',
      billedFrom: 'Emittente (I Tuoi Dati)',
      billedTo: 'Intestato a (Cliente)',
      shipTo: 'Spedire a (Destinazione)',
      colDesc: 'Descrizione',
      colQty: 'Quantità',
      colHours: 'Ore',
      colDays: 'Giorni',
      colRate: 'Prezzo Unitario',
      colTotal: 'Totale Riga',
      addItem: '➕ Aggiungi Voce',
      notesLabel: 'Note & Istruzioni',
      termsLabel: 'Termini di Pagamento & IBAN',
      signatureLabel: 'Firma Autorizzata',
      qrLabel: 'QR Code di Pagamento',
      subtotal: 'Subtotale',
      tax: 'IVA',
      discount: 'Sconto',
      shipping: 'Spedizione',
      amountPaid: 'Importo Pagato',
      totalDue: 'Totale da Saldare:',
      balanceDue: 'Totale Dovuto:',
      btnDownload: '📥 Scarica PDF',
      btnPrint: '🖨️ Stampa',
      btnEmail: '✉️ Email',
      btnClear: 'Cancella'
    }
  };

  const DEFAULT_STATE = {
    lang: 'en',
    currency: 'USD',
    invoiceNumber: 'INV-1001',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    logo: null,
    
    // Sender (From)
    fromName: 'Acme Studio Co.',
    fromDetails: '123 Creative Street\nSan Francisco, CA 94103\ncontact@acmestudio.com',

    // Client (Bill To)
    toName: 'Global Enterprises Inc.',
    toDetails: 'Attn: Accounting Dept\n456 Market Plaza, Suite 200\naccounts@globalent.com',

    // Ship To (Optional)
    shipToName: '',
    shipToDetails: '',
    showShipTo: false,

    // Items
    items: [
      { description: 'Website Redesign & UI Development', quantity: 1, rate: 2400 },
      { description: 'Mobile Responsive Optimization', quantity: 8, rate: 95 },
      { description: 'SEO Performance Audit & Setup', quantity: 1, rate: 450 }
    ],

    // Adjustments & Visibility
    taxLabel: 'Tax',
    taxRate: 8,
    discountType: 'percent',
    discountRate: 0,
    shippingAmount: 0,
    showShipping: false,
    unitType: 'Quantity',
    showNotes: true,
    showTerms: true,
    showTax: true,
    showDiscount: false,
    showQr: false,
    qrLink: '',
    layout: 'modern',
    docType: 'INVOICE',
    accentColor: '#4f46e5',

    // Notes
    notes: 'Thank you for your business! Please remit payment within 14 days.',
    terms: 'Payment via Bank Transfer (Wire/ACH):\nBank Name: Silicon Valley Bank\nAccount: 1234-5678-9012\nRouting: 987654321',

    // Power Features
    poNumber: '',
    amountPaid: 0,
    showAmountPaid: false,
    showPoweredBy: true,
    stamp: 'none',
    showSignature: true,
    signatureData: null,
    signerName: 'Authorized Signatory',
    invoiceId: 'inv_' + Date.now(),
    status: 'Draft'
  };

  let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  let isDrawingSignature = false;
  let activeHistoryFilter = 'all';

  // Helper formatting
  function getCurrencySymbol() {
    return (CURRENCIES[state.currency] || CURRENCIES.USD).symbol;
  }

  function formatMoney(amount) {
    const symbol = getCurrencySymbol();
    const num = Number(amount) || 0;
    return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Calculate Subtotal, Tax, Discount, Shipping, Grand Total, and Balance Due
  function calculateTotals() {
    let subtotal = 0;
    state.items.forEach(item => {
      const q = Math.max(0, Number(item.quantity) || 0);
      const r = Math.max(0, Number(item.rate) || 0);
      subtotal += (q * r);
    });

    let discountAmount = 0;
    if (state.showDiscount) {
      const discVal = Math.max(0, Number(state.discountRate) || 0);
      if (state.discountType === 'fixed') {
        discountAmount = Math.min(subtotal, discVal);
      } else {
        discountAmount = (subtotal * discVal) / 100;
      }
    }

    const taxableBase = Math.max(0, subtotal - discountAmount);
    const taxPercent = state.showTax ? Math.max(0, Number(state.taxRate) || 0) : 0;
    const taxAmount = (taxableBase * taxPercent) / 100;

    const shippingAmount = state.showShipping ? Math.max(0, Number(state.shippingAmount) || 0) : 0;
    const grandTotal = Math.max(0, taxableBase + taxAmount + shippingAmount);
    const amountPaid = state.showAmountPaid ? Math.max(0, Number(state.amountPaid) || 0) : 0;
    const balanceDue = Math.max(0, grandTotal - amountPaid);

    return {
      subtotal: subtotal,
      taxAmount: taxAmount,
      discountAmount: discountAmount,
      shippingAmount: shippingAmount,
      grandTotal: grandTotal,
      amountPaid: amountPaid,
      balanceDue: balanceDue
    };
  }

  // Save to LocalStorage & Sync with Invoices History
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      syncToHistory();
      showSaveIndicator();
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  // Industry Presets for Programmatic Niche Invoicing Pages
  const PRESETS = {
    plumber: {
      fromName: 'Apex Plumbing & Pipeworks LLC',
      fromDetails: '742 Pipeline Road\nAustin, TX 78701\nservice@apexplumbing.com\nLic #PL-89421',
      toName: 'Oak Ridge Residential Management',
      toDetails: 'Attn: Property Manager\n1200 Hill Country Blvd, Unit 4B\nAustin, TX 78704',
      items: [
        { description: 'Emergency Drain Snaking & Hydro-Jetting (Main Line)', quantity: 1, rate: 385 },
        { description: 'PEX Pipe Replacement & Copper Fitting Joints', quantity: 4, rate: 65 },
        { description: 'Master Bathroom Faucet & Valve Cartridge Rebuild', quantity: 2, rate: 140 },
        { description: 'Standard Service Call & Diagnostic Fee', quantity: 1, rate: 95 }
      ],
      notes: 'Work completed as per local residential plumbing code. 1-year warranty on all installed fixtures and pipe joints.',
      terms: 'Payment due on receipt. We accept Credit Card, Zelle, or Check payable to Apex Plumbing LLC.',
      taxRate: 8.25,
      docType: 'INVOICE'
    },
    electrician: {
      fromName: 'VoltCraft Electrical Services',
      fromDetails: '88 Spark Avenue, Suite 104\nDenver, CO 80202\ninfo@voltcraft-electric.com\nMaster Electrician Lic #ME-44912',
      toName: 'Highland Commercial Offices',
      toDetails: 'Attn: Facilities Director\n500 Mountain View Parkway\nDenver, CO 80211',
      items: [
        { description: '200A Main Service Panel Upgrade & Breakers', quantity: 1, rate: 1850 },
        { description: 'Dedicated 240V Circuit for EV Charger Station', quantity: 1, rate: 650 },
        { description: 'Commercial LED Recessed Troffer Retrofit & Dimmer Relays', quantity: 12, rate: 75 },
        { description: 'Electrical Safety Inspection & Permit Filing Fee', quantity: 1, rate: 220 }
      ],
      notes: 'All wiring certified and inspected to National Electrical Code (NEC) standards. 2-year workmanship guarantee.',
      terms: 'Net 15 days. ACH / Wire Transfer: Silicon Valley Bank, Routing 102000076, Acct 88291044.',
      taxRate: 7.5,
      docType: 'INVOICE'
    },
    cleaning: {
      fromName: 'Pristine Clean Professional Services',
      fromDetails: '14 Cleanway Terrace\nChicago, IL 60611\nhello@pristinecleanpro.com\n(312) 555-0199',
      toName: 'Horizon Creative Studios',
      toDetails: 'Attn: Studio Operations\n330 Michigan Avenue, 8th Floor\nChicago, IL 60601',
      items: [
        { description: 'Commercial Deep Office Cleaning & Sanitation (4,000 sq ft)', quantity: 1, rate: 450 },
        { description: 'High-Pressure Carpet Steam Cleaning & Stain Extraction', quantity: 3, rate: 120 },
        { description: 'Exterior & Interior Window Glazing Wash', quantity: 16, rate: 18 },
        { description: 'Restroom Restock & Eco-Friendly Consumables Pack', quantity: 1, rate: 95 }
      ],
      notes: 'Thank you for keeping your workspace spotless! Hospital-grade EPA eco-friendly supplies used throughout.',
      terms: 'Payment due upon completion. We accept Card, Venmo Business, or Bank Transfer.',
      taxRate: 6.0,
      docType: 'INVOICE'
    },
    trucking: {
      fromName: 'CrossCountry Haul & Freight LLC',
      fromDetails: '100 Interstate Freight Corridor\nDallas, TX 75201\ndispatch@crosscountryfreight.com\nUSDOT #3928174 | MC #918234',
      toName: 'Lone Star Logistics Hub',
      toDetails: 'Attn: Freight Receiving Dept\n8800 Commerce Way, Bay 14\nFort Worth, TX 76177',
      items: [
        { description: 'Dry Van Freight Haul (Dallas, TX to Atlanta, GA - 780 mi)', quantity: 1, rate: 2150 },
        { description: 'Fuel Surcharge (DOE Index Adjusted)', quantity: 1, rate: 380 },
        { description: 'Driver Detention Fee (Bay 14 Unloading > 2 hrs)', quantity: 2, rate: 85 },
        { description: 'Lumper & Pallet Restack Fee', quantity: 1, rate: 160 }
      ],
      notes: 'BOL signed clean with no shortages or damages. Proof of Delivery (POD) attached.',
      terms: 'Standard Net 30. QuickPay 2% discount if paid within 10 days. Remit to CrossCountry Freight LLC.',
      taxRate: 0,
      docType: 'INVOICE'
    },
    landscaping: {
      fromName: 'GreenThumb Landscape & Turf Care',
      fromDetails: '45 Meadow Lane\nCharlotte, NC 28202\ncontact@greenthumbnc.com\n(704) 555-0182',
      toName: 'Magnolia Estates HOA',
      toDetails: 'Attn: HOA Board of Directors\n120 Magnolia Ridge Dr\nCharlotte, NC 28226',
      items: [
        { description: 'Commercial Turf Mowing, Edging, Trimming & Debris Blow', quantity: 4, rate: 325 },
        { description: 'Mulch Installation (Double-Shredded Hardwood Bark - 10 yds)', quantity: 10, rate: 65 },
        { description: 'Seasonal Flowerbed Planting & Perennial Pruning', quantity: 1, rate: 420 },
        { description: 'Irrigation Backflow Testing & Drip Line Inspection', quantity: 1, rate: 180 }
      ],
      notes: 'Monthly grounds maintenance completed. Lawn treated with organic slow-release fertilizer.',
      terms: 'Payment due within 15 days. ACH or credit card accepted.',
      taxRate: 4.75,
      docType: 'INVOICE'
    },
    handyman: {
      fromName: 'Reliable Handyman & Property Care LLC',
      fromDetails: '18 Oakwood Lane\nColumbus, OH 43215\nservice@reliablehandyman.com\n(614) 555-0144 | Insured & Bonded',
      toName: 'David & Sarah Henderson',
      toDetails: '482 Maple Crest Drive\nColumbus, OH 43230',
      items: [
        { description: 'Drywall Hole Patching, Sanding & Primer Spot Coat (Living Room)', quantity: 3, rate: 85 },
        { description: 'Exterior Wooden Fence Post Replacement & Gate Latch Alignment', quantity: 1, rate: 175 },
        { description: 'Interior Solid Core Door Hanging & Satin Nickel Handle Installation', quantity: 2, rate: 110 },
        { description: 'Materials & Fasteners Reimbursed (Wood, Screws, Joint Compound)', quantity: 1, rate: 68 }
      ],
      notes: 'All repairs completed per estimate. Site thoroughly cleaned and debris hauled away. 90-day workmanship warranty.',
      terms: 'Payment due on completion. We accept Cash, Check, Venmo, or Credit Card.',
      taxRate: 7.5,
      docType: 'INVOICE'
    },
    commercial: {
      fromName: 'Global Pacific Trading Ltd',
      fromDetails: 'Export Dept, Berth 12, Harbor Road\nSeattle, WA 98101, USA\nTax / EORI ID: US948210492\nContact: export@globalpacific.com',
      toName: 'Yokohama Precision Components KK',
      toDetails: 'Attn: Customs Receiving Dept\n3-15 Minato Mirai, Nishi-ku\nYokohama 220-0012, Japan\nImporter Tax ID: JP-88491023',
      items: [
        { description: 'Precision CNC Machined Aluminum Brackets (HS Code: 7616.99, Origin: USA)', quantity: 250, rate: 24.50 },
        { description: 'Industrial Grade Stainless Steel O-Ring Seals (HS Code: 7326.90, Origin: USA)', quantity: 1000, rate: 3.20 },
        { description: 'Protective Anti-Static Packaging & Export Palletizing', quantity: 2, rate: 120.00 }
      ],
      notes: 'Commercial Invoice for Customs Clearance. Country of Origin: USA. Terms of Delivery: Incoterms 2020 CIP (Carriage and Insurance Paid to Narita Intl Airport). Shipped via Air Freight AWB #016-89420194.',
      terms: 'Payment Terms: 100% Irrevocable Letter of Credit (L/C) at sight. Remit to Global Pacific Trading Ltd, Swift: BOFAUS3N.',
      taxRate: 0,
      docType: 'COMMERCIAL INVOICE'
    },
    freelance: {
      fromName: 'Alex Rivero Design & Code',
      fromDetails: '742 Market Street, Suite 400\nSan Francisco, CA 94103\nalex@riverocreative.com',
      toName: 'Acme Digital Media',
      toDetails: 'Attn: Accounts Payable\n100 Broadway, 15th Fl\nNew York, NY 10005',
      items: [
        { description: 'Full-Stack Web App Feature Development (Sprint 4)', quantity: 35, rate: 85 },
        { description: 'Figma UI/UX Component Library & Style System', quantity: 1, rate: 1200 },
        { description: 'API Integration & Webhook Deployment', quantity: 1, rate: 650 }
      ],
      notes: 'Thanks for working together! All project code merged and tagged.',
      terms: 'Payment due within 14 days via Bank Transfer or Stripe.',
      taxRate: 0,
      docType: 'INVOICE'
    },
    contractor: {
      fromName: 'BuildRight Contracting & Remodeling',
      fromDetails: '520 Industrial Parkway\nAustin, TX 78744\noffice@buildrighttx.com\nGeneral Contractor Lic #GC-98214',
      toName: 'Summit Commercial Properties',
      toDetails: 'Attn: Project Superintendent\n4000 Barton Springs Rd\nAustin, TX 78746',
      items: [
        { description: 'Drywall Hanging & Level 4 Mudding/Taping (Phase 2)', quantity: 40, rate: 45 },
        { description: 'Commercial Framing Lumber & 5/8" Drywall Boards (Materials)', quantity: 1, rate: 1850 },
        { description: 'Demolition & Debris Disposal Haul-off', quantity: 2, rate: 350 }
      ],
      notes: 'Phase 2 milestone completed and signed off by site superintendent.',
      terms: 'Net 30 days. Remit to BuildRight Contracting LLC.',
      taxRate: 8.25,
      docType: 'INVOICE'
    },
    'uk-vat': {
      currency: 'GBP',
      taxLabel: 'VAT',
      taxRate: 20,
      fromName: 'Kensington Digital Consulting Ltd',
      fromDetails: '71-75 Shelton Street, Covent Garden\nLondon, WC2H 9JQ, United Kingdom\nVAT Reg No: GB 384 9201 55\nCompany No: 12948102',
      toName: 'Harborview Media UK',
      toDetails: 'Attn: Accounts Payable\n100 Bishopsgate\nLondon, EC2N 4AG',
      items: [
        { description: 'Quarterly Cloud Architecture & Security Audit', quantity: 1, rate: 2500 },
        { description: 'UK GDPR Data Privacy Compliance Assessment', quantity: 1, rate: 1200 },
        { description: 'DevOps CI/CD Pipeline Automation Sprint', quantity: 16, rate: 110 }
      ],
      notes: 'HMRC Valid Tax Invoice. Reverse charge does not apply. All prices in GBP (£).',
      terms: 'Payment due within 30 days via BACS / Faster Payments:\nBank: Barclays Bank UK\nSort Code: 20-00-00\nAccount: 83920184\nIBAN: GB29BARC20000083920184',
      docType: 'TAX INVOICE'
    },
    'australia-gst': {
      currency: 'AUD',
      taxLabel: 'GST',
      taxRate: 10,
      fromName: 'Pacific Rim Creative Pty Ltd',
      fromDetails: 'Level 14, 300 George Street\nSydney NSW 2000, Australia\nABN: 51 824 901 342',
      toName: 'Harbour City Retailers',
      toDetails: 'Attn: Accounts Payable\n55 Collins Street\nMelbourne VIC 3000',
      items: [
        { description: 'Brand Identity Design & Corporate Guidelines', quantity: 1, rate: 3200 },
        { description: 'E-Commerce Shopify Integration & Checkout Setup', quantity: 1, rate: 1850 },
        { description: 'Monthly Retainer — Digital Marketing Optimization', quantity: 1, rate: 950 }
      ],
      notes: 'This document is a Tax Invoice for Australian Taxation Office (ATO) compliance purposes. Total includes 10% GST.',
      terms: 'Payment due within 14 days. PayID / EFT:\nBSB: 062-000\nAccount Number: 1029 3847\nAccount Name: Pacific Rim Creative Pty Ltd',
      docType: 'TAX INVOICE'
    },
    'canada-gst': {
      currency: 'CAD',
      taxLabel: 'HST',
      taxRate: 13,
      fromName: 'Maple Ridge Software Solutions Inc.',
      fromDetails: '250 University Ave, Suite 600\nToronto, ON M5H 3E5, Canada\nCRA Business No: 89421 9021 RT0001',
      toName: 'St. Lawrence Logistics Corp',
      toDetails: 'Attn: Accounts Payable\n1000 Rue de la Gauchetière O\nMontréal, QC H3B 4W5',
      items: [
        { description: 'Custom SaaS API Backend Integration & Database Migration', quantity: 1, rate: 3400 },
        { description: 'Mobile Application QA Testing & Performance Optimization', quantity: 20, rate: 95 },
        { description: 'Monthly Cloud Infrastructure Maintenance & Backups', quantity: 1, rate: 650 }
      ],
      notes: 'Tax Invoice compliant with Canada Revenue Agency (CRA) guidelines. 13% Ontario HST included.',
      terms: 'Payment due within 30 days via Interac e-Transfer or Direct Deposit (EFT).',
      docType: 'INVOICE'
    },
    blank: {
      fromName: '',
      fromDetails: '',
      toName: '',
      toDetails: '',
      items: [
        { description: '', quantity: 1, rate: 0 },
        { description: '', quantity: 1, rate: 0 },
        { description: '', quantity: 1, rate: 0 },
        { description: '', quantity: 1, rate: 0 },
        { description: '', quantity: 1, rate: 0 }
      ],
      notes: 'Thank you for your business! Please remit payment within terms.',
      terms: 'Payment due upon receipt.',
      taxRate: 0,
      docType: 'INVOICE'
    }
  };

  PRESETS['uk'] = PRESETS['uk-vat'];
  PRESETS['australia'] = PRESETS['australia-gst'];
  PRESETS['canada'] = PRESETS['canada-gst'];

  let activePresetLoaded = null;
  let isSharedInvoiceMode = false;

  // ==========================================
  // Web Invoice Share Link Engine (Viral Growth Loop)
  // ==========================================
  function serializeInvoiceForShare() {
    const payload = {
      dct: state.docType || 'INVOICE',
      c: state.currency || 'USD',
      l: state.lang || 'en',
      in: state.invoiceNumber || '',
      id: state.issueDate || '',
      dd: state.dueDate || '',
      po: state.poNumber || '',
      fn: state.fromName || '',
      fd: state.fromDetails || '',
      tn: state.toName || '',
      td: state.toDetails || '',
      sn: state.shipToName || '',
      sd: state.shipToDetails || '',
      sst: state.showShipTo ? 1 : 0,
      items: (state.items || []).map(it => ({
        d: it.description || '',
        q: (it.quantity !== undefined && it.quantity !== null && it.quantity !== '' && !isNaN(it.quantity)) ? Number(it.quantity) : 0,
        r: (it.rate !== undefined && it.rate !== null && it.rate !== '' && !isNaN(it.rate)) ? Number(it.rate) : 0
      })),
      tl: state.taxLabel || 'Tax',
      tr: state.taxRate !== undefined ? state.taxRate : 0,
      stx: state.showTax ? 1 : 0,
      dt: state.discountType || 'percent',
      dr: state.discountRate !== undefined ? state.discountRate : 0,
      sdi: state.showDiscount ? 1 : 0,
      sa: state.shippingAmount !== undefined ? state.shippingAmount : 0,
      ssh: state.showShipping ? 1 : 0,
      ut: state.unitType || 'Quantity',
      nt: state.notes || '',
      snt: state.showNotes ? 1 : 0,
      tm: state.terms || '',
      stm: state.showTerms ? 1 : 0,
      ly: state.layout || 'modern',
      ac: state.accentColor || '#4f46e5',
      stp: state.stamp || 'none',
      ap: state.amountPaid !== undefined ? state.amountPaid : 0,
      sap: state.showAmountPaid ? 1 : 0,
      sig: state.signerName || 'Authorized Signatory',
      ssg: state.showSignature ? 1 : 0
    };

    if (state.logo && state.logo.length < 35000) {
      payload.lg = state.logo;
    }

    const json = JSON.stringify(payload);
    return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
  }

  function deserializeInvoiceFromShare(encodedStr) {
    try {
      const json = decodeURIComponent(Array.prototype.map.call(atob(encodedStr), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const p = JSON.parse(json);
      if (!p || typeof p !== 'object') return null;

      return {
        docType: p.dct || 'INVOICE',
        currency: p.c || 'USD',
        lang: p.l || 'en',
        invoiceNumber: p.in || 'INV-1001',
        issueDate: p.id || new Date().toISOString().split('T')[0],
        dueDate: p.dd || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        poNumber: p.po || '',
        fromName: p.fn || '',
        fromDetails: p.fd || '',
        toName: p.tn || '',
        toDetails: p.td || '',
        shipToName: p.sn || '',
        shipToDetails: p.sd || '',
        showShipTo: Boolean(p.sst),
        items: Array.isArray(p.items) && p.items.length > 0 ? p.items.map(it => ({
          description: it.d || '',
          quantity: (it.q !== undefined && it.q !== null && it.q !== '' && !isNaN(it.q)) ? Number(it.q) : 1,
          rate: (it.r !== undefined && it.r !== null && it.r !== '' && !isNaN(it.r)) ? Number(it.r) : 0
        })) : DEFAULT_STATE.items,
        taxLabel: p.tl || 'Tax',
        taxRate: p.tr !== undefined ? Number(p.tr) : 0,
        showTax: p.stx !== undefined ? Boolean(p.stx) : true,
        discountType: p.dt || 'percent',
        discountRate: p.dr !== undefined ? Number(p.dr) : 0,
        showDiscount: Boolean(p.sdi),
        shippingAmount: p.sa !== undefined ? Number(p.sa) : 0,
        showShipping: Boolean(p.ssh),
        unitType: p.ut || 'Quantity',
        notes: p.nt !== undefined ? p.nt : DEFAULT_STATE.notes,
        showNotes: p.snt !== undefined ? Boolean(p.snt) : true,
        terms: p.tm !== undefined ? p.tm : DEFAULT_STATE.terms,
        showTerms: p.stm !== undefined ? Boolean(p.stm) : true,
        layout: p.ly || 'modern',
        accentColor: p.ac || '#4f46e5',
        stamp: p.stp || 'none',
        amountPaid: p.ap !== undefined ? Number(p.ap) : 0,
        showAmountPaid: Boolean(p.sap),
        signerName: p.sig || 'Authorized Signatory',
        showSignature: p.ssg !== undefined ? Boolean(p.ssg) : true,
        logo: p.lg || null,
        invoiceId: 'inv_' + Date.now(),
        status: 'Shared'
      };
    } catch (e) {
      console.warn('Failed to deserialize shared invoice:', e);
      return null;
    }
  }

  function getShareInvoiceUrl() {
    const encoded = serializeInvoiceForShare();
    const base = window.location.origin + window.location.pathname.replace(/\/+$/, '') + '/';
    return base + '#inv=' + encoded;
  }

  function loadFromStorage() {
    try {
      // 1. Check for client-side invoice share link in hash (#inv=...) or query param (?inv=...)
      let invHash = window.location.hash;
      let urlParams = new URLSearchParams(window.location.search);
      let shareData = null;

      if (invHash && invHash.startsWith('#inv=')) {
        shareData = invHash.substring(5);
      } else if (urlParams.get('inv')) {
        shareData = urlParams.get('inv');
      }

      if (shareData) {
        const decoded = deserializeInvoiceFromShare(shareData);
        if (decoded) {
          state = Object.assign({}, DEFAULT_STATE, decoded);
          isSharedInvoiceMode = true;
          return;
        }
      }

      // 2. Check for trade / country presets
      const presetParam = urlParams.get('preset');
      if (presetParam && PRESETS[presetParam.toLowerCase()]) {
        const presetData = PRESETS[presetParam.toLowerCase()];
        state = Object.assign({}, DEFAULT_STATE, presetData, {
          invoiceId: 'inv_' + Date.now(),
          invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
        });
        activePresetLoaded = presetParam.toLowerCase();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

        // Clean preset param from URL address bar so subsequent browser refreshes resume active draft
        if (window.history && window.history.replaceState) {
          try {
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete('preset');
            const newSearch = cleanUrl.searchParams.toString();
            const newUrl = cleanUrl.pathname + (newSearch ? '?' + newSearch : '') + cleanUrl.hash;
            window.history.replaceState({}, document.title, newUrl);
          } catch (_) {}
        }
        return;
      }

      // 3. Fallback to local storage draft
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = Object.assign({}, DEFAULT_STATE, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }
  }

  function showSaveIndicator() {
    const ind = document.getElementById('saveIndicator');
    if (ind) {
      ind.innerHTML = '<span class="save-indicator-dot"></span> Saved Live';
      ind.classList.add('visible');
      clearTimeout(ind._timer);
      ind._timer = setTimeout(() => {
        ind.classList.remove('visible');
      }, 1800);
    }
  }

  // ==========================================
  // Invoices History & Status Tracker
  // ==========================================
  function getSavedInvoices() {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function syncToHistory() {
    try {
      let history = getSavedInvoices();
      const totals = calculateTotals();
      if (!state.invoiceId) {
        state.invoiceId = 'inv_' + Date.now();
      }

      const summary = {
        id: state.invoiceId,
        invoiceNumber: state.invoiceNumber || 'INV-1001',
        clientName: state.toName || 'Unnamed Client',
        issueDate: state.issueDate || new Date().toISOString().split('T')[0],
        totalAmount: totals.grandTotal,
        currency: state.currency || 'USD',
        status: state.status || 'Draft',
        updatedAt: Date.now(),
        data: JSON.parse(JSON.stringify(state))
      };

      const existingIndex = history.findIndex(item => item.id === state.invoiceId);
      if (existingIndex >= 0) {
        history[existingIndex] = summary;
      } else {
        history.unshift(summary);
      }

      if (history.length > 50) history = history.slice(0, 50);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      updateHistoryBadge();
    } catch (e) {
      console.warn('History sync error:', e);
    }
  }

  function updateHistoryBadge() {
    const badge = document.getElementById('historyBadgeCount');
    const invoices = getSavedInvoices();
    if (badge) badge.textContent = invoices.length;
  }

  function openHistoryDrawer() {
    const drawer = document.getElementById('historyDrawer');
    const backdrop = document.getElementById('historyDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.style.display = 'block';
      renderHistoryDrawer();
    }
  }

  function closeHistoryDrawer() {
    const drawer = document.getElementById('historyDrawer');
    const backdrop = document.getElementById('historyDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.style.display = 'none';
    }
  }

  function renderHistoryDrawer() {
    const container = document.getElementById('historyListContainer');
    if (!container) return;
    const invoices = getSavedInvoices();

    // Tab Counts
    const countAll = document.getElementById('countAll');
    const countDraft = document.getElementById('countDraft');
    const countSent = document.getElementById('countSent');
    const countPaid = document.getElementById('countPaid');
    const countOverdue = document.getElementById('countOverdue');

    if (countAll) countAll.textContent = invoices.length;
    if (countDraft) countDraft.textContent = invoices.filter(i => i.status === 'Draft').length;
    if (countSent) countSent.textContent = invoices.filter(i => i.status === 'Sent').length;
    if (countPaid) countPaid.textContent = invoices.filter(i => i.status === 'Paid').length;
    if (countOverdue) countOverdue.textContent = invoices.filter(i => i.status === 'Overdue').length;

    const filtered = activeHistoryFilter === 'all' 
      ? invoices 
      : invoices.filter(i => i.status === activeHistoryFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-dim);">
          <div style="font-size: 2.4rem; margin-bottom: 10px;">📂</div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 1rem;">No ${activeHistoryFilter === 'all' ? '' : activeHistoryFilter} Invoices</div>
          <div style="font-size: 0.82rem; margin-top: 6px; line-height: 1.5;">Invoices you edit or create are automatically stored here.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(inv => {
      const isCurrent = (inv.id === state.invoiceId);
      const symbol = (CURRENCIES[inv.currency] || CURRENCIES.USD).symbol;
      const amtStr = `${symbol}${Number(inv.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      return `
        <div class="invoice-card ${isCurrent ? 'active-current' : ''}">
          <div class="card-top">
            <span class="card-num">${inv.invoiceNumber || 'INV-1001'}</span>
            <button type="button" class="status-pill pill-${inv.status || 'Draft'}" data-toggle-status="${inv.id}" title="Click to cycle status (Draft -> Sent -> Paid -> Overdue)">
              ${inv.status || 'Draft'}
            </button>
          </div>
          <div class="card-client" title="${inv.clientName || 'Unnamed Client'}">
            ${inv.clientName || 'Unnamed Client'}
          </div>
          <div class="card-meta-row">
            <span>📅 ${inv.issueDate || 'No date'}</span>
            <span class="card-total">${amtStr}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-card-action" data-load-id="${inv.id}">Open</button>
            <button type="button" class="btn-card-action" data-dup-id="${inv.id}">Duplicate</button>
            <button type="button" class="btn-card-action btn-card-delete" data-del-id="${inv.id}" title="Delete Invoice">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    container.querySelectorAll('[data-load-id]').forEach(btn => {
      btn.addEventListener('click', () => loadInvoiceById(btn.dataset.loadId));
    });

    container.querySelectorAll('[data-dup-id]').forEach(btn => {
      btn.addEventListener('click', () => duplicateInvoiceById(btn.dataset.dupId));
    });

    container.querySelectorAll('[data-del-id]').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.delId));
    });

    container.querySelectorAll('[data-toggle-status]').forEach(btn => {
      btn.addEventListener('click', () => cycleInvoiceStatus(btn.dataset.toggleStatus));
    });
  }

  // Toast Notification Helper
  let toastTimeout = null;
  function showToast(message, icon = '✓') {
    const toast = document.getElementById('appToast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;
    toast.style.display = 'flex';

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  }

  function loadInvoiceById(id) {
    const invoices = getSavedInvoices();
    const target = invoices.find(i => i.id === id);
    if (target && target.data) {
      state = Object.assign({}, DEFAULT_STATE, target.data);
      populateInputs();
      saveToStorage();
      closeHistoryDrawer();
      showToast(`Loaded invoice ${state.invoiceNumber || ''}`, '📂');
    }
  }

  function duplicateInvoiceById(id) {
    const invoices = getSavedInvoices();
    const target = invoices.find(i => i.id === id);
    if (target && target.data) {
      const cloned = JSON.parse(JSON.stringify(target.data));
      cloned.invoiceId = 'inv_' + Date.now();
      
      // Auto-increment invoice number
      const numMatch = (cloned.invoiceNumber || '').match(/(\d+)$/);
      if (numMatch) {
        const nextNum = parseInt(numMatch[1], 10) + 1;
        const prefix = cloned.invoiceNumber.substring(0, numMatch.index);
        cloned.invoiceNumber = prefix + nextNum;
      } else {
        cloned.invoiceNumber = (cloned.invoiceNumber || 'INV') + '-COPY';
      }

      cloned.issueDate = new Date().toISOString().split('T')[0];
      cloned.status = 'Draft';

      state = Object.assign({}, DEFAULT_STATE, cloned);
      populateInputs();
      saveToStorage();
      renderHistoryDrawer();
      closeHistoryDrawer();
      showToast(`Duplicated as new draft ${state.invoiceNumber}`, '📋');
    }
  }

  let pendingDeleteInvoiceId = null;

  function openDeleteModal(id) {
    pendingDeleteInvoiceId = id;
    const invoices = getSavedInvoices();
    const target = invoices.find(i => i.id === id);
    const descEl = document.getElementById('deleteModalDesc');
    if (descEl) {
      if (target) {
        const invNum = target.invoiceNumber || 'this invoice';
        const client = target.clientName ? ` for "${target.clientName}"` : '';
        descEl.textContent = `Are you sure you want to delete ${invNum}${client} from your saved history? This action cannot be undone.`;
      } else {
        descEl.textContent = 'Are you sure you want to delete this invoice from your saved history? This action cannot be undone.';
      }
    }
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.style.display = 'flex';
  }

  function closeDeleteModal() {
    pendingDeleteInvoiceId = null;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.style.display = 'none';
  }

  function executeDeleteInvoice() {
    if (!pendingDeleteInvoiceId) return;
    let invoices = getSavedInvoices();
    invoices = invoices.filter(i => i.id !== pendingDeleteInvoiceId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(invoices));
    updateHistoryBadge();
    renderHistoryDrawer();
    closeDeleteModal();
    showToast('Invoice deleted from saved history', '🗑️');
  }

  function cycleInvoiceStatus(id) {
    const statuses = ['Draft', 'Sent', 'Paid', 'Overdue'];
    let invoices = getSavedInvoices();
    const target = invoices.find(i => i.id === id);
    if (target) {
      const curIdx = statuses.indexOf(target.status || 'Draft');
      const nextStatus = statuses[(curIdx + 1) % statuses.length];
      target.status = nextStatus;
      if (target.data) target.data.status = nextStatus;

      if (id === state.invoiceId) {
        state.status = nextStatus;
        if (nextStatus === 'Paid') state.stamp = 'PAID';
        renderStamp();
      }

      localStorage.setItem(HISTORY_KEY, JSON.stringify(invoices));
      renderHistoryDrawer();
    }
  }

  // ==========================================
  // Client Catalog (Quick Fill)
  // ==========================================
  function getSavedClients() {
    try {
      const saved = localStorage.getItem(CLIENTS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    } catch (e) {
      return DEFAULT_CLIENTS;
    }
  }

  function saveCurrentClient() {
    const name = (state.toName || '').trim();
    const details = (state.toDetails || '').trim();
    if (!name) {
      showToast('Please enter a client name before saving', '⚠️');
      return;
    }

    let clients = getSavedClients();
    const existing = clients.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing >= 0) {
      clients[existing].details = details;
    } else {
      clients.unshift({ name, details });
    }

    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    renderClientCatalogList();
    showToast(`"${name}" saved to client directory!`, '✓');
  }

  function renderClientCatalogList() {
    const listEl = document.getElementById('clientCatalogList');
    if (!listEl) return;
    const clients = getSavedClients();

    if (clients.length === 0) {
      listEl.innerHTML = '<div class="catalog-empty-msg">No saved clients yet.<br>Click "+ Save Current" to add.</div>';
      return;
    }

    listEl.innerHTML = clients.map((c, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
        <button type="button" class="catalog-item-btn" data-client-idx="${i}" style="flex: 1;">
          <strong>${c.name}</strong>
        </button>
        <button type="button" class="btn-remove-mini" data-del-client="${i}" title="Delete client" style="font-size: 0.65rem;">✕</button>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-client-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.clientIdx, 10);
        const selected = clients[idx];
        if (selected) {
          state.toName = selected.name;
          state.toDetails = selected.details;
          const toNameEl = document.getElementById('toName');
          const toDetailsEl = document.getElementById('toDetails');
          if (toNameEl) toNameEl.value = selected.name;
          if (toDetailsEl) toDetailsEl.value = selected.details;
          saveToStorage();
          const dropdown = document.getElementById('clientCatalogDropdown');
          if (dropdown) dropdown.style.display = 'none';
        }
      });
    });

    listEl.querySelectorAll('[data-del-client]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.delClient, 10);
        let cur = getSavedClients();
        cur.splice(idx, 1);
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(cur));
        renderClientCatalogList();
      });
    });
  }

  // ==========================================
  // Watermark / Status Stamp
  // ==========================================
  function renderStamp() {
    const stampEl = document.getElementById('invoiceStamp');
    const stampText = document.getElementById('stampText');
    const stampSelect = document.getElementById('stampSelector');
    if (!stampEl) return;

    const current = state.stamp || 'none';
    if (stampSelect) stampSelect.value = current;

    stampEl.className = 'invoice-stamp-badge';
    if (current === 'none') {
      stampEl.style.display = 'none';
      stampEl.classList.add('stamp-none');
    } else {
      stampEl.style.display = 'inline-block';
      stampEl.classList.add(`stamp-${current.toLowerCase()}`);
      if (stampText) stampText.textContent = current;
    }
  }

  // ==========================================
  // Digital Signature Pad
  // ==========================================
  function initSignaturePad() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = 300;
    const height = 75;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(ratio, ratio);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    canvas.addEventListener('pointerdown', (e) => {
      isDrawingSignature = true;
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDrawingSignature) return;
      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    const stopDrawing = () => {
      if (isDrawingSignature) {
        isDrawingSignature = false;
        state.signatureData = canvas.toDataURL();
        saveToStorage();
      }
    };

    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    renderSignatureImage();
  }

  function renderSignatureImage() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas || !state.signatureData) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 300, 75);
    };
    img.src = state.signatureData;
  }

  function clearSignature() {
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    state.signatureData = null;
    saveToStorage();
  }

  // ==========================================
  // Item Management
  // ==========================================
  function addItem(description = 'New Service Item', quantity = 1, rate = 100) {
    state.items.push({
      description: description,
      quantity: quantity,
      rate: rate
    });
    renderItems(true);
    updateTotals();
    saveToStorage();
  }

  function removeItem(index) {
    if (state.items.length <= 1) {
      state.items = [{ description: '', quantity: 1, rate: 0 }];
    } else {
      state.items.splice(index, 1);
    }
    renderItems();
    updateTotals();
    saveToStorage();
  }

  function renderItems(isNewItem = false) {
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    state.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.dataset.index = index;
      if (isNewItem && index === state.items.length - 1) {
        tr.classList.add('row-just-added');
      }

      const q = Math.max(0, Number(item.quantity) || 0);
      const r = Math.max(0, Number(item.rate) || 0);
      const rowTotal = q * r;

      tr.innerHTML = `
        <td class="col-desc">
          <input type="text" class="table-input item-desc" placeholder="Description of service or product" value="${escapeHtml(item.description)}">
        </td>
        <td class="col-qty">
          <input type="number" class="table-input item-qty" min="0" step="any" value="${item.quantity}">
        </td>
        <td class="col-rate">
          <input type="number" class="table-input item-rate" min="0" step="any" value="${item.rate}">
        </td>
        <td class="col-total">
          <span class="row-total-val">${formatMoney(rowTotal)}</span>
        </td>
        <td class="col-action print-hide">
          <button type="button" class="btn-delete-row" title="Delete Row" data-index="${index}">✕</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Attach row events
    tbody.querySelectorAll('.item-desc').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        state.items[idx].description = e.target.value;
        saveToStorage();
      });
    });

    tbody.querySelectorAll('.item-qty').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        state.items[idx].quantity = e.target.value;
        updateRowTotal(idx);
        updateTotals();
        saveToStorage();
      });
    });

    tbody.querySelectorAll('.item-rate').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        state.items[idx].rate = e.target.value;
        updateRowTotal(idx);
        updateTotals();
        saveToStorage();
      });
    });

    tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        removeItem(idx);
      });
    });
  }

  function updateRowTotal(index) {
    const tr = document.querySelector(`#itemsTableBody tr[data-index="${index}"]`);
    if (!tr) return;
    const item = state.items[index];
    const q = Math.max(0, Number(item.quantity) || 0);
    const r = Math.max(0, Number(item.rate) || 0);
    const totalEl = tr.querySelector('.row-total-val');
    if (totalEl) {
      totalEl.textContent = formatMoney(q * r);
    }
  }

  function updateTotals() {
    const { subtotal, taxAmount, discountAmount, shippingAmount, grandTotal, amountPaid, balanceDue } = calculateTotals();

    const subEl = document.getElementById('valSubtotal');
    if (subEl) subEl.textContent = formatMoney(subtotal);

    const taxEl = document.getElementById('valTax');
    if (taxEl) taxEl.textContent = formatMoney(taxAmount);

    const discEl = document.getElementById('valDiscount');
    if (discEl) discEl.textContent = `-${formatMoney(discountAmount)}`;

    const toggleDiscBtn = document.getElementById('btnToggleDiscountType');
    if (toggleDiscBtn) {
      toggleDiscBtn.textContent = state.discountType === 'fixed' ? getCurrencySymbol() : '%';
      toggleDiscBtn.title = state.discountType === 'fixed' ? 'Switch to Percentage (%) discount' : 'Switch to Flat Cash discount';
    }

    const currShipping = document.getElementById('currencySymbolShipping');
    if (currShipping) currShipping.textContent = getCurrencySymbol();

    const shipEl = document.getElementById('valShipping');
    if (shipEl) shipEl.textContent = formatMoney(shippingAmount);

    const currPaid = document.getElementById('currencySymbolPaid');
    if (currPaid) currPaid.textContent = getCurrencySymbol();

    const paidEl = document.getElementById('valAmountPaid');
    if (paidEl) paidEl.textContent = formatMoney(amountPaid);

    const grandLabel = document.getElementById('grandTotalLabel');
    if (grandLabel) {
      grandLabel.textContent = state.showAmountPaid ? 'Total:' : 'Total Due:';
    }

    const grandEl = document.getElementById('valGrandTotal');
    if (grandEl) {
      const prev = grandEl.textContent;
      const next = formatMoney(grandTotal);
      grandEl.textContent = next;
      if (prev && prev !== next) {
        grandEl.classList.remove('total-amount-bump');
        void grandEl.offsetWidth; // Force DOM reflow to re-trigger CSS animation
        grandEl.classList.add('total-amount-bump');
      }
    }

    const balEl = document.getElementById('valBalanceDue');
    if (balEl) balEl.textContent = formatMoney(balanceDue);

    const balRow = document.getElementById('balanceDueLine');
    if (balRow) {
      balRow.style.display = state.showAmountPaid ? 'flex' : 'none';
    }
  }

  function updatePoVisibility() {
    const poRow = document.getElementById('poNumberRow');
    if (poRow) {
      if (!state.poNumber || !state.poNumber.trim()) {
        poRow.classList.add('empty-meta-field');
      } else {
        poRow.classList.remove('empty-meta-field');
      }
    }
  }

  function updateTermsActiveState() {
    const issueInput = document.getElementById('issueDate');
    const dueInput = document.getElementById('dueDate');
    if (!issueInput || !dueInput) return;

    const issueVal = issueInput.value;
    const dueVal = dueInput.value;
    if (!issueVal || !dueVal) return;

    const issueD = new Date(issueVal);
    const dueD = new Date(dueVal);
    const diffDays = Math.round((dueD - issueD) / 86400000);

    document.querySelectorAll('.btn-preset').forEach(btn => {
      const days = parseInt(btn.dataset.days, 10);
      if (days === diffDays) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function composeEmailDraft() {
    const toText = (state.toDetails || '') + ' ' + (state.toName || '');
    const emailMatch = toText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const recipient = emailMatch ? emailMatch[0] : '';
    
    const clientName = (state.toName || 'Valued Client').trim().split('\n')[0];
    const invNum = state.invoiceNumber || 'INV-1001';
    const sender = (state.fromName || 'Acme Studio Co.').trim().split('\n')[0];
    const { grandTotal, balanceDue } = calculateTotals();
    const dueAmountFormatted = state.showAmountPaid ? formatMoney(balanceDue) : formatMoney(grandTotal);

    const subject = `Invoice ${invNum} from ${sender}`;
    const body = 
`Hi ${clientName},

Please find the details for invoice ${invNum}.

• Invoice Number: ${invNum}
• Amount Due: ${dueAmountFormatted}
• Due Date: ${state.dueDate || 'Upon receipt'}

Please review the attached invoice PDF or let us know if you have any questions.

Thank you for your business!

Best regards,
${sender}`;

    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    // GA4 Key Event & Lead Tracking
    trackEvent('generate_lead', {
      value: Number(grandTotal) || 0,
      currency: state.currency || 'USD',
      lead_type: 'email_draft',
      doc_type: state.docType || 'Invoice'
    });
    trackEvent('email_invoice_draft', {
      value: Number(grandTotal) || 0,
      currency: state.currency || 'USD',
      doc_type: state.docType || 'Invoice'
    });

    showToast('Opening your email client... Remember to attach your downloaded PDF! ✉️', '✉️');
  }

  function handleLogoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      state.logo = e.target.result;
      renderLogo();
      saveToStorage();
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    state.logo = null;
    renderLogo();
    const input = document.getElementById('logoFileInput');
    if (input) input.value = '';
    saveToStorage();
  }

  function renderLogo() {
    const box = document.querySelector('.logo-upload-box');
    const img = document.getElementById('invoiceLogoImg');
    if (!box || !img) return;

    if (state.logo) {
      img.src = state.logo;
      box.classList.add('has-logo');
    } else {
      img.src = '';
      box.classList.remove('has-logo');
    }
  }

  function renderSectionVisibility() {
    const elNotes = document.getElementById('notesSection');
    const btnAddNotes = document.getElementById('btnAddNotes');
    if (elNotes && btnAddNotes) {
      elNotes.style.display = state.showNotes ? 'flex' : 'none';
      btnAddNotes.style.display = state.showNotes ? 'none' : 'inline-flex';
    }

    const elTerms = document.getElementById('termsSection');
    const btnAddTerms = document.getElementById('btnAddTerms');
    if (elTerms && btnAddTerms) {
      elTerms.style.display = state.showTerms ? 'flex' : 'none';
      btnAddTerms.style.display = state.showTerms ? 'none' : 'inline-flex';
    }

    const elTaxLine = document.getElementById('taxLine');
    const addTaxWrap = document.getElementById('addTaxWrap');
    if (elTaxLine && addTaxWrap) {
      elTaxLine.style.display = state.showTax ? 'flex' : 'none';
      addTaxWrap.style.display = state.showTax ? 'none' : 'block';
    }

    const elDiscountLine = document.getElementById('discountLine');
    const addDiscountWrap = document.getElementById('addDiscountWrap');
    if (elDiscountLine && addDiscountWrap) {
      elDiscountLine.style.display = state.showDiscount ? 'flex' : 'none';
      addDiscountWrap.style.display = state.showDiscount ? 'none' : 'block';
    }

    const elShippingLine = document.getElementById('shippingLine');
    const addShippingWrap = document.getElementById('addShippingWrap');
    if (elShippingLine && addShippingWrap) {
      elShippingLine.style.display = state.showShipping ? 'flex' : 'none';
      addShippingWrap.style.display = state.showShipping ? 'none' : 'block';
    }

    const elShipToBlock = document.getElementById('shipToBlock');
    const btnAddShipTo = document.getElementById('btnAddShipTo');
    const addressGrid = document.querySelector('.address-grid');
    if (elShipToBlock) {
      elShipToBlock.style.display = state.showShipTo ? 'block' : 'none';
      if (btnAddShipTo) {
        btnAddShipTo.style.display = state.showShipTo ? 'none' : 'inline-flex';
      }
      if (addressGrid) {
        if (state.showShipTo) {
          addressGrid.classList.add('has-ship-to');
        } else {
          addressGrid.classList.remove('has-ship-to');
        }
      }
    }

    const elAmountPaidLine = document.getElementById('amountPaidLine');
    const addAmountPaidWrap = document.getElementById('addAmountPaidWrap');
    const balanceDueLine = document.getElementById('balanceDueLine');
    if (elAmountPaidLine && addAmountPaidWrap) {
      elAmountPaidLine.style.display = state.showAmountPaid ? 'flex' : 'none';
      addAmountPaidWrap.style.display = state.showAmountPaid ? 'none' : 'block';
      if (balanceDueLine) {
        balanceDueLine.style.display = state.showAmountPaid ? 'flex' : 'none';
      }
    }

    const elQr = document.getElementById('qrSection');
    const btnAddQr = document.getElementById('btnAddQr');
    if (elQr && btnAddQr) {
      elQr.style.display = state.showQr ? 'flex' : 'none';
      btnAddQr.style.display = state.showQr ? 'none' : 'inline-flex';
    }

    const elSig = document.getElementById('signatureSection');
    const btnAddSig = document.getElementById('btnAddSignature');
    if (elSig && btnAddSig) {
      elSig.style.display = state.showSignature !== false ? 'flex' : 'none';
      btnAddSig.style.display = state.showSignature !== false ? 'none' : 'inline-flex';
    }

    const sheetFooter = document.getElementById('invoiceSheetFooter');
    const btnToggleBadge = document.getElementById('btnToggleBadge');
    if (sheetFooter) {
      sheetFooter.style.display = state.showPoweredBy !== false ? 'flex' : 'none';
      if (btnToggleBadge) {
        btnToggleBadge.textContent = state.showPoweredBy !== false ? '✕ Remove watermark' : '➕ Show watermark';
      }
    }
  }

  function renderLayout() {
    const sheet = document.getElementById('invoiceSheet');
    const selector = document.getElementById('layoutSelector');
    if (!sheet) return;

    sheet.classList.remove('layout-modern', 'layout-classic', 'layout-creative', 'layout-compact');
    const activeLayout = state.layout || 'modern';
    sheet.classList.add(`layout-${activeLayout}`);

    if (selector) selector.value = activeLayout;
  }

  function renderDocType() {
    const titleEl = document.getElementById('invoiceMainTitle');
    const docSelect = document.getElementById('docTypeSelector');
    const type = state.docType || 'INVOICE';
    if (titleEl) titleEl.textContent = type;
    if (docSelect) docSelect.value = type;
  }

  function renderAccentColor() {
    const color = state.accentColor || '#4f46e5';
    document.documentElement.style.setProperty('--primary-indigo', color);
    document.documentElement.style.setProperty('--primary-hover', color);

    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      if (btn.dataset.color.toLowerCase() === color.toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const customInput = document.getElementById('customColorInput');
    if (customInput) customInput.value = color;
  }

  function renderQrCode() {
    const container = document.getElementById('qrCodeOutput');
    if (!container) return;

    const data = (state.qrLink || 'https://paypal.me/').trim();
    const safeUrl = encodeURIComponent(data);
    container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${safeUrl}" alt="Payment QR Code" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" loading="lazy">`;
  }

  function populateInputs() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('invoiceNumber', state.invoiceNumber);
    setVal('poNumber', state.poNumber);
    setVal('issueDate', state.issueDate);
    setVal('dueDate', state.dueDate);
    setVal('fromName', state.fromName);
    setVal('fromDetails', state.fromDetails);
    setVal('toName', state.toName);
    setVal('toDetails', state.toDetails);
    setVal('shipToName', state.shipToName);
    setVal('shipToDetails', state.shipToDetails);
    setVal('taxRate', state.taxRate);
    setVal('discountRate', state.discountRate);
    setVal('shippingAmount', state.shippingAmount || '');
    setVal('amountPaid', state.amountPaid || '');
    setVal('notesText', state.notes);
    setVal('termsText', state.terms);
    setVal('qrLinkInput', state.qrLink);
    setVal('signerNameInput', state.signerName || 'Authorized Signatory');

    const toggleDiscBtn = document.getElementById('btnToggleDiscountType');
    if (toggleDiscBtn) {
      toggleDiscBtn.textContent = state.discountType === 'fixed' ? getCurrencySymbol() : '%';
    }

    const currSelect = document.getElementById('currencySelector');
    if (currSelect) currSelect.value = state.currency || 'USD';

    const taxSelect = document.getElementById('taxLabelSelect');
    if (taxSelect) taxSelect.value = state.taxLabel || 'Tax';
    const taxDisplay = document.getElementById('taxLabelDisplay');
    if (taxDisplay) taxDisplay.textContent = state.taxLabel || 'Tax';

    const unitLabel = document.getElementById('colUnitLabel');
    if (unitLabel) unitLabel.textContent = state.unitType || 'Quantity';

    renderLogo();
    renderLayout();
    renderDocType();
    renderAccentColor();
    renderSectionVisibility();
    renderStamp();
    renderQrCode();
    renderItems();
    updateTotals();
    updatePoVisibility();
    updateTermsActiveState();
    renderSignatureImage();
    updateHistoryBadge();
  }

  function fillSampleData() {
    trackEvent('sample_invoice_loaded');
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    state.invoiceId = 'inv_' + Date.now();
    populateInputs();
    saveToStorage();
  }

  function openClearModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'flex';
  }

  function closeClearModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
  }

  function executeClearInvoice() {
    state = {
      currency: state.currency || 'USD',
      invoiceNumber: 'INV-' + (Math.floor(Math.random() * 8999) + 1001),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      logo: state.logo || null,
      fromName: state.fromName || '',
      fromDetails: state.fromDetails || '',
      toName: '',
      toDetails: '',
      shipToName: '',
      shipToDetails: '',
      showShipTo: false,
      items: [{ description: '', quantity: 1, rate: 0 }],
      taxLabel: state.taxLabel || 'Tax',
      taxRate: state.taxRate !== undefined ? state.taxRate : 8,
      discountType: 'percent',
      discountRate: 0,
      shippingAmount: 0,
      showShipping: false,
      unitType: state.unitType || 'Quantity',
      notes: state.notes || '',
      terms: state.terms || '',
      showNotes: state.showNotes !== false,
      showTerms: state.showTerms !== false,
      showTax: state.showTax !== false,
      showDiscount: false,
      showQr: state.showQr || false,
      qrLink: state.qrLink || '',
      layout: state.layout || 'modern',
      docType: 'INVOICE',
      accentColor: state.accentColor || '#4f46e5',
      stamp: 'none',
      showSignature: true,
      signatureData: state.signatureData || null,
      signerName: state.signerName || 'Authorized Signatory',
      invoiceId: 'inv_' + Date.now(),
      status: 'Draft',
      poNumber: '',
      amountPaid: 0,
      showAmountPaid: false,
      showPoweredBy: state.showPoweredBy !== false
    };
    closeClearModal();
    populateInputs();
    saveToStorage();
    showToast('New invoice created. Your company details are preserved!', '✨');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ==========================================
  // Form Listeners & Event Bindings
  // ==========================================
  function bindListeners() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          state[key] = e.target.value;
          saveToStorage();
          if (key === 'taxRate' || key === 'discountRate' || key === 'shippingAmount' || key === 'amountPaid') {
            updateTotals();
          }
          if (key === 'poNumber') {
            updatePoVisibility();
          }
          if (key === 'issueDate' || key === 'dueDate') {
            updateTermsActiveState();
          }
        });
      }
    };

    bind('invoiceNumber', 'invoiceNumber');
    bind('poNumber', 'poNumber');
    bind('issueDate', 'issueDate');
    bind('dueDate', 'dueDate');
    bind('fromName', 'fromName');
    bind('fromDetails', 'fromDetails');
    bind('toName', 'toName');
    bind('toDetails', 'toDetails');
    bind('shipToName', 'shipToName');
    bind('shipToDetails', 'shipToDetails');
    bind('taxRate', 'taxRate');
    bind('discountRate', 'discountRate');
    bind('shippingAmount', 'shippingAmount');
    bind('amountPaid', 'amountPaid');
    bind('notesText', 'notes');
    bind('termsText', 'terms');
    bind('signerNameInput', 'signerName');

    // Currency
    const currSelect = document.getElementById('currencySelector');
    if (currSelect) {
      currSelect.addEventListener('change', (e) => {
        state.currency = e.target.value;
        updateTotals();
        renderItems();
        saveToStorage();
      });
    }

    // Template Layout
    const layoutSelect = document.getElementById('layoutSelector');
    if (layoutSelect) {
      layoutSelect.addEventListener('change', (e) => {
        state.layout = e.target.value;
        renderLayout();
        saveToStorage();
      });
    }

    // Watermark / Stamp Selector
    const stampSelect = document.getElementById('stampSelector');
    if (stampSelect) {
      stampSelect.addEventListener('change', (e) => {
        state.stamp = e.target.value;
        if (state.stamp === 'PAID') state.status = 'Paid';
        renderStamp();
        saveToStorage();
      });
    }

    // Add Item Button
    const btnAddItem = document.getElementById('btnAddItem');
    if (btnAddItem) {
      btnAddItem.addEventListener('click', () => {
        addItem('', 1, 0);
      });
    }

    // Logo Upload
    const logoInput = document.getElementById('logoFileInput');
    if (logoInput) {
      logoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleLogoUpload(e.target.files[0]);
        }
      });
    }

    const btnRemoveLogo = document.getElementById('btnRemoveLogo');
    if (btnRemoveLogo) {
      btnRemoveLogo.addEventListener('click', removeLogo);
    }

    // Digital Signature Handlers
    const btnClearSig = document.getElementById('btnClearSignature');
    if (btnClearSig) {
      btnClearSig.addEventListener('click', clearSignature);
    }

    const btnRemoveSig = document.getElementById('btnRemoveSignature');
    if (btnRemoveSig) {
      btnRemoveSig.addEventListener('click', () => {
        state.showSignature = false;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    const btnAddSig = document.getElementById('btnAddSignature');
    if (btnAddSig) {
      btnAddSig.addEventListener('click', () => {
        state.showSignature = true;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    // Quick Service Presets Dropdown
    const btnQuickService = document.getElementById('btnQuickAddService');
    const serviceDropdown = document.getElementById('serviceCatalogDropdown');
    if (btnQuickService && serviceDropdown) {
      btnQuickService.addEventListener('click', (e) => {
        e.stopPropagation();
        serviceDropdown.style.display = serviceDropdown.style.display === 'none' ? 'block' : 'none';
      });

      serviceDropdown.querySelectorAll('.catalog-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const desc = btn.dataset.desc;
          const rate = parseFloat(btn.dataset.rate) || 0;
          addItem(desc, 1, rate);
          serviceDropdown.style.display = 'none';
        });
      });
    }

    // Saved Client Directory Dropdown
    const btnQuickClient = document.getElementById('btnQuickFillClient');
    const clientDropdown = document.getElementById('clientCatalogDropdown');
    const btnSaveClient = document.getElementById('btnSaveCurrentClient');

    if (btnQuickClient && clientDropdown) {
      btnQuickClient.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = clientDropdown.style.display === 'block';
        clientDropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) renderClientCatalogList();
      });
    }

    if (btnSaveClient) {
      btnSaveClient.addEventListener('click', (e) => {
        e.stopPropagation();
        saveCurrentClient();
      });
    }

    // Slide-Over Invoices Drawer Listeners
    const btnHistory = document.getElementById('btnHistoryToggle');
    if (btnHistory) {
      btnHistory.addEventListener('click', openHistoryDrawer);
    }

    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', closeHistoryDrawer);
    }

    const drawerBackdrop = document.getElementById('historyDrawerBackdrop');
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeHistoryDrawer);
    }

    const btnNewDrawer = document.getElementById('btnNewInvoiceFromDrawer');
    if (btnNewDrawer) {
      btnNewDrawer.addEventListener('click', () => {
        executeClearInvoice();
        closeHistoryDrawer();
      });
    }

    const btnSaveHistoryExplicit = document.getElementById('btnSaveCurrentToHistory');
    if (btnSaveHistoryExplicit) {
      btnSaveHistoryExplicit.addEventListener('click', () => {
        saveToStorage();
        renderHistoryDrawer();
        showToast('Invoice successfully saved to history!', '✓');
      });
    }

    // History Drawer Filter Tabs
    document.querySelectorAll('.drawer-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeHistoryFilter = tab.dataset.filter;
        renderHistoryDrawer();
      });
    });

    // ==========================================
    // PWA Install Prompt Support
    // ==========================================
    let deferredInstallPrompt = null;
    const btnInstallApp = document.getElementById('btnInstallApp');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (btnInstallApp) {
        btnInstallApp.style.display = 'inline-flex';
      }
    });

    if (btnInstallApp) {
      btnInstallApp.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          showToast('QuickBillFree installed as app!', '📲');
        }
        deferredInstallPrompt = null;
        btnInstallApp.style.display = 'none';
      });
    }

    window.addEventListener('appinstalled', () => {
      if (btnInstallApp) btnInstallApp.style.display = 'none';
      showToast('QuickBillFree installed as app', '📲');
    });

    // ==========================================
    // Drawer Backup, Export CSV & Restore
    // ==========================================
    const btnExportJsonBackup = document.getElementById('btnExportJsonBackup');
    if (btnExportJsonBackup) {
      btnExportJsonBackup.addEventListener('click', () => {
        const invoices = getSavedInvoices();
        if (!invoices || invoices.length === 0) {
          showToast('No saved invoices to backup', '⚠️');
          return;
        }
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoices, null, 2));
        const downloadAnchor = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `quickbillfree-backup-${dateStr}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast(`Backed up ${invoices.length} invoices (JSON)`, '💾');
      });
    }

    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const invoices = getSavedInvoices();
        if (!invoices || invoices.length === 0) {
          showToast('No saved invoices to export', '⚠️');
          return;
        }
        const headers = ['Invoice Number', 'Client Name', 'Issue Date', 'Due Date', 'Currency', 'Total Amount', 'Status'];
        const rows = invoices.map(inv => [
          `"${(inv.invoiceNumber || '').replace(/"/g, '""')}"`,
          `"${(inv.clientName || '').replace(/"/g, '""')}"`,
          `"${(inv.issueDate || '').replace(/"/g, '""')}"`,
          `"${(inv.dueDate || '').replace(/"/g, '""')}"`,
          `"${(inv.currency || 'USD').replace(/"/g, '""')}"`,
          Number(inv.totalAmount || 0).toFixed(2),
          `"${(inv.status || 'Draft').replace(/"/g, '""')}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
        const downloadAnchor = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        downloadAnchor.setAttribute('href', csvContent);
        downloadAnchor.setAttribute('download', `quickbillfree-invoices-${dateStr}.csv`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast(`Exported ${invoices.length} invoices to CSV`, '📊');
      });
    }

    const inputRestoreBackup = document.getElementById('inputRestoreBackup');
    if (inputRestoreBackup) {
      inputRestoreBackup.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (!Array.isArray(imported)) {
              showToast('Invalid backup file format (must be invoice list)', '❌');
              return;
            }
            let current = getSavedInvoices();
            const currentIds = new Set(current.map(i => i.id));
            let addedCount = 0;
            imported.forEach(inv => {
              if (inv && typeof inv === 'object' && inv.id) {
                if (!currentIds.has(inv.id)) {
                  current.push(inv);
                  currentIds.add(inv.id);
                  addedCount++;
                }
              }
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(current));
            updateHistoryBadge();
            renderHistoryDrawer();
            showToast(`Restored ${addedCount} new invoices from backup!`, '✓');
          } catch (err) {
            showToast('Failed to read JSON backup file', '❌');
          }
          inputRestoreBackup.value = '';
        };
        reader.readAsText(file);
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (serviceDropdown && !serviceDropdown.contains(e.target) && e.target !== btnQuickService) {
        serviceDropdown.style.display = 'none';
      }
      if (clientDropdown && !clientDropdown.contains(e.target) && e.target !== btnQuickClient) {
        clientDropdown.style.display = 'none';
      }
    });

    // Print & Document Title Handlers
    let originalPageTitle = document.title;
    window.addEventListener('beforeprint', () => {
      originalPageTitle = document.title;
      const invNum = state.invoiceNumber || 'INV-1001';
      const client = (state.toName || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      document.title = client ? `${invNum}_${client}` : invNum;
    });

    window.addEventListener('afterprint', () => {
      document.title = originalPageTitle;
    });

    function downloadDirectPdf() {
      const sheet = document.getElementById('invoiceSheet');
      if (!sheet) return;

      const invNum = state.invoiceNumber || 'INV-1001';
      const client = (state.toName || 'Client').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${invNum}_${client}.pdf`;

      const btn = document.getElementById('btnDownloadPdf');
      let originalText = '';
      if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Generating...';
        btn.disabled = true;
      }

      // Temporarily hide elements that shouldn't appear in PDF
      const printHideElements = sheet.querySelectorAll('.print-hide');
      printHideElements.forEach(el => el.style.setProperty('display', 'none', 'important'));

      const opt = {
        margin: [8, 10, 8, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      if (window.html2pdf) {
        window.html2pdf().set(opt).from(sheet).save().then(() => {
          printHideElements.forEach(el => el.style.removeProperty('display'));
          if (btn) {
            btn.innerHTML = '✓ Downloaded!';
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
            }, 2000);
          }

          // GA4 Key Event & Lead Generation Tracking
          const { grandTotal } = calculateTotals();
          const invoiceVal = Number(grandTotal) || 0;
          trackEvent('generate_lead', {
            value: invoiceVal,
            currency: state.currency || 'USD',
            lead_type: 'pdf_download',
            doc_type: state.docType || 'Invoice',
            item_count: (state.items || []).length
          });
          trackEvent('download_invoice_pdf', {
            value: invoiceVal,
            currency: state.currency || 'USD',
            doc_type: state.docType || 'Invoice',
            filename: filename
          });
        }).catch(err => {
          console.error('PDF error:', err);
          printHideElements.forEach(el => el.style.removeProperty('display'));
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }

          const { grandTotal } = calculateTotals();
          trackEvent('generate_lead', {
            value: Number(grandTotal) || 0,
            currency: state.currency || 'USD',
            lead_type: 'print_fallback'
          });
          window.print();
        });
      } else {
        const { grandTotal } = calculateTotals();
        trackEvent('generate_lead', {
          value: Number(grandTotal) || 0,
          currency: state.currency || 'USD',
          lead_type: 'print_fallback'
        });
        window.print();
      }
    }

    const btnDownload = document.getElementById('btnDownloadPdf');
    if (btnDownload) {
      btnDownload.addEventListener('click', downloadDirectPdf);
    }

    const btnPrint = document.getElementById('btnPrintInvoice');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        const { grandTotal } = calculateTotals();
        trackEvent('generate_lead', {
          value: Number(grandTotal) || 0,
          currency: state.currency || 'USD',
          lead_type: 'print_invoice',
          doc_type: state.docType || 'Invoice'
        });
        trackEvent('print_invoice', {
          value: Number(grandTotal) || 0,
          currency: state.currency || 'USD',
          doc_type: state.docType || 'Invoice'
        });
        window.print();
      });
    }

    const btnSample = document.getElementById('btnSampleInvoice');
    if (btnSample) {
      btnSample.addEventListener('click', fillSampleData);
    }

    const btnClear = document.getElementById('btnClearInvoice');
    if (btnClear) {
      btnClear.addEventListener('click', openClearModal);
    }

    const btnCancelClear = document.getElementById('btnCancelClear');
    if (btnCancelClear) {
      btnCancelClear.addEventListener('click', closeClearModal);
    }

    const btnConfirmClear = document.getElementById('btnConfirmClear');
    if (btnConfirmClear) {
      btnConfirmClear.addEventListener('click', executeClearInvoice);
    }

    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
          closeClearModal();
        }
      });
    }

    // Delete Saved Invoice Confirmation Modal Listeners
    const btnCancelDelete = document.getElementById('btnCancelDelete');
    if (btnCancelDelete) {
      btnCancelDelete.addEventListener('click', closeDeleteModal);
    }

    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', executeDeleteInvoice);
    }

    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    if (deleteConfirmModal) {
      deleteConfirmModal.addEventListener('click', (e) => {
        if (e.target === deleteConfirmModal) {
          closeDeleteModal();
        }
      });
    }

    // Share Invoice Modal Listeners (Viral Growth Loop)
    function openShareModal() {
      const shareModal = document.getElementById('shareInvoiceModal');
      const shareInput = document.getElementById('shareInvoiceUrlInput');
      const waBtn = document.getElementById('btnShareWhatsApp');
      const emailBtn = document.getElementById('btnShareEmail');

      if (!shareModal) return;

      const shareUrl = getShareInvoiceUrl();
      if (shareInput) shareInput.value = shareUrl;

      // Copy to clipboard immediately on click
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Shareable link copied to clipboard! 🔗', '🔗');
        }).catch(() => {});
      }

      // Configure WhatsApp share button
      if (waBtn) {
        const sender = (state.fromName || 'Your Invoice').split('\n')[0].trim();
        const text = encodeURIComponent(`Here is your invoice from ${sender} (${state.invoiceNumber || 'INV'}): ${shareUrl}`);
        waBtn.href = `https://api.whatsapp.com/send?text=${text}`;
      }

      // Configure Email share button
      if (emailBtn) {
        const subject = encodeURIComponent(`Invoice ${state.invoiceNumber || ''} from ${state.fromName ? state.fromName.split('\n')[0].trim() : 'us'}`);
        const body = encodeURIComponent(`Hello,\n\nPlease find your invoice online at the following link:\n${shareUrl}\n\nYou can view the full details and download the PDF directly in your browser without creating an account.\n\nThank you!`);
        emailBtn.href = `mailto:?subject=${subject}&body=${body}`;
      }

      shareModal.style.display = 'flex';
      trackEvent('share_invoice_modal_open', { invoice_number: state.invoiceNumber });
    }

    function closeShareModal() {
      const shareModal = document.getElementById('shareInvoiceModal');
      if (shareModal) shareModal.style.display = 'none';
    }

    const btnShareInvoice = document.getElementById('btnShareInvoice');
    if (btnShareInvoice) {
      btnShareInvoice.addEventListener('click', openShareModal);
    }

    const btnCloseShareModal = document.getElementById('btnCloseShareModal');
    if (btnCloseShareModal) {
      btnCloseShareModal.addEventListener('click', closeShareModal);
    }

    const btnCopyShareUrl = document.getElementById('btnCopyShareUrl');
    if (btnCopyShareUrl) {
      btnCopyShareUrl.addEventListener('click', () => {
        const shareInput = document.getElementById('shareInvoiceUrlInput');
        if (shareInput) {
          shareInput.select();
          const copyText = shareInput.value;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(copyText).then(() => {
              btnCopyShareUrl.textContent = '✓ Copied!';
              setTimeout(() => { btnCopyShareUrl.textContent = '📋 Copy'; }, 2000);
              showToast('Link copied to clipboard! 📋', '📋');
            });
          } else {
            document.execCommand('copy');
            btnCopyShareUrl.textContent = '✓ Copied!';
            setTimeout(() => { btnCopyShareUrl.textContent = '📋 Copy'; }, 2000);
            showToast('Link copied to clipboard! 📋', '📋');
          }
          trackEvent('share_invoice_link_copied');
        }
      });
    }

    const shareInvoiceModal = document.getElementById('shareInvoiceModal');
    if (shareInvoiceModal) {
      shareInvoiceModal.addEventListener('click', (e) => {
        if (e.target === shareInvoiceModal) closeShareModal();
      });
    }

    // Global keyboard listener (Escape to close modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeClearModal();
        closeDeleteModal();
        closeShareModal();
      }
    });

    // Removable Section Listeners (Notes, Terms, Tax, Discount)
    const btnRemoveNotes = document.getElementById('btnRemoveNotes');
    if (btnRemoveNotes) {
      btnRemoveNotes.addEventListener('click', () => {
        state.showNotes = false;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    const btnAddNotes = document.getElementById('btnAddNotes');
    if (btnAddNotes) {
      btnAddNotes.addEventListener('click', () => {
        state.showNotes = true;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    const btnRemoveTerms = document.getElementById('btnRemoveTerms');
    if (btnRemoveTerms) {
      btnRemoveTerms.addEventListener('click', () => {
        state.showTerms = false;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    const btnAddTerms = document.getElementById('btnAddTerms');
    if (btnAddTerms) {
      btnAddTerms.addEventListener('click', () => {
        state.showTerms = true;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    const btnRemoveTax = document.getElementById('btnRemoveTax');
    if (btnRemoveTax) {
      btnRemoveTax.addEventListener('click', () => {
        state.showTax = false;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
      });
    }

    const btnAddTax = document.getElementById('btnAddTax');
    if (btnAddTax) {
      btnAddTax.addEventListener('click', () => {
        state.showTax = true;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
      });
    }

    const btnRemoveDiscount = document.getElementById('btnRemoveDiscount');
    if (btnRemoveDiscount) {
      btnRemoveDiscount.addEventListener('click', () => {
        state.showDiscount = false;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
      });
    }

    const btnAddDiscount = document.getElementById('btnAddDiscount');
    if (btnAddDiscount) {
      btnAddDiscount.addEventListener('click', () => {
        state.showDiscount = true;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
      });
    }

    // Toggle Discount Type (% vs Flat Cash)
    const btnToggleDiscountType = document.getElementById('btnToggleDiscountType');
    if (btnToggleDiscountType) {
      btnToggleDiscountType.addEventListener('click', () => {
        state.discountType = state.discountType === 'fixed' ? 'percent' : 'fixed';
        updateTotals();
        saveToStorage();
      });
    }

    // Shipping Fee Listeners
    const btnAddShipping = document.getElementById('btnAddShipping');
    if (btnAddShipping) {
      btnAddShipping.addEventListener('click', () => {
        state.showShipping = true;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
        const input = document.getElementById('shippingAmount');
        if (input) {
          input.focus();
          input.select();
        }
      });
    }

    const btnRemoveShipping = document.getElementById('btnRemoveShipping');
    if (btnRemoveShipping) {
      btnRemoveShipping.addEventListener('click', () => {
        state.showShipping = false;
        state.shippingAmount = 0;
        const input = document.getElementById('shippingAmount');
        if (input) input.value = 0;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
      });
    }

    // Ship To (Delivery Destination) Listeners
    const btnAddShipTo = document.getElementById('btnAddShipTo');
    if (btnAddShipTo) {
      btnAddShipTo.addEventListener('click', () => {
        state.showShipTo = true;
        renderSectionVisibility();
        saveToStorage();
        const input = document.getElementById('shipToName');
        if (input) input.focus();
      });
    }

    const btnRemoveShipTo = document.getElementById('btnRemoveShipTo');
    if (btnRemoveShipTo) {
      btnRemoveShipTo.addEventListener('click', () => {
        state.showShipTo = false;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    // Deposit / Amount Paid Listeners
    const btnAddAmountPaid = document.getElementById('btnAddAmountPaid');
    if (btnAddAmountPaid) {
      btnAddAmountPaid.addEventListener('click', () => {
        state.showAmountPaid = true;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
        const input = document.getElementById('amountPaid');
        if (input) {
          input.focus();
          input.select();
        }
      });
    }

    const btnRemoveAmountPaid = document.getElementById('btnRemoveAmountPaid');
    if (btnRemoveAmountPaid) {
      btnRemoveAmountPaid.addEventListener('click', () => {
        state.showAmountPaid = false;
        state.amountPaid = 0;
        const input = document.getElementById('amountPaid');
        if (input) input.value = 0;
        renderSectionVisibility();
        updateTotals();
        saveToStorage();
      });
    }

    // Toggle Watermark / Footer Badge Listener
    const btnToggleBadge = document.getElementById('btnToggleBadge');
    if (btnToggleBadge) {
      btnToggleBadge.addEventListener('click', () => {
        state.showPoweredBy = !(state.showPoweredBy !== false);
        renderSectionVisibility();
        saveToStorage();
      });
    }

    // Email Invoice Action
    const btnEmail = document.getElementById('btnEmailInvoice');
    if (btnEmail) {
      btnEmail.addEventListener('click', composeEmailDraft);
    }

    // Tax Label Customizer (VAT / GST / Sales Tax)
    const taxLabelSelect = document.getElementById('taxLabelSelect');
    if (taxLabelSelect) {
      taxLabelSelect.addEventListener('change', (e) => {
        state.taxLabel = e.target.value;
        const taxDisplay = document.getElementById('taxLabelDisplay');
        if (taxDisplay) taxDisplay.textContent = state.taxLabel;
        saveToStorage();
        showToast(`Tax label updated to ${state.taxLabel}`, '🏷️');
      });
    }

    // Line Item Unit Switcher (Quantity / Hours / Days)
    const btnToggleUnit = document.getElementById('btnToggleUnit');
    if (btnToggleUnit) {
      btnToggleUnit.addEventListener('click', () => {
        const units = ['Quantity', 'Hours', 'Days'];
        const currentIdx = units.indexOf(state.unitType || 'Quantity');
        const nextIdx = (currentIdx + 1) % units.length;
        state.unitType = units[nextIdx];
        const unitLabel = document.getElementById('colUnitLabel');
        if (unitLabel) unitLabel.textContent = state.unitType;
        saveToStorage();
        showToast(`Unit switched to ${state.unitType}! ⏱️`, '⏱️');
      });
    }

    // Document Type Selector
    const docSelect = document.getElementById('docTypeSelector');
    if (docSelect) {
      docSelect.addEventListener('change', (e) => {
        state.docType = e.target.value;
        renderDocType();
        saveToStorage();
      });
    }

    // Editable Invoice Title Input
    const titleEl = document.getElementById('invoiceMainTitle');
    if (titleEl) {
      titleEl.addEventListener('input', (e) => {
        state.docType = e.target.textContent.trim() || 'INVOICE';
        if (docSelect) docSelect.value = state.docType;
        saveToStorage();
      });
    }

    // Brand Accent Color Swatches
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.accentColor = btn.dataset.color;
        renderAccentColor();
        saveToStorage();
      });
    });

    const customColorInput = document.getElementById('customColorInput');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        state.accentColor = e.target.value;
        renderAccentColor();
        saveToStorage();
      });
    }

    // Due Date Quick Presets
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10) || 0;
        const issueInput = document.getElementById('issueDate');
        const dueInput = document.getElementById('dueDate');
        
        let baseDate = issueInput && issueInput.value ? new Date(issueInput.value) : new Date();
        if (isNaN(baseDate.getTime())) baseDate = new Date();
        
        const targetDate = new Date(baseDate.getTime() + days * 86400000);
        const dateStr = targetDate.toISOString().split('T')[0];
        
        state.dueDate = dateStr;
        if (dueInput) dueInput.value = dateStr;
        updateTermsActiveState();
        saveToStorage();
      });
    });

    // QR Code Listeners
    const btnRemoveQr = document.getElementById('btnRemoveQr');
    if (btnRemoveQr) {
      btnRemoveQr.addEventListener('click', () => {
        state.showQr = false;
        renderSectionVisibility();
        saveToStorage();
      });
    }

    const btnAddQr = document.getElementById('btnAddQr');
    if (btnAddQr) {
      btnAddQr.addEventListener('click', () => {
        state.showQr = true;
        renderSectionVisibility();
        renderQrCode();
        saveToStorage();
      });
    }

    const qrInput = document.getElementById('qrLinkInput');
    if (qrInput) {
      qrInput.addEventListener('input', (e) => {
        state.qrLink = e.target.value;
        renderQrCode();
        saveToStorage();
      });
    }
  }

  // ==========================================
  // Interactive 3D Parallax Tilt Effect
  // ==========================================
  function init3DTiltEffect() {
    const isPointerFine = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!isPointerFine) return;

    const wrapper = document.querySelector('.invoice-sheet-wrapper');
    const sheet = document.getElementById('invoiceSheet');
    if (!wrapper || !sheet) return;

    let isInputFocused = false;
    let rafId = null;

    sheet.addEventListener('focusin', () => {
      isInputFocused = true;
      resetTilt();
    });

    sheet.addEventListener('focusout', () => {
      isInputFocused = false;
    });

    function resetTilt() {
      if (rafId) cancelAnimationFrame(rafId);
      sheet.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      sheet.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    wrapper.addEventListener('mousemove', (e) => {
      if (isInputFocused) return;

      const rect = sheet.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        resetTilt();
        return;
      }

      // Max tilt: subtle ±1.6 degrees for refined, Apple-grade 3D depth
      const percentX = (x / rect.width) - 0.5;
      const percentY = (y / rect.height) - 0.5;
      const rotateY = (percentX * 3.2).toFixed(2);
      const rotateX = (-percentY * 3.2).toFixed(2);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        sheet.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
        sheet.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      });
    });

    wrapper.addEventListener('mouseleave', resetTilt);
  }

  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    state.lang = lang;
    const t = I18N[lang];

    // Document title
    const mainTitle = document.getElementById('invoiceMainTitle');
    if (mainTitle) {
      const titles = ['INVOICE', 'FACTURA', 'FACTURE', 'RECHNUNG', 'FATURA', 'FATTURA'];
      if (!state.customTitle || titles.includes(mainTitle.textContent.trim())) {
        mainTitle.textContent = t.docTitle;
      }
    }

    // Meta labels
    const lblInv = document.querySelector('label[for="invoiceNumber"]');
    if (lblInv) lblInv.textContent = t.invoiceNumber;
    const lblPo = document.querySelector('label[for="poNumber"]');
    if (lblPo) lblPo.textContent = t.poNumber;
    const lblIssue = document.querySelector('label[for="issueDate"]');
    if (lblIssue) lblIssue.textContent = t.issueDate;
    const lblDue = document.querySelector('label[for="dueDate"]');
    if (lblDue) lblDue.textContent = t.dueDate;
    const lblTerms = document.querySelector('.preset-label');
    if (lblTerms) lblTerms.textContent = t.terms;

    // Address tags
    const addressBlocks = document.querySelectorAll('.address-block .section-tag');
    if (addressBlocks[0]) addressBlocks[0].textContent = t.billedFrom;
    if (addressBlocks[1]) addressBlocks[1].textContent = t.billedTo;
    const shipToTag = document.querySelector('#shipToBlock .section-tag');
    if (shipToTag) shipToTag.textContent = t.shipTo;

    // Table headers
    const thDesc = document.querySelector('.col-desc');
    if (thDesc) thDesc.textContent = t.colDesc;
    const unitLabel = document.getElementById('colUnitLabel');
    if (unitLabel) {
      if (state.unitType === 'Hours') unitLabel.textContent = t.colHours;
      else if (state.unitType === 'Days') unitLabel.textContent = t.colDays;
      else unitLabel.textContent = t.colQty;
    }
    const thRate = document.querySelector('.col-rate');
    if (thRate) thRate.textContent = t.colRate;
    const thTotal = document.querySelector('.col-total');
    if (thTotal) thTotal.textContent = t.colTotal;

    // Add item button
    const btnAdd = document.getElementById('btnAddItem');
    if (btnAdd) btnAdd.innerHTML = t.addItem;

    // Notes & terms labels
    const lblNotes = document.querySelector('label[for="notesText"]');
    if (lblNotes) lblNotes.textContent = t.notesLabel;
    const lblPayTerms = document.querySelector('label[for="termsText"]');
    if (lblPayTerms) lblPayTerms.textContent = t.termsLabel;

    // Totals labels
    const valSubtotal = document.getElementById('valSubtotal');
    if (valSubtotal && valSubtotal.previousElementSibling) {
      valSubtotal.previousElementSibling.textContent = t.subtotal;
    }
    const grandTotalLabel = document.getElementById('grandTotalLabel');
    if (grandTotalLabel) grandTotalLabel.textContent = t.totalDue;

    // Top action buttons
    const btnDownload = document.getElementById('btnDownloadPdf');
    if (btnDownload) btnDownload.innerHTML = t.btnDownload;
    const btnPrint = document.getElementById('btnPrintInvoice');
    if (btnPrint) btnPrint.innerHTML = t.btnPrint;
    const btnEmail = document.getElementById('btnEmailInvoice');
    if (btnEmail) btnEmail.innerHTML = t.btnEmail;
    const btnClear = document.getElementById('btnClearInvoice');
    if (btnClear) btnClear.textContent = t.btnClear;

    // Language selector sync
    const langSelect = document.getElementById('langSelector');
    if (langSelect && langSelect.value !== lang) {
      langSelect.value = lang;
    }

    document.documentElement.lang = lang;
  }

  function initI18n() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const path = window.location.pathname;
    let initialLang = 'en';

    if (urlLang && I18N[urlLang]) {
      initialLang = urlLang;
    } else if (path.includes('/es/') || path.endsWith('/es.html') || path.endsWith('/es/')) {
      initialLang = 'es';
    } else if (path.includes('/fr/') || path.endsWith('/fr.html') || path.endsWith('/fr/')) {
      initialLang = 'fr';
    } else if (path.includes('/de/') || path.endsWith('/de.html') || path.endsWith('/de/')) {
      initialLang = 'de';
    } else if (path.includes('/pt/') || path.endsWith('/pt.html') || path.endsWith('/pt/')) {
      initialLang = 'pt';
    } else if (path.includes('/it/') || path.endsWith('/it.html') || path.endsWith('/it/')) {
      initialLang = 'it';
    } else if (state.lang && I18N[state.lang]) {
      initialLang = state.lang;
    }

    applyLanguage(initialLang);

    const langSelect = document.getElementById('langSelector');
    if (langSelect) {
      langSelect.value = initialLang;
      langSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        applyLanguage(selected);
        saveToStorage();
        trackEvent('language_change', { lang: selected });
      });
    }
  }

  // Init
  function init() {
    loadFromStorage();
    populateInputs();
    bindListeners();
    initSignaturePad();
    renderClientCatalogList();
    init3DTiltEffect();
    initI18n();

    if (activePresetLoaded) {
      setTimeout(() => {
        const title = activePresetLoaded.charAt(0).toUpperCase() + activePresetLoaded.slice(1);
        showToast(`Loaded ${title} invoice template!`, '⚡');
      }, 350);
    }

    if (isSharedInvoiceMode) {
      const banner = document.getElementById('sharedInvoiceBanner');
      const invNumEl = document.getElementById('sharedBannerInvNum');
      const btnSharedDl = document.getElementById('btnSharedBannerDownload');
      if (banner) {
        banner.style.display = 'block';
        if (invNumEl) invNumEl.textContent = state.invoiceNumber || 'INV-1001';
        if (btnSharedDl) {
          btnSharedDl.addEventListener('click', () => {
            const btn = document.getElementById('btnDownloadPdf');
            if (btn) btn.click();
          });
        }
      }
      trackEvent('view_shared_invoice', { invoice_number: state.invoiceNumber, doc_type: state.docType || 'INVOICE' });
      setTimeout(() => {
        const docLabel = (state.docType || 'invoice').toLowerCase();
        showToast(`Viewing shared ${docLabel} ${state.invoiceNumber || ''}`, '📄');
      }, 400);
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const actionParam = urlParams.get('action');
      if (actionParam === 'print') {
        setTimeout(() => {
          window.print();
        }, 700);
      } else if (actionParam === 'download') {
        setTimeout(() => {
          const btn = document.getElementById('btnDownloadPdf');
          if (btn) btn.click();
        }, 850);
      }
    } catch (e) {}
  }

  window.addEventListener('DOMContentLoaded', init);

})(window);
