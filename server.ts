import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, listAllUsers } from './src/db/users.ts';
import {
  createOrder,
  listOrdersByUserUid,
  listAllOrders,
  updateOrderAdmin,
  deleteOrderByCode,
} from './src/db/orders.ts';
import {
  createContactMessage,
  listAllContactMessages,
  deleteContactMessageById,
} from './src/db/contacts.ts';
import { computeAdminStats, isValidOrderStatus } from './src/utils/admin.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Sync / retrieve authenticated user profile
app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }
    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      req.user.name || null
    );
    return res.json({
      id: dbUser.id,
      uid: dbUser.uid,
      email: dbUser.email,
      displayName: dbUser.displayName,
    });
  } catch (error: any) {
    console.error('Failed to sync user profile:', error);
    return res.status(500).json({ error: error.message || 'Impossible de charger votre profil.' });
  }
});

// Gemini AI Advisor Endpoint
app.post('/api/gemini/advisor', async (req, res) => {
  try {
    const { profile, usageDescription, budgetTnd, toolsOfInterest } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        recommendedTool: 'Pack Pro & IA (Google One + Microsoft Office)',
        headline: 'Le Pack Ultime pour Créateurs, E-commerçants & Étudiants en Tunisie',
        summary:
          'Pour votre profil, le Pack Pro & IA réunit Google One (Gemini Plus, Partage 5 proches, Google Flow & Veo pour vos vidéos marketing) et Microsoft Office 365 (Word, Excel, PowerPoint) à 42 TND/mois au lieu de 48 TND.',
        estimatedRoi: 'Économie immédiate de 6 TND/mois et gain de plusieurs heures par semaine sur vos vidéos Ads, contenus et documents.',
        recommendedPriceTnd: '42 TND / mois (ou Google One seul à 29 TND/mois • 69 TND/3 mois)',
        keyFeaturesForUser: [
          'Google Flow & Veo pour vidéos e-commerce & Reels',
          'Gemini Plus + Partage jusqu’à 5 proches',
          'Microsoft Office 365 (Word, Excel, PowerPoint)',
          'Activation en TND via D17, Flouci ou Virement',
        ],
        suggestedSteps: [
          '1. Choisir votre formule sur DigiPaiement.tn',
          '2. Transférer via D17, Flouci ou Virement',
          '3. Réception de votre accès sous 15-30 min sur votre email',
        ],
      });
    }

    const prompt = `Tu es l'expert-conseiller officiel de DigiPaiement.tn, une passerelle de paiement et service d'activation en Tunisie permettant aux créateurs de contenu, e-commerçants, étudiants et professionnels tunisiens d'accéder aux abonnements suivants en Dinars Tunisiens (TND) via D17, Flouci ou Virement bancaire :
- Google One (Gemini Plus • Partage 5 proches • Google Flow & Veo) : 29 TND (1 mois) / 69 TND (3 mois)
- Microsoft Office 365 (Word, Excel, PowerPoint) : 19 TND (1 mois) / 49 TND (3 mois)
- Shahid VIP, Spotify Premium, Prime TV, Apple TV+ : 15 TND (1 mois) / 39 TND (3 mois) chacun
- Pack Pro & IA (Google One + Microsoft Office) : 42 TND/mois
- Pack Divertissement (Spotify + Shahid ou Prime TV) : 25 TND/mois
Note importante : Nous ne proposons PAS Canva.

L'utilisateur a fourni les informations suivantes :
- Profil / Métier : ${profile || 'Non spécifié'}
- Besoins et projets actuels : ${usageDescription || 'Création de contenu vidéo, e-commerce et productivité'}
- Budget estimé (TND) : ${budgetTnd ? budgetTnd + ' TND' : 'Flexible'}
- Services d'intérêt : ${Array.isArray(toolsOfInterest) ? toolsOfInterest.join(', ') : 'Google One & Flow, Microsoft Office 365'}

Analyse ces besoins et recommande uniquement parmi les services officiels listés ci-dessus (en mettant en avant Google Flow & Veo si le profil concerne le e-commerce ou la création de contenu).

Réponds au format JSON strict avec la structure suivante :
{
  "recommendedTool": "nom exact du service ou pack de notre grille",
  "headline": "un titre percutant en français",
  "summary": "2-3 phrases expliquant pourquoi ce choix est parfait pour lui",
  "estimatedRoi": "estimation du gain de temps / conversion en Tunisie",
  "recommendedPriceTnd": "tarif exact de notre grille en TND",
  "keyFeaturesForUser": ["avantage 1", "avantage 2", "avantage 3", "avantage 4"],
  "suggestedSteps": ["étape 1", "étape 2", "étape 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error calling Gemini API in advisor:', error);
    return res.status(200).json({
      fallback: true,
      recommendation: {
        recommendedTool: 'Google One (Gemini Plus • Flow & Veo)',
        headline: 'Créez vos vidéos IA & boostez votre productivité en TND',
        summary:
          'Google One inclut Gemini Plus, Google Flow & Veo pour générer des vidéos publicitaires e-commerce et contenus créateurs, avec partage jusqu’à 5 proches sans carte bancaire internationale.',
        estimatedRoi: 'Production de vidéos publicitaires et contenus Reels sans frais de tournage.',
        recommendedPriceTnd: '29 TND / mois • 69 TND / 3 mois',
        suggestedSteps: [
          'Sélectionnez Google One (1 mois ou 3 mois)',
          'Réglez par D17, Flouci ou Virement',
          'Activation sous 15-30 minutes sur votre email',
        ],
      },
    });
  }
});

// List authenticated user's orders
app.get('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }
    await getOrCreateUser(req.user.uid, req.user.email || '', req.user.name || null);
    const userOrders = await listOrdersByUserUid(req.user.uid);
    return res.json({ orders: userOrders });
  } catch (error: any) {
    console.error('Failed to list orders:', error);
    return res.status(500).json({ error: error.message || 'Impossible de récupérer vos commandes.' });
  }
});

// Create Order Endpoint (Authenticated + Persistent in PostgreSQL)
app.post('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const { fullName, email, phone, tool, planDuration, paymentMethod, priceTnd, notes } = req.body;

    if (!fullName || !email || !phone || !tool) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    }

    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || email,
      req.user.name || fullName
    );

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `DG-${randomNum}`;
    const savedOrder = await createOrder({
      orderCode,
      userId: dbUser.id,
      fullName,
      email,
      phone,
      tool,
      planDuration: planDuration || 'Annuel',
      paymentMethod: paymentMethod || 'D17',
      priceTnd: Number(priceTnd) || 69,
      notes,
    });

    const newOrder = {
      id: savedOrder.orderCode,
      fullName: savedOrder.fullName,
      email: savedOrder.email,
      phone: savedOrder.phone,
      tool: savedOrder.tool,
      planDuration: savedOrder.planDuration,
      paymentMethod: savedOrder.paymentMethod,
      priceTnd: savedOrder.priceTnd,
      status: savedOrder.status,
      createdAt: savedOrder.createdAt,
      notes: savedOrder.notes ?? undefined,
    };

    const paymentDetails = {
      d17: {
        number: '58 570 825',
        accountName: 'DigiPaiement TN / Service Activation',
        instructions: 'Effectuez le transfert via l’application D17 Poste Tunisienne puis envoyez la capture du reçu.',
      },
      flouci: {
        tag: '@digipaiement',
        phone: '58 570 825',
        instructions: 'Ouvrez Flouci, effectuez le transfert vers le tag @digipaiement et partagez la capture sur WhatsApp.',
      },
      virement: {
        rib: '08 000 01234567890 44',
        bank: 'BIAT / CCP Poste Tunisienne',
        instructions: 'Effectuez le virement ou versement espèces au guichet avec votre nom et référence de commande.',
      },
    };

    const whatsappMessage = encodeURIComponent(
      `Bonjour DigiPaiement.tn ! Je viens de passer la commande #${newOrder.id} pour ${newOrder.tool} (${newOrder.planDuration}) au prix de ${newOrder.priceTnd} TND via ${newOrder.paymentMethod}. Mon email : ${newOrder.email}`
    );

    return res.status(201).json({
      success: true,
      order: newOrder,
      paymentDetails,
      whatsappUrl: `https://wa.me/21658570825?text=${whatsappMessage}`,
    });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de la création de la commande.' });
  }
});

