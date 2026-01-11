import { useState, useEffect } from 'react';
import { Button, Input, Card, Modal } from '../components/ui';
import { PlusIcon, TrashIcon, PencilIcon, ChevronLeftIcon } from '../components/Icons';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api';

export default function CatalogPage({ onNavigate }) {
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Add modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ product_name: '', price: '' });

    // Edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadCatalog();
    }, []);

    const loadCatalog = async () => {
        setLoading(true);
        try {
            const response = await getProducts();
            if (response.success && response.data) {
                setCatalog(response.data);
            }
        } catch (error) {
            console.error('Failed to load catalog:', error);
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

    // Add product
    const handleAddProduct = async () => {
        if (!newProduct.product_name.trim() || !newProduct.price) return;

        setSaving(true);
        try {
            const response = await addProduct({
                sku: 'SKU-' + Date.now(),
                product_name: newProduct.product_name.trim(),
                price: parseInt(newProduct.price) || 0,
            });

            if (response.success) {
                setNewProduct({ product_name: '', price: '' });
                setShowAddModal(false);
                loadCatalog();
            }
        } catch (error) {
            console.error('Failed to add product:', error);
        } finally {
            setSaving(false);
        }
    };

    // Edit product
    const handleEditProduct = async () => {
        if (!editProduct || !editProduct.product_name.trim()) return;

        setSaving(true);
        try {
            const response = await updateProduct({
                sku: editProduct.sku,
                product_name: editProduct.product_name.trim(),
                price: parseInt(editProduct.price) || 0,
            });

            if (response.success) {
                setShowEditModal(false);
                setEditProduct(null);
                loadCatalog();
            }
        } catch (error) {
            console.error('Failed to update product:', error);
        } finally {
            setSaving(false);
        }
    };

    // Delete product
    const handleDeleteProduct = async () => {
        if (!deleteConfirm) return;

        try {
            await deleteProduct(deleteConfirm.sku);
            setDeleteConfirm(null);
            loadCatalog();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const openEdit = (product) => {
        setEditProduct({ ...product });
        setShowEditModal(true);
    };

    return (
        <div className="p-5 space-y-4 page-enter">
            {/* Header */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={() => onNavigate('settings')}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Katalog Produk</h1>
                    <p className="text-gray-500 text-sm">Kelola daftar produk & jasa</p>
                </div>
            </div>

            {/* Add Button */}
            <Button variant="gradient" fullWidth onClick={() => setShowAddModal(true)}>
                <PlusIcon className="w-5 h-5" />
                Tambah Produk Baru
            </Button>

            {/* Product List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} padding="md">
                            <div className="animate-pulse flex gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : catalog.length === 0 ? (
                <Card padding="lg" className="animate-fade-in">
                    <div className="text-center text-gray-400">
                        <span className="text-4xl block mb-3">📦</span>
                        <p className="text-gray-600">Belum ada produk</p>
                        <p className="text-sm">Tambahkan produk atau jasa pertama Anda</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {catalog.map((product, index) => (
                        <Card
                            key={product.sku}
                            padding="md"
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">📦</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 font-semibold truncate">{product.product_name}</p>
                                    <p className="text-violet-600 font-bold">{formatCurrency(product.price)}</p>
                                    <p className="text-gray-400 text-xs font-mono">{product.sku}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(product)}
                                        className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Summary */}
            {catalog.length > 0 && (
                <Card padding="md" className="bg-gray-50 border-gray-200">
                    <p className="text-gray-600 text-center text-sm">
                        Total <strong>{catalog.length}</strong> produk dalam katalog
                    </p>
                </Card>
            )}

            {/* Add Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Produk Baru">
                <div className="space-y-4">
                    <Input
                        label="Nama Produk / Jasa"
                        placeholder="Contoh: Nasi Goreng Spesial"
                        value={newProduct.product_name}
                        onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                    />
                    <Input
                        label="Harga (Rp)"
                        type="number"
                        placeholder="Contoh: 25000"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <Button variant="primary" fullWidth onClick={handleAddProduct} loading={saving}>
                        Simpan Produk
                    </Button>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Produk">
                {editProduct && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-gray-400 text-xs font-mono">{editProduct.sku}</p>
                        </div>
                        <Input
                            label="Nama Produk / Jasa"
                            placeholder="Nama produk"
                            value={editProduct.product_name}
                            onChange={(e) => setEditProduct({ ...editProduct, product_name: e.target.value })}
                        />
                        <Input
                            label="Harga (Rp)"
                            type="number"
                            placeholder="Harga"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                        />
                        <Button variant="primary" fullWidth onClick={handleEditProduct} loading={saving}>
                            Simpan Perubahan
                        </Button>
                    </div>
                )}
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Produk?" size="sm">
                <div className="space-y-4 text-center">
                    <p className="text-gray-500">
                        Yakin ingin menghapus <strong>{deleteConfirm?.product_name}</strong>?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                            Batal
                        </Button>
                        <Button variant="danger" onClick={handleDeleteProduct}>
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
