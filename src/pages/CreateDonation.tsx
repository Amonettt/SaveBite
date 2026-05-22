// Historia de usuario 3: Sistema de donaciones (ofrecer y adquirir)
// Rama: feature/historia3
// Esta página implementa el formulario de creación de donaciones
import { useState } from 'react';
import { ArrowLeft, Save, Loader2, Heart, DollarSign, MapPin, Phone, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Page, DonationType } from '../types';
import { COLOMBIAN_CITIES } from '../constants/data';

interface CreateDonationProps {
  onNavigate: (page: Page) => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateDonation({ onNavigate }: CreateDonationProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    description: '', donation_type: 'food' as DonationType,
    amount: '', is_offering: true,
    city: profile?.city || 'Bogota', contact_info: '',
  });

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.description.trim()) errs.description = 'La descripcion es requerida';
    else if (form.description.trim().length < 10) errs.description = 'Minimo 10 caracteres';
    if (form.donation_type === 'money' && (!form.amount || parseFloat(form.amount) <= 0)) {
      errs.amount = 'Ingresa un monto valido';
    }
    if (!form.city) errs.city = 'Selecciona una ciudad';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;

    setLoading(true);
    const insertData = {
      donor_id: user.id,
      description: form.description.trim(),
      donation_type: form.donation_type,
      amount: form.donation_type === 'money' && form.amount ? parseFloat(form.amount) : 0,
      is_offering: form.is_offering,
      city: form.city,
      contact_info: form.contact_info.trim(),
      status: 'available',
    };

    const { error } = await supabase.from('donations').insert(insertData);
    setLoading(false);

    if (error) setErrors({ submit: error.message });
    else setSuccess(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Inicia sesion para publicar</h2>
          <button onClick={() => onNavigate('home')} className="mt-4 text-green-600 hover:underline">Volver al inicio</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Donacion publicada</h2>
          {/* Historia de usuario 3: Confirmación de donación con mensaje solidario */}
          <p className="text-gray-500 mb-6">Tu publicacion ya es visible para la comunidad. Tu generosidad hace la diferencia en la vida de muchos colombianos.</p>
          <div className="flex gap-3">
            <button onClick={() => { setSuccess(false); setForm({ description: '', donation_type: 'food' as DonationType, amount: '', is_offering: true, city: profile?.city || 'Bogota', contact_info: '' }); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Publicar otra</button>
            <button onClick={() => onNavigate('donations')} className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600">Ver donaciones</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={() => onNavigate('donations')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={16} /> Volver a donaciones
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Publicar Donacion</h1>
          <p className="text-gray-500 text-sm mt-1">Ofrece tu ayuda o solicita apoyo de la comunidad</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {errors.submit && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{errors.submit}</div>}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de publicacion *</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => update('is_offering', true)} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.is_offering ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <ArrowUpRight size={18} /> Ofrezco Ayuda
              </button>
              <button type="button" onClick={() => update('is_offering', false)} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${!form.is_offering ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <ArrowDownLeft size={18} /> Necesito Ayuda
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de donacion *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'food', label: 'Alimentos', icon: '🥫' },
                { value: 'money', label: 'Monetaria', icon: '💵' },
                { value: 'both', label: 'Ambas', icon: '🤝' },
              ].map(t => (
                <button key={t.value} type="button" onClick={() => update('donation_type', t.value)} className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${form.donation_type === t.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <span className="text-xl">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {form.donation_type === 'money' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <DollarSign size={14} /> Monto (COP) *
              </label>
              <input type="number" min="1000" step="1000" value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="50000" className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.amount ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripcion *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} placeholder={form.is_offering ? "Describe que ofreces..." : "Describe que necesitas..."} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin size={16} /> Ubicacion y Contacto</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad *</label>
            <select value={form.city} onChange={e => update('city', e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${errors.city ? 'border-red-400' : 'border-gray-200'}`}>
              {COLOMBIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Phone size={14} /> Informacion de contacto
            </label>
            <input type="text" value={form.contact_info} onChange={e => update('contact_info', e.target.value)} placeholder="WhatsApp: 300 123 4567" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Publicando...</> : <><Save size={18} /> Publicar Donacion</>}
        </button>
      </form>
    </div>
  );
}
