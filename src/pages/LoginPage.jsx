import { useState } from 'react';
import { Button, Input, Modal, Card } from '../components/ui';
import { UserIcon, LockIcon, CogIcon, LinkIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { getApiUrl, setApiUrl, testConnection, isUsingDefaultApi } from '../services/api';

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Don't show config modal by default - we have a hardcoded URL
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [apiUrlInput, setApiUrlInput] = useState(getApiUrl() || '');
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Username dan password harus diisi');
            return;
        }

        setLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            setError(err.message || 'Login gagal. Periksa username dan password.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveApiUrl = async () => {
        if (!apiUrlInput.trim()) {
            setConnectionStatus({ success: false, message: 'URL tidak boleh kosong' });
            return;
        }

        setTestingConnection(true);
        setApiUrl(apiUrlInput.trim());

        try {
            await testConnection();
            setConnectionStatus({ success: true, message: 'Koneksi berhasil!' });
            setTimeout(() => {
                setShowConfigModal(false);
                setConnectionStatus(null);
            }, 1000);
        } catch (err) {
            setConnectionStatus({ success: false, message: err.message });
        } finally {
            setTestingConnection(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-5">
            <div className="w-full max-w-sm">
                {/* Logo & Title */}
                <div className="text-center mb-8 animate-slide-up">
                    <img
                        src="/logo.png"
                        alt="SI-ACIL Logo"
                        className="w-28 h-28 mx-auto mb-4 drop-shadow-lg"
                    />
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">SI-ACIL</h1>
                    <p className="text-gray-500 text-sm">Sistem Aplikasi Catat Invoice Lengkap</p>
                    <p className="text-gray-400 text-xs mt-1">untuk UMKM Kalimantan Selatan</p>
                </div>

                {/* Login Card */}
                <Card padding="lg" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            label="Username"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon={<UserIcon className="w-5 h-5" />}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<LockIcon className="w-5 h-5" />}
                        />

                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                        >
                            Masuk
                        </Button>
                    </form>

                    <button
                        onClick={() => setShowConfigModal(true)}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors py-2"
                    >
                        <CogIcon className="w-4 h-4" />
                        <span className="text-sm">Konfigurasi Database</span>
                    </button>
                </Card>

                <p className="text-center text-gray-400 text-xs mt-6 animate-fade-in">
                    <b>©2026 | Si Acil by Mas Alfy</b>
                </p>
            </div>

            {/* API Config Modal */}
            <Modal
                isOpen={showConfigModal}
                onClose={() => getApiUrl() && setShowConfigModal(false)}
                title="Konfigurasi Database"
                showClose={!!getApiUrl()}
            >
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">
                        Masukkan URL Web App dari Google Apps Script yang sudah di-deploy.
                    </p>

                    <Input
                        placeholder="https://script.google.com/macros/s/..."
                        value={apiUrlInput}
                        onChange={(e) => setApiUrlInput(e.target.value)}
                        icon={<LinkIcon className="w-5 h-5" />}
                    />

                    {connectionStatus && (
                        <div className={`p-3 rounded-xl text-sm ${connectionStatus.success
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {connectionStatus.message}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSaveApiUrl}
                        loading={testingConnection}
                    >
                        Simpan & Test Koneksi
                    </Button>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-amber-700 text-xs">
                            💡 Deploy Apps Script sebagai Web App, pilih "Execute as: Me" dan "Who has access: Anyone".
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
