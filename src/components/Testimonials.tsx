import React from 'react';
import { Testimonial } from '../types';
import { Star, ShieldCheck, Quote, CheckCircle } from 'lucide-react';

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Yasmine C.',
    role: 'Créatrice de Contenu',
    city: 'La Marsa, Tunis',
    tool: 'Google One (3 mois)',
    avatar: 'YC',
    rating: 5,
    content:
      "Ma dotation technologique était déjà épuisée. J'ai envoyé 69 TND sur Flouci vers 14h10 et reçu mon accès Google One avec Gemini Plus et Google Flow & Veo à 14h32. Je crée maintenant mes vidéos Reels sans prise de tête.",
    date: 'Il y a 4 jours',
    paymentMethod: 'Flouci',
  },
  {
    id: '2',
    name: 'Ahmed Mansour',
    role: 'E-commerçant',
    city: 'Sousse',
    tool: 'Pack Pro & IA (42 TND/mois)',
    avatar: 'AM',
    rating: 5,
    content:
      "Google Flow m'aide énormément à générer des vidéos publicitaires dynamiques pour ma boutique en ligne, et Office 365 me sert au quotidien pour mes tableaux de stock. Activé via D17 en 25 minutes.",
    date: 'Il y a 1 semaine',
    paymentMethod: 'D17',
  },
  {
    id: '3',
    name: 'Nour B.',
    role: 'Étudiante en Mastère',
    city: 'Sfax',
    tool: 'Microsoft Office 365 (3 mois)',
    avatar: 'NB',
    rating: 5,
    content:
      "Pris pour 3 mois à 49 TND pour rédiger mon PFE sur Word et analyser mes données sur Excel. Transfert fait par D17, capture envoyée et compte activé dans la demi-heure sans jamais demander mon mot de passe.",
    date: 'Il y a 2 semaines',
    paymentMethod: 'D17',
  },
  {
    id: '4',
    name: 'Tarak Khemir',
    role: 'Gérant Agence Digitale',
    city: 'Les Berges du Lac, Tunis',
    tool: 'Google One + Partage 5 proches',
    avatar: 'TK',
    rating: 5,
    content:
      "Nous avons activé Google One pour l'équipe avec paiement par virement BIAT. Entre Gemini Plus pour les scripts et Google Flow & Veo pour les vidéos clients, le partage à 5 est ultra rentable.",
    date: 'Il y a 3 semaines',
    paymentMethod: 'Virement',
  },
  {
    id: '5',
    name: 'Salma G.',
    role: 'Boutique Instagram',
    city: 'Nabeul',
    tool: 'Google One (1 mois)',
    avatar: 'SG',
    rating: 4,
    content:
      "Un conseiller m'a guidée sur WhatsApp en 2 minutes pour démarrer avec Google Flow. Je produis maintenant des vidéos propres pour mes produits artisanaux en payant 29 TND via Flouci.",
    date: 'Il y a 1 mois',
    paymentMethod: 'Flouci',
  },
  {
    id: '6',
    name: 'Bilel Riahi',
    role: 'Développeur Web',
    city: 'Ariana',
    tool: 'Pack Divertissement (25 TND/mois)',
    avatar: 'BR',
    rating: 5,
    content:
      "Spotify + Shahid réunis pour 25 TND/mois au lieu de payer en devises. Tarif cohérent en dinars et activé via D17 en une vingtaine de minutes.",
    date: 'Il y a 1 mois',
    paymentMethod: 'D17',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="avis" className="py-20 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Retours 100% Authentiques</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Ce que disent les créateurs et <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              professionnels tunisiens
            </span>
          </h2>

          <p className="text-base text-slate-300">
            Plus de 1 450 abonnés satisfaits dans tout le pays font confiance à DigiPaiement.tn pour leurs outils
            stratégiques quotidiens.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all duration-300 hover:shadow-2xl relative group"
            >
              <div>
                {/* Header of review */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 group-hover:border-blue-500/60 transition-colors flex items-center justify-center text-xs font-bold text-blue-300 tracking-wide shrink-0"
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {review.name}
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      </h4>
                      <p className="text-xs text-slate-400">{review.role}</p>
                      <p className="text-[11px] text-blue-400 font-medium">{review.city}</p>
                    </div>
                  </div>

                  <Quote className="w-5 h-5 text-slate-700 group-hover:text-blue-500/40 transition-colors shrink-0" />
                </div>

                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1" aria-label={`Note ${review.rating} sur 5`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">{review.date}</span>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  "{review.content}"
                </p>
              </div>

              {/* Bottom Badges */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                  {review.tool}
                </span>

                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  Payé via <strong className="text-white">{review.paymentMethod}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">4.9 / 5</p>
            <p className="text-xs text-slate-400 mt-1">Note moyenne de satisfaction</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">+1 450</p>
            <p className="text-xs text-slate-400 mt-1">Abonnements activés</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">18 min</p>
            <p className="text-xs text-slate-400 mt-1">Temps moyen d'activation</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Garantie & Support WhatsApp</p>
          </div>
        </div>

      </div>
    </section>
  );
};
