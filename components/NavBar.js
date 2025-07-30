import Link from 'next/link';

/**
 * Simple navigation bar used across the app. Adjust the links depending on
 * authentication state if desired (for MVP we keep them static). When a user
 * is signed in, you might swap the Login link for Dashboard or Profile.
 */
export default function NavBar() {
  return (
    <nav className="w-full py-4 px-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-900 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          WellPal AI
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}