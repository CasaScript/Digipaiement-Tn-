import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, MessageCircle, Zap, Package, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdminEmail } from '../utils/admin';

interface NavbarProps {
  onOpenOrderModal: (toolId?: string) => void;
  onOpenAdvisorModal: () => void;
  onOpenOrdersModal: () => void;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onOpenAdvisorModal,
  onOpenOrdersModal,
  onOpenAdminModal,
}) => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const isAdmin = isAdminEmail(user?.email);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Tarifs & Outils', href: '#tarifs' },
    { label: 'Comment ça marche ?', href: '#comment-ca-marche' },
    { label: 'Avis Clients', href: '#avis' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-xs py-2 px-4 text-center border-b border-blue-500/20 text-slate-200 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Service Actif 7j/7
        </span>
        <span className="hidden sm:inline text-slate-400">•</span>
        <span className="hidden sm:inline">Paiement 100% en Dinars Tunisiens (TND) via D17 & Flouci</span>
        <span className="hidden md:inline text-slate-400">•</span>
        <span className="hidden md:inline font-medium text-blue-300">Activation en 15 à 30 min sur votre email personnel</span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080c14]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/40 py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group shrink-0">
              <img
                src="/assets/aistudio/Digipaiement_logo_b890e884.png"
                alt="DigiPaiement.tn Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                  DigiPaiement<span className="text-blue-500">.tn</span>
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-white hover:text-blue-400 transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenAdvisorModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 hover:text-white transition-all shadow-sm whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Conseiller IA</span>
              </button>

              <button
                type="button"
                onClick={user ? onOpenOrdersModal : signInWithGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 text-slate-200 border border-slate-700 hover:border-blue-500/50 hover:text-white transition-all whitespace-nowrap"
                title={user ? `Connecté : ${user.email}` : 'Se connecter avec Google'}
              >
                {user ? (
                  <>
                    <Package className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mes Commandes</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>Connexion</span>
                  </>
                )}
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 hover:text-white transition-all whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin</span>
                </button>
              )}

              {user && (
                <button
                  type="button"
                  onClick={signOut}
                  aria-label="Se déconnecter"
                  title="Se déconnecter"
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenOrderModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Commander en TND</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenOrderModal()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
              >
                Commander
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Ouvrir le menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c1220] border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-blue-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tableau de bord Admin</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    onOpenOrdersModal();
                  } else {
                    signInWithGoogle();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-700"
              >
                {user ? <Package className="w-4 h-4 text-blue-400" /> : <LogIn className="w-4 h-4 text-blue-400" />}
                <span>{user ? 'Mes Commandes' : 'Se connecter avec Google'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdvisorModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-700/40"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Simulateur & Conseiller IA</span>
              </button>
              <a
                href="https://wa.me/21658570825"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-700/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter sur WhatsApp (+216 58 570 825)</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
