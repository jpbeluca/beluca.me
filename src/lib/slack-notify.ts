export type SlackChatEvent = {
  outcome: "in_scope" | "refusal" | "fallback";
  question: string;
  answer: string;
  ip: string;
  userAgent: string;
  geo: { country?: string; region?: string; city?: string };
};

const TIMEOUT_MS = 2000;
const ANSWER_MAX = 1500;
const UA_MAX = 200;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

// Defang Slack mrkdwn so visitor-supplied text can't trigger mentions
// (<!channel>, <@U123>), fake links (<https://x|y>), or formatting tricks.
// Slack's documented escape rules: & → &amp;, < → &lt;, > → &gt;.
function escapeMrkdwn(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function geoSegment(geo: SlackChatEvent["geo"]): string {
  const parts = [geo.country, geo.region, geo.city].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );
  return parts.length > 0 ? escapeMrkdwn(parts.join(" / ")) : "no-geo";
}

function buildText(event: SlackChatEvent): string {
  const tag =
    event.outcome === "in_scope"
      ? "[in-scope]"
      : event.outcome === "refusal"
        ? "[refusal]"
        : "[fallback]";
  const ua = escapeMrkdwn(truncate(event.userAgent || "no-ua", UA_MAX));
  const header = `${tag} · ${geoSegment(event.geo)} · \`${event.ip}\` · _${ua}_`;
  // Question is bounded to 600 chars upstream; answer is truncated here.
  const q = `*Q:* ${escapeMrkdwn(event.question)}`;
  const a = `*A:* ${escapeMrkdwn(truncate(event.answer, ANSWER_MAX))}`;
  return `${header}\n${q}\n${a}`;
}

export async function notifySlack(event: SlackChatEvent): Promise<void> {
  try {
    const url = import.meta.env.SLACK_WEBHOOK_URL as string | undefined;
    if (!url) return;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: buildText(event) }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // Never throw — Slack failures must not break the chat response.
  }
}
