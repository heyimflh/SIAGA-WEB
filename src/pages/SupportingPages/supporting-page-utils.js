/**
 * Utility functions for Supporting Pages.
 */

/**
 * Validates that commission split sums to 100.
 * @param {number} platformPercent
 * @param {number} pilotPercent
 * @returns {boolean}
 */
export function validateCommissionSplit(platformPercent, pilotPercent) {
  return platformPercent + pilotPercent === 100;
}

/**
 * Generates FAQ panel content ID from item id.
 * @param {string} faqId
 * @returns {string}
 */
export function getFAQPanelId(faqId) {
  return `${faqId}-panel`;
}

/**
 * Generates FAQ button ID from item id.
 * @param {string} faqId
 * @returns {string}
 */
export function getFAQButtonId(faqId) {
  return `${faqId}-button`;
}
