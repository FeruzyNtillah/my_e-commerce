/**
 * Formats a number as TZS currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Adds TZS prefix to a value
 * @param {number|string} value - The value to prefix
 * @returns {string} - Value with TZS prefix
 */
export const addCurrency = (value) => {
    return `TZS ${value}`;
};
