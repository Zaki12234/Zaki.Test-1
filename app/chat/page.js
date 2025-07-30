"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import NavBar from '../../components/NavBar';

/**
 * Chat page for interacting with the AI wellness assistant. Stores messages
 * on the server and uses OpenAI via an API route. Requires authentication.
 */
export default function ChatPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I\'m WellPal, your AI wellness coach. Ask me anything about hydration, sleep, or mood!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setSession(session);
    };
    fetchSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession) {
        router.push('/login');
      } else {
        setSession(newSession);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok) {
        throw new Error('Failed to get response');
      }
      const data = await res.json();
      const assistantReply = data.reply;
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
      // Log both user question and assistant reply into Supabase entries table.
      if (session) {
        const categorize = (text) => {
          const t = text.toLowerCase();
          if (t.includes('sleep')) return 'sleep';
          if (t.includes('hydration') || t.includes('water')) return 'hydration';
          if (t.includes('mood') || t.includes('stress')) return 'mood';
          return 'general';
        };
        const cat = categorize(userMessage.content);
        // Insert both user question and assistant response
        await supabase.from('entries').insert([
          {
            user_id: session.user.id,
            category: cat,
            content: userMessage.content,
          },
          {
            user_id: session.user.id,
            category: 'general',
            content: assistantReply,
          },
        ]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Oops! Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <NavBar />
      <main className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">Chat with WellPal</h1>
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-white rounded shadow">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 text-sm">Thinking…</div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Ask me about your wellness…"
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}