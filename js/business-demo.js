(() => {
  const key = 'qbf_business_demo_v1';
  const defaults = {
    brandName: 'Acme Plumbing & Heating',
    accentColor: '#4f46e5',
    customers: [
      { id: 'c1', name: 'Northstar Property Management', email: 'accounts@northstar.example' },
      { id: 'c2', name: 'Oakwood Bakery Ltd', email: 'david@oakwood.example' }
    ],
    invoices: [
      { id: 'i1', number: 'INV-1001', customer: 'Northstar Property Management', desc: 'Boiler inspection & valve replacement', amount: 420, status: 'Paid' },
      { id: 'i2', number: 'INV-1002', customer: 'Oakwood Bakery Ltd', desc: 'Commercial drainage service', amount: 288, status: 'Overdue' },
      { id: 'i3', number: 'INV-1003', customer: 'Northstar Property Management', desc: 'Radiator balancing', amount: 216, status: 'Sent' }
    ]
  };
  const $ = (id) => document.getElementById(id);
  const pounds = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
  const money = (amount) => pounds.format(amount);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const tabs = document.querySelectorAll('.demo-tab');
  const navigation = document.querySelectorAll('.demo-nav-btn[data-tab]');

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved?.invoices) && Array.isArray(saved?.customers)) {
        return {
          ...saved,
          brandName: String(saved.brandName || defaults.brandName),
          accentColor: /^#[0-9a-f]{6}$/i.test(saved.accentColor) ? saved.accentColor : defaults.accentColor
        };
      }
    } catch {
      // The demo can run with in-memory data if storage is unavailable.
    }
    return structuredClone(defaults);
  }

  let state = load();

  function announce(message) {
    $('demoFeedback').textContent = message;
  }

  function save(message) {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      message += ' Changes are available until you close or reload this page.';
    }
    render();
    announce(message);
  }

  function switchTab(tab, focusTarget = null) {
    tabs.forEach((section) => { section.hidden = section.id !== 'tab-' + tab; });
    navigation.forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    announce('');
    (focusTarget || $('tab-' + tab).querySelector('h2')).focus();
  }

  function invoiceTable(invoices, label) {
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="${label}"><table class="demo-table">
      <thead><tr><th scope="col">Invoice</th><th scope="col">Customer</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
      <tbody>${invoices.map((invoice) => {
        const number = escape(invoice.number);
        const id = escape(invoice.id);
        const status = escape(invoice.status);
        const statusClass = invoice.status === 'Paid' ? ' status-paid' : invoice.status === 'Overdue' ? ' status-overdue' : '';
        return `<tr>
          <td><strong>${number}</strong></td><td>${escape(invoice.customer)}</td><td class="invoice-amount">${money(invoice.amount)}</td>
          <td><span class="status${statusClass}">${status}</span></td>
          <td><div class="invoice-actions">
            <button class="row-btn" type="button" data-action="pdf" data-id="${id}" aria-label="Download ${number} PDF">PDF</button>
            ${invoice.status === 'Paid' ? '' : `<button class="row-btn" type="button" data-action="paid" data-id="${id}" aria-label="Mark ${number} paid">Mark paid</button>`}
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
  }

  function previewBrand() {
    $('previewBrandName').textContent = $('dBrandName').value.trim() || 'My Business';
    $('brandPreview').style.setProperty('--demo-accent', $('dBrandColor').value);
  }

  function render() {
    $('demoBrandTitle').textContent = state.brandName;
    $('demoInitials').textContent = state.brandName.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
    $('demoRoot').style.setProperty('--demo-accent', state.accentColor);

    let total = 0;
    let paid = 0;
    state.invoices.forEach((invoice) => {
      const pennies = Math.round(Number(invoice.amount) * 100);
      total += pennies;
      if (invoice.status === 'Paid') paid += pennies;
    });
    const percentage = total ? Math.round(paid / total * 100) : 0;
    $('dInvoiced').textContent = money(total / 100);
    $('dPaid').textContent = money(paid / 100);
    $('dOutstanding').textContent = money((total - paid) / 100);
    $('dCustCount').textContent = state.customers.length;
    $('dPaidPercent').textContent = percentage + '%';
    $('dPaymentTrack').setAttribute('aria-label', percentage + '% of invoiced value collected');
    $('dPaymentTrack').firstElementChild.style.width = percentage + '%';

    $('dashRecentTable').innerHTML = invoiceTable(state.invoices.slice(0, 5), 'Recent invoices');
    $('invListTable').innerHTML = invoiceTable(state.invoices, 'All invoices');
    const customerSelect = $('dInvCustomer');
    const previousCustomer = customerSelect.value;
    customerSelect.replaceChildren(...state.customers.map((customer) => new Option(customer.name, customer.id)));
    if (state.customers.some((customer) => customer.id === previousCustomer)) {
      customerSelect.value = previousCustomer;
    }
    $('custListTable').innerHTML = `<div class="table-scroll" tabindex="0" role="region" aria-label="Customer directory"><table class="demo-table">
      <thead><tr><th scope="col">Business</th><th scope="col">Email</th></tr></thead>
      <tbody>${state.customers.map((customer) => `<tr><td><strong>${escape(customer.name)}</strong></td><td>${escape(customer.email || '—')}</td></tr>`).join('')}</tbody>
    </table></div>`;
  }

  function syncBrandForm() {
    $('dBrandName').value = state.brandName;
    $('dBrandColor').value = state.accentColor;
    previewBrand();
  }

  async function downloadPdf(invoice, button) {
    const template = $('pdfSampleTemplate');
    if (!template.hidden) return;
    button.disabled = true;
    template.hidden = false;
    template.innerHTML = `
      <div style="border-bottom:3px solid ${state.accentColor};padding-bottom:16px;margin-bottom:24px">
        <p style="font-size:14px">Sample invoice · ${escape(invoice.number)}</p>
        <h2 style="margin:6px 0;font-size:26px">${escape(state.brandName)}</h2>
      </div>
      <p style="margin-bottom:18px"><strong>Bill to</strong><br>${escape(invoice.customer)}</p>
      <p style="padding:12px 0;border-bottom:1px solid #bdcec3">${escape(invoice.desc)}</p>
      <p style="margin-top:16px;font-size:20px"><strong>Total ${money(invoice.amount)}</strong></p>
      <p>${escape(invoice.status)}</p>
    `;
    try {
      await html2pdf().from(template).set({ filename: invoice.number + '.pdf', margin: 10 }).save();
      announce(invoice.number + ' PDF downloaded.');
    } catch {
      announce('Could not download the PDF. Try again.');
    } finally {
      template.hidden = true;
      template.replaceChildren();
      button.disabled = false;
    }
  }

  navigation.forEach((button) => button.addEventListener('click', () => switchTab(button.dataset.tab)));
  $('btnNewInvoice').addEventListener('click', () => switchTab('invoices', $('dInvCustomer')));
  $('btnViewInvoices').addEventListener('click', () => switchTab('invoices'));

  ['dashRecentTable', 'invListTable'].forEach((tableId) => {
    const table = $(tableId);
    table.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      const invoice = button && state.invoices.find((item) => item.id === button.dataset.id);
      if (!invoice) return;
      if (button.dataset.action === 'pdf') {
        downloadPdf(invoice, button);
      } else {
        const rowIndex = button.closest('tr').rowIndex;
        invoice.status = 'Paid';
        save(invoice.number + ' marked paid.');
        table.querySelector('table').rows[rowIndex].querySelector('button').focus();
      }
    });
  });

  $('demoInvForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const customer = state.customers.find((item) => item.id === $('dInvCustomer').value);
    const description = $('dInvDesc').value.trim();
    if (!customer || !description) {
      announce('Choose a customer and enter a service description.');
      return;
    }
    const lastNumber = state.invoices.reduce((highest, invoice) => Math.max(highest, Number(invoice.number.replace('INV-', '')) || 0), 1000);
    const number = 'INV-' + (lastNumber + 1);
    state.invoices.unshift({
      id: 'i_' + crypto.randomUUID(),
      number,
      customer: customer.name,
      desc: description,
      amount: $('dInvAmount').valueAsNumber,
      status: 'Sent'
    });
    event.target.reset();
    save(number + ' created.');
  });

  $('demoCustForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('dCustName').value.trim();
    if (!name) {
      announce('Enter a business name.');
      $('dCustName').focus();
      return;
    }
    state.customers.unshift({ id: 'c_' + crypto.randomUUID(), name, email: $('dCustEmail').value.trim() });
    event.target.reset();
    save(name + ' added.');
  });

  $('demoBrandForm').addEventListener('input', previewBrand);
  $('demoBrandForm').addEventListener('submit', (event) => {
    event.preventDefault();
    state.brandName = $('dBrandName').value.trim() || 'My Business';
    state.accentColor = $('dBrandColor').value;
    syncBrandForm();
    save('Branding applied.');
  });

  $('btnResetDemo').addEventListener('click', () => {
    if (!window.confirm('Reset the demo and remove your sample changes?')) return;
    state = structuredClone(defaults);
    $('demoInvForm').reset();
    $('demoCustForm').reset();
    syncBrandForm();
    switchTab('dashboard');
    save('Demo reset.');
  });

  syncBrandForm();
  render();
})();
