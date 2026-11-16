import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle, Clock, CheckCircle2, AlertCircle, ShieldCheck, LogIn } from 'lucide-react';
import { isValidEmail, isValidTunisianPhone } from '../utils/pricing';
import { useAuth } from '../context/AuthContext';

export const ContactSection: React.FC = () => {
  const { user, signInWithGoogle, getFreshToken } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Renseignement abonnement',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Veuillez saisir votre nom complet.' });
      return;
    }

    if (!isValidEmail(formData.email)) {
      setStatus({ type: 'error', message: 'Veuillez saisir une adresse e-mail valide.' });
      return;
    }

    if (formData.phone && !isValidTunisianPhone(formData.phone)) {
      setStatus({
        type: 'error',
        message: 'Veuillez renseigner un numéro de téléphone tunisien valide (8 chiffres ex : 98 765 432).',
      });
      return;
    }

    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Veuillez rédiger votre message.' });
      return;
    }

    setLoading(true);

    try {
      let idToken = await getFreshToken();
      if (!idToken) {
        idToken = await signInWithGoogle();
      }
      if (!idToken) {
        setStatus({
          type: 'error',
          message: 'Veuillez vous connecter avec Google pour enregistrer votre message.',
        });
        setLoading(false);
        return;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur lors de l’envoi');

      setStatus({
        type: 'success',
        message:
          'Merci ! Votre message a bien été transmis. Notre équipe basée à Tunis vous répondra sous 30 minutes.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Renseignement abonnement',
        message: '',
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message:
          'Une erreur est survenue lors de la transmission. Vous pouvez également nous contacter directement sur WhatsApp.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-[#080c14] via-[#0c1220] to-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30">
            <Mail className="w-3.5 h-3.5" />
            <span>Support & Contact Direct</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Une question ou un besoin précis ? <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Contactez l'équipe DigiPaiement.tn
            </span>
          </h2>

          <p className="text-base text-slate-300">
            Nous répondons rapidement pour vous conseiller, valider vos paiements ou vous guider dans l'activation
            immédiate de votre abonnement.
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Information & Channels (Left) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white">Canaux de support directs</h3>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/21658570825?text=Bonjour%20DigiPaiement.tn%20!%20J'ai%20une%20question%20concernant%20les%20abonnements"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      WhatsApp Express (Recommandé)
                    </h4>
                    <p className="text-xs text-slate-300">+216 58 570 825</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">Réponse en moins de 15 min</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">Ouvrir →</span>
              </a>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 text-xs text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Email officiel</p>
                    <p className="text-sm font-bold text-white">contact@digipaiement.tn</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Disponibilité du service</p>
                    <p className="text-sm font-bold text-white">7 jours sur 7 • 08:30 - 23:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Siège & Couverture</p>
                    <p className="text-sm font-bold text-white">Tunis, Tunisie (Service 100% digital national)</p>
                  </div>
                </div>
              </div>

              {/* Guarantee Reassurance */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Tous les abonnements sont garantis avec support continu et assistance d'activation.</span>
              </div>
            </div>

          </div>

          {/* Integrated Contact Form (Right) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-2">Envoyez-nous un message</h3>
              <p className="text-xs text-slate-400 mb-6">
                Remplissez ce formulaire et nous vous recontacterons avec toutes les informations nécessaires.
              </p>

              {status && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/60 border border-red-500/40 text-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nom & Prénom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex : Mohamed Trabelsi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Numéro de Téléphone (Tunisie)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex : 98 765 432"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adresse Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre.email@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Objet de votre demande
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Renseignement abonnement">Renseignement abonnement Google One / Flow / IA</option>
                      <option value="Aide paiement D17 / Flouci">Aide paiement D17 ou Flouci</option>
                      <option value="Demande formule sur-mesure agence">Formule entreprise / agence</option>
                      <option value="Support technique activation">Support technique & activation</option>
                      <option value="Autre question">Autre question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Votre message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Dites-nous quel outil vous intéresse ou posez votre question..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {!user && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-300">
                      Connexion Google requise pour transmettre et suivre votre demande.
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer mon message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
