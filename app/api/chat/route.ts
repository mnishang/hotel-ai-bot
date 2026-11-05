import { NextResponse } from "next/server";
import {
  AI_CHAT_MAX_CONTEXT_MESSAGES,
  AI_CHAT_MAX_MESSAGE_LENGTH,
  AI_CHAT_MAX_TOTAL_LENGTH,
} from "@/lib/ai-assistant/hotelKnowledge";
import { buildLocalReply } from "@/lib/ai-assistant/localReplies";
import { buildSystemPrompt } from "@/lib/ai-assistant/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

/** Simple in-memory, per-IP fixed-window rate limit. */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const RATE_LIMIT_MAX_BUCKETS = 5000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const forwardedIp = forwarded?.split(",")[0]?.trim();
  return forwardedIp || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    // Keep the map from growing forever in long-running processes.
    if (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
      for (const [bucketKey, value] of rateLimitBuckets) {
        if (value.resetAt <= now) rateLimitBuckets.delete(bucketKey);
      }

      if (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
        const oldestKey = rateLimitBuckets.keys().next().value;
        if (oldestKey !== undefined) rateLimitBuckets.delete(oldestKey);
      }
    }

    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((bucket.resetAt - now) / 1000),
      ),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "You're sending messages a little too quickly. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 100_000) {
    return errorResponse("That message is too large. Please shorten it.", 413);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }

  const rawMessages = (payload as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return errorResponse("Please send at least one message.", 400);
  }

  if (rawMessages.length > 50) {
    return errorResponse("Too many messages in this request.", 400);
  }

  const messages: ChatMessage[] = [];
  let totalLength = 0;

  for (const item of rawMessages.slice(-AI_CHAT_MAX_CONTEXT_MESSAGES)) {
    if (typeof item !== "object" || item === null) {
      return errorResponse("Invalid message format.", 400);
    }

    const { role, content } = item as { role?: unknown; content?: unknown };

    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return errorResponse("Invalid message format.", 400);
    }

    const trimmed = content.trim();
    if (!trimmed) {
      return errorResponse("Messages cannot be empty.", 400);
    }

    if (trimmed.length > AI_CHAT_MAX_MESSAGE_LENGTH) {
      return errorResponse(
        `Please keep each message under ${AI_CHAT_MAX_MESSAGE_LENGTH} characters.`,
        400,
      );
    }

    totalLength += trimmed.length;
    messages.push({ role, content: trimmed });
  }

  if (totalLength > AI_CHAT_MAX_TOTAL_LENGTH) {
    return errorResponse("This conversation is too long. Please start a new one.", 400);
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return errorResponse("The last message must be from the guest.", 400);
  }

  const localReply = buildLocalReply(messages);
  const apiKey = process.env.AI_API_KEY?.trim();
  const baseUrl = (
    process.env.AI_BASE_URL?.trim() || "https://api.openai.com/v1"
  ).replace(/\/+$/, "");
  const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";

  // No provider key? Answer from the built-in hotel knowledge instead of
  // showing an error. This is the default mode for local testing/demo.
  if (!apiKey) {
    console.warn(
      "[AI Assistant] AI_API_KEY is not set. Replying with built-in hotel knowledge.",
    );
    return NextResponse.json({ reply: localReply, mode: "local" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 500,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages,
        ],
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[AI Assistant] Provider returned ${response.status}: ${detail.slice(0, 500)}`,
      );
      return NextResponse.json({ reply: localReply, mode: "local" });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const reply = data.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      console.error("[AI Assistant] Provider returned an empty reply.");
      return NextResponse.json({ reply: localReply, mode: "local" });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    console.error(`[AI Assistant] Request failed (${name}).`);
    return NextResponse.json({ reply: localReply, mode: "local" });
  } finally {
    clearTimeout(timeout);
  }
}
