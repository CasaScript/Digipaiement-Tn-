import React, { useState, useMemo } from 'react';
import {
  FAQ_CATEGORIES,
  FAQ_LIST,
  FAQCategory,
  filterFAQs,
} from '../utils/faqData';
import {
  HelpCircle,
  Search,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Wand2,
  CreditCard,
  Coins,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  PhoneCall,
  Clock,
} from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['how-1', 'tools-1', 'pay-1']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    return filterFAQs(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const getCategoryIcon = (catId: FAQCategory) => {
    switch (catId) {
      case 'how-it-works':
        return <Layers className="w-3.5 h-3.5" />;
      case 'supported-tools':
        return <Wand2 className="w-3.5 h-3.5" />;
      case 'payment-methods':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'currency-tnd':
        return <Coins className="w-3.5 h-3.5" />;
      case 'subscription-management':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'customer-support':
        return <Headphones className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="faq" className="py-20 bg-[#080c14] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Centre d'Aide & Questions Fréquentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Tout comprendre sur <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              DigiPaiement.tn & vos abonnements
            </span>
          </h2>

          <p className="text-base text-slate-300">
            Fonctionnement du service, outils supportés, paiement en Dinars (TND), gestion et garanties : retrouvez
            toutes les réponses détaillées en toute transparence.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question (ex : D17, Flouci, Google Flow, Office 365, garantie...)"
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 text-sm text-slate-100 placeholder-slate-500 rounded-2xl pl-12 pr-10 py-3.5 shadow-xl transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? FAQ_LIST.length
                : FAQ_LIST.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/25 scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-10 space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-base font-bold text-white">Aucune question ne correspond à votre recherche</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Vous n'avez pas trouvé ce que vous cherchiez ? Notre équipe est connectée sur WhatsApp pour vous
                répondre en direct en quelques minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-semibold text-blue-400 hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = openIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-blue-500/50 shadow-xl shadow-blue-950/30'
                      : 'bg-slate-900/50 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 flex-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-slate-700/60 mb-1">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 mt-1 ${
                        isOpen
                          ? 'rotate-180 bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-800/70 animate-in fade-in space-y-4">
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>

                      {/* Highlight Badges */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {item.highlights.map((badge, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Customer Support Reassurance Card at the bottom of FAQ */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Support Client Disponible en Direct</span>
            </div>
            <h4 className="text-xl font-extrabold text-white">
              Vous avez une question qui n'est pas répertoriée ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Notre équipe technique et nos conseillers basés à Tunis sont disponibles 7j/7 de 08:30 à 23:30.
              Nous vous répondons sur WhatsApp en moins de 15 minutes.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/21658570825?text=Bonjour%20DigiPaiement.tn%20!%20J'ai%20une%20question%20concernant%20mon%20abonnement"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-400/20 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Poser ma question sur WhatsApp</span>
            </a>

            <a
              href="mailto:contact@digipaiement.tn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <span>contact@digipaiement.tn</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
