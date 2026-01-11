import BottomNav from './BottomNav';

export default function AppLayout({ children, currentPage, onNavigate, onAddClick }) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="app-container">
            {/* Main Content */}
            <main className="relative">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNav
                currentPage={currentPage}
                onNavigate={onNavigate}
                onAddClick={onAddClick}
            />

            {/* Footer - Fixed at very bottom, BELOW navigation */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
                <div className="max-w-[480px] mx-auto px-4 py-1.5 text-center" style={{ paddingBottom: 'max(var(--safe-bottom), 4px)' }}>
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 flex-wrap">
                        <img src="/logo.png" alt="SI-ACIL" className="w-3.5 h-3.5 rounded-full" />
                        <span>© {currentYear}</span>
                        <span className="text-gray-300">|</span>
                        <span>Si Acil by</span>
                        <a
                            href="https://www.instagram.com/masalfy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-500 hover:text-violet-600 font-medium inline-flex items-center gap-0.5"
                        >
                            Mas Alfy
                            {/* Verified Badge */}
                            <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
