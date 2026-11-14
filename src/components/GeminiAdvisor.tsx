import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface GeminiAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedTool: (toolId: string) => void;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ isOpen, onClose, onSelectRecommendedTool }) => {
  const [profile, setProfile] = useState('Community Manager');
  const [usageDescription, setUsageDescription] = useState('');
  const [budgetTnd, setBudgetTnd] = useState('50 - 100');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Google One & Flow']);
  const [loading, setLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (tool: string) => {
    if (selectedInterests.includes(tool)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tool));
    } else {
      setSelectedInterests([...selectedInterests, tool]);
    }
  };

  const handleGenerateAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          usageDescription: usageDescription || 'Création de contenu régulier pour réseaux sociaux et productivité.',
          budgetTnd,
          toolsOfInterest: selectedInterests,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la consultation du conseiller');
      const data = await res.json();
      setAdviceResult(data.recommendation || data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Impossible de joindre le conseiller IA en ce moment. Vous pouvez nous contacter sur WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const mapToolToId = (toolName: string): string => {
    const lower = (toolName || '').toLowerCase();
    if (lower.includes('pack pro') || (lower.includes('google') && lower.includes('office'))) return 'pack-pro-ia';
    if (lower.includes('divertissement')) return 'pack-divertissement';
    if (lower.includes('google') || lower.includes('flow') || lower.includes('veo') || lower.includes('gemini')) {
      return 'google-one';
    }
    if (lower.includes('office') || lower.includes('microsoft')) return 'microsoft-office-365';
    if (lower.includes('shahid')) return 'shahid-vip';
    if (lower.includes('spotify')) return 'spotify-premium';
    if (lower.includes('prime')) return 'prime-tv';
    if (lower.includes('apple')) return 'apple-tv-plus';
    return 'google-one';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0c1220] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950/80 via-blue-950/60 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Conseiller Intelligent IA DigiPaiement
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Trouvez la formule exacte selon vos projets, votre rentabilité et votre budget en TND
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!adviceResult ? (
            <form onSubmit={handleGenerateAdvice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Quel est votre profil principal en Tunisie ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Community Manager',
                    'Graphiste Freelance',
                    'Créateur de Contenu',
                    'Étudiant / Chercheur',
                    'Boutique E-commerce',
                    'Agence / Entreprise',
                  ].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setProfile(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-colors ${
                        profile === p
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. Décrivez brièvement vos besoins ou projets actuels :
                </label>
                <textarea
                  value={usageDescription}
                  onChange={(e) => setUsageDescription(e.target.value)}
                  placeholder="Ex : Je gère 3 pages Instagram pour des marques locales de vêtements et j'ai besoin de visuels rapides, de détourage et de rédaction de légendes..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  3. Outils qui vous intéressent a priori :
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Google One & Flow',
                    'Microsoft Office 365',
                    'Pack Pro & IA',
                    'Shahid VIP',
                    'Spotify Premium',
                    'Pack Divertissement',
                  ].map((tool) => (
                    <button
                      type="button"
                      key={tool}
                      onClick={() => toggleInterest(tool)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedInterests.includes(tool)
                          ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  4. Budget envisagé en Dinars Tunisiens (TND) :
                </label>
                <select
                  value={budgetTnd}
                  onChange={(e) => setBudgetTnd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="15 - 30 TND">15 - 30 TND (Streaming, Office 365 ou Google One 1 mois)</option>
                  <option value="30 - 50 TND">30 - 50 TND (Pack Pro & IA 42 TND/mois ou Streaming 3 mois)</option>
                  <option value="50 - 70 TND">50 - 70 TND (Google One + Flow 3 mois à 69 TND)</option>
                  <option value="+70 TND">+70 TND (Multi-abonnements / équipes)</option>
                </select>
              </div>

              {errorMsg && <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini analyse vos besoins et le marché tunisien...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Générer ma recommandation personnalisée</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              {/* Recommendation Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/40 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                      Recommandation Spécifique
                    </span>
                    <h4 className="text-xl font-black text-white mt-0.5">
                      {adviceResult.recommendedTool}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {adviceResult.recommendedPriceTnd || 'Tarif compétitif en TND'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-blue-200">
                  {adviceResult.headline}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {adviceResult.summary}
                </p>

                {adviceResult.estimatedRoi && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-300 font-medium">
                      <strong>Retour sur investissement estimé :</strong> {adviceResult.estimatedRoi}
                    </p>
                  </div>
                )}

                {adviceResult.keyFeaturesForUser && (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Atouts clés pour vous :</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {adviceResult.keyFeaturesForUser.map((feat: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const toolId = mapToolToId(adviceResult.recommendedTool);
                    onSelectRecommendedTool(toolId);
                    onClose();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <span>Commander cette formule ({adviceResult.recommendedTool})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAdviceResult(null)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Modifier mes critères
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Paiement en Dinars (D17 & Flouci) sans commission de change
          </span>
          <button onClick={onClose} className="hover:text-white">
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
