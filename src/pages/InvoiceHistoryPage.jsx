import { useState, useEffect } from 'react';
import { Card, Modal, Button } from '../components/ui';
import { DocumentTextIcon, WhatsAppIcon, PrinterIcon } from '../components/Icons';
import { getInvoices } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { generateInvoicePdf } from '../utils/pdfGenerator';
import { generateWhatsAppLink } from '../utils/whatsapp';

export default function InvoiceHistoryPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const response = await getInvoices();
            if (response.success && response.data) {
                setInvoices(response.data);
            }
        } catch (error) {
            console.error('Failed to load invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const parseItems = (itemsJson) => {
        try {
            return JSON.parse(itemsJson);
        } catch {
            return [];
        }
    };

    const handlePdf = (invoice) => {
        generateInvoicePdf(invoice, user);
    };

    const handleWhatsApp = (invoice) => {
        const link = generateWhatsAppLink(invoice, user, invoice.customer_wa);
        window.open(link, '_blank');
    };

    return (
        <div className="p-5 space-y-4 page-enter">
            {/* Header */}
            <div className="pt-2">
                <h1 className="text-2xl font-bold text-gray-900">Riwayat Nota</h1>
                <p className="text-gray-500 text-sm">Daftar transaksi tersimpan</p>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} padding="md">
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                                <div className="h-5 bg-gray-200 rounded w-1/4 ml-auto" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : invoices.length === 0 ? (
                <Card padding="lg" className="animate-fade-in">
                    <div className="text-center text-gray-400">
                        <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-600">Belum ada riwayat</p>
                        <p className="text-sm text-gray-400">Transaksi akan muncul di sini</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {invoices.map((invoice, index) => (
                        <Card
                            key={invoice.invoice_id}
                            padding="md"
                            hoverable
                            onClick={() => setSelectedInvoice(invoice)}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-900 font-semibold">{invoice.customer_name}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{formatDate(invoice.date)}</p>
                                    <p className="text-gray-300 text-xs font-mono">#{invoice.invoice_id}</p>
                                    {invoice.customer_wa && (
                                        <p className="text-green-600 text-xs mt-1">📱 {invoice.customer_wa}</p>
                                    )}
                                </div>
                                <p className="text-gray-900 font-bold">{formatCurrency(invoice.total_amount)}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Invoice Detail Modal */}
            <Modal
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title={`Nota #${selectedInvoice?.invoice_id}`}
                size="lg"
            >
                {selectedInvoice && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Pelanggan</span>
                                <span className="font-medium text-gray-900">{selectedInvoice.customer_name}</span>
                            </div>
                            {selectedInvoice.customer_wa && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">WhatsApp</span>
                                    <span className="font-medium text-green-600">{selectedInvoice.customer_wa}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tanggal</span>
                                <span className="font-medium text-gray-900">{formatDate(selectedInvoice.date)}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Detail Item</h3>
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                {parseItems(selectedInvoice.items_json).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name} x{item.qty}</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(item.price * item.qty)}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-gray-200 my-2" />
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-violet-600">
                                        {formatCurrency(selectedInvoice.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="success" onClick={() => handleWhatsApp(selectedInvoice)}>
                                <WhatsAppIcon className="w-5 h-5" />
                                WhatsApp
                            </Button>
                            <Button variant="gradient" onClick={() => handlePdf(selectedInvoice)}>
                                <PrinterIcon className="w-5 h-5" />
                                Cetak PDF
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
