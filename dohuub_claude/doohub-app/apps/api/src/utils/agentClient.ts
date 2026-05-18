/**
 * Client for the mcp-intelligence-agent at AGENT_BASE_URL.
 *
 * - Logs in once with the DoHuub service account and caches the JWT.
 * - Calls /api/agent/run, consumes the SSE stream, and returns the agent's
 *   final assistant text concatenated.
 *
 * The DoHuub worker (w-dohuub) is prompted to emit a single JSON object as its
 * final message, matching the shape that mobile already renders:
 *   { content: string, metadata: { type: 'text' | 'service-cards' | 'category-chips', ... } }
 */

const AGENT_BASE_URL = process.env.AGENT_BASE_URL || 'http://localhost:8000';
const AGENT_SERVICE_USER = process.env.AGENT_SERVICE_USER || 'dohuub_service';
const AGENT_SERVICE_PASSWORD = process.env.AGENT_SERVICE_PASSWORD || '';

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAgentToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const res = await fetch(`${AGENT_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: AGENT_SERVICE_USER, password: AGENT_SERVICE_PASSWORD }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`agent login ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as { token: string };
  cachedToken = { token: data.token, expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000 };
  return data.token;
}

export interface AgentReply {
  content: string;
  metadata: Record<string, unknown>;
}

const FALLBACK: AgentReply = {
  content: "I'm having trouble reaching the assistant right now. Please try again in a moment.",
  metadata: { type: 'text' },
};

function extractJson(raw: string): AgentReply | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const candidates: string[] = [];
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) candidates.push(fenced[1]);
  candidates.push(trimmed);
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }
  for (const c of candidates) {
    try {
      const parsed = JSON.parse(c) as AgentReply;
      if (parsed && typeof parsed.content === 'string') {
        if (!parsed.metadata || typeof parsed.metadata !== 'object') {
          parsed.metadata = { type: 'text' };
        }
        return parsed;
      }
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

export async function askDohuubAgent(
  query: string,
  threadId?: string,
): Promise<AgentReply & { threadId?: string }> {
  if (!AGENT_SERVICE_PASSWORD) {
    return { ...FALLBACK, content: 'Chat assistant is not configured (missing AGENT_SERVICE_PASSWORD).' };
  }

  let token: string;
  try {
    token = await getAgentToken();
  } catch (err) {
    console.error('[agentClient] login failed:', err);
    return FALLBACK;
  }

  const res = await fetch(`${AGENT_BASE_URL}/api/agent/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, worker_id: 'w-dohuub', thread_id: threadId || '' }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => '');
    console.error('[agentClient] run failed:', res.status, body.slice(0, 200));
    return FALLBACK;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let textOut = '';
  let returnedThreadId: string | undefined;
  let errorMsg: string | undefined;

  const handleLine = (raw: string) => {
    if (!raw.startsWith('data:')) return;
    const payload = raw.slice(5).trim();
    if (!payload || payload === '[DONE]') return;
    try {
      const obj = JSON.parse(payload);
      if (obj.type === 'session' && obj.thread_id) returnedThreadId = obj.thread_id;
      else if (obj.type === 'text' && typeof obj.text === 'string') textOut += obj.text;
      else if (obj.type === 'error' && obj.message) errorMsg = String(obj.message);
    } catch {
      /* ignore non-JSON lines */
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      handleLine(buffer.slice(0, nl).replace(/\r$/, ''));
      buffer = buffer.slice(nl + 1);
    }
  }
  if (buffer.trim()) handleLine(buffer);

  if (errorMsg) {
    console.error('[agentClient] agent error:', errorMsg);
    return { ...FALLBACK, content: `Assistant error: ${errorMsg}` };
  }

  const parsed = extractJson(textOut);
  if (parsed) return { ...parsed, threadId: returnedThreadId };

  return {
    content: textOut.trim() || FALLBACK.content,
    metadata: { type: 'text' },
    threadId: returnedThreadId,
  };
}
