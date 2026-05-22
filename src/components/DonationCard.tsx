// Historia de usuario 3: Sistema de donaciones (ofrecer y adquirir)
// Rama: feature/historia3
// Este componente implementa la tarjeta visual para cada donación
import { MapPin, Clock, Heart, DollarSign, Package, Phone, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Donation } from '../types';

interface DonationCardProps {
  donation: Donation;
}

const TYPE_CONFIG = {
  money: { label: 'Monetaria', icon: <DollarSign size={20} />, bg: 'bg-emerald-100 text-emerald-700', cardBg: 'from-emerald-50 to-teal-50' },
  food: { label: 'Alimentos', icon: <Package size={20} />, bg: 'bg-orange-100 text-orange-700', cardBg: 'from-orange-50 to-amber-50' },
  both: { label: 'Mixta', icon: <Heart size={20} />, bg: 'bg-rose-100 text-rose-700', cardBg: 'from-rose-50 to-pink-50' },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  return 'hace poco';
}

export default function DonationCard({ donation }: DonationCardProps) {
  const config = TYPE_CONFIG[donation.donation_type] || TYPE_CONFIG.food;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className={`relative bg-gradient-to-br ${config.cardBg} h-28 flex items-center justify-center`}>
        <div className={`p-4 rounded-2xl ${config.bg} text-3xl`}>
          {config.icon}
        </div>
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${config.bg}`}>
          {config.label}
        </span>
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${donation.is_offering ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
          {donation.is_offering ? <><ArrowUpRight size={12} /> Ofrezco</> : <><ArrowDownLeft size={12} /> Necesito</>}
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-700 line-clamp-3 mb-3 leading-relaxed">{donation.description}</p>

        <div className="space-y-1.5 mb-3">
          {donation.donation_type === 'money' && donation.amount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-emerald-600">{formatPrice(donation.amount)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-green-500 flex-shrink-0" />
            <span>{donation.city}</span>
          </div>
          {donation.contact_info && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone size={13} className="flex-shrink-0" />
              <span>{donation.contact_info}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            donation.status === 'available' ? 'bg-green-100 text-green-700' :
            donation.status === 'pending' ? 'bg-amber-100 text-amber-700' :
            donation.status === 'completed' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {donation.status === 'available' ? 'Disponible' :
             donation.status === 'pending' ? 'En proceso' :
             donation.status === 'completed' ? 'Completado' : 'Cancelado'}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            <span>{timeAgo(donation.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
