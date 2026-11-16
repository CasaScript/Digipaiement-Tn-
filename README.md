# DigiPaiement.tn

> **Tunisian subscription gateway & instant activation platform** enabling creators, e-commerce sellers, students, and professionals in Tunisia to subscribe to global AI, productivity, and streaming services in **Tunisian Dinars (TND)** via **D17**, **Flouci**, or **Bank/CCP Transfer** — no international card required.

---

## Key Features

- **Local TND Catalog & Official Pricing**: Transparent 1-month and 3-month pricing plus combined bundles, backed by shared validation and pricing helpers (`src/utils/pricing.ts`).
- **Google Flow & Veo Spotlight**: Dedicated showcase highlighting Google One (`Gemini Plus`, `Google Flow & Veo`, and 5-member family sharing) for Tunisian content creators and e-commerce brands.
- **Interactive Payment Video Guide**: 16-second 1280×720 HD video (`public/videos/guide-d17-flouci.mp4`) with WebVTT subtitles, interactive chapter timeline (`src/utils/videoGuide.ts`), and instant WhatsApp support link.
- **AI Subscription Advisor (`/api/gemini/advisor`)**: Powered by `@google/genai` (`gemini-3.8-flash`) with deterministic fallback recommendations tailored to user profile and TND budget.
- **Order Checkout & Customer Order History**: End-to-end order placement (`#DG-XXXX`) stored in PostgreSQL with D17, Flouci, and RIB/CCP payment instructions plus pre-filled WhatsApp confirmation links.
- **Firebase Authentication**: Google Sign-In via Firebase Auth on the client (`src/lib/firebase.ts`) verified server-side on every protected endpoint using `firebase-admin` (`src/middleware/auth.ts`).
- **Built-in Admin Dashboard**: Role-restricted management modal (`src/components/AdminDashboardModal.tsx`) for viewing KPIs, filtering/updating order statuses and notes, inspecting client spend history, and moderating contact messages.
- **Interactive Tunisia Coverage & FAQ**: Regional activation map (`src/components/InteractiveMap.tsx`), searchable FAQ (`src/utils/faqData.ts`), testimonials, and authenticated contact form.

---

## Official Pricing Grid (TND)

| Category | Service | 1 Month | 3 Months | Notes |
| --- | --- | :---: | :---: | --- |
| **IA & Productivité** | **Google One** | 29 TND | 69 TND | Gemini Plus • Partage 5 proches • Google Flow & Veo |
| **IA & Productivité** | **Microsoft Office 365** | 19 TND | 49 TND | Word, Excel, PowerPoint |
| **Streaming & Musique** | **Shahid VIP** | 15 TND | 39 TND | Series, Arabic cinema & live TV |
| **Streaming & Musique** | **Spotify Premium** | 15 TND | 39 TND | Ad-free music & offline downloads |
| **Streaming & Musique** | **Prime TV** | 15 TND | 39 TND | Amazon Originals & 4K streaming |
| **Streaming & Musique** | **Apple TV+** | 15 TND | 39 TND | Apple Originals in 4K HDR |
| **Packs Combinés** | **Pack Pro & IA** | 42 TND | — | Google One + Microsoft Office 365 |
| **Packs Combinés** | **Pack Divertissement** | 25 TND | — | Spotify Premium + Shahid VIP or Prime TV |

---

## Local Payment & Support Channels

