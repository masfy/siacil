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
    message += '🧾 *NOTA PEMBELIAN*\n';
    message += '━━━━━━━━━━━━━━━━\n';
    message += '🏪 *' + (storeInfo?.store_name || 'Toko') + '*\n';
    if (storeInfo?.address) {
        message += '📍 ' + storeInfo.address + '\n';
    }
    message += '\n';

    // Invoice info
    message += '📋 No: #' + (invoice.invoice_id || 'INV-0000') + '\n';
    message += '📅 ' + formatDate(invoice.date) + '\n';
    message += '👤 ' + (invoice.customer_name || 'Pelanggan') + '\n';
    message += '\n';

    // Items
    message += '*Detail Pembelian:*\n';
    message += '─────────────────\n';

    items.forEach((item, idx) => {
        const itemTotal = (item.price || 0) * (item.qty || 1);
        message += (idx + 1) + '. ' + (item.name || 'Item') + '\n';
        message += '   ' + (item.qty || 1) + ' x ' + formatCurrency(item.price || 0) + ' = ' + formatCurrency(itemTotal) + '\n';
    });

    message += '─────────────────\n';
    message += '*TOTAL: ' + formatCurrency(invoice.total_amount || 0) + '*\n';
    message += '\n';

    // Footer
    message += '━━━━━━━━━━━━━━━━\n';
    message += '✨ Terima kasih atas kunjungan Anda!\n';
    message += '🤲 Barakallah!\n';
    message += '\n';
    message += '_Powered by SI-ACIL_';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Determine which phone number to use
    // Priority: 1. Customer WA from parameter, 2. Invoice customer_wa, 3. Store WA
    let phone = customerWa || invoice.customer_wa || storeInfo?.wa_number || '';

    if (phone) {
        // Clean the number (remove non-digits, ensure starts with country code)
        phone = phone.replace(/\D/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
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
