// API Service for Google Apps Script communication

/**
 * ============================================
 * KONFIGURASI API URL
 * ============================================
 * Ganti URL di bawah ini dengan URL Web App Google Apps Script Anda.
 * Cara mendapatkan URL:
 * 1. Buka Google Apps Script dari Spreadsheet
 * 2. Deploy > New deployment > Web app
 * 3. Execute as: Me, Who has access: Anyone
 * 4. Copy URL yang muncul dan paste di bawah
 */
const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbwordP868PjT2okQHDvCgWdlq9Q71q4UtuhkFCF1lzgVFYDX8HOysCvmsl1U-Hc6zNZ/exec';

const API_URL_KEY = 'SI_ACIL_API_URL';
const USER_DATA_KEY = 'SI_ACIL_USER_DATA';
const FIRST_LOGIN_KEY = 'SI_ACIL_FIRST_LOGIN';

/**
 * Get the API URL (uses default if not set in localStorage)
 */
export function getApiUrl() {
    return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
}

/**
 * Set the API URL in localStorage
 */
export function setApiUrl(url) {
    localStorage.setItem(API_URL_KEY, url);
}

/**
 * Clear the API URL from localStorage (will fall back to default)
 */
export function clearApiUrl() {
    localStorage.removeItem(API_URL_KEY);
}

/**
 * Check if using default API URL
 */
export function isUsingDefaultApi() {
    return !localStorage.getItem(API_URL_KEY);
}

/**
 * Get stored user data
 */
export function getStoredUser() {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Store user data
 */
export function setStoredUser(user) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

/**
 * Clear stored user data
 */
export function clearStoredUser() {
    localStorage.removeItem(USER_DATA_KEY);
}

/**
 * Check if this is the first login
 */
export function isFirstLogin() {
    return localStorage.getItem(FIRST_LOGIN_KEY) !== 'false';
}

/**
 * Mark first login as complete
 */
export function completeFirstLogin() {
    localStorage.setItem(FIRST_LOGIN_KEY, 'false');
}

/**
 * Main API request function
 */
export async function apiRequest(action, data = {}) {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        throw new Error('API URL belum dikonfigurasi');
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({ action, ...data }),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Terjadi kesalahan');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * API request using GET method
 */
export async function apiGet(action, params = {}) {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        throw new Error('API URL belum dikonfigurasi');
    }

    try {
        const queryParams = new URLSearchParams({ action, ...params });
        const response = await fetch(`${apiUrl}?${queryParams}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Terjadi kesalahan');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== SPECIFIC API FUNCTIONS =====

/**
 * Login user
 */
export async function login(username, password) {
    return apiRequest('login', { username, password });
}

/**
 * Get user profile
 */
export async function getProfile(username) {
    return apiGet('getProfile', { username });
}

/**
 * Update user profile
 */
export async function updateProfile(data) {
    return apiRequest('updateProfile', data);
}

/**
 * Change password
 */
export async function changePassword(username, oldPassword, newPassword) {
    return apiRequest('changePassword', { username, oldPassword, newPassword });
}

/**
 * Add new invoice
 */
export async function addInvoice(invoiceData) {
    return apiRequest('addInvoice', invoiceData);
}

/**
 * Get all invoices
 */
export async function getInvoices() {
    return apiGet('getInvoices');
}

/**
 * Get products list
 */
export async function getProducts() {
    return apiGet('getProducts');
}

/**
 * Add new product
 */
export async function addProduct(productData) {
    return apiRequest('addProduct', productData);
}

/**
 * Delete product
 */
export async function deleteProduct(sku) {
    return apiRequest('deleteProduct', { sku });
}

/**
 * Update product
 */
export async function updateProduct(productData) {
    return apiRequest('updateProduct', productData);
}

/**
 * Test API connection
 */
export async function testConnection() {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        throw new Error('API URL belum dikonfigurasi');
    }

    try {
        const response = await fetch(`${apiUrl}?action=ping`);
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Connection test failed:', error);
        throw new Error('Tidak dapat terhubung ke server');
    }
}
