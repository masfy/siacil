/**
 * SI-ACIL - Google Apps Script Backend
 * ====================================
 * This script handles all CRUD operations for the SI-ACIL POS app.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire code
 * 4. Run the setup() function first (Run > Run function > setup)
 * 5. Deploy as Web App:
 *    - Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL and use it in the SI-ACIL app
 */

// ===== CONFIGURATION =====
const SHEET_NAMES = {
  USERS: 'Users',
  INVOICES: 'Invoices',
  PRODUCTS: 'Products'
};

const HEADERS = {
  USERS: ['username', 'password', 'display_name', 'avatar_base64', 'store_name', 'address', 'wa_number', 'logo_base64'],
  INVOICES: ['invoice_id', 'date', 'customer_name', 'customer_wa', 'items_json', 'total_amount'],
  PRODUCTS: ['sku', 'product_name', 'price']
};

// ===== SETUP FUNCTION =====
/**
 * Initialize the spreadsheet with required sheets and headers
 * Run this function once when setting up
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create sheets if they don't exist
  Object.entries(SHEET_NAMES).forEach(([key, name]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    
    // Add or update headers
    if (sheet.getLastRow() === 0) {
      // Empty sheet - add headers
      sheet.getRange(1, 1, 1, HEADERS[key].length).setValues([HEADERS[key]]);
      sheet.getRange(1, 1, 1, HEADERS[key].length).setFontWeight('bold');
    } else {
      // Update headers to match current schema
      sheet.getRange(1, 1, 1, HEADERS[key].length).setValues([HEADERS[key]]);
      sheet.getRange(1, 1, 1, HEADERS[key].length).setFontWeight('bold');
    }
  });
  
  // Create default admin user if Users sheet is empty (only header)
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (usersSheet.getLastRow() === 1) {
    usersSheet.appendRow(['admin', 'admin', 'Admin', '', 'Toko Saya', 'Alamat Toko', '', '']);
  }
  
  Logger.log('Setup complete! Headers updated and ready to use.');
}

/**
 * Migrate existing users data to new schema
 * Run this if you updated from an older version
 */
function migrateUsers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  if (!sheet) {
    Logger.log('Users sheet not found. Run setup() first.');
    return;
  }
  
  // Get current data
  const data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    Logger.log('No user data to migrate.');
    return;
  }
  
  // Check current header count
  const currentCols = data[0].length;
  const requiredCols = HEADERS.USERS.length;
  
  Logger.log('Current columns: ' + currentCols + ', Required: ' + requiredCols);
  
  if (currentCols < requiredCols) {
    // Need to add columns - insert avatar_base64 column if missing
    Logger.log('Migrating data to new schema...');
    
    // Update header
    sheet.getRange(1, 1, 1, requiredCols).setValues([HEADERS.USERS]);
    
    // For each data row, shift data if needed
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Old schema: username, password, display_name, store_name, address, wa_number, logo_base64
      // New schema: username, password, display_name, avatar_base64, store_name, address, wa_number, logo_base64
      
      if (currentCols === 7) {
        // Old 7-column format - insert empty avatar_base64
        const newRow = [
          row[0], // username
          row[1], // password
          row[2], // display_name
          '',     // avatar_base64 (new)
          row[3], // store_name
          row[4], // address
          row[5], // wa_number
          row[6]  // logo_base64
        ];
        sheet.getRange(i + 1, 1, 1, requiredCols).setValues([newRow]);
      } else if (currentCols === 6) {
        // Even older format without display_name
        const newRow = [
          row[0],      // username
          row[1],      // password
          row[0],      // display_name = username
          '',          // avatar_base64
          row[2] || 'Toko Saya', // store_name
          row[3] || '', // address
          row[4] || '', // wa_number
          row[5] || ''  // logo_base64
        ];
        sheet.getRange(i + 1, 1, 1, requiredCols).setValues([newRow]);
      }
    }
    
    Logger.log('Migration complete!');
  } else {
    Logger.log('Schema is already up to date.');
  }
}

// ===== HTTP HANDLERS =====

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    let result;
    
    switch (action) {
      case 'ping':
        result = { success: true, message: 'Pong!' };
        break;
        
      case 'getProfile':
        result = getProfile(e.parameter.username);
        break;
        
      case 'getInvoices':
        result = getInvoices();
        break;
        
      case 'getProducts':
        result = getProducts();
        break;
        
      default:
        result = { success: false, message: 'Unknown action' };
    }
    
    return createJsonResponse(result);
    
  } catch (error) {
    return createJsonResponse({ success: false, message: error.message });
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    
    switch (action) {
      case 'login':
        result = login(data.username, data.password);
        break;
        
      case 'updateProfile':
        result = updateProfile(data);
        break;
        
      case 'changePassword':
        result = changePassword(data.username, data.oldPassword, data.newPassword);
        break;
        
      case 'addInvoice':
        result = addInvoice(data);
        break;
        
      case 'addProduct':
        result = addProduct(data);
        break;
        
      case 'updateProduct':
        result = updateProduct(data);
        break;
        
      case 'deleteProduct':
        result = deleteProduct(data.sku);
        break;
        
      default:
        result = { success: false, message: 'Unknown action' };
    }
    
    return createJsonResponse(result);
    
  } catch (error) {
    return createJsonResponse({ success: false, message: error.message });
  }
}

