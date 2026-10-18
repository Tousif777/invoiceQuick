const InvoiceCalculator = require('./index.js');

const items = [
  { description: 'Development', rate: 100, quantity: 2 },
  { description: 'Consulting', rate: 50, quantity: 1 }
];

const res = InvoiceCalculator.calculate(items, { taxPercent: 10, discountPercent: 0 });
console.log('Test result:', res);
if (res.total === 275 && res.subtotal === 250) {
  console.log('✅ All package calculations passed with 100% precision!');
} else {
  console.error('❌ Calculation mismatch');
  process.exit(1);
}
