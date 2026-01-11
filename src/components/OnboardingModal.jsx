import { Modal, Button } from './ui';

export default function OnboardingModal({ isOpen, onClose }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showClose={false}
            size="md"
        >
            <div className="text-center">
                {/* Si Acil Mascot */}
                <div className="mb-6">
                    <img
                        src="/logo.png"
                        alt="SI-ACIL"
                        className="w-32 h-32 mx-auto rounded-full shadow-lg animate-float"
                    />
                </div>

                {/* Greeting */}
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Halo, Dingsanak! 👋
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Sistem Aplikasi Catat Invoice Lengkap
                </p>

                {/* Banjar Message */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-200">
                    <p className="text-gray-700 leading-relaxed text-sm">
                        <span className="font-semibold text-amber-600">Assalamualaikum Dingsanak!</span>
                        <br />
                        Ayu nah, tekan tombol <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-900 rounded-lg text-white text-sm font-bold mx-1">+</span> di bawah itu gasan ma-isi barang jualan pian.
                    </p>
                </div>

                {/* Tips */}
                <div className="text-left bg-violet-50 rounded-xl p-4 mb-6 border border-violet-200">
                    <h3 className="font-semibold text-violet-700 mb-2">💡 Tips Cepat:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Isi data toko di menu <strong>Pengaturan</strong></li>
                        <li>• Upload logo untuk header & watermark nota</li>
                        <li>• Mulai transaksi dan kirim nota via WhatsApp!</li>
                    </ul>
                </div>

                <Button
                    variant="primary"
                    fullWidth
                    onClick={onClose}
                >
                    Siap, Mulai Berjualan! 🚀
                </Button>
            </div>
        </Modal>
    );
}
