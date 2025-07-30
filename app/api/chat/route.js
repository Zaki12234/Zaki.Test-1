import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// System prompt instructing the assistant to be supportive and concise.
const SYSTEM_PROMPT = `You are "WellPal," a friendly, supportive AI wellness assistant. You help users with wellness queries—hydration, sleep, mood, simple stress management, fitness tips. Keep answers clear, concise (50–100 words max), friendly, motivational. Never provide medical diagnoses or medical advice—always redirect serious issues to healthcare professionals. Use an empathetic, supportive tone ("I understand how you're feeling...", "Great question!", "You're doing great!"). End responses with actionable tips or gentle encouragement.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
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
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    const reply = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}