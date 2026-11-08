// Historia de usuario 2: Publicación y visualización de ofertas de alimentos
// Rama: feature/historia2
// Esta página implementa el listado de ofertas con filtros por ciudad, categoría y tipo
import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FoodOffer, Page } from '../types';
import OfferCard from '../components/OfferCard';
import { COLOMBIAN_CITIES, FOOD_CATEGORIES, OFFER_TYPES } from '../constants/data';
import { useAuth } from '../hooks/useAuth';

interface OffersProps {
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function Offers({ onNavigate, onOpenAuth }: OffersProps) {
  const { user } = useAuth();
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, [selectedCity, selectedCategory, selectedType]);

  const fetchOffers = async () => {
    setLoading(true);
    let query = supabase
      .from('food_offers')
      .select('*, profiles(full_name, establishment_name, role, city)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (selectedCity) query = query.eq('city', selectedCity);
    if (selectedCategory) query = query.eq('category', selectedCategory);
    if (selectedType) query = query.eq('offer_type', selectedType);

    const { data, error } = await query;
    if (error) console.error('Error fetching offers:', error.message);
    setOffers((data as FoodOffer[]) || []);
    setLoading(false);
  };

  const filtered = offers.filter(o =>
    !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Ofertas de Alimentos</h1>
              <p className="text-gray-500 text-sm mt-1">Productos frescos a bajo costo, gratis o en donación cerca de ti</p>
            </div>
            <button onClick={() => onNavigate('create-offer')} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md">
              <Plus size={18} /> Publicar Oferta
            </button>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar alimentos..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white min-w-[160px]">
                <option value="">Todas las ciudades</option>
                {COLOMBIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Filter size={15} /> Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-3">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Todas las categorías</option>
                {FOOD_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Todos los tipos</option>
                {OFFER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <button onClick={() => { setSelectedCategory(''); setSelectedType(''); setSelectedCity(''); setSearch(''); }} className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-green-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay ofertas disponibles</h3>
            <p className="text-gray-400 text-sm mb-6">Sé el primero en publicar una oferta en esta zona.</p>
            <button onClick={() => onNavigate('create-offer')} className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
              Publicar Primera Oferta
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} oferta{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(offer => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
