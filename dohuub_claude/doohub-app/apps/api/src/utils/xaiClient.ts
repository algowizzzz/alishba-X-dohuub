/**
 * Direct xAI (Grok) client — OpenAI-compatible chat completions endpoint.
 *
 * Bypasses mcp-intelligence-agent entirely. Used by routes/chat.ts. Returns
 * a final assistant message string; the caller is responsible for building
 * the context block + system prompt.
 *
 * Required env: XAI_API_KEY. Optional: XAI_MODEL (default grok-3),
 * XAI_MAX_TOKENS (default 1024).
 */
import { logger } from '../lib/logger';

const XAI_URL = 'https://api.x.ai/v1/chat/completions';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const FALLBACK_TEXT =
  "I'm having trouble reaching the assistant right now. Please try again in a moment.";

export async function askXai(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    logger.error('XAI_API_KEY not set — chat falling back');
    return 'Chat assistant is not configured (missing XAI_API_KEY).';
  }

  const model = process.env.XAI_MODEL || 'grok-3';
  const maxTokens = Number(process.env.XAI_MAX_TOKENS || 1024);

  try {
    const res = await fetch(XAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: maxTokens,
      }),
      // xAI usually responds in <10s; cap so a stuck request doesn't tie up
      // our process or the user's chat UI.
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.error({ status: res.status, body: body.slice(0, 400) }, 'xAI request failed');
      return FALLBACK_TEXT;
    }

    const data: any = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      logger.error({ data }, 'xAI returned empty/malformed content');
      return FALLBACK_TEXT;
    }
    return content;
  } catch (err: any) {
    logger.error({ err: err?.message }, 'xAI request threw');
    return FALLBACK_TEXT;
  }
}
