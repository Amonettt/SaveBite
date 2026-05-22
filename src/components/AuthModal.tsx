// Historia de usuario 1: Registro e inicio de sesión con validación
// Rama: feature/historia1
// Este componente implementa el modal de autenticación con formularios de registro e inicio de sesión
import { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Building2, Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { COLOMBIAN_CITIES, ESTABLISHMENT_TYPES } from '../constants/data';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

interface FormErrors {
  [key: string]: string;
}

export default function AuthModal({ onClose, initialMode = 'login' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', phone: '', city: 'Bogotá',
    role: 'user', establishment_name: '', establishment_type: '',
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) newErrors.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.password) newErrors.password = 'La contraseña es requerida';
    else if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (mode === 'register') {
      if (!form.full_name.trim()) newErrors.full_name = 'El nombre es requerido';
      else if (form.full_name.trim().length < 3) newErrors.full_name = 'Mínimo 3 caracteres';
      if (!form.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
      else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
      if (form.phone && !/^[0-9+\s\-()]{7,15}$/.test(form.phone)) newErrors.phone = 'Teléfono inválido';
      if (form.role === 'establishment' && !form.establishment_name.trim()) newErrors.establishment_name = 'El nombre del establecimiento es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    if (mode === 'login') {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        setServerError(error.includes('Invalid') ? 'Correo o contraseña incorrectos' : error);
      } else {
        onClose();
      }
    } else {
      const { error } = await signUp(form.email, form.password, {
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
        role: form.role as 'user' | 'establishment',
        establishment_name: form.establishment_name,
        establishment_type: form.establishment_type,
      });
      if (error) {
        setServerError(error.includes('already registered') ? 'Este correo ya está registrado' : error);
      } else {
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-white/20 rounded-xl">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold">SaveBite</span>
          </div>
          <p className="text-green-100 text-sm mt-1">
            {mode === 'login' ? 'Bienvenido de nuevo' : 'Únete a nuestra comunidad'}
          </p>
        </div>

        <div className="flex border-b border-gray-100">
          <button onClick={() => setMode('login')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'login' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
            Iniciar Sesión
          </button>
          <button onClick={() => setMode('register')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'register' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{serverError}</div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Tu nombre completo" className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
              </div>
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="correo@ejemplo.com" className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Mínimo 6 caracteres" className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repite tu contraseña" className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="300 123 4567" className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select value={form.city} onChange={e => update('city', e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    {COLOMBIAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cuenta *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => update('role', 'user')} className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${form.role === 'user' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <User size={16} className="mx-auto mb-1" />
                    Usuario
                  </button>
                  <button type="button" onClick={() => update('role', 'establishment')} className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${form.role === 'establishment' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <Building2 size={16} className="mx-auto mb-1" />
                    Establecimiento
                  </button>
                </div>
              </div>

              {form.role === 'establishment' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del establecimiento *</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={form.establishment_name} onChange={e => update('establishment_name', e.target.value)} placeholder="Nombre de tu negocio" className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.establishment_name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                    </div>
                    {errors.establishment_name && <p className="text-red-500 text-xs mt-1">{errors.establishment_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de establecimiento</label>
                    <select value={form.establishment_type} onChange={e => update('establishment_type', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                      <option value="">Selecciona...</option>
                      {ESTABLISHMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold text-sm hover:from-green-700 hover:to-emerald-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Procesando...
              </span>
            ) : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); setServerError(''); }} className="text-green-600 font-semibold hover:underline">
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
