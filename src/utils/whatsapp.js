/**
 * Generate WhatsApp message link for invoice
 * @param {object} invoice - Invoice data
 * @param {object} storeInfo - Store information
 * @param {string} customerWa - Customer WhatsApp number (optional, overrides store WA)
 */
export function generateWhatsAppLink(invoice, storeInfo, customerWa = null) {
    // Parse items
    let items = [];
    try {
        items = JSON.parse(invoice.items_json);
    } catch {
        items = [];
    }

    // Format currency
    const formatCurrency = (amount) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount || 0);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Build message
    let message = '';

    // Header
    message += '*INVOICE*\n';
    message += '========================\n';
    message += '*' + (storeInfo?.store_name || 'Toko') + '* Digital Services • Web Dev • Print\n';
    if (storeInfo?.address) {
        message += '> ' + storeInfo.address + '\n';
    }
    message += '\n';

    // Invoice info
    message += 'No: #' + (invoice.invoice_id || 'INV-0000') + '\n';
    message += 'Tanggal: ' + formatDate(invoice.date) + '\n';
    message += 'Pelanggan: ' + (invoice.customer_name || 'Pelanggan') + '\n';
    message += '\n';

    // Items
    message += '*Detail Pembelian:*\n';
    message += '------------------------\n';

    items.forEach((item, idx) => {
        const itemTotal = (item.price || 0) * (item.qty || 1);
        message += (idx + 1) + '. ' + (item.name || 'Item') + '\n';
        message += '   ' + (item.qty || 1) + ' x ' + formatCurrency(item.price || 0) + ' = ' + formatCurrency(itemTotal) + '\n';
    });

    message += '------------------------\n';

    // Calculate total from items (in case total_amount is missing)
    const calculatedTotal = items.reduce((sum, item) => {
        return sum + ((parseInt(item.price) || 0) * (parseInt(item.qty) || 1));
    }, 0);
    const finalTotal = calculatedTotal > 0 ? calculatedTotal : (invoice.total_amount || 0);

    message += '*TOTAL: ' + formatCurrency(finalTotal) + '*\n';
    message += '\n';

    // Footer
    message += '========================\n';
    message += '> Terima kasih atas kepercayaan Anda. Barang yang dibeli sudah sah. Minta rela, minta halal.\n';
    message += '\n';
    message += '_Powered by SI-ACIL by Mas Alfy_';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Determine which phone number to use
    // Priority: 1. Customer WA from parameter, 2. Invoice customer_wa, 3. Store WA
    let phone = customerWa || invoice.customer_wa || storeInfo?.wa_number || '';

    if (phone) {
        // Convert to string and clean the number (remove non-digits)
        phone = String(phone).replace(/\D/g, '');

        // Handle various formats:
        // - "81234567890" (stored as number, lost leading 0) → "6281234567890"
        // - "081234567890" (with leading 0) → "6281234567890"
        // - "6281234567890" (already with country code) → keep as is
        // - "628123456789" (already correct) → keep as is

        if (phone.startsWith('62')) {
            // Already has country code, use as is
        } else if (phone.startsWith('0')) {
            // Has leading 0, replace with 62
            phone = '62' + phone.substring(1);
        } else if (phone.length >= 9 && phone.length <= 12) {
            // No leading 0 (lost in spreadsheet), assume it's Indonesian number
            // Add 62 prefix directly
            phone = '62' + phone;
        }

        return 'https://wa.me/' + phone + '?text=' + encodedMessage;
    }

    // Generic link without phone number
    return 'https://wa.me/?text=' + encodedMessage;
}

/**
 * Generate simple text message for copying
 */
export function generateInvoiceText(invoice, storeInfo) {
    // Parse items
    let items = [];
    try {
        items = JSON.parse(invoice.items_json);
    } catch {
        items = [];
    }

    // Format currency
    const formatCurrency = (amount) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount || 0);
    };

    let text = '';
    text += 'NOTA #' + (invoice.invoice_id || '') + '\n';
    text += (storeInfo?.store_name || 'Toko') + '\n';
    text += 'Pelanggan: ' + (invoice.customer_name || '') + '\n';
    text += '---\n';

    items.forEach((item) => {
        text += (item.name || 'Item') + ' x' + (item.qty || 1) + ' = ' + formatCurrency((item.price || 0) * (item.qty || 1)) + '\n';
    });

    text += '---\n';
    text += 'TOTAL: ' + formatCurrency(invoice.total_amount || 0);

    return text;
}