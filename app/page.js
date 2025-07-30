import NavBar from '../components/NavBar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          AI‑powered wellness companion
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-8">
          WellPal AI helps you stay on top of hydration, sleep, and mood with
          smart reminders, friendly chat, and weekly insights – built with
          GPT‑4.
        </p>
        <Link
          href="/login"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}