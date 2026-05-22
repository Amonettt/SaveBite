// Componente compartido: Footer de la aplicación
// Referencia: Historias de usuario 1-5 (navegación general)
import { Leaf, MapPin, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-green-600 rounded-lg">
                <Leaf size={20} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">Save<span className="text-green-400">Bite</span></span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Reduciendo el desperdicio de alimentos en Colombia conectando establecimientos con comunidades vulnerables.
              Cada alimento cuenta, cada gesto importa.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-sm text-gray-400">
              <MapPin size={14} className="text-green-400 flex-shrink-0" />
              <span>Colombia — Todas las ciudades</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-700 transition-colors"><Instagram size={16} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-700 transition-colors"><Facebook size={16} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-700 transition-colors"><Twitter size={16} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {[
                { page: 'home' as Page, label: 'Inicio' },
                { page: 'offers' as Page, label: 'Ver Ofertas' },
                { page: 'donations' as Page, label: 'Donaciones' },
                { page: 'impact' as Page, label: 'Impacto Social' },
              ].map(({ page, label }) => (
                <li key={page}>
                  <button onClick={() => onNavigate(page)} className="text-gray-400 hover:text-green-400 transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={14} className="text-green-400" /> hola@savebite.co
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={14} className="text-green-400" /> +57 310 000 0000
              </li>
            </ul>
            <div className="mt-6 p-3 bg-green-900/30 rounded-xl border border-green-800/40">
              <p className="text-xs text-green-300 font-semibold">Impacto 2024</p>
              <p className="text-xs text-gray-400 mt-1">Miles de kg de alimentos salvados del desperdicio en Colombia</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 SaveBite Colombia. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