- **D17 (Poste Tunisienne)**: `58 570 825`
- **Flouci**: `@digipaiement` (`58 570 825`)
- **Bank / CCP Transfer**: RIB `08 000 01234567890 44` (BIAT / CCP Poste Tunisienne)
- **WhatsApp Support**: [+216 58 570 825](https://wa.me/21658570825)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react`, `motion`, `canvas-confetti` |
| **Backend** | Express 4 (`server.ts`) with Vite middleware in development and static `dist/` serving in production |
| **Database** | PostgreSQL (Cloud SQL `europe-west2`) via `pg` + Drizzle ORM (`drizzle-orm`, `drizzle-kit`) |
| **Authentication** | Firebase Authentication (`firebase`) + Firebase Admin SDK (`firebase-admin`) |
| **AI Integration** | Google GenAI SDK (`@google/genai`, `gemini-3.8-flash`) |
| **Testing** | Node.js built-in test runner (`node:test`) executed with `tsx` |

---

## Project Structure

```text
.
├── server.ts                        # Express server, API routes, Vite/static integration
├── index.html                       # HTML entry point & SEO meta tags
├── metadata.json                    # App metadata & capabilities
├── firebase-applet-config.json      # Firebase project configuration
├── public/
│   ├── assets/aistudio/             # Uploaded static media assets
│   └── videos/                      # HD D17/Flouci guide MP4, poster JPG & VTT captions
└── src/
    ├── App.tsx                      # Root application layout, modals & floating actions
    ├── context/AuthContext.tsx      # Firebase Google Sign-In auth context & token helper
    ├── lib/
    │   ├── firebase.ts              # Client Firebase initialization
    │   └── firebase-admin.ts        # Server Firebase Admin initialization
    ├── middleware/auth.ts           # requireAuth & requireAdmin Express middlewares
    ├── db/
    │   ├── index.ts                 # PostgreSQL connection pool & Drizzle instance
    │   ├── schema.ts                # Drizzle schema: users, orders, contact_messages
    │   ├── drizzle.config.ts        # Drizzle Kit configuration
    │   ├── users.ts                 # User persistence & listing queries
    │   ├── orders.ts                # Order creation, user lookup & admin CRUD
    │   └── contacts.ts              # Contact message creation, listing & deletion
    ├── utils/
    │   ├── admin.ts / admin.test.ts         # Admin authorization, stats & order filters
    │   ├── pricing.ts / pricing.test.ts     # TND catalog, validation & WhatsApp link builder
    │   ├── faqData.ts / faqData.test.ts     # FAQ dataset & category/search filtering
    │   └── videoGuide.ts / videoGuide.test.ts # Video guide chapters & timestamp helpers
    └── components/
        ├── Navbar.tsx               # Top bar with auth & conditional Admin button
        ├── Hero.tsx                 # Hero banner with TND quick highlights
        ├── CanvaProSpotlight.tsx    # Google One (Flow & Veo) creator/e-commerce spotlight
        ├── CatalogSection.tsx       # Interactive catalog & pricing matrix
        ├── HowItWorks.tsx           # 3-step onboarding + MP4 guide player & script memo
        ├── InteractiveMap.tsx       # Tunisia regional coverage visualization
        ├── Testimonials.tsx         # Customer reviews across Tunisia
        ├── FAQSection.tsx           # Searchable & filterable FAQ
        ├── ContactSection.tsx       # Authenticated contact form & direct channels
        ├── OrderModal.tsx           # Checkout modal & instant D17/Flouci instructions
        ├── OrdersModal.tsx          # Authenticated user's order history
        ├── AdminDashboardModal.tsx  # Restricted admin management console
        ├── GeminiAdvisor.tsx        # AI tool/pack recommendation modal
        └── Footer.tsx               # Footer with links, channels & legal info
```

---

## Database Schema

Defined in `src/db/schema.ts` (PostgreSQL via Drizzle ORM):

1. **`users`**: `id`, `uid` (unique Firebase UID), `email`, `display_name`, `created_at`
2. **`orders`**: `id`, `order_code` (unique `#DG-XXXX`), `user_id` (FK -> `users.id`), `full_name`, `email`, `phone`, `tool`, `plan_duration`, `payment_method`, `price_tnd`, `status` (`pending_payment` | `processing` | `activated` | `cancelled`), `notes`, `created_at`
3. **`contact_messages`**: `id`, `user_id` (FK -> `users.id`), `name`, `email`, `phone`, `subject`, `message`, `created_at`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/me` | Bearer Token | Syncs and returns the authenticated user profile |
| `POST` | `/api/gemini/advisor` | Public | Generates a personalized TND plan recommendation via Gemini |
| `GET` | `/api/orders` | Bearer Token | Lists all orders belonging to the signed-in user |
| `POST` | `/api/orders` | Bearer Token | Creates a new order and returns payment instructions & WhatsApp link |
| `POST` | `/api/contact` | Bearer Token | Persists a customer inquiry in `contact_messages` |
| `GET` | `/api/admin/overview` | Admin Only | Returns KPI stats, all orders, all users, and all messages |
| `PATCH` | `/api/admin/orders/:orderCode` | Admin Only | Updates an order's `status` and/or admin `notes` |
| `DELETE` | `/api/admin/orders/:orderCode` | Admin Only | Deletes an order by `orderCode` |
| `DELETE` | `/api/admin/messages/:id` | Admin Only | Deletes a contact message by numeric ID |

---

## Environment Variables

Configure these variables in your runtime environment (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key used server-side by `/api/gemini/advisor` (falls back gracefully if omitted) |
| `APP_URL` | Public URL where the app is hosted |
| `PORT` | HTTP server port (defaults to `3000`) |
| `SQL_HOST` | PostgreSQL / Cloud SQL host address |
| `SQL_USER` | PostgreSQL application user |
| `SQL_PASSWORD` | PostgreSQL application password |
| `SQL_DB_NAME` | PostgreSQL database name |
| `SQL_ADMIN_USER` | PostgreSQL admin user for `drizzle-kit` migrations (`src/db/drizzle.config.ts`) |
| `SQL_ADMIN_PASSWORD` | PostgreSQL admin password for `drizzle-kit` migrations |

Firebase project settings are stored in `firebase-applet-config.json`.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Push the database schema (if provisioning a fresh database)

```bash
npx drizzle-kit push --config=src/db/drizzle.config.ts
```

### 3. Run in development

```bash
npm run dev
```

The app and API will be served together on `http://localhost:3000`.

### 4. Build & run in production

```bash
npm run build
NODE_ENV=production npm run start
```

---

## Verification & Testing

| Check | Command |
| --- | --- |
| **TypeScript check** | `npm run lint` |
| **Production bundle** | `npm run build` |
| **Unit tests (20 tests)** | `npx tsx --test src/utils/admin.test.ts src/utils/pricing.test.ts src/utils/faqData.test.ts src/utils/videoGuide.test.ts` |

---

## Admin Access

The Admin Dashboard is strictly enforced both on the client UI and in backend middleware (`src/middleware/auth.ts` -> `requireAdmin`, requiring `email_verified === true` and matching `ADMIN_EMAIL` in `src/utils/admin.ts`):

1. Sign in with Google using **`mohamedkhaliljelassi00@gmail.com`**.
2. Click the **`Admin`** button in the navigation bar (or open `/?admin=1`).
3. Manage incoming orders, update activation statuses (`En attente de paiement` -> `En traitement` -> `Activé` / `Annulé`), inspect client totals, and review or remove contact messages.
