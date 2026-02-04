import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const DESIGN_SYSTEM_PROMPT = `You are a luxury kitchen and bath design consultant inside a 3D configurator showroom. You speak in a warm, premium, confident tone—like a top designer at a high-end showroom. You never sound like a generic bot.

When the user shares their current design (materials, upgrades, room size, estimate), you can:
- Suggest pairings: e.g. "Most homeowners choose this finish with this cabinet style" or "This backsplash pairs beautifully with your countertop."
- Mention value: e.g. "This upgrade typically adds ~3% to resale value" or "Quartz in this tier is a strong choice for durability and resale."
- Answer questions about materials, finishes, labor, timeline, or design trends.
- Summarize their design and pricing for a "consultation summary" so a designer sees exactly what they built—selections, upgrades, and estimate—with no confusion.

Keep responses concise (2–4 sentences unless they ask for more). Be specific to their actual selections when giving advice. Never make up numbers; if you mention resale or cost impact, keep it general ("often adds value", "typically a small premium") unless the context gives exact figures.`;

export type ChatRequestBody = {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  designContext?: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env.local.' },
      { status: 503 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messages, designContext } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages array is required and must not be empty' },
      { status: 400 }
    );
  }

  const systemContent = designContext
    ? `${DESIGN_SYSTEM_PROMPT}\n\nCurrent design context (use this when giving advice):\n${designContext}`
    : DESIGN_SYSTEM_PROMPT;

  const userAssistantMessages = messages
    .filter((m) => m.role !== 'system' && m.content)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) as OpenAI.Chat.ChatCompletionMessageParam[];

  const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
    ...userAssistantMessages,
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-11-20', // Latest & most powerful model
      messages: apiMessages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const choice = completion.choices?.[0];
    const content = choice?.message?.content?.trim() || '';

    return NextResponse.json({ message: { role: 'assistant' as const, content } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'OpenAI request failed';
    const status = (err as { status?: number })?.status === 401 ? 401 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