// Contact / Message Endpoint (Authenticated + Persistent in PostgreSQL)
app.post('/api/contact', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nom, email et message sont obligatoires.' });
    }

    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || email,
      req.user.name || name
    );

    const savedMessage = await createContactMessage({
      userId: dbUser.id,
      name,
      email,
      phone,
      subject: subject || 'Renseignement abonnement',
      message,
    });

    return res.json({
      success: true,
      message: 'Votre message a été transmis avec succès. Notre équipe vous répondra sous 30 minutes.',
      timestamp: savedMessage.createdAt,
    });
  } catch (error: any) {
    console.error('Failed to save contact message:', error);
    return res.status(500).json({ error: error.message || 'Impossible de transmettre le message.' });
  }
});

// Admin Overview Endpoint (Strictly restricted to ADMIN_EMAIL)
app.get('/api/admin/overview', requireAuth, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const [allOrders, allUsers, allMessages] = await Promise.all([
      listAllOrders(),
      listAllUsers(),
      listAllContactMessages(),
    ]);

    const stats = computeAdminStats(allOrders, allUsers, allMessages);

    return res.json({
      stats,
      orders: allOrders,
      users: allUsers,
      messages: allMessages,
    });
  } catch (error: any) {
    console.error('Failed to load admin overview:', error);
    return res.status(500).json({
      error: error.message || 'Impossible de charger les données administrateur.',
    });
  }
});

