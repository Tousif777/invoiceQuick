(() => {
  const recipient = 'support@quickbillfree.com';
  const form = document.getElementById('inquiryForm');
  const panel = document.getElementById('draftPanel');
  const draftBody = document.getElementById('draftBody');
  const status = document.getElementById('inqStatus');
  const business = document.getElementById('inqBiz');
  const name = document.getElementById('inqName');
  let subject = '';

  form.addEventListener('input', () => {
    business.setCustomValidity('');
    name.setCustomValidity('');
    panel.hidden = true;
    status.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const businessName = business.value.trim();
    const contactName = name.value.trim();
    business.setCustomValidity(businessName ? '' : 'Enter your business name.');
    name.setCustomValidity(contactName ? '' : 'Enter your name.');
    if (!form.reportValidity()) return;

    const industry = document.getElementById('inqIndustry').value.trim();
    const email = document.getElementById('inqEmail').value.trim();
    const notes = document.getElementById('inqNotes').value.trim();
    subject = 'QuickBillFree Business setup inquiry – ' + businessName;
    draftBody.value = [
      'Business name: ' + businessName,
      'Industry: ' + (industry || 'Not specified'),
      'Contact name: ' + contactName,
      'Contact email: ' + email,
      'Package: ' + form.elements.package.value,
      '',
      'Requirements:',
      notes || 'Standard white-label setup'
    ].join('\n');

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(draftBody.value.replace(/\n/g, '\r\n'));
    const gmail = new URL('https://mail.google.com/mail/');
    gmail.search = new URLSearchParams({
      view: 'cm', fs: '1', to: recipient, su: subject, body: draftBody.value
    });
    document.getElementById('gmailLink').href = gmail.href;
    document.getElementById('mailLink').href = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
    document.getElementById('draftSubject').textContent = 'Subject: ' + subject;
    status.textContent = '';
    panel.hidden = false;
    document.getElementById('draftHeading').focus();
  });

  document.getElementById('copyDraft').addEventListener('click', async () => {
    const text = `To: ${recipient}\nSubject: ${subject}\n\n${draftBody.value}`;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Draft copied. Paste it into a new email.';
    } catch {
      draftBody.focus();
      draftBody.select();
      status.textContent = 'The message is selected. Copy it and paste it into a new email.';
    }
  });
})();
