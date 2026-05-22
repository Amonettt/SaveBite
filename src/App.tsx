// Componente raíz: App
// Referencia: Historias de usuario 1-5 (navegación y estructura general)
import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Offers from './pages/Offers';
import Donations from './pages/Donations';
import Impact from './pages/Impact';
import Admin from './pages/Admin';
import CreateOffer from './pages/CreateOffer';
import CreateDonation from './pages/CreateDonation';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({ open: false, mode: 'login' });

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModal({ open: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ open: false, mode: 'login' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
      case 'offers':
        return <Offers onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
      case 'donations':
        return <Donations onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
      case 'impact':
        return <Impact />;
      case 'admin':
        return <Admin onNavigate={handleNavigate} />;
      case 'create-offer':
        return <CreateOffer onNavigate={handleNavigate} />;
      case 'create-donation':
        return <CreateDonation onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
        />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
        {authModal.open && (
          <AuthModal
            onClose={handleCloseAuth}
            initialMode={authModal.mode}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
