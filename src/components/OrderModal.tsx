import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CATALOG_TOOLS,
  DurationOption,
  calculateSubscriptionPrice,
  supportsDuration,
  isValidEmail,
  isValidTunisianPhone,
  generateWhatsAppLink,
} from '../utils/pricing';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  MessageCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultToolId?: string;
}

const resolveInitialToolId = (toolId?: string): string => {
  if (toolId && CATALOG_TOOLS.some((t) => t.id === toolId)) {
    return toolId;
  }
  return CATALOG_TOOLS[0].id;
};

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, defaultToolId }) => {
  const { user, signInWithGoogle, getFreshToken, authError } = useAuth();
  const [selectedToolId, setSelectedToolId] = useState<string>(() => resolveInitialToolId(defaultToolId));
  const [duration, setDuration] = useState<DurationOption>('1 mois');
  const [paymentMethod, setPaymentMethod] = useState<'D17' | 'Flouci' | 'Virement'>('D17');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    setSelectedToolId(resolveInitialToolId(defaultToolId));
  }, [defaultToolId]);

  useEffect(() => {
    const tool = CATALOG_TOOLS.find((t) => t.id === selectedToolId);
    if (tool && !supportsDuration(tool, duration)) {
      setDuration('1 mois');
    }
  }, [selectedToolId, duration]);

  useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.displayName || '');
      setEmail((prev) => prev || user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const currentTool = CATALOG_TOOLS.find((t) => t.id === selectedToolId) || CATALOG_TOOLS[0];
  const effectiveDuration: DurationOption = supportsDuration(currentTool, duration) ? duration : '1 mois';
  const totalPrice = calculateSubscriptionPrice(currentTool.id, effectiveDuration);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Veuillez renseigner une adresse email valide pour la réception de votre accès.');
      return;
    }

    if (!isValidTunisianPhone(phone)) {
      setError('Veuillez saisir un numéro de téléphone tunisien valide (8 chiffres).');
      return;
    }

    setLoading(true);

    try {
      let idToken = await getFreshToken();
      if (!idToken) {
        idToken = await signInWithGoogle();
      }
      if (!idToken) {
        setError('Veuillez vous connecter avec Google pour enregistrer et suivre votre commande.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          tool: currentTool.name,
          planDuration: effectiveDuration,
          paymentMethod,
          priceTnd: totalPrice,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la commande');

      setOrderResult(data);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue lors du traitement.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setOrderResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0c1220] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {orderResult ? 'Commande Enregistrée ! 🚀' : 'Commander votre abonnement'}
              </h3>
              <p className="text-xs text-slate-300">
                Paiement 100% en Dinars Tunisiens (TND) • Activation en 15-30 min
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!orderResult ? (
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              
              {/* Tool Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Outil ou Pack souhaité
                </label>
                <select
                  value={selectedToolId}
                  onChange={(e) => setSelectedToolId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {CATALOG_TOOLS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. Durée de l'abonnement
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['1 mois', '3 mois'] as DurationOption[]).map((d) => {
                    const isAvailable = supportsDuration(currentTool, d);
                    const isSelected = effectiveDuration === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => isAvailable && setDuration(d)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                          !isAvailable
                            ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                            : isSelected
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {d}
                        {d === '3 mois' && (
                          <span
                            className={`block text-[9px] font-normal ${
                              isAvailable ? 'text-emerald-300' : 'text-slate-600'
                            }`}
                          >
                            {isAvailable ? 'Tarif économique' : 'Offre mensuelle uniquement'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total à payer en Tunisie :</span>
                  <div className="text-2xl font-black text-white">
                    {totalPrice} <span className="text-blue-400 text-sm font-bold">TND</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Zéro frais de change
                </span>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom & Prénom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex : Mohamed Trabelsi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone (Tunisie) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98 765 432"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adresse e-mail d'activation <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.adresse@gmail.com (votre propre compte)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  L'invitation officielle ou la clé d'activation sera envoyée sur cette adresse personnelle.
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Moyen de paiement en Dinars :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'D17', label: 'D17 Poste', sub: 'Mobile & Bureau' },
                    { id: 'Flouci', label: 'Flouci', sub: 'Instantané' },
                    { id: 'Virement', label: 'Virement', sub: 'Bancaire / CCP' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-colors ${
                        paymentMethod === m.id
                          ? 'bg-indigo-950/60 border-indigo-400 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs">{m.label}</p>
                      <p className="text-[10px] text-slate-400">{m.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {!user && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-300">
                    Connectez votre compte Google pour sauvegarder et suivre vos commandes.
                  </span>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google</span>
                  </button>
                </div>
              )}

              {(error || authError) && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error || authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Génération de la commande...</span>
                ) : (
                  <>
                    <span>Valider ma commande ({totalPrice} TND)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Order Success & Payment Instructions Screen */
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  Commande #{orderResult.order.id} Enregistrée !
                </h4>
                <p className="text-xs text-slate-300">
                  Pour finaliser l'activation sous 15-30 minutes, effectuez le transfert de{' '}
                  <strong className="text-white font-bold">{orderResult.order.priceTnd} TND</strong> via{' '}
                  <strong className="text-emerald-400 font-bold">{orderResult.order.paymentMethod}</strong>.
                </p>
              </div>

              {/* Specific Payment Credentials Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Coordonnées de paiement officiel :
                </p>

                {orderResult.order.paymentMethod === 'D17' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Numéro Téléphone D17 :</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {orderResult.paymentDetails.d17.number}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderResult.paymentDetails.d17.number, 'd17')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedField === 'd17' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {orderResult.paymentDetails.d17.instructions}
                    </p>
                  </div>
                )}

                {orderResult.order.paymentMethod === 'Flouci' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tag Flouci officiel :</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {orderResult.paymentDetails.flouci.tag}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderResult.paymentDetails.flouci.tag, 'flouci')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedField === 'flouci' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {orderResult.paymentDetails.flouci.instructions}
                    </p>
                  </div>
                )}

                {orderResult.order.paymentMethod === 'Virement' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">RIB / CCP :</span>
                        <span className="text-xs font-mono font-bold text-white">
                          {orderResult.paymentDetails.virement.rib}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderResult.paymentDetails.virement.rib, 'rib')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedField === 'rib' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {orderResult.paymentDetails.virement.instructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Confirmation Button */}
              <div className="space-y-2">
                <a
                  href={orderResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-400/20 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer mon reçu sur WhatsApp (Validation Rapide)</span>
                </a>
                <p className="text-center text-[10px] text-slate-400">
                  Vous pouvez aussi envoyer une capture de votre reçu directement au +216 58 570 825
                </p>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Terminer et fermer la fenêtre
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Garantie totale sur toute la durée de l'abonnement
          </span>
          <span className="font-semibold text-blue-400">DigiPaiement.tn</span>
        </div>

      </div>
    </div>
  );
};
