import type { APIRoute } from "astro";
import { renderOg } from "../lib/og";

export const prerender = true;

export const GET: APIRoute = async () => {
  const png = await renderOg({
    eyebrow: "AI · Cloud · Architecture",
    title:
      "Shipping production AI systems — agents, RAG, and the boring cloud plumbing.",
    meta: "beluca.me",
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
