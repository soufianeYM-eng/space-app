import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { calculateProfitMargin } from './markets.utils'

describe('calculateProfitMargin', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it.each([
    { sellPrice: 150, purchasePrice: 100, expected: '50.0', description: 'positive profit margin' },
    { sellPrice: 75, purchasePrice: 100, expected: '-25.0', description: 'negative profit margin (loss)' },
    { sellPrice: 100, purchasePrice: 100, expected: '0.0', description: 'zero profit margin' },
    { sellPrice: 133.33, purchasePrice: 100, expected: '33.3', description: 'rounding to 1 decimal place' },
    { sellPrice: 500, purchasePrice: 100, expected: '400.0', description: 'large margins' },
    { sellPrice: 101, purchasePrice: 100, expected: '1.0', description: 'small margins' },
    { sellPrice: 125.50, purchasePrice: 100.25, expected: '25.2', description: 'decimal prices' },
    { sellPrice: 100.5, purchasePrice: 100, expected: '0.5', description: 'very small margins with precision' },
    { sellPrice: 50, purchasePrice: 200, expected: '-75.0', description: 'large loss' },
  ])('should calculate $description correctly', ({ sellPrice, purchasePrice, expected }) => {
    const result = calculateProfitMargin(sellPrice, purchasePrice)
    expect(result).toBe(expected)
  })

  it.each([
    { sellPrice: 100, purchasePrice: 0, description: 'purchase price is 0' },
    { sellPrice: 100, purchasePrice: -50, description: 'purchase price is negative' },
  ])('should log error and return "0.0" when $description', ({ sellPrice, purchasePrice }) => {
    const result = calculateProfitMargin(sellPrice, purchasePrice)

    expect(result).toBe('0.0')
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Purchase price must be greater than 0',
      { sellPrice, purchasePrice }
    )
  })
})
