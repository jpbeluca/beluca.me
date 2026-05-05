import { p as profile } from '../../chunks/profile_CsjIYOgr.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const FALLBACK = `I couldn't pull that up cleanly. You can reach John directly at ${profile.email}.`;
function cannedAnswer(question) {
  const q = question.toLowerCase();
  if (/(\bai\b|llm|agent|rag|tool[- ]?call|vector|embedding)/.test(q)) {
    const aiSkills = profile.skills["AI & LLM Architecture"] ?? [];
    return [
      `Over the last year John has been architecting AI systems into production — agentic flows with tool-calling, RAG over vector databases, and multi-provider integrations across OpenAI, Anthropic, and Gemini.`,
      `Representative work: ${profile.projects[0].title} — ${profile.projects[0].summary}`,
      `Strengths in this area: ${aiSkills.slice(0, 4).join(", ")}.`
    ].join(" ");
  }
  if (/(aws|cloud|infra|infrastructure|ec2|lambda|s3)/.test(q)) {
    return [
      `John has 8+ years on AWS — EC2, ECS, Lambda, API Gateway, SQS, SNS, S3, RDS, VPC, IAM — across compute, storage, networking, security, and CI/CD.`,
      `He's currently working through the AWS Solutions Architect Associate certification.`,
      `Cloud is the boring plumbing he layers AI products on top of.`
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
    const list = profile.projects.map((p) => `${p.title} (${p.industry}, ${p.year})`).join("; ");
    return `Selected work: ${list}. Each one shipped into production for paying clients — happy to walk through any of them in more depth.`;
  }
  if (/(location|where.*based|calgary|canada)/.test(q)) {
    return `John is based in ${profile.location} and works across North American and international time zones.`;
  }
  return [
    profile.about[0],
    `He's currently focused on AI/LLM systems — agentic architectures, RAG pipelines, and multi-provider LLM integrations.`,
    `For a specific topic, ask about his AI work, AWS background, projects, or availability.`
  ].join(" ");
}
const POST = async ({ request }) => {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return new Response(JSON.stringify({ error: "missing question" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (question.length > 600) {
    return new Response(JSON.stringify({ error: "question too long" }), {
      status: 413,
      headers: { "Content-Type": "application/json" }
    });
  }
  let answer;
  try {
    answer = cannedAnswer(question);
  } catch {
    answer = FALLBACK;
  }
  return new Response(JSON.stringify({ answer }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
