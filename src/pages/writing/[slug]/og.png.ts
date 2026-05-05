import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { renderOg } from "../../../lib/og";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<"blog">;
}

export const GET: APIRoute<Props> = async ({ props }) => {
  const { post } = props;

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(post.data.date);

  const png = await renderOg({
    eyebrow: post.data.tag,
    title: post.data.title,
    meta: `${dateLabel} · ${post.data.readTime}`,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
