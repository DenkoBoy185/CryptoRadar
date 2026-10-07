export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercentage(percentage) {
  if (!percentage && percentage !== 0) return '0.00%';
  const formatted = percentage.toFixed(2) + '%';
  return percentage > 0 ? '+' + formatted : formatted;
}
