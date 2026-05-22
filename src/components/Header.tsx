// Componente compartido: Header de navegación
// Referencia: Historias de usuario 1, 2, 3, 5 (navegación y autenticación)
import { useState } from 'react';
import { Leaf, Menu, X, LogOut, User, BarChart3, ShoppingBag, Heart, Home, Database, Plus, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const NAV_ITEMS = [
  { page: 'home' as Page, label: 'Inicio', icon: Home },
  { page: 'offers' as Page, label: 'Ofertas', icon: ShoppingBag },
  { page: 'donations' as Page, label: 'Donaciones', icon: Heart },
  { page: 'impact' as Page, label: 'Impacto', icon: BarChart3 },
];

export default function Header({ currentPage, onNavigate, onOpenAuth }: HeaderProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900">Save<span className="text-green-600">Bite</span></span>
              <p className="text-xs text-gray-400 leading-none -mt-0.5">Colombia</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
              <button key={page} onClick={() => handleNav(page)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={15} />
                {label}
              </button>
            ))}
            {user && (
              <button onClick={() => handleNav('admin')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 'admin' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Database size={15} />
                Base de Datos
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button onClick={() => handleNav('create-offer')} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  <Plus size={15} />
                  Publicar
                </button>
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 text-sm font-bold">{profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-semibold text-gray-900 leading-none">{profile?.full_name || 'Usuario'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{profile?.city}</p>
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {/* Historia de usuario 5: Badge de administrador en menú de usuario */}
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${isAdmin ? 'bg-gray-800 text-white' : profile?.role === 'establishment' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {isAdmin ? 'Administrador' : profile?.role === 'establishment' ? 'Establecimiento' : 'Usuario'}
                        </span>
                      </div>
                      {isAdmin && (
                        <button onClick={() => { handleNav('admin'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Shield size={14} /> Panel de Administración
                        </button>
                      )}
                      <button onClick={() => { handleNav('create-offer'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Plus size={14} /> Publicar oferta
                      </button>
                      <button onClick={() => { handleNav('create-donation'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Heart size={14} /> Publicar donación
                      </button>
                      <button onClick={() => { handleNav('admin'); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Database size={14} /> Base de Datos
                      </button>
                      <div className="border-t border-gray-100 mt-1">
                        <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <LogOut size={14} /> Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => onOpenAuth('login')} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                  Iniciar sesión
                </button>
                <button onClick={() => onOpenAuth('register')} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Registrarse
                </button>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
              <button key={page} onClick={() => handleNav(page)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
            {user && (
              <>
                <button onClick={() => handleNav('admin')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${currentPage === 'admin' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Database size={16} /> Base de Datos
                </button>
                <button onClick={() => handleNav('create-offer')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Plus size={16} /> Publicar Oferta
                </button>
                <button onClick={() => handleNav('create-donation')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Heart size={16} /> Publicar Donación
                </button>
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </>
            )}
            {!user && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button onClick={() => { onOpenAuth('login'); setMenuOpen(false); }} className="py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700">
                  Iniciar sesión
                </button>
                <button onClick={() => { onOpenAuth('register'); setMenuOpen(false); }} className="py-2.5 text-sm font-semibold bg-green-600 text-white rounded-lg">
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
