// Historia de usuario 3: Sistema de donaciones (ofrecer y adquirir)
// Rama: feature/historia3
// Esta página implementa el listado de donaciones con filtros por dirección y tipo
import { useState, useEffect } from 'react';
import { Heart, MapPin, Filter, Plus, Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Donation, Page } from '../types';
import DonationCard from '../components/DonationCard';
import { COLOMBIAN_CITIES } from '../constants/data';
import { useAuth } from '../hooks/useAuth';

interface DonationsProps {
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function Donations({ onNavigate, onOpenAuth }: DonationsProps) {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [direction, setDirection] = useState('');

  useEffect(() => {
    fetchDonations();
  }, [selectedCity, selectedType, direction]);

  const fetchDonations = async () => {
    setLoading(true);
    let query = supabase
      .from('donations')
      .select('*, profiles(full_name, establishment_name, role)')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (selectedCity) query = query.eq('city', selectedCity);
    if (selectedType) query = query.eq('donation_type', selectedType);
    if (direction === 'offering') query = query.eq('is_offering', true);
    if (direction === 'needed') query = query.eq('is_offering', false);

    const { data, error } = await query;
    if (error) console.error('Error fetching donations:', error.message);
    setDonations((data as Donation[]) || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Donaciones</h1>
              <p className="text-gray-500 text-sm mt-1">Ofrece o solicita ayuda en forma de alimentos o recursos</p>
            </div>
            <button onClick={() => onNavigate('create-donation')} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors shadow-md">
              <Plus size={18} /> Nueva Donación
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Historia de usuario 3: Botones de filtro por dirección de donación */}
            <button onClick={() => setDirection(direction === 'offering' ? '' : 'offering')} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${direction === 'offering' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              <ArrowUpRight size={16} /> Ofrezco Ayuda
            </button>
            <button onClick={() => setDirection(direction === 'needed' ? '' : 'needed')} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${direction === 'needed' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-rose-300'}`}>
              <ArrowDownLeft size={16} /> Necesito Ayuda
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white min-w-[160px]">
                <option value="">Todas las ciudades</option>
                {COLOMBIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Todos los tipos</option>
                <option value="money">Monetaria</option>
                <option value="food">Alimentos</option>
                <option value="both">Mixta</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-rose-400" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay donaciones en este momento</h3>
            <p className="text-gray-400 text-sm mb-6">Puedes ser el primero en ofrecer o solicitar ayuda.</p>
            <button onClick={() => onNavigate('create-donation')} className="px-6 py-2.5 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors">
              Publicar Donación
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{donations.length} donación{donations.length !== 1 ? 'es' : ''} encontrada{donations.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {donations.map(donation => <DonationCard key={donation.id} donation={donation} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
