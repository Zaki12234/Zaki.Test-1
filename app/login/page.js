"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import NavBar from '../../components/NavBar';

/**
 * Login / Signup page. Provides simple email+password auth and Google OAuth
 * via Supabase. After authentication, users are redirected to /dashboard.
 */
export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      // On success, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (oauthError) throw oauthError;
      // Supabase will handle redirect
    } catch (err) {
      setError(err.message || 'OAuth error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <NavBar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? 'Create an account' : 'Sign in to WellPal AI'}
          </h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Loading…' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="my-4 flex items-center justify-between">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-purple-600 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
          <div className="border-t pt-4 mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="20"
                height="20"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.9 0 6.7 1.7 8.2 3.2l6-5.7C34.4 2.4 29.7 0 24 0 14.7 0 6.7 5.6 2.6 13.7l7.9 6.1C13.2 12.3 18 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24c0-1.5-.1-2.9-.4-4.3H24v8.1h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.7-9.9 6.7-16.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.5 28.3c-1.1-3.3-1.1-6.8 0-10.1L2.6 12C-1.5 20.2-1.5 27.8 2.6 36l7.9-6.1z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.5 0 12-2.1 16-5.8l-7.3-5.7c-2.2 1.5-5 2.3-8.7 2.3-5.9 0-11-3.5-13.2-8.5l-7.9 6.1C6.7 42.4 14.7 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}