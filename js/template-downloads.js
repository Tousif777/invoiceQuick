/* Count download-link clicks without sending document or client contents. */
document.addEventListener('click', function (event) {
  if (event.defaultPrevented || !event.target || !event.target.closest) return;
  const link = event.target.closest('a[data-template-download]');
  if (!link || typeof window.gtag !== 'function') return;
  const format = link.dataset.templateDownload;
  if (format !== 'xlsx' && format !== 'docx') return;
  try {
    window.gtag('event', 'invoice_template_download_click', {
      template_format: format,
      transport_type: 'beacon'
    });
  } catch (_) {
    // Analytics must never prevent the normal file download.
  }
});
