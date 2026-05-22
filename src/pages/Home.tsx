// Página principal: Home
// Referencia: Historias de usuario 1-5 (punto de entrada a todas las funcionalidades)
import { ShoppingBag, Heart, TrendingDown, Users, ArrowRight, Leaf, Store, Utensils, Apple, Star, MapPin } from 'lucide-react';
import { Page } from '../types';
import { useAuth } from '../hooks/useAuth';

interface HomeProps {
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const STATS = [
  { value: '12,400', label: 'kg salvados', icon: TrendingDown, color: 'text-green-600', bg: 'bg-green-50' },
  { value: '3,200', label: 'familias beneficiadas', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: '890', label: 'establecimientos', icon: Store, color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: '28', label: 'ciudades activas', icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const FEATURES = [
  {
    icon: ShoppingBag,
    title: 'Ofertas de Alimentos',
    desc: 'Accede a productos próximos a vencer a precios reducidos o gratis desde restaurantes, supermercados y tiendas cerca de ti.',
    color: 'bg-amber-500',
    page: 'offers' as Page,
  },
  {
    icon: Heart,
    title: 'Donaciones Solidarias',
    desc: 'Ofrece o recibe donaciones de alimentos o recursos económicos para apoyar a quienes más lo necesitan en tu ciudad.',
    color: 'bg-rose-500',
    page: 'donations' as Page,
  },
  {
    icon: TrendingDown,
    title: 'Impacto Social',
    desc: 'Conoce el impacto real de la comunidad: kilos salvados, familias ayudadas y ciudades participantes en todo el país.',
    color: 'bg-green-600',
    page: 'impact' as Page,
  },
];

const TESTIMONIALS = [
  { name: 'Panadería El Trigal', city: 'Medellín', role: 'Establecimiento', text: 'Gracias a SaveBite donamos el pan que nos sobra cada tarde. Antes lo tirábamos, ahora llega a 30 familias cada semana.', stars: 5 },
  { name: 'María Rodríguez', city: 'Bogotá', role: 'Usuario', text: 'Encontré mercado fresco a mitad de precio. Mi familia ahorra y ayudamos a no desperdiciar comida.', stars: 5 },
  { name: 'Supermercado Vecino', city: 'Cali', role: 'Establecimiento', text: 'La plataforma es muy fácil de usar. Publicamos excedentes y al día siguiente ya no queda nada.', stars: 5 },
];

export default function Home({ onNavigate, onOpenAuth }: HomeProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
              <Leaf size={14} />
              Plataforma solidaria colombiana
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Salva Alimentos,<br />
              <span className="text-yellow-300">Transforma Vidas</span>
            </h1>
            <p className="text-lg text-green-100 leading-relaxed mb-8 max-w-xl">
              Conectamos establecimientos con excedentes de alimentos con familias y personas vulnerables en toda Colombia. Menos desperdicio, más solidaridad.
            </p>
            {/* Historia de usuario 1: Mensaje motivacional para registro */}
            {!user && (
              <p className="text-sm text-yellow-200 font-medium mb-2">
                Regístrate gratis y empieza a hacer la diferencia hoy
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate('offers')} className="flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <ShoppingBag size={18} /> Ver Ofertas
              </button>
              {!user ? (
                <button onClick={() => onOpenAuth('register')} className="flex items-center gap-2 px-6 py-3 bg-white/20 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm">
                  Únete Gratis <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={() => onNavigate('create-offer')} className="flex items-center gap-2 px-6 py-3 bg-white/20 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm">
                  Publicar Oferta <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map(({ value, label, icon: Icon, color, bg }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                <div className={`p-2.5 rounded-xl ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">¿Cómo funciona SaveBite?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Una plataforma simple que conecta oferta y necesidad para reducir el desperdicio y apoyar comunidades.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, page }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                <button onClick={() => onNavigate(page)} className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 group-hover:gap-2 transition-all">
                  Explorar <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Categorías de Alimentos</h2>
            <p className="text-gray-500">Encuentra exactamente lo que necesitas</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Apple, label: 'Frutas y Verduras', color: 'bg-green-100 text-green-700' },
              { icon: Utensils, label: 'Preparados', color: 'bg-orange-100 text-orange-700' },
              { icon: ShoppingBag, label: 'Panadería', color: 'bg-amber-100 text-amber-700' },
              { icon: Leaf, label: 'Lácteos', color: 'bg-blue-100 text-blue-700' },
              { icon: Store, label: 'Carnes', color: 'bg-red-100 text-red-700' },
              { icon: ShoppingBag, label: 'Granos', color: 'bg-yellow-100 text-yellow-700' },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} onClick={() => onNavigate('offers')} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group">
                <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Lo que dice nuestra comunidad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, role, text, stars }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} fill="currentColor" className="text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role} · {city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-4">¿Listo para marcar la diferencia?</h2>
            <p className="text-green-100 mb-8 text-lg">Únete a miles de colombianos que ya están reduciendo el desperdicio alimentario.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => onOpenAuth('register')} className="px-8 py-3.5 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Crear Cuenta Gratis
              </button>
              <button onClick={() => onOpenAuth('login')} className="px-8 py-3.5 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
