// In a real application, API keys should be loaded securely from environment variables or a secure configuration service, not hardcoded.
// const API_KEY = "sk_live_12345abcdef67890"; // Removed hardcoded API key for security

/**
 * Returns the uppercase name of a user.
 * @param {object} user - The user object.
 * @param {string} user.name - The name of the user.
 * @returns {string|null} The uppercase name, or null if user or user.name is null.
 */
function getUserName(user) {
    // Added null check for user and user.name
    if (user && user.name) {
        return user.name.toUpperCase();
    }
    return null; // Return null or throw an error if user or name is missing
}

// Avoid console.log in production. Use a logging library that can be configured for different environments.
// console.log("App started"); // Removed for production readiness

/**
 * Executes a given code string. WARNING: Using eval() is a severe security risk
 * as it can execute arbitrary code. Avoid using it whenever possible.
 * If dynamic code execution is required, consider safer alternatives like
 * Web Workers with strict content security policies, or a sandboxed environment.
 * @param {string} code - The code string to execute.
 */
function runCode(code) {
    // eval(code); // Removed eval() due to security risks. If absolutely necessary, implement robust sanitization and sandboxing.
    console.warn("Attempted to run code using eval(). This is a security risk and should be avoided.");
}

/**
 * Fetches data from a specified API endpoint.
 * Includes error handling to gracefully manage network issues or API errors.
 * @returns {Promise<object|null>} The fetched data or null if an error occurs.
 */
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null; // Return null or re-throw the error for upstream handling
    }
}

// Unused variable 'unusedVar' has been removed to improve code quality.

/**
 * Calculates the sum of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of a and b.
 */
function calculateTotal(a, b) {
    const sum = a + b;
    return sum; // Added missing return statement
}

/**
 * Displays a message in a DOM element.
 * Uses textContent instead of innerHTML to prevent Cross-Site Scripting (XSS) vulnerabilities.
 * @param {string} userInput - The message to display.
 */
function displayMessage(userInput) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = userInput; // Changed innerHTML to textContent for security
    } else {
        console.error("Element with ID 'message' not found.");
    }
}

/**
 * Compares two values for strict equality.
 * @param {*} a - The first value.
 * @param {*} b - The second value.
 * @returns {boolean} True if the values are strictly equal, false otherwise.
 */
function compare(a, b) {
    if (a === b) {  // Changed == to === for strict equality comparison
        return true;
    }
    return false;
}

/**
 * Asynchronously fetches data and logs "Done" upon completion.
 * Ensures that fetchData() is awaited to correctly manage the asynchronous flow.
 */
async function getData() {
    await fetchData();  // Added await to ensure fetchData completes before logging "Done"
    console.log("Done");
}

/**
 * Generates a token. WARNING: Math.random() is not cryptographically secure
 * and should NOT be used for generating security-sensitive tokens (e.g., session tokens, CSRF tokens).
 * For security-sensitive applications, use a cryptographically secure random number generator (CSPRNG),
 * like Web Crypto API's window.crypto.getRandomValues().
 * @returns {string} A randomly generated token (not cryptographically secure).
 */
function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
