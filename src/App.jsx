import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isFirstLogin, completeFirstLogin } from './services/api';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionPage from './pages/TransactionPage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import SettingsPage from './pages/SettingsPage';
import CatalogPage from './pages/CatalogPage';

// Components
import AppLayout from './components/layout/AppLayout';
import OnboardingModal from './components/OnboardingModal';

function AppContent() {
    const { isAuthenticated, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Check for first login after authentication
    useEffect(() => {
        if (isAuthenticated && isFirstLogin()) {
            setShowOnboarding(true);
        }
    }, [isAuthenticated]);

    // Handle onboarding close
    const handleOnboardingClose = () => {
        completeFirstLogin();
        setShowOnboarding(false);
    };

    // Handle center add button click - go to transaction
    const handleAddClick = () => {
        setCurrentPage('transaction');
    };

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <img
                        src="/logo.png"
                        alt="SI-ACIL"
                        className="w-24 h-24 mx-auto mb-4 animate-float drop-shadow-lg"
                    />
                    <h2 className="text-gray-800 font-bold text-xl mb-1">SI-ACIL</h2>
                    <p className="text-gray-500 text-sm">Memuat...</p>
                </div>
            </div>
        );
    }

    // Login screen
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    // Render current page with key for animation
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage key="dashboard" onNavigate={setCurrentPage} />;
            case 'transaction':
                return <TransactionPage key="transaction" />;
            case 'history':
                return <InvoiceHistoryPage key="history" />;
            case 'settings':
                return <SettingsPage key="settings" onNavigate={setCurrentPage} />;
            case 'catalog':
                return <CatalogPage key="catalog" onNavigate={setCurrentPage} />;
            default:
                return <DashboardPage key="dashboard" onNavigate={setCurrentPage} />;
        }
    };

    return (
        <>
            <AppLayout
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onAddClick={handleAddClick}
            >
                {renderPage()}
            </AppLayout>

            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={handleOnboardingClose}
            />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
