<div align="center">

# 🛒 বাজার দর · BazarDor

**প্রয়োজনীয় পণ্যের দাম এক নজরে।**
Daily essential-commodity prices in Bangladesh — rice, lentils, oil, vegetables, fish, meat, eggs & spices — with market-by-market comparison.

</div>

## 📖 Description

BazarDor is a responsive Next.js web app that shows today's market prices (in Bengali, with Bengali numerals) for everyday goods. Browse by category, see which prices rose or fell today, sort by price, and — after signing in — open a product to compare minimum, maximum and average prices across different bazaars.

## 🧰 Technologies used

| Purpose | Tech |
| --- | --- |
| Framework | **Next.js 15** (App Router) + **React 19** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** + **DaisyUI 5** |
| Authentication | **Better Auth** (email/password, Google, GitHub) |
| Database | **MongoDB** (production) · SQLite file (local dev only) |
| Notifications | **react-hot-toast** |
| Data | Bazardor REST API (with automatic fail-over to the alternative base URLs) |

## ✨ Key features

1. **Live price ticker & Bangla date** – an infinite marquee (pauses on hover) of emoji, name, price per unit and ▲/▼ change %.
2. **Risers & fallers** – "আজ দাম বেড়েছে ▲" and "আজ দাম কমেছে ▼" show the top 6 movers; "সব পণ্য" lists every product in a responsive grid with search.
3. **Category pages with numeric sorting** – ডিফল্ট / দাম: কম থেকে বেশি / দাম: বেশি থেকে কম. Prices are parsed from Bengali numerals so sorting is by value, not string.
4. **Protected product detail page** – min / max / average price, cheapest & dearest bazaar, per-market table and a market-comparison chart.
5. **Complete authentication** – email/password + Google + GitHub via Better Auth, toast feedback for every login / signup / logout / validation / protected-route redirect.
6. **Profile & update information** – view your profile and change your name (`authClient.updateUser`).
7. **Great loading & error states** – skeleton loaders, friendly 404 for unknown routes, empty category state, fully responsive (mobile → desktop).

## 🚀 Getting started

```bash
git clone <your-repo-url> && cd bazardor
npm install
cp .env.example .env.local     # fill in the values
npm run db:migrate             # only for local SQLite dev (no MONGODB_URI)
npm run dev                    # http://localhost:3000
```

### Environment variables

| Name | Description |
| --- | --- |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` | Public URL of the app (e.g. `https://your-app.vercel.app`) |
| `MONGODB_URI`, `MONGODB_DB` | MongoDB connection (required in production) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app. Redirect URI: `<APP_URL>/api/auth/callback/google` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app. Callback URL: `<APP_URL>/api/auth/callback/github` |
| `NEXT_PUBLIC_API_URL` | *(optional)* override for the products API |

### Deploying to Vercel

1. Import the repo, add the environment variables above, deploy.
2. Dynamic routes (`/category/[slug]`, `/product/[slug]`) are rendered on demand, so refreshing any page works.

## 🗺️ Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Hero, risers, fallers, all products | Public |
| `/category/[slug]` | Category list + sorting | Public |
| `/product/[slug]` | Product detail & market comparison | 🔒 Login required |
| `/signin`, `/signup` | Authentication | Public |
| `/profile`, `/profile/update` | Profile & update name | 🔒 Login required |
| anything else | 404 page | — |

## 📝 Notes

- All prices are indicative: *সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।*
- If none of the API endpoints are reachable, the app falls back to a small built-in dataset so the UI never breaks.
