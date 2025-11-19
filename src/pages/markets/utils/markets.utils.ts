/**
 * Calculate the profit margin percentage between sell and purchase prices
 * @param sellPrice - The price at which the item is sold
 * @param purchasePrice - The price at which the item is purchased
 * @returns The profit margin as a string with 1 decimal place (e.g., "25.5"), or "0.0" if purchasePrice is invalid
 */
export function calculateProfitMargin(sellPrice: number, purchasePrice: number): string {
  if (purchasePrice <= 0) {
    console.error('Purchase price must be greater than 0', { sellPrice, purchasePrice })
    return '0.0'
  }

  const margin = ((sellPrice - purchasePrice) / purchasePrice) * 100
  return margin.toFixed(1)
}
