import React, { useState } from 'react';
import {
  CATALOG_TOOLS,
  DurationOption,
  ToolCategory,
  calculateSubscriptionPrice,
  calculateMonthlyEquivalent,
  supportsDuration,
} from '../utils/pricing';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck, Tag, Layers } from 'lucide-react';

interface CatalogSectionProps {
  onOpenOrderModal: (toolId?: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ onOpenOrderModal }) => {
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>('1 mois');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ToolCategory>('all');

  const individualTools = CATALOG_TOOLS.filter((t) => {
    if (t.category === 'packs') return false;
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const packTools = CATALOG_TOOLS.filter((t) => {
    if (t.category !== 'packs') return false;
    return selectedCategory === 'all' || selectedCategory === 'packs';
  });

  return (
    <section id="tarifs" className="py-20 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>Grille Tarifaire Officielle en Dinars (TND)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Vos abonnements premium, <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              payables en Dinars Tunisiens
            </span>
          </h2>

          <p className="text-base text-slate-300">
            Tarifs nets en TND via D17, Flouci ou Virement bancaire. Choisissez votre formule 1 mois, 3 mois ou nos
            packs combinés à prix réduit.
          </p>

          {/* Duration Selector Tabs */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => setSelectedDuration('1 mois')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedDuration === '1 mois'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Mois
              </button>
              <button
                type="button"
                onClick={() => setSelectedDuration('3 mois')}
                className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedDuration === '3 mois'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3 Mois
                <span className="ml-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-full">
                  Économique
                </span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'Tous les services' },
              { id: 'ai-productivity', label: 'IA & Productivité' },
              { id: 'streaming-music', label: 'Streaming & Musique' },
              { id: 'packs', label: 'Offres Packs Combinés' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as 'all' | ToolCategory)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-white border-blue-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Individual Services Grid */}
        {individualTools.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {individualTools.map((tool) => {
              const totalPrice = calculateSubscriptionPrice(tool.id, selectedDuration);
              const monthlyEquiv = calculateMonthlyEquivalent(tool.id, selectedDuration);
              const altPrice =
                selectedDuration === '1 mois' ? tool.quarterlyTnd : tool.monthlyTnd;
              const altLabel = selectedDuration === '1 mois' ? '3 mois' : '1 mois';

              return (
                <div
                  key={tool.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-300 border ${
                    tool.featured
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-blue-950/30 border-blue-500/60 shadow-2xl shadow-blue-950/40 hover:border-blue-400'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  {tool.badge && (
                    <div className="absolute -top-3 left-6">
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-white/20">
                        {tool.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between mt-1">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{tool.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">{tool.description}</p>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                          {totalPrice}
                        </span>
                        <span className="text-sm font-bold text-blue-400 ml-1.5">TND</span>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          pour {selectedDuration}
                        </span>
                      </div>

                      <div className="text-right">
                        {selectedDuration === '3 mois' ? (
                          <>
                            <span className="text-xs text-slate-400">Soit env.</span>
                            <p className="text-sm font-bold text-emerald-400">
                              {monthlyEquiv} TND/mois
                            </p>
                          </>
                        ) : (
                          altPrice && (
                            <>
                              <span className="text-xs text-slate-400">Formule {altLabel}</span>
                              <p className="text-sm font-bold text-blue-300">{altPrice} TND</p>
                            </>
                          )
                        )}
                      </div>
                    </div>

                    {/* Key Benefits List */}
                    <div className="mt-6 space-y-2.5">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Inclus dans la formule :
                      </p>
                      {tool.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Order CTA */}
                  <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-3">
                    <button
                      type="button"
                      onClick={() => onOpenOrderModal(tool.id)}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        tool.featured
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Commander ({tool.name})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Activation 15-30 min en TND</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Offres Packs Combinés */}
        {packTools.length > 0 && (
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-500/40 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-400">
                  <Layers className="w-4 h-4" />
                  <span>Offres Packs Combinés</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Combinez vos abonnements et payez moins cher chaque mois
                </h3>
              </div>
              <span className="self-start sm:self-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Tarifs mensuels sans engagement
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packTools.map((pack) => {
                const effectiveDuration = supportsDuration(pack, selectedDuration)
                  ? selectedDuration
                  : '1 mois';
                const packPrice = calculateSubscriptionPrice(pack.id, effectiveDuration);

                return (
                  <div
                    key={pack.id}
                    className="flex flex-col justify-between rounded-2xl p-6 bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30 mb-2">
                            {pack.badge}
                          </span>
                          <h4 className="text-xl font-bold text-white">{pack.name}</h4>
                          <p className="text-sm text-blue-300 font-medium mt-0.5">{pack.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-3xl font-extrabold text-white">
                            {packPrice} <span className="text-sm font-bold text-blue-400">TND</span>
                          </div>
                          <span className="text-xs text-slate-400">/ mois</span>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        {pack.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenOrderModal(pack.id)}
                      className="mt-6 w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Commander le {pack.name} ({packPrice} TND/mois)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Agency & Multi-Pack Callout */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Besoin de plusieurs comptes ou d'une offre agence / équipe ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Nous activons des packs sur-mesure pour e-commerçants, agences, freelances et étudiants avec paiement
              local D17, Flouci ou Virement bancaire.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://wa.me/21698765432?text=Bonjour%20DigiPaiement.tn%20!%20Je%20souhaite%20un%20devis%20pour%20plusieurs%20abonnements"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>Contacter le support B2B / WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
