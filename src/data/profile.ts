export type ExperienceJob = {
  company: string;
  role: string;
  period: string;
  location: string;
  url?: string;
  blurb: string;
  bullets: string[];
};

export type Project = {
  id: string;
  title: string;
  industry: string;
  year: string;
  role: string;
  summary: string;
  stack: string[];
  impact: string;
  details: string[];
  image: string;
  link?: string;
};

export type Skills = Record<string, string[]>;

export const profile = {
  name: "John Beluca",
  fullName: "John Beluca",
  title: "Senior Solutions Architect",
  focus: "AI & LLM Systems",
  location: "Calgary, Canada",
  email: "jpbeluca@gmail.com",
  linkedin: "linkedin.com/in/beluca",
  linkedinUrl: "https://www.linkedin.com/in/beluca",

  tagline:
    "I design and ship production AI systems — agents, RAG pipelines, and the boring cloud plumbing that holds them together.",

  about: [
    "I'm a Solutions Architect with 12+ years building cloud and software systems for 40+ clients across manufacturing, SaaS, healthcare, agribusiness, retail, and engineering.",
    "Over the last year I've focused on architecting and shipping AI/LLM-powered solutions into production — agentic systems with tool-calling, RAG pipelines on vector databases, multi-provider integrations across OpenAI, Anthropic, and Gemini.",
    "I work at the intersection of business strategy and technical execution — sitting with founders and C-levels during discovery, then leading engineering teams through delivery and long-term operations. I'm open to contracts, just contact me on my email",
  ],

  stats: {
    yearsExp: 12,
    clients: 40,
    awsYears: 8,
    industries: 6,
  },

  experience: [
    {
      company: "Procedo Software Solutions",
      role: "Solutions Architect & Technical Lead",
      period: "Jul 2018 — Present",
      location: "São Paulo, Brazil",
      url: "https://procedo.dev",
      blurb:
        "Technology consulting firm specializing in solution architecture and cloud-based systems.",
      bullets: [
        "Led end-to-end client engagements as primary Solutions Architect — discovery, scoping, design.",
        "Designed, deployed and operated AWS architectures for 8+ years across compute, storage, networking, security and CI/CD.",
        "Led adoption of AI/LLM solutions: multi-provider integration, agentic architectures, RAG pipelines, prompt engineering.",
        "Built and led cross-functional teams across engineering, marketing, sales, admin.",
        "Maintained client relationships running close to a decade.",
      ],
    },
    {
      company: "Tromp Tecnologia",
      role: "Solutions Analyst / Software Engineer",
      period: "Jun 2011 — Jul 2018",
      location: "São Paulo, Brazil",
      blurb: "TOTVS ERP customization and support for industrial manufacturing clients.",
      bullets: [
        "Translated business processes into ERP enhancements for industrial clients.",
        "Designed product evolution roadmaps with client stakeholders.",
        "Database maintenance and performance optimization across production ERP environments.",
      ],
    },
    {
      company: "TOTVS",
      role: "Solutions Analyst / Software Engineer",
      period: "Feb 2006 — Jun 2011",
      location: "São Paulo, Brazil",
      url: "https://en.totvs.com",
      blurb: "Brazil's leading enterprise software company.",
      bullets: [
        "Partnered with C-level execs to translate strategy into technical solutions across Finance, Manufacturing, Billing, Procurement, Sales.",
        "Designed and documented architectural specs for ERP extensions, integrations, multi-tenant SaaS capabilities.",
        "Oversaw database architecture, observability and access control for production reliability.",
        "Notable: Contributed to ERP evolution at WEG Brasil (~2,000 employees, multi-site).",
      ],
    },
  ] satisfies ExperienceJob[],

  projects: [
    {
      id: "full-engage",
      title: "Full Engage — Operating System for Multi-Client Consultants",
      industry: "B2B SaaS / Consulting Operations",
      year: "2026",
      role: "Founder & Lead Engineer",
      summary:
         "A multi-tenant SaaS that gives fractional executives and advisory firms one operational backbone for every client engagement — tasks, meetings, notes, time tracking, and an AI co-pilot, all isolated per client workspace.",
      stack: [
        "Next.js 16",
        "React 19",                
        "Neo Database + Prisma",
        "OpenAI",
        "Stripe",
        "AI SDK + OpenAI",
        "RAG + Vector Embeddings",        
      ],
      impact:
        "Replaces the consultant's daily stack — CRM, planner, time tracking, and knowledge base — with one workspace, killing the context-switching between Notion, Asana, and Google Calendar across multiple clients.",
      details: [
        "Designed a strict multi-tenant architecture: every query is filtered by organizationId, with platform-admin and org-role (owner / admin / member) layered on top, plus a privacy model that hides assigned tasks from non-assignees and renders read-only summaries for time-blocking events.",
        "Built a dual API surface — tRPC v11 for the in-app client and a versioned REST API (app/api/v1/) wrapped in withApiKeyAuth — so external integrations (Google Calendar, Microsoft 365, Slack, QuickBooks, Zapier) hit the same business logic as the product UI.",
        "Implemented an AI co-pilot with a RAG pipeline: notes and uploaded files are parsed, chunked, embedded, and stored as vectors, then surfaced to a tool-calling agent that can search, summarize activity, draft agendas, and reference org context inside a chat scoped to the active client.",
        "Shipped a unified Planner with cross-view drag-and-drop (calendar reschedule, kanban status changes), 15-minute snap, optimistic mutations with automatic rollback, bulk operations up to 100 items, and ghost rendering for items from non-active clients so consultants can spot scheduling conflicts without losing focus.",
        "Built an organization-wide Audit Log: every create / update / delete across tRPC and REST emits a fire-and-forget audit entry with actor, IP, user-agent, and auth method (session vs API key), giving compliance-conscious clients a complete trail.",
        "Established a testing discipline that's mandatory for every new feature: Vitest unit + DB-integration tests with factories under tests/support/factories, with explicit coverage for multi-tenant isolation (data from org A must never leak to org B).",
      ],
      image: "/images/work/full-engage.svg",
      link: "https://fullengage.ai",
    },
    {
      id: "gipo-saas-platform",
      title: "Gipo — SaaS Project & Productivity Management Platform",
      industry: "SaaS / Project Management",
      year: "2022-Present",
      role: "Founder & Solutions Architect",
      summary:
        "Cloud-native SaaS platform focused on project management, time tracking, productivity analytics, and operational cost control for modern teams.",
      stack: [
        "AWS",
        "PHP",        
        "MySQL",
        "WebSocket",
        "Stripe",
        "Docker",
        "REST API",
      ],
      impact:
        "Built a scalable subscription-based SaaS platform enabling companies to improve workflow visibility, optimize team productivity, and control operational costs in real time.",
      details: [
        "Designed and implemented scalable SaaS architecture hosted on AWS.",
        "Developed real-time task and time tracking capabilities using WebSocket technologies.",
        "Integrated Stripe subscription billing for automated recurring revenue operations.",
        "Created analytics and productivity monitoring features for operational visibility.",
        "Built APIs and integrations supporting extensibility and automation.",
        "Structured the platform for scalability, multi-team collaboration, and continuous delivery.",
      ],
      image: "/images/work/gipo.svg",
      link: "https://gipo.io",
    },
    
    {
      id: "b2b-crm",
      title: "B2B Commercial Operations & CRM Platform",
      industry: "Manufacturing & Distribution",
      year: "2017-Present",
      role: "Solutions Architect",
      summary:
        "Custom CRM for a 300+ person manufacturing group with hundreds of millions in annual revenue. Centralizes commercial operations end-to-end.",
      stack: ["AWS EC2", "S3", "SES", "REST APIs", "Google APIs", "ERP Integration"],
      impact:
        "Core daily system for sales and customer management — improved data consistency, reduced manual work.",
      details: [
        "Integrated architecture covering customer management, sales workflows, order lifecycle, reporting.",
        "ERP integration via REST APIs.",
        "Built on AWS with external integrations to Google APIs.",
      ],
      image: "/images/work/b2b-crm.svg",
    },
  ] satisfies Project[],

  skills: {
    "AI & LLM Architecture": [
      "LLM Integration (OpenAI, Anthropic, Gemini)",
      "Agentic Systems / Tool-Calling",
      "RAG & Vector Databases",
      "Prompt Engineering & Token Optimization",
      "AI Guardrails & Human-in-the-Loop",
      "AI-Assisted Dev Workflows",
    ],
    Architecture: [
      "Solution Architecture & Discovery",
      "Multi-tenant SaaS",
      "REST APIs & Event-Driven",
      "Domain-Driven Design",
      "Security-by-Design",
      "C4 Model / ADRs",
    ],
    "Cloud & Infra": [
      "AWS (8+ yrs) — EC2, ECS, Lambda, API Gateway, SQS, SNS, S3, RDS, VPC, IAM",
      "Docker / Containerization",
      "Linux, Bash, Nginx, DNS",
      "Observability & Production Support",
      "AWS SAA — in progress",
    ],
    Leadership: [
      "Pre-sales & Technical Proposals",
      "Stakeholder & Executive Communication",
      "Risk & Delivery Planning",
      "Cross-functional Leadership",
    ],
  } satisfies Skills,
};

export type Profile = typeof profile;
