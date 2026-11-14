import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

interface HeroProps {
  onOpenOrderModal: (toolId?: string) => void;
  onOpenAdvisorModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, onOpenAdvisorModal }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28"
    >
      {/* Dynamic Parallax Background Glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-cyan-400/20 blur-[130px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mouseOffset.x * 1.5}px), ${mouseOffset.y * 1.5}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-[120px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * -1}px, ${mouseOffset.y * -1}px)`,
        }}
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Launching Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-950/50">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Lancement Officiel en Tunisie 🇹🇳</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400 font-bold">100% Paiement en Dinars (TND)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Vos abonnements <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                IA & Outils Premium
              </span>{' '}
              enfin accessibles en Dinars !
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Conçu pour les <strong className="text-white font-semibold">e-commerçants en Tunisie</strong> et les{' '}
              <strong className="text-white font-semibold">étudiants</strong> qui veulent{' '}
              <span className="text-cyan-300 font-semibold">upgrader leur potentiel digital</span> sans carte
              internationale : boostez vos vidéos, boutiques et projets avec{' '}
              <strong className="text-white font-semibold">Google One (Gemini Plus & Google Flow)</strong>,{' '}
              <strong className="text-white font-semibold">Microsoft Office 365</strong> et nos offres IA & streaming,
              activés en Dinars via <span className="text-blue-400 font-semibold">D17</span> ou{' '}
              <span className="text-cyan-400 font-semibold">Flouci</span>.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-300 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Email personnel 100% privé</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Activation 15 à 30 min</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Garantie totale incluse</span>
              </div>
            </div>

            {/* Actions / CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <button
                type="button"
                onClick={() => onOpenOrderModal('google-one')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Activer Google One & Flow en TND</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenAdvisorModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-blue-500/50 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span>Simuler mon besoin (IA)</span>
              </button>

              <a
                href="https://wa.me/21698765432?text=Bonjour%20DigiPaiement.tn%20!%20Je%20souhaite%20activer%20un%20abonnement%20en%20Dinars"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Express</span>
              </a>
            </div>

            {/* Payment Logos Pill */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Moyens de paiement acceptés :</span>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-white">D17</span>
                <span className="text-[10px] text-slate-400">(Poste Tunisienne)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="font-bold text-white">Flouci</span>
                <span className="text-[10px] text-slate-400">(Instantané)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-emerald-400">RIB / CCP</span>
                <span className="text-[10px] text-slate-400">Virement bancaire</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Poster with Parallax & Floating Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Parallax wrapper */}
            <div
              className="relative w-full max-w-md lg:max-w-none transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * 0.4}deg) rotateX(${
                  mouseOffset.y * -0.4
                }deg)`,
              }}
            >
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 animate-tilt"></div>

              {/* Main Card Frame with the Official Launch Poster */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
                {/* Header of mock card */}
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">digipaiement.tn/google-flow</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    En ligne
                  </span>
                </div>

                {/* Official User Visual Poster */}
                <div className="relative group overflow-hidden bg-slate-950">
                  <img
                    src="/assets/aistudio/1er_Pub__2__25f8f84a.png"
                    alt="DigiPaiement.tn - Abonnements Google One, Google Flow, Office 365 et Streaming en Dinars Tunisiens"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Bottom Quick Feature Highlights */}
                <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Google One + Flow</p>
                    <p className="text-sm font-extrabold text-blue-400">Dès 29 TND</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Délai moyen</p>
                    <p className="text-sm font-extrabold text-emerald-400">18 min</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Garantie</p>
                    <p className="text-sm font-extrabold text-indigo-400">100% Valide</p>
                  </div>
                </div>
              </div>

              {/* Parallax Floating Badge 1 (Top Left) */}
              <div
                className="absolute -top-5 -left-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-900/50 border border-white/20 hidden sm:flex items-center gap-3 backdrop-blur-md"
                style={{
                  transform: `translate(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px)`,
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-blue-200">Google Flow & Veo</p>
                  <p className="text-sm font-extrabold">Vidéo IA + 5 Proches</p>
                </div>
              </div>

              {/* Parallax Floating Badge 2 (Bottom Right) */}
              <div
                className="absolute -bottom-6 -right-6 bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 hidden sm:flex items-center gap-3 backdrop-blur-md"
                style={{
                  transform: `translate(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px)`,
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400 fill-current" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Paiement D17 & Flouci</p>
                  <p className="text-xs font-bold text-emerald-400">Zéro Carte Internationale</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