/**
 * Create JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== USER FUNCTIONS =====

/**
 * Login user
 */
function login(username, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === password) {
      return {
        success: true,
        isFirstLogin: !data[i][4], // First login if no store_name set yet
        data: {
          username: data[i][0],
          display_name: data[i][2],
          avatar_base64: data[i][3],
          store_name: data[i][4],
          address: data[i][5],
          wa_number: data[i][6],
          logo_base64: data[i][7]
        }
      };
    }
  }
  
  return { success: false, message: 'Username atau password salah' };
}

/**
 * Get user profile
 */
function getProfile(username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      return {
        success: true,
        data: {
          username: data[i][0],
          display_name: data[i][2],
          avatar_base64: data[i][3],
          store_name: data[i][4],
          address: data[i][5],
          wa_number: data[i][6],
          logo_base64: data[i][7]
        }
      };
    }
  }
  
  return { success: false, message: 'User tidak ditemukan' };
}

/**
 * Update user profile
 */
function updateProfile(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.username) {
      // Update row (keep username and password, update the rest)
      sheet.getRange(i + 1, 3).setValue(data.display_name || '');
      sheet.getRange(i + 1, 4).setValue(data.avatar_base64 || '');
      sheet.getRange(i + 1, 5).setValue(data.store_name || '');
      sheet.getRange(i + 1, 6).setValue(data.address || '');
      sheet.getRange(i + 1, 7).setValue(data.wa_number || '');
      sheet.getRange(i + 1, 8).setValue(data.logo_base64 || '');
      
      return { success: true, message: 'Profil berhasil diperbarui' };
    }
  }
  
  return { success: false, message: 'User tidak ditemukan' };
}

/**
 * Change password
 */
function changePassword(username, oldPassword, newPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username) {
      // Verify old password
      if (rows[i][1] !== oldPassword) {
        return { success: false, message: 'Password lama salah' };
      }
      
      // Update password
      sheet.getRange(i + 1, 2).setValue(newPassword);
      return { success: true, message: 'Password berhasil diubah' };
    }
  }
  
  return { success: false, message: 'User tidak ditemukan' };
}

// ===== INVOICE FUNCTIONS =====

/**
 * Add new invoice
 */
function addInvoice(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.INVOICES);
  
  // Generate invoice ID
  const timestamp = new Date().getTime();
  const invoiceId = 'INV-' + timestamp;
  
  // Add row
  sheet.appendRow([
    invoiceId,
    data.date || new Date().toISOString(),
    data.customer_name || 'Pelanggan',
    data.customer_wa || '',
    data.items_json || '[]',
    data.total_amount || 0
  ]);
  
  return { 
    success: true, 
    message: 'Invoice berhasil disimpan',
    invoice_id: invoiceId
  };
}

/**
 * Get all invoices
 */
function getInvoices() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.INVOICES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { success: true, data: [] };
  }
  
  const invoices = [];
  for (let i = data.length - 1; i >= 1; i--) { // Reverse order (newest first)
    invoices.push({
      invoice_id: data[i][0],
      date: data[i][1],
      customer_name: data[i][2],
      customer_wa: data[i][3],
      items_json: data[i][4],
      total_amount: data[i][5]
    });
  }
  
  return { success: true, data: invoices };
}

// ===== PRODUCT FUNCTIONS =====

/**
 * Add new product
 */
function addProduct(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  
  // Check if SKU already exists
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sku) {
      return { success: false, message: 'SKU sudah ada' };
    }
  }
  
  // Add row
  sheet.appendRow([
    data.sku || 'SKU-' + new Date().getTime(),
    data.product_name || '',
    data.price || 0
  ]);
  
  return { success: true, message: 'Produk berhasil ditambahkan' };
}

/**
 * Get all products
 */
function getProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { success: true, data: [] };
  }
  
  const products = [];
  for (let i = 1; i < data.length; i++) {
    products.push({
      sku: data[i][0],
      product_name: data[i][1],
      price: data[i][2]
    });
  }
  
  return { success: true, data: products };
}

/**
 * Delete product by SKU
 */
function deleteProduct(sku) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === sku) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Produk berhasil dihapus' };
    }
  }
  
  return { success: false, message: 'Produk tidak ditemukan' };
}

/**
 * Update product by SKU
 */
function updateProduct(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sku) {
      // Update product_name and price
      sheet.getRange(i + 1, 2).setValue(data.product_name || rows[i][1]);
      sheet.getRange(i + 1, 3).setValue(data.price || rows[i][2]);
      return { success: true, message: 'Produk berhasil diperbarui' };
    }
  }
  
  return { success: false, message: 'Produk tidak ditemukan' };
}
