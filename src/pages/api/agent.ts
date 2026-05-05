import type { APIRoute } from "astro";
import { profile } from "../../data/profile";

// Marks this single endpoint as on-demand. The rest of the site stays static.
// Build-time deploy will require an adapter (added in Stop 13).
export const prerender = false;

type Body = { question?: unknown };

const FALLBACK = `I couldn't pull that up cleanly. You can reach John directly at ${profile.email}.`;

// Lightweight keyword-routed canned answers so the chat works end-to-end
// without an API key. Replaced by a real Anthropic call in production
// (see TODO below).
function cannedAnswer(question: string): string {
  const q = question.toLowerCase();

  if (/(\bai\b|llm|agent|rag|tool[- ]?call|vector|embedding)/.test(q)) {
    const aiSkills = profile.skills["AI & LLM Architecture"] ?? [];
    return [
      `Over the last year John has been architecting AI systems into production — agentic flows with tool-calling, RAG over vector databases, and multi-provider integrations across OpenAI, Anthropic, and Gemini.`,
      `Representative work: ${profile.projects[0].title} — ${profile.projects[0].summary}`,
      `Strengths in this area: ${aiSkills.slice(0, 4).join(", ")}.`,
    ].join(" ");
  }

  if (/(aws|cloud|infra|infrastructure|ec2|lambda|s3)/.test(q)) {
    return [
      `John has 8+ years on AWS — EC2, ECS, Lambda, API Gateway, SQS, SNS, S3, RDS, VPC, IAM — across compute, storage, networking, security, and CI/CD.`,
      `He's currently working through the AWS Solutions Architect Associate certification.`,
      `Cloud is the boring plumbing he layers AI products on top of.`,
    ].join(" ");
  }

  if (/(contract|hire|hiring|available|engagement|w2|c2c|freelance)/.test(q)) {
    return `Yes — John is open to W2, C2C, and international contract engagements. He's based in ${profile.location}. Best to reach out at ${profile.email}.`;
  }

  if (/(experience|background|history|where.*work|who is)/.test(q)) {
    const current = profile.experience[0];
    return `John is a ${profile.title} with ${profile.stats.yearsExp}+ years and ${profile.stats.clients}+ clients across ${profile.stats.industries} industries. Currently ${current.role} at ${current.company} (${current.period}). Based in ${profile.location}.`;
  }

  if (/(project|portfolio|work|built)/.test(q)) {
    const list = profile.projects
      .map((p) => `${p.title} (${p.industry}, ${p.year})`)
      .join("; ");
    return `Selected work: ${list}. Each one shipped into production for paying clients — happy to walk through any of them in more depth.`;
  }

  if (/(location|where.*based|calgary|canada)/.test(q)) {
    return `John is based in ${profile.location} and works across North American and international time zones.`;
  }

  return [
    profile.about[0],
    `He's currently focused on AI/LLM systems — agentic architectures, RAG pipelines, and multi-provider LLM integrations.`,
    `For a specific topic, ask about his AI work, AWS background, projects, or availability.`,
  ].join(" ");
}

export const POST: APIRoute = async ({ request }) => {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const question =
    typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return new Response(JSON.stringify({ error: "missing question" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (question.length > 600) {
    return new Response(JSON.stringify({ error: "question too long" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  // TODO(stop-13/launch): replace cannedAnswer() with the real Anthropic
  // Messages API call once ANTHROPIC_API_KEY is wired in:
  //
  //   import Anthropic from "@anthropic-ai/sdk";
  //   const client = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });
  //   const system = buildSystemPrompt(profile);   // see EdV2Chat ctx template
  //   const msg = await client.messages.create({
  //     model: "claude-haiku-4-5",
  //     max_tokens: 256,
  //     system,
  //     messages: [{ role: "user", content: question }],
  //   });
  //   const answer = msg.content[0]?.type === "text" ? msg.content[0].text : "";
  //
  // Also add per-IP rate limiting at this point — sliding window keyed off
  // the platform's edge IP header (e.g. x-real-ip / x-forwarded-for) backed
  // by an Upstash KV or in-memory map for low-volume usage.

  let answer: string;
  try {
    answer = cannedAnswer(question);
  } catch {
    answer = FALLBACK;
  }

  return new Response(JSON.stringify({ answer }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
