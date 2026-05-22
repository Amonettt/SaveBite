// Historia de usuario 5: Panel de administración de base de datos
// Rama: feature/historia5
// Esta página implementa el panel de visualización de registros de usuarios, ofertas y donaciones
import { useState, useEffect } from 'react';
import { Database, Users, ShoppingBag, Heart, Loader2, Search, ChevronDown, ChevronUp, User, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile, FoodOffer, Donation } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';

interface AdminProps {
  onNavigate: (page: Page) => void;
}

type TabType = 'users' | 'offers' | 'donations';

export default function Admin({ onNavigate }: AdminProps) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'users') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers((data as Profile[]) || []);
    } else if (activeTab === 'offers') {
      const { data } = await supabase.from('food_offers').select('*, profiles(full_name, email, establishment_name)').order('created_at', { ascending: false });
      setOffers((data as FoodOffer[]) || []);
    } else {
      const { data } = await supabase.from('donations').select('*, profiles(full_name, email)').order('created_at', { ascending: false });
      setDonations((data as Donation[]) || []);
    }
    setLoading(false);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const getFilteredAndSorted = () => {
    let data: any[] = [];
    if (activeTab === 'users') data = users;
    else if (activeTab === 'offers') data = offers;
    else data = donations;

    if (search) {
      const s = search.toLowerCase();
      data = data.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(s)
      );
    }

    if (sortField) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    return data;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Database size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-500 mb-6">Inicia sesión para acceder a la base de datos.</p>
        </div>
      </div>
    );
  }

  const data = getFilteredAndSorted();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Database size={24} className="text-green-600" /> Base de Datos
              </h1>
              <p className="text-gray-500 text-sm mt-1">Visualización de registros en tiempo real</p>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              {profile?.role === 'establishment' ? <Building2 size={16} className="text-amber-600" /> : <User size={16} className="text-green-600" />}
              <span className="text-sm font-medium text-gray-700">{profile?.full_name}</span>
              <span className="text-xs text-gray-500">({profile?.role === 'establishment' ? 'Establecimiento' : 'Usuario'})</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { key: 'users', label: 'Usuarios', icon: Users, count: users.length },
              { key: 'offers', label: 'Ofertas', icon: ShoppingBag, count: offers.length },
              { key: 'donations', label: 'Donaciones', icon: Heart, count: donations.length },
            ].map(({ key, label, icon: Icon, count }) => (
              <button key={key} onClick={() => setActiveTab(key as TabType)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${activeTab === key ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <Icon size={16} /> {label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === key ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar en registros..."
                className="w-full md:w-80 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-green-500" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {activeTab === 'users' && (
                      <>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('full_name')}>Nombre {sortField === 'full_name' && (sortAsc ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />)}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>Correo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Rol</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Ciudad</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>Fecha</th>
                      </>
                    )}
                    {activeTab === 'offers' && (
                      <>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Titulo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Autor</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Tipo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Ciudad</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Fecha</th>
                      </>
                    )}
                    {activeTab === 'donations' && (
                      <>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Descripcion</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Donante</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Tipo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Ciudad</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Fecha</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={activeTab === 'users' ? 5 : 6} className="text-center py-12 text-gray-400">No hay registros</td></tr>
                  ) : (
                    data.map((item: any, i: number) => (
                      <tr key={item.id || i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        {activeTab === 'users' && (
                          <>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">{item.full_name?.[0]?.toUpperCase() || 'U'}</div>
                                <span className="font-medium text-gray-900">{item.full_name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{item.email}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${item.role === 'establishment' ? 'bg-amber-100 text-amber-700' : item.role === 'admin' ? 'bg-gray-800 text-white' : 'bg-green-100 text-green-700'}`}>
                                {item.role === 'establishment' ? 'Establecimiento' : item.role === 'admin' ? 'Admin' : 'Usuario'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{item.city}</td>
                            <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(item.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'offers' && (
                          <>
                            <td className="py-3 px-4 font-medium text-gray-900">{item.title}</td>
                            <td className="py-3 px-4 text-gray-600">{item.profiles?.full_name || 'Anonimo'}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${item.offer_type === 'free' ? 'bg-green-100 text-green-700' : item.offer_type === 'donation' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                {item.offer_type === 'free' ? 'Gratis' : item.offer_type === 'donation' ? 'Donacion' : 'Bajo Precio'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : item.status === 'claimed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                {item.status === 'active' ? 'Activo' : item.status === 'claimed' ? 'Reclamado' : 'Vencido'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{item.city}</td>
                            <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(item.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'donations' && (
                          <>
                            <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{item.description}</td>
                            <td className="py-3 px-4 text-gray-600">{item.profiles?.full_name || 'Anonimo'}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${item.donation_type === 'money' ? 'bg-emerald-100 text-emerald-700' : item.donation_type === 'food' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'}`}>
                                {item.donation_type === 'money' ? 'Monetaria' : item.donation_type === 'food' ? 'Alimentos' : 'Mixta'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'available' ? 'bg-green-100 text-green-700' : item.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                {item.status === 'available' ? 'Disponible' : item.status === 'completed' ? 'Completado' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{item.city}</td>
                            <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(item.created_at)}</td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
              {data.length} registro{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
