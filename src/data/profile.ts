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
    "I work at the intersection of business strategy and technical execution — sitting with founders and C-levels during discovery, then leading engineering teams through delivery and long-term operations.",
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
      id: "ai-sales-agent",
      title: "AI-Powered Sales Intelligence Agent",
      industry: "Agribusiness",
      year: "2024",
      role: "Solutions Architect & Tech Lead",
      summary:
        "An agentic conversational layer embedded into a CRM. Sales directors ask questions in natural language; the agent runs SQL via tool-calling and enriches answers with RAG over historical data.",
      stack: [
        "OpenAI",
        "Tool-calling",
        "Vector DB",
        "RAG",
        "Stored Procedures",
        "Prompt Caching",
      ],
      impact:
        "Became a daily tool for the commercial team — accelerated deal prep, cut prep time before client visits.",
      details: [
        "Designed agentic architecture with OpenAI's tool-calling against client's database via stored procedures.",
        "Implemented RAG pipeline with statistical embeddings in a vector DB for contextual business intelligence.",
        "Optimized token consumption with prompt engineering and caching strategies.",
      ],
    },
    {
      id: "b2b-crm",
      title: "B2B Commercial Operations & CRM Platform",
      industry: "Manufacturing & Distribution",
      year: "2020-2024",
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
    },
    {
      id: "healthcare-tracking",
      title: "Healthcare Operations & Asset Tracking Platform",
      industry: "Healthcare",
      year: "2019-2022",
      role: "Solutions Architect",
      summary:
        "Cloud platform for hospital operations — real-time tracking of medical assets and patient flow via RFID/IoT.",
      stack: ["Event-Driven", "RFID/IoT", "AWS", "Analytics Dashboards"],
      impact:
        "Mission-critical system supporting daily hospital workflows. Improved asset utilization, reduced operational waste.",
      details: [
        "Scalable, event-driven architecture for RFID/IoT data ingestion.",
        "APIs and analytics dashboards for operational visibility.",
        "Improved asset utilization and reduced inefficiencies.",
      ],
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
