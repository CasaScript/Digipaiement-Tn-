import React, { useRef, useState } from 'react';
import {
  MousePointerClick,
  CreditCard,
  MailCheck,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  Film,
  Sparkles,
  Loader2,
  Smartphone,
} from 'lucide-react';
import {
  VIDEO_GUIDE_CHAPTERS,
  PAYMENT_RECIPIENTS,
  GuidePaymentMethod,
  PaymentGuideScript,
  getChapterForTime,
  getDefaultPaymentGuideScript,
  normalizePaymentGuideScript,
} from '../utils/videoGuide';

interface HowItWorksProps {
  onOpenOrderModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOrderModal }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>(VIDEO_GUIDE_CHAPTERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<GuidePaymentMethod>('Les deux');
  const [guideScript, setGuideScript] = useState<PaymentGuideScript>(() =>
    getDefaultPaymentGuideScript('Les deux')
  );
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const steps = [
    {
      step: '01',
      title: 'Choisissez votre outil & formule',
      subtitle: 'Sur mesure en Dinars (TND)',
      icon: MousePointerClick,
      color: 'from-blue-600 to-cyan-500',
      description:
        'Sélectionnez Google One (Gemini Plus, Flow & Veo), Microsoft Office 365, Shahid VIP, Spotify, Prime TV, Apple TV+ ou un Pack Combiné selon vos besoins (1 mois ou 3 mois).',
      highlight: 'Aucune démarche bancaire complexe',
    },
    {
      step: '02',
      title: 'Réglez simplement par D17 ou Flouci',
      subtitle: 'Transfert local immédiat',
      icon: CreditCard,
      color: 'from-cyan-500 to-indigo-600',
      description:
        'Effectuez un transfert depuis votre application D17 (Poste Tunisienne), votre compte Flouci ou par virement bancaire / CCP. Envoyez la capture du reçu en 1 clic.',
      highlight: 'Numéro D17 & Tag Flouci vérifiés',
    },
    {
      step: '03',
      title: 'Activation express sur votre email',
      subtitle: 'En 15 à 30 minutes chrono',
      icon: MailCheck,
      color: 'from-indigo-600 to-purple-600',
      description:
        'Votre compte personnel est mis à niveau automatiquement. Vous recevez l’invitation officielle et débloquez toutes les fonctionnalités premium immédiatement.',
      highlight: 'Garantie 100% sur toute la durée',
    },
  ];

  const handleSelectChapter = (chapterId: string, startSeconds: number) => {
    setActiveChapterId(chapterId);
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.currentTime = startSeconds;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore autoplay restriction errors if triggered outside direct gesture
        });
      }
    }
  };

  const handleTogglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } else {
      videoEl.pause();
    }
  };

  const handleVideoTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const chapter = getChapterForTime(videoEl.currentTime);
    if (chapter.id !== activeChapterId) {
      setActiveChapterId(chapter.id);
    }
  };

  const handleGenerateAiScript = async (method: GuidePaymentMethod) => {
    setSelectedMethod(method);
    setIsLoadingScript(true);
    setScriptError(null);

    try {
      const response = await fetch('/api/gemini/video-guide-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });

      if (!response.ok) {
        throw new Error('Impossible de charger le récapitulatif vidéo.');
      }

      const data = await response.json();
      setGuideScript(normalizePaymentGuideScript(data, method, Boolean(data?.isAiGenerated)));
    } catch {
      setScriptError('Mode hors-ligne : affichage du guide officiel vérifié.');
      setGuideScript(getDefaultPaymentGuideScript(method));
    } finally {
      setIsLoadingScript(false);
    }
  };

  const activeChapter =
    VIDEO_GUIDE_CHAPTERS.find((chapter) => chapter.id === activeChapterId) ||
    VIDEO_GUIDE_CHAPTERS[0];

  return (
    <section
      id="comment-ca-marche"
      className="py-20 bg-gradient-to-b from-[#080c14] via-[#0c1322] to-[#080c14] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Processus Clair & Transparent</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Comment activer votre abonnement en <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              3 étapes simples ?
            </span>
          </h2>

          <p className="text-base text-slate-300">
            Pas besoin de carte internationale, pas de plafond de dotation technologique dépassé, pas d’attente inutile.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-indigo-600/40 -translate-y-12 z-0 pointer-events-none" />

          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 flex flex-col justify-between bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl hover:border-slate-700 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black font-mono text-slate-700 group-hover:text-blue-500 transition-colors">
                      {item.step}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guide Vidéo Section */}
        <div
          id="guide-video"
          aria-labelledby="guide-video-heading"
          className="mt-16 rounded-3xl bg-slate-900/75 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guide Vidéo • D17 & Flouci</span>
              </div>
              <h3
                id="guide-video-heading"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                Guide Vidéo : Comment régler votre paiement par{' '}
                <span className="bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  D17 & Flouci
                </span>
              </h3>
              <p className="text-sm text-slate-300">
                Visualisez en 16 secondes le transfert local en Dinars Tunisiens (TND) et l’envoi de votre capture pour une activation immédiate.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                <span className="text-amber-300 font-bold">D17 Poste TN : </span>
                <span className="font-mono font-bold text-white">{PAYMENT_RECIPIENTS.d17Number}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                <span className="text-cyan-300 font-bold">Flouci : </span>
                <span className="font-mono font-bold text-white">{PAYMENT_RECIPIENTS.flouciTag}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Video Player Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl">
                <video
                  ref={videoRef}
                  src="/videos/guide-d17-flouci.mp4"
                  poster="/videos/guide-d17-flouci-poster.jpg"
                  controls
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  aria-label="Guide vidéo court expliquant le paiement par D17 et Flouci sur DigiPaiement.tn"
                  className="w-full aspect-video bg-slate-950 block"
                >
                  <track
                    kind="captions"
                    src="/videos/guide-d17-flouci.vtt"
                    srcLang="fr"
                    label="Français"
                  />
                  Votre navigateur ne prend pas en charge la lecture vidéo HTML5.
                </video>

                <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                      <span>{activeChapter.methodTag}</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-400">{activeChapter.timeRange}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-200">
                      {activeChapter.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Mettre en pause le guide vidéo' : 'Lire le guide vidéo'}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <PauseCircle className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        <span>Lire la vidéo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chapter Quick Jump Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {VIDEO_GUIDE_CHAPTERS.map((chapter) => {
                  const isActive = chapter.id === activeChapter.id;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => handleSelectChapter(chapter.id, chapter.startSeconds)}
                      aria-pressed={isActive}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="block font-mono text-[11px] font-bold text-cyan-400">
                        {chapter.timeRange}
                      </span>
                      <span className="block text-xs font-bold mt-0.5 leading-snug">
                        {chapter.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Script & Step-by-Step Recap Column */}
            <div className="lg:col-span-5 bg-slate-950/75 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Narration & Mémo IA</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-white mt-1">
                    {guideScript.title}
                  </h4>
                </div>
                <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
              </div>

              {/* Method Selector Buttons */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choisir la méthode de paiement à détailler">
                {(['Les deux', 'D17', 'Flouci'] as GuidePaymentMethod[]).map((method) => {
                  const active = selectedMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      disabled={isLoadingScript}
                      onClick={() => handleGenerateAiScript(method)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                      } disabled:opacity-60`}
                    >
                      {isLoadingScript && active ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{method === 'Les deux' ? 'D17 + Flouci' : `Guide ${method}`}</span>
                    </button>
                  );
                })}
              </div>

              {scriptError && (
                <p className="text-xs text-amber-300 bg-amber-950/50 border border-amber-500/30 rounded-lg px-3 py-2">
                  {scriptError}
                </p>
              )}

              {/* Voiceover Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Script explicatif</span>
                  <span className="text-emerald-400">
                    {guideScript.isAiGenerated ? 'Généré par IA' : 'Guide officiel'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  « {guideScript.voiceover} »
                </p>
              </div>

              {/* Numbered Checklist */}
              <ol className="space-y-2.5">
                {guideScript.steps.map((stepText, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{stepText}</span>
                  </li>
                ))}
              </ol>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-medium">{guideScript.recipientInfo}</span>
                <button
                  type="button"
                  onClick={onOpenOrderModal}
                  className="shrink-0 text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1"
                >
                  <span>Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Notre engagement de garantie totale</h4>
              <p className="text-xs text-slate-400">
                Tous vos abonnements sont garantis opérationnels pendant toute la durée payée. Remplacement immédiat en cas d’anomalie.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenOrderModal}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            <span>Lancer ma commande</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

