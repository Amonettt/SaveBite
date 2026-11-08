// Historia de usuario 2: Publicación y visualización de ofertas de alimentos
// Rama: feature/historia2
// Esta página implementa el formulario de creación de ofertas de alimentos
import { useState } from 'react';
import { ArrowLeft, Save, Loader2, Package, DollarSign, MapPin, Calendar, Tag, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Page, FoodCategory, OfferType } from '../types';
import { COLOMBIAN_CITIES, FOOD_CATEGORIES, OFFER_TYPES } from '../constants/data';

interface CreateOfferProps {
  onNavigate: (page: Page) => void;
}

interface FormErrors {
  [key: string]: string;
}

const DEMO_USER_ID = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9';

export default function CreateOffer({ onNavigate }: CreateOfferProps) {
  const { user, profile } = useAuth();
  const activeUserId = user?.id || DEMO_USER_ID;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', category: '' as FoodCategory,
    offer_type: 'low_price' as OfferType, original_price: '', offer_price: '',
    quantity: '1', unit: 'unidades', expiry_date: '',
    city: profile?.city || 'Bogota', address: '',
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = 'El titulo es requerido';
    else if (form.title.trim().length < 5) errs.title = 'Minimo 5 caracteres';
    if (!form.category) errs.category = 'Selecciona una categoria';
    if (!form.offer_type) errs.offer_type = 'Selecciona el tipo de oferta';
    if (form.offer_type === 'low_price') {
      if (!form.offer_price || parseFloat(form.offer_price) <= 0) errs.offer_price = 'Ingresa un precio valido';
    }
    if (!form.quantity || parseInt(form.quantity) <= 0) errs.quantity = 'Cantidad invalida';
    if (!form.city) errs.city = 'Selecciona una ciudad';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const insertData = {
      user_id: activeUserId,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      offer_type: form.offer_type,
      original_price: form.original_price ? parseFloat(form.original_price) : 0,
      offer_price: form.offer_type === 'low_price' && form.offer_price ? parseFloat(form.offer_price) : 0,
      quantity: parseInt(form.quantity),
      unit: form.unit,
      expiry_date: form.expiry_date || null,
      city: form.city,
      address: form.address.trim(),
      status: 'active',
    };

    const { error } = await supabase.from('food_offers').insert(insertData);
    setLoading(false);

    if (error) setErrors({ submit: error.message });
    else setSuccess(true);
  };



  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oferta publicada exitosamente</h2>
          {/* Historia de usuario 2: Confirmación visual de publicación de oferta */}
          <p className="text-gray-500 mb-6">Tu oferta ya esta visible para la comunidad. Gracias por contribuir a reducir el desperdicio alimentario.</p>
          <div className="flex gap-3">
            <button onClick={() => { setSuccess(false); setForm({ title: '', description: '', category: '' as FoodCategory, offer_type: 'low_price' as OfferType, original_price: '', offer_price: '', quantity: '1', unit: 'unidades', expiry_date: '', city: profile?.city || 'Bogota', address: '' }); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Publicar otra</button>
            <button onClick={() => onNavigate('offers')} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">Ver ofertas</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={() => onNavigate('offers')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={16} /> Volver a ofertas
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Publicar Oferta de Alimentos</h1>
          <p className="text-gray-500 text-sm mt-1">Comparte alimentos en exceso o proximos a vencer con la comunidad</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {errors.submit && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{errors.submit}</div>}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Tag size={14} /> Titulo de la oferta *
            </label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Ej: Pan del dia a mitad de precio" className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FileText size={14} /> Descripcion
            </label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={2} placeholder="Describe el alimento..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${errors.category ? 'border-red-400' : 'border-gray-200'}`}>
                <option value="">Seleccione...</option>
                {FOOD_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de oferta *</label>
              <select value={form.offer_type} onChange={e => update('offer_type', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {OFFER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {form.offer_type === 'low_price' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <DollarSign size={14} /> Precio original
                </label>
                <input type="number" min="0" step="100" value={form.original_price} onChange={e => update('original_price', e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <DollarSign size={14} /> Precio oferta *
                </label>
                <input type="number" min="0" step="100" value={form.offer_price} onChange={e => update('offer_price', e.target.value)} placeholder="COP" className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.offer_price ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.offer_price && <p className="text-red-500 text-xs mt-1">{errors.offer_price}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad disponible *</label>
              <input type="number" min="1" value={form.quantity} onChange={e => update('quantity', e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.quantity ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unidad</label>
              <select value={form.unit} onChange={e => update('unit', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="unidades">Unidades</option>
                <option value="kg">Kilogramos</option>
                <option value="libras">Libras</option>
                <option value="porciones">Porciones</option>
                <option value="cajas">Cajas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Calendar size={14} /> Fecha de vencimiento
            </label>
            <input type="date" value={form.expiry_date} onChange={e => update('expiry_date', e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin size={16} /> Ubicacion</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad *</label>
            <select value={form.city} onChange={e => update('city', e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${errors.city ? 'border-red-400' : 'border-gray-200'}`}>
              {COLOMBIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Direccion / Referencia</label>
            <input type="text" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Barrio o punto de referencia" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Publicando...</> : <><Save size={18} /> Publicar Oferta</>}
        </button>
      </form>
    </div>
  );
}
