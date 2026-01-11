import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Modal, Button, Input } from '../components/ui';
import { ShoppingCartIcon, DocumentTextIcon, ChevronRightIcon, LogoutIcon, PhotoIcon } from '../components/Icons';
import { updateProfile } from '../services/api';
import { compressImage } from '../utils/imageCompressor';

export default function DashboardPage({ onNavigate }) {
    const { user, updateUser, logout } = useAuth();
    const fileInputRef = useRef(null);

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Profile edit state - display_name is user's personal name, avatar is profile photo
    const [displayName, setDisplayName] = useState(user?.display_name || '');
    const [profilePhoto, setProfilePhoto] = useState(user?.avatar_base64 || '');
    const [saving, setSaving] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null);

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setUploadMessage({ type: 'error', text: 'Ukuran file maksimal 2MB' });
            return;
        }

        try {
            setUploadMessage({ type: 'info', text: 'Mengompres...' });
            const compressedImage = await compressImage(file, 100, 100, 0.7);
            setProfilePhoto(compressedImage);
            setUploadMessage(null);
        } catch (error) {
            setUploadMessage({ type: 'error', text: 'Gagal memproses gambar' });
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await updateProfile({
                username: user.username,
                display_name: displayName,
                avatar_base64: profilePhoto || '', // Compressed avatar
                store_name: user.store_name || '',
                address: user.address || '',
                wa_number: user.wa_number || '',
                logo_base64: user.logo_base64 || '',
            });

            updateUser({ display_name: displayName, avatar_base64: profilePhoto });
            setShowProfileModal(false);
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const openProfileModal = () => {
        setDisplayName(user?.display_name || user?.username || '');
        setProfilePhoto(user?.avatar_base64 || '');
        setUploadMessage(null);
        setShowProfileModal(true);
    };

    return (
        <div className="p-5 space-y-5 page-enter">
            {/* Header */}
            <div className="flex items-center gap-4 pt-2">
                {/* Store Logo (left) */}
                {user?.logo_base64 ? (
                    <img
                        src={user.logo_base64}
                        alt="Logo Toko"
                        className="w-12 h-12 rounded-2xl object-cover bg-white shadow-md"
                    />
                ) : (
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                        <span className="text-2xl">🏪</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">
                        {user?.store_name || 'Toko Saya'}
                    </h1>
                    <p className="text-gray-500 text-sm truncate">
                        {user?.address || 'Alamat belum diatur'}
                    </p>
                </div>

                {/* Profile Avatar Button (right - separate from store logo) */}
                <button
                    onClick={openProfileModal}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors overflow-hidden"
                >
                    {user?.avatar_base64 ? (
                        <img src={user.avatar_base64} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg">👤</span>
                    )}
                </button>
            </div>

            {/* Hero Card - Shows display_name (user's personal name) */}
            <Card padding="lg" className="animate-slide-up bg-gradient-to-br from-violet-500 to-purple-600 border-0">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center animate-float">
                        <span className="text-3xl">👋</span>
                    </div>
                    <div>
                        <p className="text-white/80 text-sm">Selamat datang,</p>
                        <p className="text-white font-bold text-xl">
                            {user?.display_name || user?.username || 'Admin'}!
                        </p>
                    </div>
                </div>
            </Card>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-3">
                <Card
                    padding="md"
                    hoverable
                    onClick={() => onNavigate('transaction')}
                    className="animate-slide-up"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                            <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-gray-500 text-xs mb-1">Transaksi Baru</p>
                        <p className="text-gray-900 font-bold">+ Mulai</p>
                    </div>
                </Card>

                <Card
                    padding="md"
                    hoverable
                    onClick={() => onNavigate('history')}
                    className="animate-slide-up"
                    style={{ animationDelay: '0.15s' }}
                >
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center mb-3">
                            <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-gray-500 text-xs mb-1">Riwayat</p>
                        <p className="text-gray-900 font-bold">Lihat Nota</p>
                    </div>
                </Card>
            </div>

            {/* Action List */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-gray-900 font-semibold mb-3">Aksi Cepat</h2>
                <Card padding="none">
                    <button
                        onClick={() => onNavigate('transaction')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                <span className="text-lg">💰</span>
                            </div>
                            <div className="text-left">
                                <p className="text-gray-900 font-medium">Buat Transaksi</p>
                                <p className="text-gray-400 text-xs">Tambah penjualan baru</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>

                    <div className="h-px bg-gray-100 mx-4" />

                    <button
                        onClick={() => onNavigate('settings')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                <span className="text-lg">🏪</span>
                            </div>
                            <div className="text-left">
                                <p className="text-gray-900 font-medium">Atur Toko</p>
                                <p className="text-gray-400 text-xs">Nama toko, logo, katalog</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>

                    <div className="h-px bg-gray-100 mx-4" />

                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                <LogoutIcon className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="text-red-500 font-medium">Keluar</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>
                </Card>
            </div>

            {/* Tips */}
            <Card padding="md" className="animate-slide-up bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100" style={{ animationDelay: '0.25s' }}>
                <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <p className="text-gray-900 font-medium mb-1">Tips</p>
                        <p className="text-gray-600 text-sm">
                            Foto profil (kanan atas) berbeda dengan logo toko (kiri). Atur keduanya sesuai kebutuhan!
                        </p>
                    </div>
                </div>
            </Card>

            {/* Profile Edit Modal - for display_name and avatar (NOT store logo) */}
            <Modal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="Edit Profil Saya"
            >
                <div className="space-y-4">
                    {/* Avatar Upload - separate from store logo */}
                    <div className="flex flex-col items-center gap-3">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all overflow-hidden border-2 border-dashed border-gray-300"
                        >
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <PhotoIcon className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <p className="text-gray-500 text-xs">Klik untuk ubah foto profil</p>
                        {uploadMessage && (
                            <p className={`text-xs ${uploadMessage.type === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
                                {uploadMessage.text}
                            </p>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <Input
                        label="Nama Anda"
                        placeholder="Nama pengguna (contoh: Pak Ahmad)"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />

                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">
                        💡 Logo toko diatur terpisah di menu <strong>Pengaturan → Informasi Toko</strong>
                    </div>

                    <Button variant="primary" fullWidth onClick={handleSaveProfile} loading={saving}>
                        Simpan Perubahan
                    </Button>
                </div>
            </Modal>

            {/* Logout Confirm Modal */}
            <Modal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                title="Keluar?"
                size="sm"
            >
                <div className="space-y-4 text-center">
                    <p className="text-gray-500">Yakin ingin keluar dari akun?</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>
                            Batal
                        </Button>
                        <Button variant="danger" onClick={logout}>
                            Keluar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
