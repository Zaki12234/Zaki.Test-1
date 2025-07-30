import NavBar from '../../components/NavBar';
import Link from 'next/link';

/**
 * Pricing page with two subscription tiers. Real Stripe checkout integration
 * would require an API route and keys – here we provide placeholders for
 * demonstration. Users should configure products and prices in Stripe and
 * implement checkout on the server.
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <NavBar />
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Choose your plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Basic</h2>
            <p className="text-2xl font-bold mb-4">£5<span className="text-sm text-gray-600">/mo</span></p>
            <ul className="text-left list-disc list-inside flex-1 mb-4 space-y-1">
              <li>Daily reminders</li>
              <li>AI chat (10 messages/day)</li>
            </ul>
            <button className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
              Subscribe
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col border-2 border-purple-600">
            <h2 className="text-xl font-semibold mb-2">Pro</h2>
            <p className="text-2xl font-bold mb-4">£15<span className="text-sm text-gray-600">/mo</span></p>
            <ul className="text-left list-disc list-inside flex-1 mb-4 space-y-1">
              <li>Unlimited AI chat</li>
              <li>Weekly AI-generated health summaries</li>
              <li>Personalized reminders</li>
            </ul>
            <button className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
              Subscribe
            </button>
          </div>
        </div>
        <p className="mt-8 text-sm text-gray-600">
          All plans include a 7‑day free trial. Prices are in GBP and processed via
          Stripe.
        </p>
      </main>
    </div>
  );
}