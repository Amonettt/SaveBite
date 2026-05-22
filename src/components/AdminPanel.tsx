// Historia de usuario 5: Panel de administración para ver usuarios registrados
// Este componente implementa la tabla de gestión de usuarios para administradores
import { useState, useEffect } from 'react';
import { Users, Search, Shield, Building2, User, Mail, MapPin, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export default function AdminPanel() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Historia de usuario 5: Obtener todos los usuarios registrados
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers((data as Profile[]) || []);
    } catch (err) {
      setError('No se pudieron cargar los usuarios. Verifica tu conexión.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.city?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-gradient-to-r from-gray-700 to-gray-900 text-white',
      establishment: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300',
      user: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
    };
    const labels: Record<string, string> = {
      admin: 'Administrador',
      establishment: 'Establecimiento',
      user: 'Usuario',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[role] || styles.user}`}>
        {labels[role] || 'Usuario'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-gray-500">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center bg-red-50 rounded-2xl p-8 border border-red-200 max-w-md">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Historia de usuario 5: Encabezado del panel de administración */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-yellow-400" />
          <h2 className="text-xl font-bold">Panel de Administración</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Gestiona los usuarios registrados en la plataforma SaveBite
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-green-400" />
            <span className="text-gray-300">Total usuarios:</span>
            <span className="font-bold text-white">{users.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-amber-400" />
            <span className="text-gray-300">Establecimientos:</span>
            <span className="font-bold text-white">{users.filter(u => u.role === 'establishment').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-400" />
            <span className="text-gray-300">Usuarios:</span>
            <span className="font-bold text-white">{users.filter(u => u.role === 'user').length}</span>
          </div>
        </div>
      </div>

      {/* Historia de usuario 5: Barra de búsqueda */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo o ciudad..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Historia de usuario 5: Tabla de usuarios */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-2"><User size={14} /> Usuario</div>
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-2"><Mail size={14} /> Correo</div>
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-600">Rol</th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-2"><MapPin size={14} /> Ciudad</div>
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-2"><Calendar size={14} /> Registro</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Users size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                      {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                      user.role === 'admin' ? 'bg-yellow-50/50' : ''
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          user.role === 'admin' ? 'bg-gradient-to-r from-gray-700 to-gray-900' :
                          user.role === 'establishment' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                          'bg-gradient-to-r from-green-400 to-green-600'
                        }`}>
                          {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.full_name || 'Sin nombre'}</p>
                          {user.role === 'establishment' && user.establishment_name && (
                            <p className="text-xs text-amber-600">{user.establishment_name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-5">{getRoleBadge(user.role || 'user')}</td>
                    <td className="py-4 px-5 text-sm text-gray-600">{user.city || '-'}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">
                      {user.created_at ? formatDate(user.created_at) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </div>
    </div>
  );
}
