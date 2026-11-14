import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  ShoppingBag,
  Users,
  Wand2,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clapperboard,
  TrendingUp,
} from 'lucide-react';

interface CanvaProSpotlightProps {
  onOpenOrderModal: (toolId?: string) => void;
}

export const CanvaProSpotlight: React.FC<CanvaProSpotlightProps> = ({ onOpenOrderModal }) => {
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'creators' | 'gemini' | 'sharing'>('ecommerce');

  const googleFlowFeatures = [
    {
      id: 'ecommerce',
      title: 'Vidéos Publicitaires E-commerce',
      badge: 'Pour E-commerçants',
      icon: ShoppingBag,
      description:
        'Transformez vos produits et idées marketing en vidéos publicitaires ultra-réalistes pour Facebook Ads, Instagram Reels et TikTok sans studio ni tournage.',
      details:
        'Idéal pour augmenter le taux de clic (CTR) de vos boutiques en Tunisie et présenter vos articles sous leur meilleur angle.',
    },
    {
      id: 'creators',
      title: 'Cinéma IA avec Google Flow & Veo',
      badge: 'Pour Créateurs de Contenu',
      icon: Clapperboard,
      description:
        'Créez des séquences vidéo fluides, des transitions soignées et des plans cinématiques cohérents grâce au moteur Google Flow propulsé par Veo.',
      details:
        'Gardez la continuité de vos personnages, décors et éclairages pour vos Reels, Shorts et vidéos YouTube.',
    },
    {
      id: 'gemini',
      title: 'Gemini Plus pour Scripts & Prompts',
      badge: 'Productivité IA',
      icon: Wand2,
      description:
        'Rédigez vos hooks viraux, descriptions produits e-commerce et prompts vidéo Google Flow directement dans votre suite Google.',
      details:
        'Passez de l’idée de campagne au script puis à la vidéo finale en quelques minutes seulement.',
    },
    {
      id: 'sharing',
      title: 'Partage Inclus jusqu’à 5 Proches',
      badge: '29 TND / mois',
      icon: Users,
      description:
        'Un seul abonnement Google One inclut Gemini Plus, Google Flow & Veo et le partage jusqu’à 5 membres de votre équipe ou famille.',
      details:
        'Formule disponible à 29 TND pour 1 mois, 69 TND pour 3 mois, ou dans le Pack Pro & IA à 42 TND/mois.',
    },
  ];

  return (
    <section
      id="google-flow"
      className="py-20 bg-gradient-to-b from-[#080c14] via-[#0c1322] to-[#080c14] relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Focus Création Vidéo IA : Google One + Flow & Veo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Pourquoi <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Google Flow</span> est indispensable pour les créateurs & e-commerçants
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Inclus dans notre abonnement <strong className="text-white">Google One (Gemini Plus • Partage 5 proches • Google Flow & Veo)</strong>,
            cet outil révolutionne la production de vidéos publicitaires, Reels et contenus à forte conversion en Dinars Tunisiens.
          </p>
        </div>

        {/* Feature Interactive Showcase Tabs */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Feature List (Left) */}
          <div className="lg:col-span-5 space-y-3">
            {googleFlowFeatures.map((feat) => {
              const Icon = feat.icon;
              const isSelected = activeTab === feat.id;
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => setActiveTab(feat.id as typeof activeTab)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    isSelected
                      ? 'bg-slate-900/90 border-blue-500/80 shadow-xl shadow-blue-500/10 scale-[1.01]'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {feat.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40 shrink-0">
                        {feat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">{feat.description}</p>
                    {isSelected && (
                      <p className="text-xs text-blue-300 font-medium mt-2 flex items-start gap-1.5 animate-in fade-in">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat.details}</span>
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Quick Order Strip */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenOrderModal('google-one')}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Activer Google One (Flow & Veo) dès 29 TND</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Feature Visual Preview (Right) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
              {/* Top Controls Mockup */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  <span className="text-xs text-slate-400 font-mono ml-2">
                    Google Flow & Veo • Workspace Actif
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Gemini Plus Inclus
                </span>
              </div>

              {activeTab === 'ecommerce' && (
                <div className="space-y-4">
                  <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                    <div className="relative z-10 text-center px-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-xl shadow-blue-600/40 text-white mb-3">
                        <Video className="w-10 h-10" />
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        Vidéos E-commerce à Forte Conversion
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                        Mettez en scène vos vêtements, cosmétiques ou gadgets en mouvement pour vos campagnes
                        sponsorisées en Tunisie sans payer de tournage vidéo.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                          Tournage classique : Coûteux & lent
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Avec Google Flow : Créatives prêtes en minutes ⚡
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'creators' && (
                <div className="h-64 sm:h-72 rounded-xl bg-slate-950/70 border border-slate-800 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Pipeline Créateur • Scènes Flow & Veo
                      </span>
                      <span className="text-[11px] text-cyan-400 font-semibold">Rendu Cinématique</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-[10px] text-blue-400 font-bold uppercase">Plan 01 • Hook</p>
                        <p className="text-xs text-white font-semibold mt-1">Ouverture 3 sec</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Caméra dynamique</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40">
                        <p className="text-[10px] text-cyan-400 font-bold uppercase">Plan 02 • Démo</p>
                        <p className="text-xs text-white font-semibold mt-1">Produit en action</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Continuité visuelle</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">Plan 03 • CTA</p>
                        <p className="text-xs text-white font-semibold mt-1">Format 9:16 & 16:9</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Prêt pour Reels/TikTok</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-2">
                    <span>Idéal pour créateurs TikTok, Reels, YouTube Shorts & UGC</span>
                    <span className="text-emerald-400 font-bold shrink-0">Engagement x3</span>
                  </div>
                </div>
              )}

              {activeTab === 'gemini' && (
                <div className="h-64 sm:h-72 rounded-xl bg-slate-950/70 border border-slate-800 p-5 flex flex-col justify-center text-center">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <div className="h-20 rounded-lg bg-blue-950/40 border border-blue-900/50 flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-extrabold text-blue-400">Scripts Ads</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Hooks TikTok/FB</span>
                    </div>
                    <div className="h-20 rounded-lg bg-indigo-950/40 border border-indigo-900/50 flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-extrabold text-indigo-400">Fiches Produits</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Copywriting</span>
                    </div>
                    <div className="h-20 rounded-lg bg-cyan-950/40 border border-cyan-900/50 flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-extrabold text-cyan-400">Google Flow</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Scènes IA Veo</span>
                    </div>
                    <div className="h-20 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-extrabold text-emerald-400">Gemini Plus</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Productivité</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Combinez la puissance rédactionnelle de Gemini Plus et la génération vidéo de Google Flow & Veo
                    dans un seul abonnement payable en Dinars.
                  </p>
                </div>
              )}

              {activeTab === 'sharing' && (
                <div className="h-64 sm:h-72 rounded-xl bg-slate-950/70 border border-slate-800 p-5 flex flex-col items-center justify-center text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Partage jusqu’à 5 proches inclus</span>
                  </div>
                  <h5 className="text-lg font-bold text-white">
                    Rentabilisez votre abonnement à plusieurs
                  </h5>
                  <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
                    Avec Google One à <strong className="text-white">29 TND/mois</strong> (ou{' '}
                    <strong className="text-white">69 TND / 3 mois</strong>), partagez les avantages avec jusqu’à 5
                    membres de votre famille, équipe e-commerce ou binômes étudiants.
                  </p>
                </div>
              )}

              {/* Bottom Guarantee Banner */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Activation officielle sur votre compte Google
                </span>
                <span className="text-slate-300 font-semibold">
                  29 TND / mois • 69 TND / 3 mois
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table: Importance of Google Flow for Creators & E-commerce */}
        <div className="mt-16 rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white text-center mb-2">
              L'importance de Google Flow (Google One) pour les créateurs & e-commerçants
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 text-center mb-6 max-w-2xl mx-auto">
              Comparatif concret entre la création traditionnelle et l'accélération vidéo IA avec Google Flow & Veo
              payable en Dinars Tunisiens.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Besoin Créateur & E-commerce</th>
                    <th className="pb-4 font-semibold text-center text-slate-500">Sans Google Flow</th>
                    <th className="pb-4 font-semibold text-center text-blue-400">
                      Google Flow + Veo (Google One)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-3.5 font-medium text-slate-200">
                      Vidéos publicitaires (Facebook Ads, TikTok, Reels)
                    </td>
                    <td className="py-3.5 text-center text-red-400">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Tournage long & budget agence élevé
                      </span>
                    </td>
                    <td className="py-3.5 text-center text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Scènes vidéo IA prêtes pour convertir
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-200">
                      Mise en valeur des produits e-commerce
                    </td>
                    <td className="py-3.5 text-center text-slate-400">
                      Photos statiques vues et revues
                    </td>
                    <td className="py-3.5 text-center text-blue-400 font-semibold">
                      Mises en scène animées haute rétention
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-200">
                      Rédaction de scripts, hooks & fiches produits
                    </td>
                    <td className="py-3.5 text-center text-slate-500">Plusieurs heures de rédaction</td>
                    <td className="py-3.5 text-center text-emerald-400 font-semibold">
                      Gemini Plus intégré pour vos campagnes
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-200">
                      Collaboration équipe / associés / proches
                    </td>
                    <td className="py-3.5 text-center text-red-400">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Compte individuel isolé
                      </span>
                    </td>
                    <td className="py-3.5 text-center text-blue-400 font-semibold">
                      Partage inclus jusqu’à 5 proches
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-200">Moyen de paiement en Tunisie</td>
                    <td className="py-3.5 text-center text-slate-400">Carte internationale en devises</td>
                    <td className="py-3.5 text-center font-bold text-emerald-400">
                      🇹🇳 100% Dinars (D17, Flouci, Virement)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-200">Tarif transparent DigiPaiement.tn</td>
                    <td className="py-3.5 text-center text-slate-500">Frais de change & dotation limitée</td>
                    <td className="py-3.5 text-center text-indigo-300 font-bold">
                      29 TND / mois • 69 TND / 3 mois (Pack Pro & IA : 42 TND/mois)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => onOpenOrderModal('google-one')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Activer Google One & Google Flow dès 29 TND</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
