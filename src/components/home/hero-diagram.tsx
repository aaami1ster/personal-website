import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

// Generic banking integration topology for the homepage hero (design spec
// §4.2). Rendered on the server as inline SVG so it never waits for JS; all
// colors come from theme tokens, so both themes paint correctly on first load.
//
// Node labels are technical names and stay English in both locales. The SVG
// is pinned to LTR (attribute + CSS) so the flow never mirrors on Arabic
// pages (§9.2).
//
// Label sizes are in viewBox units. The SVG renders ~254px wide on a 320px
// viewport (scale ~0.64), so small screens use larger units to keep labels at
// ~10px or more; from `sm` the SVG is ~330–400px wide and labels render at
// roughly 11–14px.

const labelClass =
  "fill-fg font-sans font-semibold text-[16px] sm:text-[13px] lg:text-[14px]";
const subLabelClass =
  "fill-muted font-mono text-[16px] sm:text-[12px] lg:text-[13px]";
const nodeClass = "fill-surface stroke-border";
const edgeClass = "stroke-accent";

function Node({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx="8"
      strokeWidth="1.5"
      className={nodeClass}
    />
  );
}

export async function HeroDiagram({ className }: { className?: string }) {
  const t = await getTranslations("Home.diagram");

  return (
    <figure className={cn("w-full max-w-md lg:max-w-none", className)}>
      <div className="rounded-2xl border bg-surface/60 p-4 sm:p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-muted [:lang(ar)_&]:normal-case [:lang(ar)_&]:tracking-normal">
          {t("panelTitle")}
        </p>
        <svg
          viewBox="0 0 400 460"
          role="img"
          aria-labelledby="hero-diagram-title hero-diagram-desc"
          direction="ltr"
          className="h-auto w-full [direction:ltr]"
        >
          <title id="hero-diagram-title">{t("title")}</title>
          <desc id="hero-diagram-desc">{t("desc")}</desc>

          <defs>
            <marker
              id="hero-diagram-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M0 1 9 5 0 9z"
                fillOpacity="0.6"
                className="fill-accent"
              />
            </marker>
          </defs>

          {/* Edges first so nodes sit on top of them. */}
          <g
            fill="none"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={edgeClass}
          >
            {/* Channels → API Gateway → Middleware */}
            <path d="M184 80V107" markerEnd="url(#hero-diagram-arrow)" />
            <path d="M184 152V179" markerEnd="url(#hero-diagram-arrow)" />
            {/* Middleware fans out to the three back-end services */}
            <path d="M184 224V240M66 240H302" />
            <path d="M66 240V255" markerEnd="url(#hero-diagram-arrow)" />
            <path d="M184 240V255" markerEnd="url(#hero-diagram-arrow)" />
            <path d="M302 240V255" markerEnd="url(#hero-diagram-arrow)" />
            {/* Services publish to the event bus */}
            <path d="M66 360V391" markerEnd="url(#hero-diagram-arrow)" />
            <path d="M184 360V391" markerEnd="url(#hero-diagram-arrow)" />
            <path d="M302 360V391" markerEnd="url(#hero-diagram-arrow)" />
            {/* Return edge: event bus back up to the middleware */}
            <path d="M372 392V202H335" markerEnd="url(#hero-diagram-arrow)" />
          </g>

          <g textAnchor="middle" lang="en">
            <Node x={34} y={12} width={300} height={68} />
            <text x="184" y="40" className={labelClass}>
              Digital Channels
            </text>
            <text x="184" y="64" className={subLabelClass}>
              Mobile · Web · Partners
            </text>

            <Node x={74} y={108} width={220} height={44} />
            <text x="184" y="136" className={labelClass}>
              API Gateway
            </text>

            <Node x={34} y={180} width={300} height={44} />
            <text x="184" y="208" className={labelClass}>
              Integration Middleware
            </text>

            <Node x={12} y={256} width={108} height={104} />
            <text x="66" y="304" className={labelClass}>
              <tspan x="66">Core</tspan>
              <tspan x="66" dy="20">
                Banking
              </tspan>
            </text>

            <Node x={130} y={256} width={108} height={104} />
            <text x="184" y="283" className={labelClass}>
              <tspan x="184">Payment</tspan>
              <tspan x="184" dy="19">
                Hub
              </tspan>
            </text>
            <text x="184" y="326" className={subLabelClass}>
              <tspan x="184">IPS/SARIE</tspan>
              <tspan x="184" dy="18">
                SWIFT
              </tspan>
            </text>

            <Node x={248} y={256} width={108} height={104} />
            <text x="302" y="304" className={labelClass}>
              <tspan x="302">Domain</tspan>
              <tspan x="302" dy="20">
                Services
              </tspan>
            </text>

            <Node x={12} y={392} width={376} height={48} />
            <text x="200" y="422" className={labelClass}>
              Event Bus (Kafka)
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 text-start text-sm text-muted">
        {t("caption")}
      </figcaption>
    </figure>
  );
}
