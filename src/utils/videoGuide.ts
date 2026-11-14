export type GuidePaymentMethod = 'D17' | 'Flouci' | 'Les deux';

export interface VideoChapter {
  id: string;
  label: string;
  shortTitle: string;
  startSeconds: number;
  endSeconds: number;
  timeRange: string;
  methodTag: string;
  description: string;
  recipientHighlight?: string;
}

export interface PaymentGuideScript {
  method: GuidePaymentMethod;
  title: string;
  voiceover: string;
  steps: string[];
  recipientInfo: string;
  isAiGenerated: boolean;
}

export const PAYMENT_RECIPIENTS = {
  d17Number: '98 765 432',
  flouciTag: '@digipaiement',
  flouciNumber: '98 765 432',
  activationDelay: '15 à 30 minutes',
} as const;

export const VIDEO_GUIDE_CHAPTERS: VideoChapter[] = [
  {
    id: 'commande',
    label: '01. Choisir en TND',
    shortTitle: 'Commande en Dinars',
    startSeconds: 0,
    endSeconds: 4,
    timeRange: '0:00 – 0:04',
    methodTag: 'DigiPaiement.tn',
    description:
      'Sélectionnez votre abonnement (Google One avec Flow & Veo, Microsoft Office 365 ou Streaming) et validez votre commande en TND.',
  },
  {
    id: 'd17',
    label: '02. Payer par D17',
    shortTitle: 'Transfert D17 Poste TN',
    startSeconds: 4,
    endSeconds: 8,
    timeRange: '0:04 – 0:08',
    methodTag: 'D17 Poste Tunisienne',
    description:
      'Ouvrez D17 → Transfert d’argent, saisissez le numéro vérifié 98 765 432, entrez le montant exact en TND et capturez le reçu.',
    recipientHighlight: 'Numéro D17 : 98 765 432',
  },
  {
    id: 'flouci',
    label: '03. Payer par Flouci',
    shortTitle: 'Envoi instantané Flouci',
    startSeconds: 8,
    endSeconds: 12,
    timeRange: '0:08 – 0:12',
    methodTag: 'Flouci Wallet',
    description:
      'Ouvrez Flouci → Envoyer de l’argent, recherchez le tag @digipaiement (ou 98 765 432), confirmez en TND et gardez la capture.',
    recipientHighlight: 'Tag Flouci : @digipaiement',
  },
  {
    id: 'activation',
    label: '04. Activation Express',
    shortTitle: 'Reçu WhatsApp & Email',
    startSeconds: 12,
    endSeconds: 16,
    timeRange: '0:12 – 0:16',
    methodTag: 'Activation 15-30 min',
    description:
      'Envoyez la capture du reçu avec votre numéro #DG-XXXX sur WhatsApp. Votre accès officiel est activé sur votre email sous 15 à 30 min.',
  },
];

export function getChapterForTime(seconds: number): VideoChapter {
  const safeSec = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
  for (let i = VIDEO_GUIDE_CHAPTERS.length - 1; i >= 0; i--) {
    if (safeSec >= VIDEO_GUIDE_CHAPTERS[i].startSeconds) {
      return VIDEO_GUIDE_CHAPTERS[i];
    }
  }
  return VIDEO_GUIDE_CHAPTERS[0];
}

