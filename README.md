# 🕌 KurbaniVag

> রংপুর থেকে ঢাকায় সুন্নাহসম্মত হালাল কোরবানি — ভাগে গরু, ঘরে মাংস।

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand
- **Backend**: Node.js + Express, Mongoose
- **Database**: MongoDB
- **Payment**: SSLCommerz
- **Fonts**: Playfair Display, Lora, Scheherazade New, Noto Serif Bengali

---

## Project Structure

```
kurbanivag/
├── backend/
│   ├── config/
│   │   └── pricing.json        ← Edit this to update all prices (no code change)
│   ├── models/
│   │   ├── User.js
│   │   ├── Cow.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cows.js
│   │   ├── bookings.js
│   │   └── payments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/               ← Cow photos stored here
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/app/
        ├── page.tsx            ← Homepage (cow listing)
        ├── cows/[id]/          ← Cow detail + booking panel
        ├── auth/login/         ← Login
        ├── auth/register/      ← 2-step registration with address
        ├── dashboard/          ← Order tracker
        ├── guide/              ← Rules & Sunnah guide
        ├── admin/              ← Admin panel (role-protected)
        └── checkout/failed/    ← Payment failed page
```

---

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, SSLCZ credentials

npm install
mkdir uploads

npm run dev   # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm install
npm run dev   # runs on http://localhost:3000
```

---

## Updating Prices

Edit `backend/config/pricing.json` — no code change needed, just restart the server.

```json
{
  "tiers": [
    {
      "cow_price_per_vag": 10000,
      "katakati": 800,
      "packaging": 500,
      "freezer_transport": 900,
      "last_mile_delivery": 300
    }
  ]
}
```

---

## Admin Setup

1. Register a user normally
2. In MongoDB, update that user's `role` field to `"admin"`:
   ```js
   db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
   ```
3. Visit `/admin` — you can now:
   - Create cow listings per tier
   - Update cow status (open → purchased → sacrificed → delivered)
   - Upload real cow photos
   - Add Etim-khana receipt URLs
   - Add poor-share distribution photo URLs

---

## Payment Flow

1. User selects cow + vag count → clicks "পেমেন্ট করুন"
2. Backend creates a Booking with `paymentStatus: 'pending'`
3. Backend calls SSLCommerz `/gwprocess/v4/api.php`
4. User is redirected to SSLCommerz gateway
5. On success, SSLCommerz POSTs to `/api/payments/success`
6. Booking is updated to `paymentStatus: 'paid'`
7. User redirected to `/dashboard?payment=success`

For testing, set `SSLCZ_IS_LIVE=false` to use sandbox.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | User | Get current user |
| GET | `/api/cows` | — | List all cows (with tier info) |
| GET | `/api/cows/tiers` | — | Get pricing tiers from JSON |
| GET | `/api/cows/:id` | — | Cow detail + partner list |
| POST | `/api/cows` | Admin | Create new cow listing |
| PATCH | `/api/cows/:id/photo` | Admin | Upload cow photo |
| PATCH | `/api/cows/:id/status` | Admin | Update cow status |
| POST | `/api/bookings` | User | Create booking (atomic slot reservation) |
| GET | `/api/bookings/my` | User | Get my bookings |
| GET | `/api/bookings/:id` | User | Get booking detail |
| POST | `/api/payments/initiate` | User | Start SSLCommerz payment |
| POST | `/api/payments/success` | — | SSLCommerz webhook |

---

## Key Features

- **Atomic slot reservation** — MongoDB transactions prevent double-booking
- **Pricing snapshot** — Prices locked at booking time, no future price changes affect paid orders
- **Guest browsing** — All cow pages visible without login; auth required only at checkout
- **Bangla-first UI** — Full Bangla with Islamic Arabic script accents
- **Progressive order tracker** — 7-step timeline from "slot open" to "delivered"
- **Donation transparency** — Etim-khana receipt + poor-share photo proofs in dashboard

---

*আল্লাহর নামে শুরু, তাঁরই সন্তুষ্টিতে শেষ। কোরবানি কবুল হোক। 🤲*
