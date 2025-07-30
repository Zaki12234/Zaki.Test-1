## WellPal AI

This repository contains the source code for **WellPal AI**, a minimal MVP for a personalised wellness companion. It uses **Next.js** (App Router + Tailwind), **Supabase** for authentication and data storage, the **OpenAI API** for AI‑powered chat and weekly summaries, and **Stripe** (placeholder) for subscriptions.

### Features

* Landing page with a clear call‑to‑action.
* Authentication via email/password and Google OAuth using Supabase.
* User dashboard with CRUD for wellness reminders (hydration, sleep, medication, custom).
* Chat page powered by GPT‑4 (via the OpenAI API) with logs stored in Supabase.
* Weekly summary endpoint that summarises the last 7 days of user entries and stores the result.
* Pricing page with Basic and Pro plans (Stripe integration stubbed out).

### Getting Started

1. **Install dependencies** (after cloning or extracting this repo):

```bash
npm install
```

2. **Configure environment variables** by creating a `.env.local` file in the root with the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key   # Only needed if you implement Stripe
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret # Only needed if you implement Stripe webhooks
```

3. **Run the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can register and log in, create reminders, chat with the assistant, generate weekly summaries, and view pricing tiers.

### Deployment

Deploy this app to Lovable or any Next.js‑compatible hosting platform. Make sure to set the environment variables above in your hosting provider. If using Lovable, install the Supabase integration for secure storage of your API keys.

### Notes

* The chat and weekly summary features use the OpenAI API. Costs may incur based on usage.
* The subscription flow and Stripe webhook are stubbed out. You must implement the checkout session creation and webhook handling for real payments.
* Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It must only be used on server routes such as `/api/weekly-summary`.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
