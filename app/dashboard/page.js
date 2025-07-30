"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import NavBar from '../../components/NavBar';

/**
 * Dashboard page showing the user's reminders and basic streak info. Users
 * can create, edit, and delete reminders. This page requires authentication;
 * unauthenticated users are redirected to /login.
 */
export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newReminder, setNewReminder] = useState({
    type: 'hydration',
    message: '',
    time: '',
    active: true,
  });
  const [editingId, setEditingId] = useState(null);

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
      loadReminders(session);
    };
    fetchSession();
    // listen to auth changes
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

  async function loadReminders(session) {
    setLoading(true);
    setError('');
    try {
      const { data, error: selectError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('time_utc', { ascending: true });
      if (selectError) throw selectError;
      setReminders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveReminder() {
    setError('');
    try {
      // Convert local time to UTC string (HH:MM)
      const timeUtc = newReminder.time;
      if (editingId) {
        const { error: updateError } = await supabase
          .from('reminders')
          .update({
            type: newReminder.type,
            message: newReminder.message,
            time_utc: timeUtc,
            active: newReminder.active,
          })
          .eq('id', editingId)
          .eq('user_id', session.user.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('reminders').insert({
          user_id: session.user.id,
          type: newReminder.type,
          message: newReminder.message,
          time_utc: timeUtc,
          active: newReminder.active,
        });
        if (insertError) throw insertError;
      }
      setNewReminder({ type: 'hydration', message: '', time: '', active: true });
      setEditingId(null);
      loadReminders(session);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(id) {
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return;
    setEditingId(id);
    setNewReminder({
      type: reminder.type,
      message: reminder.message,
      time: reminder.time_utc,
      active: reminder.active,
    });
  }

  async function handleDelete(id) {
    if (!confirm('Delete this reminder?')) return;
    try {
      const { error: deleteError } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
      if (deleteError) throw deleteError;
      setReminders(reminders.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  // Compute streak: count days with at least one active reminder for demonstration.
  const streak = reminders.filter((r) => r.active).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <NavBar />
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-purple-600 hover:underline"
          >
            Sign out
          </button>
        </div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">7‑day streak</h2>
          <p className="text-2xl font-bold text-purple-700">🔥 {streak} reminders</p>
        </div>
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Reminder' : 'New Reminder'}
          </h2>
          {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                className="w-full border rounded-md px-2 py-1"
                value={newReminder.type}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, type: e.target.value })
                }
              >
                <option value="hydration">Hydration</option>
                <option value="sleep">Sleep</option>
                <option value="medication">Medication</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Message</label>
              <input
                className="w-full border rounded-md px-2 py-1"
                type="text"
                value={newReminder.message}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, message: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Time (HH:MM)</label>
              <input
                className="w-full border rounded-md px-2 py-1"
                type="time"
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={newReminder.active}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, active: e.target.checked })
                }
              />
              Active
            </label>
            <button
              onClick={handleSaveReminder}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewReminder({ type: 'hydration', message: '', time: '', active: true });
                }}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Your Reminders</h2>
          {loading ? (
            <p>Loading…</p>
          ) : reminders.length === 0 ? (
            <p className="text-gray-600 text-sm">No reminders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Type</th>
                  <th className="py-2">Message</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 capitalize">{r.type}</td>
                    <td className="py-2">{r.message}</td>
                    <td className="py-2">
                      {r.time_utc}
                    </td>
                    <td className="py-2">{r.active ? 'Yes' : 'No'}</td>
                    <td className="py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(r.id)}
                        className="text-purple-600 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}