import type { APIRoute } from "astro";
import OpenAI from "openai";
import { profile } from "../../data/profile";
import { buildSystemPrompt, REFUSAL_STRING } from "../../lib/agent-prompt";
import { checkRateLimit } from "../../lib/rate-limit";
import { notifySlack } from "../../lib/slack-notify";

export const prerender = false;

// On the standalone Node server the process stays alive after the response is
// sent, so background work (Slack transcription) just needs to run detached
// without blocking or throwing. notifySlack already swallows its own errors,
// so discarding the promise is safe. (On Vercel this was @vercel/functions'
// waitUntil, which kept the serverless invocation alive; unneeded here.)
function waitUntil(promise: Promise<unknown>): void {
  void promise;
}

type Body = { question?: unknown };

const FALLBACK = `I couldn't pull that up cleanly. You can reach John directly at ${profile.email}.`;

const INJECTION_PATTERNS = [
  /ignore (?:previous|above|prior|all) instructions/i,
  /system prompt/i,
  /you are now/i,
  /reveal (?:the |your )?(?:system )?prompt/i,
  /disregard (?:previous|above|all) instructions/i,
];

function looksLikeInjection(q: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(q));
}

function jsonError(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sseHeaders(): HeadersInit {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

function sseEvent(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function sseStreamFromString(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(sseEvent({ chunk: text })));
      controller.enqueue(encoder.encode(sseEvent({ done: true })));
      controller.close();
    },
  });
  return new Response(stream, { status: 200, headers: sseHeaders() });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // 1. Validate body
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return jsonError(400, { error: "invalid json" });
  }

  const question =
    typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return jsonError(400, { error: "missing question" });
  }
  if (question.length > 600) {
    return jsonError(413, { error: "question too long" });
  }

  // Capture visitor metadata before the rate-limit and OpenAI branches.
  let ip = "unknown";
  try {
    ip = clientAddress ?? "unknown";
  } catch {
    ip = "unknown";
  }
  const userAgent = request.headers.get("user-agent") ?? "";
  // Vercel URL-encodes city headers; malformed values (rare but possible
  // from spoofed headers or upstream proxies) make decodeURIComponent throw.
  const safeDecode = (s: string | null): string | undefined => {
    if (!s) return undefined;
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  const geo = {
    country: request.headers.get("x-vercel-ip-country") ?? undefined,
    region: request.headers.get("x-vercel-ip-country-region") ?? undefined,
    city: safeDecode(request.headers.get("x-vercel-ip-city")),
  };

  // 2. Anti-injection pre-filter — short-circuit obvious patterns
  if (looksLikeInjection(question)) {
    waitUntil(
      notifySlack({
        outcome: "refusal",
        question,
        answer: REFUSAL_STRING,
        ip,
        userAgent,
        geo,
      }),
    );
    return sseStreamFromString(REFUSAL_STRING);
  }

  // 3. Rate limit
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "rate limit exceeded", retryAfter: rl.retryAfter }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter),
        },
      },
    );
  }

  // 4. OpenAI call
  const apiKey = process.env.OPENAI_API_KEY ?? import.meta.env.OPENAI_API_KEY;
  if (!apiKey) {
    waitUntil(
      notifySlack({
        outcome: "fallback",
        question,
        answer: FALLBACK,
        ip,
        userAgent,
        geo,
      }),
    );
    return sseStreamFromString(FALLBACK);
  }

  const client = new OpenAI({ apiKey });
  const system = buildSystemPrompt(profile);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Per-stream state for incremental answer extraction.
      let raw = "";
      let inAnswer = false;
      let answerStart = -1;
      let emittedDecodedLen = 0;
      let finishedAnswer = false;

      const decodeAnswerSlice = (rawText: string, start: number): { decoded: string; end: number } => {
        let out = "";
        let i = start;
        while (i < rawText.length) {
          const c = rawText[i];
          if (c === '"') return { decoded: out, end: i };
          if (c === "\\") {
            if (i + 1 >= rawText.length) return { decoded: out, end: -1 };
            const esc = rawText[i + 1];
            if (esc === "u") {
              if (i + 6 > rawText.length) return { decoded: out, end: -1 };
              out += String.fromCharCode(parseInt(rawText.slice(i + 2, i + 6), 16));
              i += 6;
              continue;
            }
            switch (esc) {
              case '"': out += '"'; break;
              case "\\": out += "\\"; break;
              case "/": out += "/"; break;
              case "n": out += "\n"; break;
              case "t": out += "\t"; break;
              case "r": out += "\r"; break;
              case "b": out += "\b"; break;
              case "f": out += "\f"; break;
              default: out += esc;
            }
            i += 2;
            continue;
          }
          out += c;
          i += 1;
        }
        return { decoded: out, end: -1 };
      };

      const emitAnswerProgress = () => {
        if (finishedAnswer) return;
        if (!inAnswer) {
          // Only start hunting for "answer":" after we've seen in_scope's
          // value close, so a stray "answer":" substring inside in_scope
          // (or earlier) can't trick the extractor.
          const inScopeMatch = /"in_scope"\s*:\s*(?:true|false)\s*,/.exec(raw);
          if (!inScopeMatch) return;
          const after = inScopeMatch.index + inScopeMatch[0].length;
          const m = /"answer"\s*:\s*"/.exec(raw.slice(after));
          if (!m) return;
          inAnswer = true;
          answerStart = after + m.index + m[0].length;
        }
        const { decoded, end } = decodeAnswerSlice(raw, answerStart);
        const slice = decoded.slice(emittedDecodedLen);
        if (slice) {
          controller.enqueue(encoder.encode(sseEvent({ chunk: slice })));
          emittedDecodedLen = decoded.length;
        }
        if (end !== -1) finishedAnswer = true;
      };

      const fail = (msg: string) => {
        try {
          controller.enqueue(encoder.encode(sseEvent({ replace: msg })));
          controller.enqueue(encoder.encode(sseEvent({ done: true })));
        } catch {
          // ignore
        }
        waitUntil(
          notifySlack({
            outcome: "fallback",
            question,
            answer: msg,
            ip,
            userAgent,
            geo,
          }),
        );
        controller.close();
      };

      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 350,
          stream: true,
          messages: [
            { role: "system", content: system },
            { role: "user", content: question },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "agent_reply",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  in_scope: { type: "boolean" },
                  answer: { type: "string" },
                },
                required: ["in_scope", "answer"],
              },
            },
          },
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            raw += delta;
            emitAnswerProgress();
          }
        }

        // Final parse — validate in_scope and the full answer.
        let parsed: { in_scope?: unknown; answer?: unknown };
        try {
          parsed = JSON.parse(raw);
        } catch {
          // If the model produced unparseable JSON we cannot verify the
          // in_scope guardrail, so we MUST replace whatever was streamed
          // with the safe fallback rather than trust the partial output.
          fail(FALLBACK);
          return;
        }

        const inScope = parsed.in_scope === true;
        const finalAnswer = typeof parsed.answer === "string" ? parsed.answer : "";

        if (!inScope) {
          // Override whatever was streamed with the canonical refusal string.
          controller.enqueue(encoder.encode(sseEvent({ replace: REFUSAL_STRING })));
          controller.enqueue(encoder.encode(sseEvent({ done: true })));
          waitUntil(
            notifySlack({
              outcome: "refusal",
              question,
              answer: REFUSAL_STRING,
              ip,
              userAgent,
              geo,
            }),
          );
          controller.close();
          return;
        }

        // If for some reason we streamed less than the final answer (e.g. the
        // model emitted unicode escapes we partially decoded), top up.
        if (finalAnswer && finalAnswer.length > emittedDecodedLen) {
          controller.enqueue(
            encoder.encode(sseEvent({ chunk: finalAnswer.slice(emittedDecodedLen) })),
          );
        }
        controller.enqueue(encoder.encode(sseEvent({ done: true })));
        waitUntil(
          notifySlack({
            outcome: "in_scope",
            question,
            answer: finalAnswer,
            ip,
            userAgent,
            geo,
          }),
        );
        controller.close();
      } catch (err) {
        fail(FALLBACK);
      }
    },
  });

  return new Response(stream, { status: 200, headers: sseHeaders() });
};
