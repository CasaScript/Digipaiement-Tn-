import React from 'react';
import { MessageCircle, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05080f] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Digipaiement_logo_b890e884.png"
                alt="DigiPaiement.tn Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  DigiPaiement<span className="text-blue-500">.tn</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              DigiPaiement.tn est la solution de confiance qui élimine les obstacles financiers et bancaires pour les
              créateurs, entrepreneurs, freelances et étudiants en Tunisie. Accédez aux meilleurs outils du monde
              en payant simplement en Dinars Tunisiens (TND).
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Service 100% opérationnel • Support réactif 7j/7</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Nos Outils & Offres
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#google-flow" className="hover:text-blue-400 transition-colors">
                  Google Flow & Google One
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-blue-400 transition-colors">
                  Microsoft Office 365
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-blue-400 transition-colors">
                  Shahid, Spotify, Prime & Apple TV+
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-blue-400 transition-colors">
                  Offres Packs Combinés
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition-colors">
                  Questions Fréquentes (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Paiement en Tunisie
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>D17 (Poste Tunisienne)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Flouci (Application mobile)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Virement / Versement CCP</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Agences bancaires locales</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Assistance Rapide
            </h4>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/21698765432"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+216 98 765 432</span>
              </a>
              <p className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@digipaiement.tn</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Tunis, Tunisie</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} DigiPaiement.tn — Fait avec passion en Tunisie 🇹🇳.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Activation directe sur votre email</span>
            <span>•</span>
            <span>Garantie 100% active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
