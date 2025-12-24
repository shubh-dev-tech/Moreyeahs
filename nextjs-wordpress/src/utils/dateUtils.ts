/**
 * Utility functions for consistent date formatting across the application
 * Prevents hydration errors by avoiding locale-dependent date formatting
 */

/**
 * Format date consistently for server and client rendering
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format date in short format
 * @param dateString - ISO date string
 * @returns Short formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format date for machine reading (ISO format)
 * @param dateString - ISO date string
 * @returns ISO formatted date string
 */
export function formatDateISO(dateString: string): string {
  return new Date(dateString).toISOString().split('T')[0];
}