// Admin Update Order Status & Notes
app.patch('/api/admin/orders/:orderCode', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { orderCode } = req.params;
    const { status, notes } = req.body ?? {};

    if (status !== undefined && !isValidOrderStatus(String(status))) {
      return res.status(400).json({ error: 'Statut de commande invalide.' });
    }

    if (status === undefined && notes === undefined) {
      return res.status(400).json({ error: 'Aucune modification fournie.' });
    }

    const updated = await updateOrderAdmin(orderCode, {
      status: status !== undefined ? String(status) : undefined,
      notes: notes !== undefined ? (notes === null ? null : String(notes)) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }

    return res.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Failed to update order as admin:', error);
    return res.status(500).json({
      error: error.message || 'Impossible de mettre à jour la commande.',
    });
  }
});

// Admin Delete Order
app.delete('/api/admin/orders/:orderCode', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { orderCode } = req.params;
    const deleted = await deleteOrderByCode(orderCode);
    if (!deleted) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }
    return res.json({ success: true, orderCode: deleted.orderCode });
  } catch (error: any) {
    console.error('Failed to delete order as admin:', error);
    return res.status(500).json({
      error: error.message || 'Impossible de supprimer la commande.',
    });
  }
});

// Admin Delete Contact Message
app.delete('/api/admin/messages/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const messageId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(messageId) || messageId <= 0) {
      return res.status(400).json({ error: 'Identifiant de message invalide.' });
    }
    const deleted = await deleteContactMessageById(messageId);
    if (!deleted) {
      return res.status(404).json({ error: 'Message introuvable.' });
    }
    return res.json({ success: true, id: deleted.id });
  } catch (error: any) {
    console.error('Failed to delete message as admin:', error);
    return res.status(500).json({
      error: error.message || 'Impossible de supprimer le message.',
    });
  }
});

// Setup Vite or static serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DigiPaiement.tn server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
