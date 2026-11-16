export type FAQCategory =
  | 'all'
  | 'how-it-works'
  | 'supported-tools'
  | 'payment-methods'
  | 'currency-tnd'
  | 'subscription-management'
  | 'customer-support';

export interface FAQItem {
  id: string;
  category: Exclude<FAQCategory, 'all'>;
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

export const FAQ_CATEGORIES: { id: FAQCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Toutes les questions', icon: 'Sparkles' },
  { id: 'how-it-works', label: 'Fonctionnement & Sécurité', icon: 'Layers' },
  { id: 'supported-tools', label: 'Outils & Abonnements', icon: 'Wand2' },
  { id: 'payment-methods', label: 'Moyens de Paiement', icon: 'CreditCard' },
  { id: 'currency-tnd', label: 'Tarifs & Dinars (TND)', icon: 'Coins' },
  { id: 'subscription-management', label: 'Gestion & Garantie', icon: 'ShieldCheck' },
  { id: 'customer-support', label: 'Support & Contact', icon: 'Headphones' },
];

export const FAQ_LIST: FAQItem[] = [
  // 1. How the service works
  {
    id: 'how-1',
    category: 'how-it-works',
    categoryLabel: 'Fonctionnement',
    question: "Comment fonctionne concrètement le service DigiPaiement.tn ?",
    answer:
      "DigiPaiement.tn agit comme une passerelle d'accès et un intermédiaire de confiance en Tunisie. Vous choisissez l'abonnement de votre choix (Google One avec Google Flow & Veo, Microsoft Office 365, Shahid VIP, Spotify, Prime TV, Apple TV+ ou un Pack Combiné) et réglez en Dinars Tunisiens (TND) via D17, Flouci ou virement. Notre équipe active votre accès en 15 à 30 minutes.",
    highlights: ["Aucune carte internationale requise", "Activation en 15-30 minutes", "100% légal et sécurisé"],
  },
  {
    id: 'how-2',
    category: 'how-it-works',
    categoryLabel: 'Fonctionnement',
    question: "Dois-je vous communiquer mon mot de passe personnel ?",
    answer:
      "Absolument JAMAIS ! Nous ne vous demanderons jamais le mot de passe de votre compte e-mail ou de votre outil. L'activation s'effectue soit par invitation officielle d'équipe/workspace certifiée transmise à votre adresse e-mail, soit par clé de licence officielle à saisir sur votre compte existant.",
    highlights: ["Zéro mot de passe demandé", "Protection intégrale de votre vie privée", "Vos dossiers restent 100% privés"],
  },
  {
    id: 'how-3',
    category: 'how-it-works',
    categoryLabel: 'Fonctionnement',
    question: "Mes projets, fichiers et historiques sur mon compte Google ou Office sont-ils conservés ?",
    answer:
      "Oui, l'activation s'appliquant directement à votre compte personnel existant, vous conservez l'intégralité de vos fichiers Drive, documents Word/Excel, historiques Gemini et créations Google Flow. Rien n'est écrasé ni supprimé.",
    highlights: ["Conservation totale de vos données", "Pas besoin de recréer un nouveau compte"],
  },
  {
    id: 'how-4',
    category: 'how-it-works',
    categoryLabel: 'Fonctionnement',
    question: "Quels sont les délais d'activation après validation du paiement ?",
    answer:
      "Le délai moyen d'activation constaté est de 15 à 30 minutes après réception de la capture de votre paiement sur WhatsApp ou par e-mail. Notre équipe technique est opérationnelle 7 jours sur 7, de 08:30 à 23:30.",
    highlights: ["Délai moyen : 18 minutes", "Disponibilité 7j/7 de 08h30 à 23h30"],
  },

  // 2. Supported tools
  {
    id: 'tools-1',
    category: 'supported-tools',
    categoryLabel: 'Outils',
    question: "Quels sont les outils numériques et services actuellement pris en charge ?",
    answer:
      "Notre catalogue officiel comprend : Google One (Gemini Plus, Partage 5 proches, Google Flow & Veo) à 29 TND/mois ou 69 TND/3 mois, Microsoft Office 365 (19 TND/mois ou 49 TND/3 mois), ainsi que Shahid VIP, Spotify Premium, Prime TV et Apple TV+ (15 TND/mois ou 39 TND/3 mois). Nous proposons aussi le Pack Pro & IA (42 TND/mois) et le Pack Divertissement (25 TND/mois).",
    highlights: ["Google One & Flow", "Microsoft Office 365", "Streaming 15 TND", "Pack Pro & IA", "Pack Divertissement"],
  },
  {
    id: 'tools-2',
    category: 'supported-tools',
    categoryLabel: 'Outils',
    question: "Pourquoi Google Flow (inclus dans Google One) est-il important pour les créateurs et e-commerçants ?",
    answer:
      "Google Flow, propulsé par Veo dans votre abonnement Google One, permet aux e-commerçants et créateurs de contenu en Tunisie de générer des vidéos publicitaires, Reels, TikToks et présentations produits cinématiques sans tournage coûteux. Associé à Gemini Plus pour les scripts et au partage jusqu'à 5 proches, c'est un levier majeur de croissance digitale à partir de 29 TND/mois.",
    highlights: ["Vidéos Ads e-commerce", "Google Flow & Veo", "Partage 5 proches inclus"],
  },
  {
    id: 'tools-3',
    category: 'supported-tools',
    categoryLabel: 'Outils',
    question: "Puis-je commander un outil qui ne figure pas encore dans le catalogue ?",
    answer:
      "Oui ! Nous répondons aux demandes personnalisées pour d'autres outils numériques professionnels sur demande. Il vous suffit de nous contacter directement sur WhatsApp au +216 58 570 825 avec le nom du service souhaité pour obtenir un devis immédiat en TND.",
    highlights: ["Outils sur mesure disponibles", "Devis instantané en Dinars", "Support WhatsApp dédié"],
  },
  {
    id: 'tools-4',
    category: 'supported-tools',
    categoryLabel: 'Outils',
    question: "Que contiennent les Offres Packs Combinés ?",
    answer:
      "Nous proposons deux packs mensuels avantageux : le Pack Pro & IA (Google One + Microsoft Office 365) à 42 TND/mois au lieu de 48 TND, et le Pack Divertissement (Spotify Premium + Shahid VIP ou Prime TV) à 25 TND/mois au lieu de 30 TND.",
    highlights: ["Pack Pro & IA : 42 TND/mois", "Pack Divertissement : 25 TND/mois", "Économie immédiate chaque mois"],
  },

  // 3. Payment methods
  {
    id: 'pay-1',
    category: 'payment-methods',
    categoryLabel: 'Paiement',
    question: "Quels sont les moyens de paiement acceptés en Tunisie ?",
    answer:
      "Nous acceptons l'ensemble des solutions de paiement locales les plus populaires : l'application D17 de la Poste Tunisienne, le portefeuille mobile instantané Flouci, ainsi que le virement bancaire et le versement d'espèces au guichet (CCP Poste Tunisienne ou BIAT). Vous n'avez besoin d'aucune carte bancaire internationale en devises.",
    highlights: ["D17 (Poste Tunisienne)", "Flouci (Mobile)", "Virement / Versement CCP & BIAT"],
  },
  {
    id: 'pay-2',
    category: 'payment-methods',
    categoryLabel: 'Paiement',
    question: "Comment payer avec l'application D17 de la Poste Tunisienne ?",
    answer:
      "Dans l'application D17 de votre smartphone, sélectionnez « Transfert d'argent », saisissez le numéro de téléphone officiel communiqué lors de votre commande (+216 58 570 825), entrez le montant exact en Dinars et validez avec votre code secret. Vous recevez un reçu de transaction avec référence : prenez une capture d'écran et envoyez-la nous sur WhatsApp.",
    highlights: ["Transfert instantané D17", "Accessible depuis n'importe quel compte e-dinar", "Validation en quelques minutes"],
  },
  {
    id: 'pay-3',
    category: 'payment-methods',
    categoryLabel: 'Paiement',
    question: "Comment payer avec l'application Flouci ?",
    answer:
      "Ouvrez votre application Flouci, cliquez sur « Envoyer de l'argent », entrez notre tag officiel @digipaiement (ou le numéro de téléphone associé), indiquez le montant en TND et validez. Le transfert est immédiat et sans frais additionnels.",
    highlights: ["Transfert sans frais", "Tag vérifié @digipaiement", "100% instantané"],
  },
  {
    id: 'pay-4',
    category: 'payment-methods',
    categoryLabel: 'Paiement',
    question: "Je n'ai pas de compte bancaire ni d'application, puis-je payer en espèces ?",
    answer:
      "Oui ! Vous pouvez vous rendre dans n'importe quel bureau de Poste Tunisienne ou agence bancaire pour effectuer un versement d'espèces direct sur notre compte CCP / bancaire avec votre nom en référence. Le guichetier vous remet un reçu papier qu'il suffit de prendre en photo.",
    highlights: ["Versement d'espèces au guichet", "Valable dans tous les bureaux de poste de Tunisie"],
  },

  // 4. Currency conversion & Pricing in TND
  {
    id: 'curr-1',
    category: 'currency-tnd',
    categoryLabel: 'Tarifs & Dinars',
    question: "Comment sont fixés les prix en Dinars Tunisiens (TND) ?",
    answer:
      "Tous nos tarifs sont affichés en Dinars Tunisiens (TND) nets et fermes. Le prix que vous voyez est exactement le montant que vous réglez. Vous n'avez pas à vous soucier des variations quotidiennes du taux de change Dollar/Euro ou des fluctuations monétaires.",
    highlights: ["Prix nets et transparents", "Zéro commission de change", "Zéro mauvaise surprise sur votre facture"],
  },
  {
    id: 'curr-2',
    category: 'currency-tnd',
    categoryLabel: 'Tarifs & Dinars',
    question: "Est-ce que cet achat consomme ma Dotation Technologique bancaire ?",
    answer:
      "NON ! Étant donné que vous réglez en Dinars Tunisiens via des circuits de paiement nationaux (D17, Flouci, virement local), votre achat ne touche absolument pas à votre Dotation Technologique internationale annuelle (limitée par la Banque Centrale de Tunisie à 1 000 TND pour les particuliers). Vous préservez ainsi 100% de votre dotation pour d'autres besoins.",
    highlights: ["Dotation technologique 100% préservée", "Aucune autorisation bancaire requise", "Aucun justificatif complexe à fournir"],
  },
  {
    id: 'curr-3',
    category: 'currency-tnd',
    categoryLabel: 'Tarifs & Dinars',
    question: "Y a-t-il des taxes internationales ou des frais cachés ?",
    answer:
      "Non, aucun frais caché. Les banques tunisiennes prélèvent d'ordinaire des commissions de non-résidence (jusqu'à 3% à 5%) et des frais fixes sur les paiements internationaux. Avec DigiPaiement.tn, vous payez uniquement le prix affiché en Dinars Tunisiens.",
    highlights: ["Zéro taxe cachée", "Paiement local sans frais transfrontaliers"],
  },

  // 5. Subscription management & Warranty
  {
    id: 'sub-1',
    category: 'subscription-management',
    categoryLabel: 'Gestion & Garantie',
    question: "Comment fonctionne la garantie sur mon abonnement ?",
    answer:
      "100% de nos abonnements bénéficient d'une garantie totale sur l'intégralité de la période souscrite (1 mois ou 3 mois). En cas de mise à jour de la plateforme, de changement technique ou de bug, notre assistance locale intervient sans frais pour réactiver ou remplacer votre accès sous quelques heures.",
    highlights: ["Garantie complète 100%", "Assistance technique continue", "Remplacement immédiat en cas d'anomalie"],
  },
  {
    id: 'sub-2',
    category: 'subscription-management',
    categoryLabel: 'Gestion & Garantie',
    question: "Y a-t-il une reconduction tacite ou un prélèvement automatique non souhaité ?",
    answer:
      "Non ! Nous n'effectuons aucun prélèvement automatique surprise. Cinq jours avant l'expiration de votre abonnement, nous vous envoyons un simple rappel courtois par WhatsApp et e-mail. Vous êtes totalement libre de renouveler ou de laisser l'abonnement prendre fin, sans aucune démarche de désabonnement contraignante.",
    highlights: ["Zéro reconduction automatique forcée", "Rappel 5 jours avant l'échéance", "Liberté totale"],
  },
  {
    id: 'sub-3',
    category: 'subscription-management',
    categoryLabel: 'Gestion & Garantie',
    question: "Puis-je passer d'une formule 1 mois vers une formule 3 mois ou un Pack Combiné ?",
    answer:
      "Oui ! Si vous avez testé un abonnement 1 mois et souhaitez passer à la formule économique 3 mois ou à un Pack Combiné (Pack Pro & IA à 42 TND/mois ou Pack Divertissement à 25 TND/mois), contactez-nous simplement sur WhatsApp pour basculer votre formule sans coupure.",
    highlights: ["Évolution facile", "Tarif économique 3 mois & Packs"],
  },

  // 6. Customer support contact information
  {
    id: 'sup-1',
    category: 'customer-support',
    categoryLabel: 'Support Client',
    question: "Quelles sont les coordonnées officielles du service client ?",
    answer:
      "Notre équipe est joignable via plusieurs canaux directs : \n• WhatsApp Express : +216 58 570 825 (canal recommandé pour activation rapide et envoi de reçu)\n• E-mail officiel : contact@digipaiement.tn\n• Téléphone hotline : +216 58 570 825\n• Adresse : Tunis, Tunisie (Service 100% en ligne couvrant les 24 gouvernorats)",
    highlights: ["WhatsApp : +216 58 570 825", "Email : contact@digipaiement.tn", "Couverture nationale 24 gouvernorats"],
  },
  {
    id: 'sup-2',
    category: 'customer-support',
    categoryLabel: 'Support Client',
    question: "Quels sont les horaires d'ouverture du support client ?",
    answer:
      "Notre support client et notre service d'activation sont actifs 7 jours sur 7, y compris les week-ends et jours fériés, de 08:30 à 23:30 (heure de Tunis). Les messages reçus en dehors de ces heures sont traités en priorité dès l'ouverture le lendemain matin.",
    highlights: ["Ouvert 7 jours sur 7", "08:30 à 23:30 sans interruption", "Prise en charge les week-ends"],
  },
  {
    id: 'sup-3',
    category: 'customer-support',
    categoryLabel: 'Support Client',
    question: "Délivrez-vous des factures officielles pour les entreprises et agences tunisiennes ?",
    answer:
      "Oui ! Nous délivrons sur demande des factures professionnelles avec mention des coordonnées de votre société ou agence pour votre comptabilité locale. Indiquez-le lors de votre commande ou auprès de notre support WhatsApp.",
    highlights: ["Facturation professionnelle", "Conforme pour la comptabilité d'entreprise en Tunisie"],
  },
];

/**
 * Filter FAQ list by category and search term
 */
export function filterFAQs(category: FAQCategory, search: string): FAQItem[] {
  const query = search.trim().toLowerCase();

  return FAQ_LIST.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;

    if (!query) return true;

    const inQuestion = item.question.toLowerCase().includes(query);
    const inAnswer = item.answer.toLowerCase().includes(query);
    const inHighlights = item.highlights?.some((h) => h.toLowerCase().includes(query));

    return inQuestion || inAnswer || inHighlights;
  });
}
