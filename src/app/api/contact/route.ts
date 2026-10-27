import { contactRequestSchema } from "@/components/contact/schema";
import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/contact (design spec §10.2). POST handlers always run at request
// time, so no segment config is needed (Cache Components forbids `dynamic`).
// The checks run in a fixed order: content type, size, origin, rate limit,
// JSON, honeypot and fill time, schema, then sending. Responses carry a short
// error code only; the message and the sender's address are never logged.

const MAX_BODY_BYTES = 10_240;
const MIN_FILL_MS = 3_000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

type ErrorCode = "invalid" | "rate_limited" | "unavailable" | "failed";

function ok() {
  return Response.json({ ok: true });
}

function fail(status: number, error?: ErrorCode, headers?: HeadersInit) {
  return Response.json({ ok: false, ...(error && { error }) }, { status, headers });
}

/** Reads the body as text, stopping as soon as it exceeds `limit` bytes. */
async function readBody(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/** True when an Origin header is present and names a different host than Host. */
function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return false;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    // Unparsable origins, including the opaque "null", are treated as foreign.
    return true;
  }
}

/**
 * Client IP for rate limiting: the first x-forwarded-for entry, else x-real-ip.
 * These headers are only trustworthy behind a proxy that sets them (e.g. Vercel).
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Honeypot filled, or the form was submitted too fast or too long after loading. */
function looksAutomated(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const { website, startedAt } = body as Record<string, unknown>;
  if (website !== undefined && website !== null && website !== "") return true;
  if (typeof startedAt === "number" && Number.isFinite(startedAt)) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) return true;
  }
  return false;
}

export async function POST(request: Request) {
  // 1. JSON only.
  const contentType = request.headers.get("content-type");
  if (contentType?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return fail(415);
  }

  // 2. Size: the declared length, then the bytes actually received.
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return fail(413);
  const text = await readBody(request, MAX_BODY_BYTES);
  if (text === null) return fail(413);

  // 3. Same origin only, when the browser says where the request came from.
  if (isCrossOrigin(request)) return fail(403);

  // 4. Rate limit per IP (per server instance; see rate-limit.ts).
  const limited = rateLimit(`contact:${clientIp(request)}`, RATE_LIMIT);
  if (!limited.ok) {
    return fail(429, "rate_limited", {
      "Retry-After": String(limited.retryAfterSeconds),
    });
  }

  // 5. Well-formed JSON.
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, "invalid");
  }

  // 6. Bots get a normal success response and nothing is sent.
  if (looksAutomated(body)) return ok();

  // 7. The same schema as the client; no field details in the response.
  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) return fail(400, "invalid");

  // 8. No provider configured (e.g. no verified sending domain yet): the
  //    client shows a mailto fallback that keeps the visitor's input.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail(503, "unavailable");

  // 9. Send.
  const sent = await sendContactEmail(parsed.data, apiKey);
  return sent ? ok() : fail(502, "failed");
}
