/**
 * Logic and calculation helpers for DigiPaiement.tn pricing and orders
 */

export type ToolCategory = 'ai-productivity' | 'streaming-music' | 'packs';

export type DurationOption = '1 mois' | '3 mois';

export interface ToolOffering {
  id: string;
  name: string;
  category: ToolCategory;
  badge?: string;
  monthlyTnd: number;
  quarterlyTnd?: number;
  featured?: boolean;
  description: string;
  benefits: string[];
}

export const CATALOG_TOOLS: ToolOffering[] = [
  {
    id: 'google-one',
    name: 'Google One',
    category: 'ai-productivity',
    badge: 'IA & Productivité',
    monthlyTnd: 29,
    quarterlyTnd: 69,
    featured: true,
    description: 'Gemini Plus • Partage 5 proches • Google Flow & Veo',
    benefits: [
      'Accès Gemini Plus intégré à vos outils Google',
      'Partage familial inclus jusqu’à 5 proches',
      'Accès Google Flow & Veo pour la création vidéo IA',
      'Activation rapide sur votre compte Google en TND',
    ],
  },
  {
    id: 'microsoft-office-365',
    name: 'Microsoft Office 365',
    category: 'ai-productivity',
    badge: 'Suite Bureautique',
    monthlyTnd: 19,
    quarterlyTnd: 49,
    featured: false,
    description: 'Suite complète Word, Excel, PowerPoint',
    benefits: [
      'Word, Excel et PowerPoint complets et officiels',
      'Synchronisation multi-appareils (PC, Mac, Mobile)',
      'Idéal pour e-commerçants, freelances et étudiants',
      'Activation garantie sous 15 à 30 minutes',
    ],
  },
  {
    id: 'shahid-vip',
    name: 'Shahid VIP',
    category: 'streaming-music',
    badge: 'Séries & Cinéma',
    monthlyTnd: 15,
    quarterlyTnd: 39,
    description: 'Séries arabes exclusives, films, chaînes TV en direct et contenus sans publicité.',
    benefits: [
      'Catalogue complet Shahid VIP sans coupure pub',
      'Qualité HD/Full HD sur TV, PC et smartphone',
      'Séries originales, cinéma arabe et direct TV',
      'Paiement en Dinars via D17, Flouci ou Virement',
    ],
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium',
    category: 'streaming-music',
    badge: 'Musique & Podcasts',
    monthlyTnd: 15,
    quarterlyTnd: 39,
    description: 'Écoutez toute votre musique sans publicité, hors ligne et en haute qualité audio.',
    benefits: [
      'Zéro coupure publicitaire sur tous vos appareils',
      'Téléchargement illimité pour écoute hors ligne',
      'Zappage illimité et qualité audio supérieure',
      'Activation simple sans carte internationale',
    ],
  },
  {
    id: 'prime-tv',
    name: 'Prime TV',
    category: 'streaming-music',
    badge: 'Streaming HD/4K',
    monthlyTnd: 15,
    quarterlyTnd: 39,
    description: 'Films récents, séries Amazon Originals et programmes exclusifs en streaming fluide.',
    benefits: [
      'Accès complet aux séries et films Prime Video',
      'Lecture HD / 4K et téléchargement hors connexion',
      'Profils multiples sur Smart TV, mobile et web',
      'Renouvellement sans frais bancaires cachés',
    ],
  },
  {
    id: 'apple-tv-plus',
    name: 'Apple TV+',
    category: 'streaming-music',
    badge: 'Apple Originals',
    monthlyTnd: 15,
    quarterlyTnd: 39,
    description: 'Séries et films Apple Originals acclamés par la critique en 4K HDR sans publicité.',
    benefits: [
      'Productions exclusives Apple Originals en 4K HDR',
      'Zéro publicité et lecture hors ligne incluse',
      'Compatible Apple, Smart TV, navigateurs et consoles',
      'Support local réactif 7j/7 en Tunisie',
    ],
  },
  {
    id: 'pack-pro-ia',
    name: 'Pack Pro & IA',
    category: 'packs',
    badge: 'Pack Combiné ⭐',
    monthlyTnd: 42,
    featured: true,
    description: 'Google One + Microsoft Office',
    benefits: [
      'Google One (Gemini Plus, partage 5 proches, Flow & Veo)',
      'Microsoft Office 365 (Word, Excel, PowerPoint)',
      'Tarif mensuel avantageux : 42 TND/mois (au lieu de 48 TND)',
      'Activation synchronisée sous 15 à 30 minutes',
    ],
  },
  {
    id: 'pack-divertissement',
    name: 'Pack Divertissement',
    category: 'packs',
    badge: 'Pack Combiné',
    monthlyTnd: 25,
    featured: true,
    description: 'Spotify + Shahid ou Prime TV',
    benefits: [
      'Spotify Premium + Shahid VIP ou Prime TV au choix',
      'Tarif mensuel avantageux : 25 TND/mois (au lieu de 30 TND)',
      'Musique et streaming vidéo réunis en un seul paiement',
      'Paiement simple en Dinars via D17, Flouci ou Virement',
    ],
  },
];

/**
 * Checks whether a given offering has a specific duration rate
 */
export function supportsDuration(tool: ToolOffering, duration: DurationOption): boolean {
  if (duration === '1 mois') return true;
  return typeof tool.quarterlyTnd === 'number';
}

/**
 * Calculates pricing for a given tool and selected duration
 */
export function calculateSubscriptionPrice(toolId: string, duration: DurationOption): number {
  const tool = CATALOG_TOOLS.find((t) => t.id === toolId);
  if (!tool) return 0;

  if (duration === '3 mois' && typeof tool.quarterlyTnd === 'number') {
    return tool.quarterlyTnd;
  }

  return tool.monthlyTnd;
}

/**
 * Calculates monthly equivalent for comparison
 */
export function calculateMonthlyEquivalent(toolId: string, duration: DurationOption): number {
  const tool = CATALOG_TOOLS.find((t) => t.id === toolId);
  if (!tool) return 0;

  if (duration === '3 mois' && typeof tool.quarterlyTnd === 'number') {
    return Math.round((tool.quarterlyTnd / 3) * 10) / 10;
  }

  return tool.monthlyTnd;
}

/**
 * Validates Tunisian phone numbers (e.g. 98123456, +21698123456, 216 22 345 678)
 */
export function isValidTunisianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Matches 8 digits starting with 2, 4, 5, 7, 9 or prefixed by +216 or 00216 or 216
  const regex = /^(?:\+216|00216|216)?[24579]\d{7}$/;
  return regex.test(cleaned);
}

/**
 * Validates standard email address
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Generates an instant WhatsApp message link
 */
export function generateWhatsAppLink(params: {
  phone?: string;
  orderId?: string;
  toolName: string;
  duration: string;
  paymentMethod: string;
  customerEmail: string;
}): string {
  const targetPhone = '21658570825';
  const text = `Bonjour DigiPaiement.tn ! 🇹🇳\nJe souhaite commander l'abonnement : *${params.toolName}* (${params.duration}).\nMode de paiement : *${params.paymentMethod}*\nMon adresse e-mail d'activation : ${params.customerEmail}${
    params.orderId ? `\nRéférence : #${params.orderId}` : ''
  }\nMerci de me confirmer les coordonnées de transfert !`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
