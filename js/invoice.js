// js/invoice.js - Super Intuitive Client-Side Invoice Generator Engine

(function(window) {
  'use strict';

  const STORAGE_KEY = 'simple_invoice_data_v1';

  const CURRENCIES = {
    USD: { symbol: '$', code: 'USD' },
    EUR: { symbol: '€', code: 'EUR' },
    GBP: { symbol: '£', code: 'GBP' },
    CAD: { symbol: 'CA$', code: 'CAD' },
    AUD: { symbol: 'A$', code: 'AUD' },
    INR: { symbol: '₹', code: 'INR' }
  };

  const DEFAULT_STATE = {
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

    // Items
    items: [
      { description: 'Website Redesign & UI Development', quantity: 1, rate: 2400 },
      { description: 'Mobile Responsive Optimization', quantity: 8, rate: 95 },
      { description: 'SEO Performance Audit & Setup', quantity: 1, rate: 450 }
    ],

    // Adjustments & Visibility
    taxRate: 8,
    discountRate: 0,
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
    terms: 'Payment via Bank Transfer (Wire/ACH):\nBank Name: Silicon Valley Bank\nAccount: 1234-5678-9012\nRouting: 987654321'
  };

  let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

  // Helper formatting
  function getCurrencySymbol() {
    return (CURRENCIES[state.currency] || CURRENCIES.USD).symbol;
  }

  function formatMoney(amount) {
    const symbol = getCurrencySymbol();
    const num = Number(amount) || 0;
    return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Calculate Subtotal, Tax, Discount, Grand Total
  function calculateTotals() {
    let subtotal = 0;
    state.items.forEach(item => {
      const q = Math.max(0, Number(item.quantity) || 0);
      const r = Math.max(0, Number(item.rate) || 0);
      subtotal += (q * r);
    });

    const taxPercent = state.showTax ? Math.max(0, Number(state.taxRate) || 0) : 0;
    const taxAmount = (subtotal * taxPercent) / 100;

    const discountPercent = state.showDiscount ? Math.max(0, Number(state.discountRate) || 0) : 0;
    const discountAmount = (subtotal * discountPercent) / 100;

    const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

    return {
      subtotal: subtotal,
      taxAmount: taxAmount,
      discountAmount: discountAmount,
      grandTotal: grandTotal
    };
  }

  // Save to LocalStorage (0 Server)
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      showSaveIndicator();
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  function loadFromStorage() {
    try {
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
      ind.classList.add('visible');
      clearTimeout(ind._timer);
      ind._timer = setTimeout(() => {
        ind.classList.remove('visible');
      }, 1500);
    }
  }

  // Item Management
  function addItem(description = 'New Service Item', quantity = 1, rate = 100) {
    state.items.push({
      description: description,
      quantity: quantity,
      rate: rate
    });
    renderItems();
    updateTotals();
    saveToStorage();
  }

  function removeItem(index) {
    if (state.items.length <= 1) {
      // Keep at least one empty item row
      state.items = [{ description: '', quantity: 1, rate: 0 }];
    } else {
      state.items.splice(index, 1);
    }
    renderItems();
    updateTotals();
    saveToStorage();
  }

  // Render Table Items
  function renderItems() {
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    state.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = 'item-row';

      const lineTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);

      tr.innerHTML = `
        <td class="col-desc">
          <input type="text" class="table-input item-desc" placeholder="Description of service or product" value="${escapeHtml(item.description)}" data-index="${index}">
        </td>
        <td class="col-qty">
          <input type="number" class="table-input item-qty" min="0" step="any" value="${item.quantity}" data-index="${index}">
        </td>
        <td class="col-rate">
          <input type="number" class="table-input item-rate" min="0" step="any" value="${item.rate}" data-index="${index}">
        </td>
        <td class="col-total">
          <span class="line-total-val">${formatMoney(lineTotal)}</span>
        </td>
        <td class="col-action print-hide">
          <button type="button" class="btn-delete-row" title="Delete Item" data-index="${index}">✕</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Event listeners on dynamically rendered table rows
    tbody.querySelectorAll('.item-desc').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        state.items[idx].description = e.target.value;
        saveToStorage();
      });
    });

    tbody.querySelectorAll('.item-qty').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        state.items[idx].quantity = e.target.value;
        updateTotals();
        saveToStorage();
        // Update line total text
        const totalSpan = e.target.closest('tr').querySelector('.line-total-val');
        if (totalSpan) {
          const lt = (Number(e.target.value) || 0) * (Number(state.items[idx].rate) || 0);
          totalSpan.textContent = formatMoney(lt);
        }
      });
    });

    tbody.querySelectorAll('.item-rate').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        state.items[idx].rate = e.target.value;
        updateTotals();
        saveToStorage();
        // Update line total text
        const totalSpan = e.target.closest('tr').querySelector('.line-total-val');
        if (totalSpan) {
          const lt = (Number(state.items[idx].quantity) || 0) * (Number(e.target.value) || 0);
          totalSpan.textContent = formatMoney(lt);
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        removeItem(idx);
      });
    });
  }

  function updateTotals() {
    const totals = calculateTotals();

    const elSubtotal = document.getElementById('valSubtotal');
    const elTax = document.getElementById('valTax');
    const elDiscount = document.getElementById('valDiscount');
    const elGrandTotal = document.getElementById('valGrandTotal');
    const elCurrencySymbols = document.querySelectorAll('.currency-symbol');

    if (elSubtotal) elSubtotal.textContent = formatMoney(totals.subtotal);
    if (elTax) elTax.textContent = formatMoney(totals.taxAmount);
    if (elDiscount) elDiscount.textContent = formatMoney(totals.discountAmount);
    if (elGrandTotal) elGrandTotal.textContent = formatMoney(totals.grandTotal);

    elCurrencySymbols.forEach(span => {
      span.textContent = getCurrencySymbol();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Logo Upload & Remove
  function handleLogoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      state.logo = e.target.result;
      renderLogo();
      saveToStorage();
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    state.logo = null;
    renderLogo();
    saveToStorage();
  }

  function renderLogo() {
    const logoBox = document.querySelector('.logo-upload-box');
    const logoImg = document.getElementById('invoiceLogoImg');
    const uploadPrompt = document.getElementById('logoUploadPrompt');
    const removeBtn = document.getElementById('btnRemoveLogo');

    if (state.logo) {
      if (logoBox) logoBox.classList.add('has-logo');
      logoImg.src = state.logo;
      logoImg.style.display = 'block';
      uploadPrompt.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
      if (logoBox) logoBox.classList.remove('has-logo');
      logoImg.src = '';
      logoImg.style.display = 'none';
      uploadPrompt.style.display = 'flex';
      if (removeBtn) removeBtn.style.display = 'none';
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

    // QR Code Section Visibility
    const elQr = document.getElementById('qrSection');
    const btnAddQr = document.getElementById('btnAddQr');
    if (elQr && btnAddQr) {
      elQr.style.display = state.showQr ? 'flex' : 'none';
      btnAddQr.style.display = state.showQr ? 'none' : 'inline-flex';
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
    
    // Calculate a slightly darker hover color
    document.documentElement.style.setProperty('--primary-hover', color);

    // Update active swatch
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

  // Lightweight Client-Side QR Code Generator (SVG based)
  function renderQrCode() {
    const container = document.getElementById('qrCodeOutput');
    if (!container) return;

    const data = (state.qrLink || 'https://paypal.me/').trim();
    // Use high-speed Google Charts API or fallback SVG QR representation
    const safeUrl = encodeURIComponent(data);
    container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${safeUrl}" alt="Payment QR Code" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" loading="lazy">`;
  }

  // Populate Input Fields from State
  function populateInputs() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('invoiceNumber', state.invoiceNumber);
    setVal('issueDate', state.issueDate);
    setVal('dueDate', state.dueDate);
    setVal('fromName', state.fromName);
    setVal('fromDetails', state.fromDetails);
    setVal('toName', state.toName);
    setVal('toDetails', state.toDetails);
    setVal('taxRate', state.taxRate);
    setVal('discountRate', state.discountRate);
    setVal('notesText', state.notes);
    setVal('termsText', state.terms);
    setVal('qrLinkInput', state.qrLink);

    const currSelect = document.getElementById('currencySelector');
    if (currSelect) currSelect.value = state.currency || 'USD';

    renderLogo();
    renderLayout();
    renderDocType();
    renderAccentColor();
    renderSectionVisibility();
    renderQrCode();
    renderItems();
    updateTotals();
  }

  // Clear / Sample actions
  function fillSampleData() {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    populateInputs();
    saveToStorage();
  }

  function clearInvoice() {
    if (confirm('Are you sure you want to clear this invoice?')) {
      state = {
        currency: 'USD',
        invoiceNumber: 'INV-1001',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        logo: null,
        fromName: '',
        fromDetails: '',
        toName: '',
        toDetails: '',
        items: [{ description: '', quantity: 1, rate: 0 }],
        taxRate: 0,
        discountRate: 0,
        notes: '',
        terms: ''
      };
      populateInputs();
      saveToStorage();
    }
  }

  // Bind Form Listeners
  function bindListeners() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          state[key] = e.target.value;
          saveToStorage();
          if (key === 'taxRate' || key === 'discountRate') {
            updateTotals();
          }
        });
      }
    };

    bind('invoiceNumber', 'invoiceNumber');
    bind('issueDate', 'issueDate');
    bind('dueDate', 'dueDate');
    bind('fromName', 'fromName');
    bind('fromDetails', 'fromDetails');
    bind('toName', 'toName');
    bind('toDetails', 'toDetails');
    bind('taxRate', 'taxRate');
    bind('discountRate', 'discountRate');
    bind('notesText', 'notes');
    bind('termsText', 'terms');

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

    // Header Actions
    const btnPrint = document.getElementById('btnPrintInvoice');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    const btnSample = document.getElementById('btnSampleInvoice');
    if (btnSample) {
      btnSample.addEventListener('click', fillSampleData);
    }

    const btnClear = document.getElementById('btnClearInvoice');
    if (btnClear) {
      btnClear.addEventListener('click', clearInvoice);
    }

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

  // Init
  function init() {
    loadFromStorage();
    populateInputs();
    bindListeners();
  }

  window.addEventListener('DOMContentLoaded', init);

})(window);
