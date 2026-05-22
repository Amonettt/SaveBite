// Historia de usuario 4: Visualización de impacto social
// Rama: feature/historia4
// Esta página implementa las estadísticas de impacto social de SaveBite en Colombia
import { TrendingDown, Users, Store, MapPin, Heart, Package, Leaf, Award, BarChart3, Globe } from 'lucide-react';

const IMPACT_STATS = [
  { value: '12,400+', label: 'kg de alimentos salvados', icon: Package, color: 'from-green-500 to-emerald-500' },
  { value: '3,200+', label: 'familias beneficiadas', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { value: '890+', label: 'establecimientos activos', icon: Store, color: 'from-amber-500 to-orange-500' },
  { value: '28', label: 'ciudades en Colombia', icon: MapPin, color: 'from-rose-500 to-pink-500' },
];

const MONTHLY_DATA = [
  { month: 'Ene', offers: 120, donations: 45, saved: 890 },
  { month: 'Feb', offers: 145, donations: 52, saved: 1050 },
  { month: 'Mar', offers: 180, donations: 68, saved: 1320 },
  { month: 'Abr', offers: 210, donations: 75, saved: 1540 },
  { month: 'May', offers: 250, donations: 89, saved: 1820 },
  { month: 'Jun', offers: 280, donations: 95, saved: 2100 },
];

const CITY_IMPACT = [
  { city: 'Bogotá', offers: 1240, families: 890 },
  { city: 'Medellín', offers: 680, families: 420 },
  { city: 'Cali', offers: 520, families: 380 },
  { city: 'Barranquilla', offers: 340, families: 250 },
  { city: 'Cartagena', offers: 280, families: 180 },
];

export default function Impact() {
  const maxOffers = Math.max(...MONTHLY_DATA.map(d => d.offers));

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Globe size={14} />
            Impacto en Colombia
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Nuestro Impacto Social</h1>
          <p className="text-green-100 max-w-xl mx-auto">Cada número representa una familia alimentada, un alimento salvado del desperdicio y un paso hacia un Colombia más solidaria.</p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPACT_STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-5">
                <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={22} className="text-white" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 size={24} className="text-green-600" />
            <h2 className="text-2xl font-extrabold text-gray-900">Crecimiento Mensual</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              {MONTHLY_DATA.map(({ month, offers, donations, saved }) => (
                <div key={month} className="flex items-center gap-4">
                  <span className="w-10 text-sm font-medium text-gray-500">{month}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-end pr-3"
                      style={{ width: `${(offers / maxOffers) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{offers}</span>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs text-gray-500">{saved} kg</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-xs text-gray-500">Ofertas</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf size={14} className="text-green-500" />
                <span className="text-xs text-gray-500">Alimentos salvados (kg)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Award size={24} className="text-amber-500" />
            <h2 className="text-2xl font-extrabold text-gray-900">Ciudades Destacadas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ciudad</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Ofertas Publicadas</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Familias Ayudadas</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {CITY_IMPACT.map(({ city, offers, families }, i) => (
                  <tr key={city} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                        <span className="font-medium text-gray-900">{city}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-600">{offers.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-sm text-gray-600">{families.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingDown size={14} className="text-green-500" />
                        <span className="text-sm font-medium text-green-600">+{Math.round(families / offers * 15)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Historia de usuario 4: Sección de ciudades participantes */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Ciudades Participantes</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Ibagué', 'Cúcuta', 'Pasto', 'Neiva', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar', 'Popayán', 'Sincelejo', 'Tunja', 'Florencia', 'Riohacha', 'Quibdó', 'Mocoa', 'Yopal', 'Arauca', 'Leticia', 'San José del Guaviare'].map(city => (
              <span key={city} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart size={40} className="mx-auto text-rose-400 mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Cada aporte cuenta</h2>
          <p className="text-gray-600 leading-relaxed">Detrás de cada número hay una historia: un restaurante que dona sus excedentes, una familia que accede a alimentos frescos, un supermercado que reduce su desperdicio. Juntos estamos construyendo una Colombia más solidaria.</p>
        </div>
      </section>
    </div>
  );
}
