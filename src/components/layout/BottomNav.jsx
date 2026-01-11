import { HomeIcon, ShoppingCartIcon, DocumentTextIcon, CogIcon, PlusIcon } from '../Icons';

export default function BottomNav({ currentPage, onNavigate, onAddClick }) {
    const navItems = [
        { id: 'dashboard', label: 'Beranda', icon: HomeIcon },
        { id: 'transaction', label: 'Transaksi', icon: ShoppingCartIcon },
        { id: 'add', label: '', icon: PlusIcon, isCenter: true },
        { id: 'history', label: 'Riwayat', icon: DocumentTextIcon },
        { id: 'settings', label: 'Pengaturan', icon: CogIcon },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                // Center Add Button
                if (item.isCenter) {
                    return (
                        <button
                            key={item.id}
                            onClick={onAddClick}
                            className="relative -top-4 flex items-center justify-center w-14 h-14 bg-gray-900 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                        >
                            <Icon className="w-6 h-6 text-white" />
                        </button>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        {/* Active indicator */}
                        {isActive && (
                            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-violet-500 rounded-full" />
                        )}

                        <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-violet-600' : 'text-gray-400'}`} />
                        <span className={`text-[11px] font-medium ${isActive ? 'text-violet-600' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
