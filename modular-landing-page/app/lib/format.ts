/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: KES for Kenya Shillings)
 * @param locale - The locale for formatting (default: en-KE)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'KES',
  locale: string = 'en-KE'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as a simple price with currency symbol
 * @param price - The price to format
 * @param symbol - The currency symbol (default: KSh)
 * @returns Formatted price string
 */
export function formatPrice(price: number | undefined | null, symbol: string = 'KSh'): string {
  if (price === undefined || price === null || isNaN(price)) {
    return `${symbol} 0`;
  }
  return `${symbol} ${price.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
