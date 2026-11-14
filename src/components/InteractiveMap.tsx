import React from 'react';
import { MapPin } from 'lucide-react';

interface InteractiveMapProps {
  onOpenOrderModal?: (toolId?: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = () => {
  return (
    <section id="carte-tunisie" className="py-20 bg-[#080c14] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Présence & Couverture 100% Nationale</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Une passerelle active dans les <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              24 gouvernorats de Tunisie
            </span>
          </h2>

          <p className="text-base text-slate-300">
            Que vous soyez à Tunis, Sousse, Sfax, Bizerte ou Djerba, réglez vos abonnements instantanément avec vos
            applications locales habituelles (D17 & Flouci) sans vous déplacer.
          </p>
        </div>
      </div>
    </section>
  );
};
