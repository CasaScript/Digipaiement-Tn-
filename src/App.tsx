import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CanvaProSpotlight } from './components/CanvaProSpotlight';
import { CatalogSection } from './components/CatalogSection';
import { HowItWorks } from './components/HowItWorks';
import { InteractiveMap } from './components/InteractiveMap';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { OrdersModal } from './components/OrdersModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isAdminEmail } from './utils/admin';
import { MessageCircle, Sparkles } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | undefined>('google-one');
  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' && isAdminEmail(user?.email)) {
      setAdminModalOpen(true);
    }
  }, [user]);

  const handleOpenOrderModal = (toolId?: string) => {
    if (toolId) {
      setSelectedToolId(toolId);
    }
    setOrderModalOpen(true);
  };

  const handleSelectRecommendedTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenOrderModal={handleOpenOrderModal}
        onOpenAdvisorModal={() => setAdvisorModalOpen(true)}
        onOpenOrdersModal={() => setOrdersModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Parallax Hero Section */}
        <Hero
          onOpenOrderModal={handleOpenOrderModal}
          onOpenAdvisorModal={() => setAdvisorModalOpen(true)}
        />

        {/* Live Reassurance Banner */}
        <section className="bg-slate-900/60 border-y border-slate-800/80 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</p>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">En Dinars Tunisiens (TND)</p>
                <p className="text-[11px] text-slate-500">Zéro carte internationale</p>
              </div>
              <div className="p-3">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">15-30 min</p>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">Activation Express</p>
                <p className="text-[11px] text-slate-500">Directe sur votre email</p>
              </div>
              <div className="p-3">
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">D17 & Flouci</p>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">Paiements Simples</p>
                <p className="text-[11px] text-slate-500">+ Virement bancaire / CCP</p>
              </div>
              <div className="p-3">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">Garantie Totale</p>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">Support Réactif 7j/7</p>
                <p className="text-[11px] text-slate-500">Assistance basée à Tunis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Focus Feature: Canva Pro Spotlight */}
        <CanvaProSpotlight onOpenOrderModal={handleOpenOrderModal} />

        {/* Complete Catalog & Pricing Section */}
        <CatalogSection onOpenOrderModal={handleOpenOrderModal} />

        {/* 3-Step Guide: How It Works */}
        <HowItWorks onOpenOrderModal={() => handleOpenOrderModal('google-one')} />

        {/* Interactive Map of Tunisia */}
        <InteractiveMap onOpenOrderModal={handleOpenOrderModal} />

        {/* Customer Testimonials */}
        <Testimonials />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Contact Form & Channels */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <button
          type="button"
          onClick={() => setAdvisorModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold bg-indigo-900/90 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 shadow-xl backdrop-blur-md transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simulateur IA</span>
        </button>

        <a
          href="https://wa.me/21698765432?text=Bonjour%20DigiPaiement.tn%20!%20Je%20souhaite%20commander%20un%20abonnement"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-3 rounded-full font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">Assistance WhatsApp</span>
        </a>
      </div>

      {/* Order & Checkout Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        defaultToolId={selectedToolId}
      />

        {/* Gemini AI Advisor Modal */}
        <GeminiAdvisor
          isOpen={advisorModalOpen}
          onClose={() => setAdvisorModalOpen(false)}
          onSelectRecommendedTool={handleSelectRecommendedTool}
        />

      {/* Orders History Modal */}
      <OrdersModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
        onOpenNewOrder={() => handleOpenOrderModal()}
      />

      {/* Restricted Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
