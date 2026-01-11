import { useState, useRef } from 'react';
import { Button, Input, Card, Modal } from '../components/ui';
import { PhotoIcon, LogoutIcon, ChevronRightIcon, LockIcon, CogIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, getApiUrl, setApiUrl } from '../services/api';
import { compressImage } from '../utils/imageCompressor';

export default function SettingsPage({ onNavigate }) {
    const { user, updateUser, logout } = useAuth();
    const fileInputRef = useRef(null);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [storeName, setStoreName] = useState(user?.store_name || '');
    const [address, setAddress] = useState(user?.address || '');
    const [waNumber, setWaNumber] = useState(user?.wa_number || '');
    const [logoPreview, setLogoPreview] = useState(user?.logo_base64 || '');

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);

    const [showApiModal, setShowApiModal] = useState(false);
    const [apiUrl, setApiUrlState] = useState(getApiUrl() || '');

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB' });
            return;
        }

        try {
            setMessage({ type: 'info', text: 'Mengompres gambar...' });
            const compressedImage = await compressImage(file, 150, 150, 0.7);
            setLogoPreview(compressedImage);
            setMessage(null);
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal memproses gambar' });
        }
    };

    const handleSaveStore = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await updateProfile({
                username: user.username,
                display_name: user.display_name || '',
                avatar_base64: user.avatar_base64 || '',
                store_name: storeName,
                address,
                wa_number: waNumber,
                logo_base64: logoPreview || '',
            });

            if (response.success) {
                updateUser({ store_name: storeName, address, wa_number: waNumber, logo_base64: logoPreview });
                setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Gagal menyimpan' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError('Semua kolom harus diisi');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Konfirmasi password tidak cocok');
            return;
        }

        if (newPassword.length < 4) {
            setPasswordError('Password minimal 4 karakter');
            return;
        }

        setPasswordSaving(true);
        try {
            const response = await changePassword(user.username, oldPassword, newPassword);

            if (response.success) {
                setShowPasswordModal(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setMessage({ type: 'success', text: 'Password berhasil diubah!' });
            }
        } catch (error) {
            setPasswordError(error.message || 'Gagal. Pastikan password lama benar.');
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleSaveApiUrl = () => {
        if (apiUrl.trim()) {
            setApiUrl(apiUrl.trim());
            setShowApiModal(false);
            setMessage({ type: 'success', text: 'URL Database disimpan!' });
        }
    };

    return (
        <div className="p-5 space-y-4 page-enter">
            {/* Header */}
            <div className="pt-2">
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
                <p className="text-gray-500 text-sm">Kelola toko dan akun</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-3 rounded-2xl text-sm animate-slide-up ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : message.type === 'info'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Logo Toko */}
            <Card padding="md" className="animate-slide-up">
                <h2 className="text-gray-900 font-semibold mb-3">Logo Toko</h2>
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all overflow-hidden border-2 border-dashed border-gray-300 active:scale-95"
                    >
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-700 text-sm mb-1">Klik untuk upload</p>
                        <p className="text-gray-400 text-xs">JPG, PNG. Max 2MB</p>
                        <p className="text-gray-400 text-xs">Akan dikompres otomatis</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
            </Card>

            {/* Store Info */}
            <Card padding="md" className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
                <h2 className="text-gray-900 font-semibold mb-4">Informasi Toko</h2>
                <div className="space-y-4">
                    <Input label="Nama Toko" placeholder="Warung Bu Ani" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                    <Input label="Alamat" placeholder="Jl. Pasar Baru No. 5" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <Input label="WhatsApp Toko" placeholder="628123456789" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} />
                    <Button variant="primary" fullWidth loading={saving} onClick={handleSaveStore}>
                        Simpan Pengaturan
                    </Button>
                </div>
            </Card>

            {/* Catalog - Link to dedicated page */}
            <Card padding="none" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <button onClick={() => onNavigate('catalog')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg">📦</span>
                        </div>
                        <div className="text-left">
                            <span className="text-gray-900 font-medium block">Katalog Produk</span>
                            <span className="text-gray-400 text-xs">Kelola produk & harga</span>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                </button>
            </Card>

            {/* Account */}
            <Card padding="none" className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <LockIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-left">
                            <span className="text-gray-900 font-medium block">Ubah Password</span>
                            <span className="text-gray-400 text-xs">Ganti kredensial login</span>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                </button>

                <div className="h-px bg-gray-100 mx-4" />

                <button onClick={() => setShowApiModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <CogIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <span className="text-gray-900 font-medium block">Database</span>
                            <span className="text-gray-400 text-xs">URL Google Apps Script</span>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                </button>

                <div className="h-px bg-gray-100 mx-4" />

                <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <LogoutIcon className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-red-500 font-medium">Keluar</span>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                </button>
            </Card>

            {/* Password Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Ubah Password">
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Masukkan password lama dan baru.</p>
                    <Input label="Password Lama" type="password" placeholder="Password saat ini" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <Input label="Password Baru" type="password" placeholder="Min. 4 karakter" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <Input label="Konfirmasi" type="password" placeholder="Ulangi password baru" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {passwordError && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-xl">{passwordError}</p>}
                    <Button variant="primary" fullWidth onClick={handleChangePassword} loading={passwordSaving}>
                        Simpan Password
                    </Button>
                </div>
            </Modal>

            {/* API Modal */}
            <Modal isOpen={showApiModal} onClose={() => setShowApiModal(false)} title="Konfigurasi Database">
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">URL Web App Google Apps Script.</p>
                    <Input placeholder="https://script.google.com/..." value={apiUrl} onChange={(e) => setApiUrlState(e.target.value)} />
                    <Button variant="primary" fullWidth onClick={handleSaveApiUrl}>Simpan</Button>
                </div>
            </Modal>

            {/* Logout Modal */}
            <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} title="Keluar?" size="sm">
                <div className="space-y-4 text-center">
                    <p className="text-gray-500">Yakin ingin keluar?</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>Batal</Button>
                        <Button variant="danger" onClick={logout}>Keluar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
