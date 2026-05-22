// Historia de usuario 2: Publicación y visualización de ofertas de alimentos
// Rama: feature/historia2
// Este componente implementa la tarjeta visual para cada oferta de alimento
import { MapPin, Clock, Package, Tag, Building2, User, Utensils, Apple, Croissant, Milk, ShoppingBasket, Beef, Wheat } from 'lucide-react';
import { FoodOffer } from '../types';

interface OfferCardProps {
  offer: FoodOffer;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  frutas_verduras: <Apple size={20} />,
  panaderia: <Croissant size={20} />,
  lacteos: <Milk size={20} />,
  preparados: <Utensils size={20} />,
  carnes: <Beef size={20} />,
  granos: <Wheat size={20} />,
  otros: <ShoppingBasket size={20} />,
};

const CATEGORY_LABELS: Record<string, string> = {
  frutas_verduras: 'Frutas y Verduras',
  panaderia: 'Panadería',
  lacteos: 'Lácteos',
  preparados: 'Comidas Preparadas',
  carnes: 'Carnes',
  granos: 'Granos',
  otros: 'Otros',
};

const CATEGORY_COLORS: Record<string, string> = {
  frutas_verduras: 'bg-green-100 text-green-700',
  panaderia: 'bg-amber-100 text-amber-700',
  lacteos: 'bg-blue-100 text-blue-700',
  preparados: 'bg-orange-100 text-orange-700',
  carnes: 'bg-red-100 text-red-700',
  granos: 'bg-yellow-100 text-yellow-700',
  otros: 'bg-gray-100 text-gray-700',
};

const OFFER_TYPE_CONFIG = {
  low_price: { label: 'Bajo Precio', bg: 'bg-amber-500', text: 'text-white' },
  free: { label: 'GRATIS', bg: 'bg-green-500', text: 'text-white' },
  donation: { label: 'Donación', bg: 'bg-blue-500', text: 'text-white' },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  return 'hace poco';
}

export default function OfferCard({ offer }: OfferCardProps) {
  const typeConfig = OFFER_TYPE_CONFIG[offer.offer_type];
  const daysToExpiry = offer.expiry_date ? Math.ceil((new Date(offer.expiry_date).getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 h-32 flex items-center justify-center">
        <div className={`p-4 rounded-2xl ${CATEGORY_COLORS[offer.category]} text-3xl`}>
          {CATEGORY_ICONS[offer.category]}
        </div>
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${typeConfig.bg} ${typeConfig.text}`}>
          {typeConfig.label}
        </span>
        {daysToExpiry !== null && daysToExpiry <= 3 && daysToExpiry >= 0 && (
          <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
            Vence en {daysToExpiry}d
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">{offer.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[offer.category]}`}>
            {CATEGORY_LABELS[offer.category]}
          </span>
        </div>

        {offer.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{offer.description}</p>
        )}

        <div className="space-y-1.5 mb-3">
          {offer.offer_type === 'low_price' && (
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-amber-500 flex-shrink-0" />
              <div className="flex items-center gap-2">
                {offer.original_price > 0 && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(offer.original_price)}</span>
                )}
                <span className="text-sm font-bold text-amber-600">{formatPrice(offer.offer_price)}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Package size={13} className="flex-shrink-0" />
            <span>{offer.quantity} {offer.unit} disponibles</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="flex-shrink-0 text-green-500" />
            <span>{offer.city}{offer.address ? ` · ${offer.address}` : ''}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            {offer.profiles?.role === 'establishment' ? <Building2 size={12} /> : <User size={12} />}
            <span className="truncate max-w-[100px]">
              {offer.profiles?.establishment_name || offer.profiles?.full_name || 'Anónimo'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            <span>{timeAgo(offer.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
