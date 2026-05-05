/** @jsxImportSource react */
import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";

const GEIST_REGULAR =
  "https://cdn.jsdelivr.net/npm/@fontsource/geist@5.1.0/files/geist-latin-400-normal.woff";
const GEIST_MEDIUM =
  "https://cdn.jsdelivr.net/npm/@fontsource/geist@5.1.0/files/geist-latin-500-normal.woff";
const GEIST_MONO =
  "https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5.1.0/files/geist-mono-latin-400-normal.woff";

let fontCache: SatoriOptions["fonts"] | null = null;

async function loadFonts(): Promise<SatoriOptions["fonts"]> {
  if (fontCache) return fontCache;

  const [r, m, mono] = await Promise.all([
    fetch(GEIST_REGULAR).then((r) => r.arrayBuffer()),
    fetch(GEIST_MEDIUM).then((r) => r.arrayBuffer()),
    fetch(GEIST_MONO).then((r) => r.arrayBuffer()),
  ]);

  fontCache = [
    { name: "Geist", data: r, weight: 400, style: "normal" },
    { name: "Geist", data: m, weight: 500, style: "normal" },
    { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
  ];
  return fontCache;
}

export type OgInput = {
  eyebrow?: string;
  title: string;
  meta?: string;
};

const COLORS = {
  bg: "#f5f3ec",
  bgAlt: "#ecebe3",
  ink: "#0e1f3a",
  ink2: "#3a4a64",
  muted: "#7a8294",
  rule: "#cfccbf",
  accent: "#3a5a40",
  accent2: "#9b2c2c",
};

function OgCard({ eyebrow, title, meta }: OgInput) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: COLORS.bg,
        fontFamily: "Geist",
        color: COLORS.ink,
        padding: "72px 80px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${COLORS.rule} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.rule} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.18,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 36,
          fontFamily: "Geist Mono",
          fontSize: 18,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.muted,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: COLORS.ink,
            color: COLORS.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Geist",
            fontStyle: "italic",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          b
        </div>
        <div style={{ display: "flex" }}>beluca.me</div>
        {eyebrow && (
          <>
            <div
              style={{ color: COLORS.rule, display: "flex", margin: "0 4px" }}
            >
              ·
            </div>
            <div style={{ color: COLORS.accent, display: "flex" }}>
              {eyebrow}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 76,
          lineHeight: 1.05,
          letterSpacing: -2,
          fontWeight: 500,
          color: COLORS.ink,
          maxWidth: 1040,
        }}
      >
        {title}
      </div>

      <div style={{ flex: 1, display: "flex" }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 28,
          borderTop: `1px solid ${COLORS.rule}`,
          fontFamily: "Geist Mono",
          fontSize: 18,
          color: COLORS.muted,
          letterSpacing: 1,
        }}
      >
        <div style={{ color: COLORS.ink, display: "flex" }}>John Beluca</div>
        <div style={{ display: "flex", margin: "0 14px" }}>·</div>
        <div style={{ display: "flex" }}>Senior Solutions Architect</div>
        {meta && (
          <>
            <div style={{ display: "flex", marginLeft: "auto" }}>{meta}</div>
          </>
        )}
      </div>
    </div>
  );
}

export async function renderOg(input: OgInput): Promise<Uint8Array> {
  const fonts = await loadFonts();

  const svg = await satori(<OgCard {...input} />, {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  return png;
}
