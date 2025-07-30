import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createSupabaseServerClient } from '../../../lib/supabaseClient';

/**
 * Weekly summary endpoint. POST body must include userId. It will fetch the
 * last 7 days of entries for that user, group by category, and ask OpenAI to
 * produce a concise 200–300 word summary with 3 prioritized suggestions. It
 * then stores the summary back into the `entries` table with category 'general'
 * and returns the summary in the response.
 */
export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    const supabase = createSupabaseServerClient();
    // Get entries from last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: entries, error } = await supabase
      .from('entries')
      .select('category, content')
      .eq('user_id', userId)
      .gte('created_at', since);
    if (error) throw error;
    const grouped = {};
    for (const entry of entries) {
      grouped[entry.category] = grouped[entry.category] || [];
      grouped[entry.category].push(entry.content);
    }
    let summaryInput = 'Weekly wellness log:\n';
    for (const [category, items] of Object.entries(grouped)) {
      summaryInput += `\n${category.toUpperCase()}:\n- ${items.join('\n- ')}\n`;
    }
    summaryInput +=
      '\nGenerate a concise 200–300 word summary of the user\'s wellness over the past week, and provide three prioritized suggestions for improvement.';
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a wellness summary generator. Summarise user logs.' },
        { role: 'user', content: summaryInput },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    const summary = completion.choices[0]?.message?.content?.trim() || '';
    // Store summary as a new entry
    const { error: insertError } = await supabase.from('entries').insert({
      user_id: userId,
      category: 'general',
      content: summary,
    });
    if (insertError) throw insertError;
    return NextResponse.json({ summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}