export function getDefaultPaymentGuideScript(method: GuidePaymentMethod): PaymentGuideScript {
  if (method === 'D17') {
    return {
      method: 'D17',
      title: 'Guide pas à pas : Régler votre commande via D17',
      voiceover:
        'Pour payer avec D17 Poste Tunisienne, ouvrez votre application mobile, sélectionnez Transfert d’argent, indiquez le numéro 98 765 432 avec le montant exact de votre commande en Dinars, puis envoyez la capture du reçu sur WhatsApp pour activer votre accès en 15 à 30 minutes.',
      steps: [
        'Passez votre commande sur DigiPaiement.tn et notez votre référence (#DG-XXXX) ainsi que le montant exact en TND.',
        'Ouvrez l’application D17 (Poste Tunisienne) et choisissez « Transfert d’argent ».',
        `Entrez le numéro bénéficiaire vérifié ${PAYMENT_RECIPIENTS.d17Number} et validez le montant exact.`,
        'Faites une capture d’écran du reçu D17 et transmettez-la sur WhatsApp : activation sous 15 à 30 min.',
      ],
      recipientInfo: `D17 Poste Tunisienne • ${PAYMENT_RECIPIENTS.d17Number}`,
      isAiGenerated: false,
    };
  }

  if (method === 'Flouci') {
    return {
      method: 'Flouci',
      title: 'Guide pas à pas : Régler votre commande via Flouci',
      voiceover:
        'Avec Flouci, le règlement est instantané 24h/24 : ouvrez Flouci, appuyez sur Envoyer de l’argent, recherchez le tag @digipaiement ou le numéro 98 765 432, confirmez le montant en TND et partagez votre reçu sur WhatsApp.',
      steps: [
        'Sélectionnez votre abonnement (1 mois ou 3 mois) et validez votre commande sur DigiPaiement.tn.',
        'Ouvrez votre application Flouci et sélectionnez « Envoyer de l’argent ».',
        `Recherchez le tag officiel ${PAYMENT_RECIPIENTS.flouciTag} (ou ${PAYMENT_RECIPIENTS.flouciNumber}) et saisissez le total en TND.`,
        'Prenez une capture d’écran de la confirmation et envoyez-la sur WhatsApp pour recevoir votre accès.',
      ],
      recipientInfo: `Flouci Wallet • ${PAYMENT_RECIPIENTS.flouciTag} (${PAYMENT_RECIPIENTS.flouciNumber})`,
      isAiGenerated: false,
    };
  }

  return {
    method: 'Les deux',
    title: 'Résumé Express : Paiement D17 & Flouci en Tunisie',
    voiceover:
      'Réglez tous vos abonnements en Dinars Tunisiens sans carte bancaire internationale : envoyez votre paiement par D17 au 98 765 432 ou par Flouci vers @digipaiement, puis partagez la capture sur WhatsApp pour une activation sous 15 à 30 minutes.',
    steps: [
      'Choisissez votre outil ou pack sur DigiPaiement.tn (tarif clair en TND, 1 mois ou 3 mois).',
      `Via D17 : effectuez un transfert vers le ${PAYMENT_RECIPIENTS.d17Number}.`,
      `Via Flouci : envoyez directement au tag ${PAYMENT_RECIPIENTS.flouciTag} (ou ${PAYMENT_RECIPIENTS.flouciNumber}).`,
      'Partagez la capture du reçu sur WhatsApp : activation garantie sur votre email personnel en 15 à 30 min.',
    ],
    recipientInfo: `D17 : ${PAYMENT_RECIPIENTS.d17Number} • Flouci : ${PAYMENT_RECIPIENTS.flouciTag}`,
    isAiGenerated: false,
  };
}

export function normalizePaymentGuideScript(
  raw: unknown,
  method: GuidePaymentMethod,
  isAiGenerated = true
): PaymentGuideScript {
  const fallback = getDefaultPaymentGuideScript(method);
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const record = raw as Record<string, unknown>;
  const title =
    typeof record.title === 'string' && record.title.trim().length > 0
      ? record.title.trim()
      : fallback.title;
  const voiceover =
    typeof record.voiceover === 'string' && record.voiceover.trim().length > 0
      ? record.voiceover.trim()
      : fallback.voiceover;
  const steps = Array.isArray(record.steps)
    ? record.steps
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .map((s) => s.trim().replace(/^\d+[\.\)]\s*/, ''))
    : [];
  const recipientInfo =
    typeof record.recipientInfo === 'string' && record.recipientInfo.trim().length > 0
      ? record.recipientInfo.trim()
      : fallback.recipientInfo;

  return {
    method,
    title,
    voiceover,
    steps: steps.length >= 3 ? steps.slice(0, 5) : fallback.steps,
    recipientInfo,
    isAiGenerated,
  };
}
