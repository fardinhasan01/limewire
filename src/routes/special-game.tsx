import { createFileRoute } from "@tanstack/react-router";
import { Expand, ExternalLink, Gamepad2 } from "lucide-react";
import { useRef } from "react";

import { AppShell } from "@/components/layout/AppShell";

const SPECIAL_GAME_URL = "https://runbd.netlify.app";

export const Route = createFileRoute("/special-game")({
  head: () => ({ meta: [{ title: "Special Game · E-পাঠশালা" }] }),
  component: SpecialGamePage,
});

function SpecialGamePage() {
  const frameWrapRef = useRef<HTMLDivElement | null>(null);

  async function enterFullscreen() {
    if (!frameWrapRef.current?.requestFullscreen) return;
    await frameWrapRef.current.requestFullscreen().catch(() => {});
  }

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <header className="glass-strong rounded-[2rem] p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <Gamepad2 className="h-3.5 w-3.5 text-brand-orange" /> special game
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">RunBD inside the platform</h1>
            <p className="max-w-2xl text-sm md:text-base text-muted-foreground">
              The game opens in a fullscreen iframe, with a fallback button if the browser blocks embedded playback.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void enterFullscreen()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 font-semibold text-white shadow-soft"
            >
              <Expand className="h-4 w-4" />
              Fullscreen
            </button>
            <a
              href={SPECIAL_GAME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70"
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </div>
        </header>

        <section
          ref={frameWrapRef}
          className="overflow-hidden rounded-[2rem] border border-border bg-black shadow-soft"
          style={{ minHeight: "calc(100vh - 190px)" }}
        >
          <iframe
            src={SPECIAL_GAME_URL}
            title="RunBD special game"
            className="block h-[calc(100vh-190px)] w-full bg-black"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </section>
      </div>
    </AppShell>
  );
}
