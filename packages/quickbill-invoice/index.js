/**
 * quickbill-invoice
 * Lightweight client-side invoice and bill calculation utility.
 * Powered by QuickBillFree.com (https://quickbillfree.com)
 */

class InvoiceCalculator {
  /**
   * Calculates item subtotal, discount, tax, and final grand total.
   * @param {Array<{ rate: number, quantity: number }>} items - List of invoice line items
   * @param {Object} options - Tax, discount, and shipping rates
   * @returns {Object} Computed financial summary
   */
  static calculate(items = [], options = {}) {
    const subtotal = items.reduce((acc, item) => {
      const rate = parseFloat(item.rate) || 0;
      const qty = parseFloat(item.quantity) || 0;
      return acc + (rate * qty);
    }, 0);

    const discountRate = parseFloat(options.discountPercent) || 0;
    const discountAmount = subtotal * (discountRate / 100);

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxRate = parseFloat(options.taxPercent) || 0;
    const taxAmount = taxableAmount * (taxRate / 100);

    const shipping = parseFloat(options.shipping) || 0;
    const total = taxableAmount + taxAmount + shipping;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }

  /**
   * Formats a numeric currency value.
   * @param {number} amount
   * @param {string} currencyCode - e.g. 'USD', 'EUR', 'GBP'
   * @returns {string}
   */
  static formatCurrency(amount, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  }
}

module.exports = InvoiceCalculator;
