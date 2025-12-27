/**
 * Divides two numbers, with a check for division by zero.
 * @param {number} a - The numerator.
 * @param {number} b - The denominator.
 * @returns {number|string} The result of the division, or an error message if division by zero is attempted.
 */
function divide(a, b) {
    if (b === 0) {
        console.error("Error: Division by zero is not allowed.");
        return NaN; // Or throw an error, depending on desired error handling strategy
    }
    return a / b;
}

/**
 * Adds an item to an array without mutating the original array.
 * Returns a new array with the added item.
 * @param {Array} arr - The original array.
 * @param {*} item - The item to add.
 * @returns {Array} A new array with the item added.
 */
function addItem(arr, item) {
    return [...arr, item]; // Returns a new array with the item, without mutating the original
}

/**
 * Checks the status of a user based on multiple conditions.
 * Refactored to improve readability using early exits (guard clauses).
 * @param {object} user - The user object.
 * @param {boolean} user.isActive - Whether the user is active.
 * @param {boolean} user.hasPermission - Whether the user has permission.
 * @param {string} user.role - The role of the user.
 * @returns {boolean} True if the user meets all criteria, false otherwise.
 */
function checkStatus(user) {
    // Use guard clauses to reduce nesting and improve readability
    if (!user || !user.isActive || !user.hasPermission) {
        return false;
    }
    return user.role === 'admin';
}

// Define a constant for the price to avoid "magic numbers".
const PRODUCT_UNIT_PRICE = 29.99;

/**
 * Calculates the total price based on quantity and a predefined unit price.
 * @param {number} quantity - The quantity of items.
 * @returns {number} The total calculated price.
 */
function calculatePrice(quantity) {
    return quantity * PRODUCT_UNIT_PRICE;
}

/**
 * Loads data from an API endpoint and handles both success and error cases.
 * Returns a Promise that resolves with the data or rejects with an error.
 * @returns {Promise<object|Error>} A promise that resolves with the fetched data or rejects with an error.
 */
async function loadData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load data:", error);
        throw error; // Re-throw to allow upstream error handling
    }
}
