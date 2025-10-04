/**
 * Day-Of-Year (DOY) utilities for ClimaLens
 * 
 * These functions handle date-to-DOY conversion and windowing for climatological analysis.
 * The analysis uses historical data (1980-present) mapped by DOY, allowing users to
 * query future dates as "what historically happens around this date-of-year?"
 */

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Get Day-Of-Year (DOY) for a given date
 * Returns 1-366 (366 only for leap years on/after Feb 29)
 * 
 * @param date - The date to convert
 * @returns DOY (1-366)
 * 
 * @example
 * getDOY(new Date('2024-01-01')) // 1
 * getDOY(new Date('2024-02-29')) // 60 (leap year)
 * getDOY(new Date('2024-12-31')) // 366 (leap year)
 */
export function getDOY(date: Date): number {
  const year = date.getFullYear()
  const start = new Date(year, 0, 0) // Dec 31 of previous year
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const doy = Math.floor(diff / oneDay)
  return doy
}

/**
 * Normalize leap-day DOY for historical data lookup
 * 
 * Policy: When DOY=60 (Feb 29) is queried but the dataset years don't have leap days,
 * we map it to DOY=59 (Feb 28) to ensure consistent historical lookup.
 * This is a conservative approach that uses the closest non-leap day.
 * 
 * For analysis windows around leap day (e.g., Feb 27-Mar 2), the window will include
 * both Feb 28 and Mar 1 data, effectively averaging around the leap day.
 * 
 * @param doy - The original DOY (1-366)
 * @param isLeap - Whether the queried year is a leap year
 * @returns Normalized DOY for historical lookup (1-365)
 * 
 * @example
 * normalizeLeapDOY(60, true)  // 59 (Feb 29 → Feb 28)
 * normalizeLeapDOY(61, true)  // 60 (Mar 1 in leap year → Mar 1 in non-leap)
 * normalizeLeapDOY(100, false) // 100 (no change for non-leap years)
 */
export function normalizeLeapDOY(doy: number, isLeap: boolean): number {
  if (!isLeap || doy < 60) {
    // Non-leap year or before Feb 29: no adjustment needed
    return doy
  }
  
  if (doy === 60) {
    // Feb 29 in leap year → map to Feb 28 (DOY 59)
    return 59
  }
  
  // After Feb 29 in leap year: shift back by 1 to align with non-leap years
  // (Mar 1 in leap = DOY 61 → Mar 1 in non-leap = DOY 60)
  return doy - 1
}

/**
 * Get the maximum DOY for a given year (365 or 366)
 */
export function getMaxDOY(year: number): number {
  return isLeapYear(year) ? 366 : 365
}

/**
 * Generate a window of DOYs around a central DOY, wrapping at year boundaries
 * 
 * This handles cases like DOY=1 with window=7 → [359,360,...,365,1,2,...,7]
 * and DOY=365 with window=7 → [359,...,365,1,...,5]
 * 
 * @param centerDOY - The central DOY (1-366)
 * @param windowSize - Number of days on each side (±windowSize)
 * @param maxDOY - Maximum DOY for the year (365 or 366)
 * @returns Array of DOYs in the window, sorted
 * 
 * @example
 * wrapWindow(1, 3, 365)   // [363, 364, 365, 1, 2, 3, 4]
 * wrapWindow(365, 3, 365) // [362, 363, 364, 365, 1, 2, 3]
 * wrapWindow(180, 7, 365) // [173, 174, ..., 180, ..., 186, 187]
 */
export function wrapWindow(centerDOY: number, windowSize: number, maxDOY: number = 365): number[] {
  const doys: number[] = []
  
  for (let offset = -windowSize; offset <= windowSize; offset++) {
    let doy = centerDOY + offset
    
    // Wrap around year boundaries
    if (doy < 1) {
      doy = maxDOY + doy // e.g., 0 → 365, -1 → 364
    } else if (doy > maxDOY) {
      doy = doy - maxDOY // e.g., 366 → 1 (when maxDOY=365)
    }
    
    doys.push(doy)
  }
  
  return doys
}

/**
 * Check if a date is in the future relative to today
 */
export function isFutureDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to start of day
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate > today
}

/**
 * Check if a date is Feb 29 (leap day)
 */
export function isLeapDay(date: Date): boolean {
  return date.getMonth() === 1 && date.getDate() === 29
}

/**
 * Get date from DOY and year
 * Useful for reverse conversion
 */
export function dateFromDOY(doy: number, year: number): Date {
  const date = new Date(year, 0) // Jan 1st
  date.setDate(doy) // Add days
  return date
}

/**
 * Format DOY with month/day for display
 */
export function formatDOY(doy: number, year: number): string {
  const date = dateFromDOY(doy, year)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

