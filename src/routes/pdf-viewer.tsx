import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ExternalLink, LoaderCircle, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";

type PdfSearch = {
  src?: string;
  title?: string;
};

type PdfDocumentProxy = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPageProxy>;
  destroy: () => Promise<void>;
};

type PdfPageProxy = {
  getViewport: (params: { scale: number }) => { width: number; height: number };
  render: (params: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => {
    promise: Promise<void>;
  };
};

export const Route = createFileRoute("/pdf-viewer")({
  validateSearch: (search: Record<string, unknown>): PdfSearch => ({
    src: typeof search.src === "string" ? search.src : undefined,
    title: typeof search.title === "string" ? search.title : undefined,
  }),
  head: ({ search }) => ({ meta: [{ title: `${search.title ?? "PDF Viewer"} · E-পাঠশালা` }] }),
  loader: ({ search }) => {
    if (!search.src) throw notFound();
    return {};
  },
  component: PdfViewerPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="px-4 py-10 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold">No PDF selected</h1>
        <p className="mt-2 text-muted-foreground">Open a subject PDF from the curriculum page first.</p>
      </div>
    </AppShell>
  ),
});

function PdfViewerPage() {
  const search = Route.useSearch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdf, setPdf] = useState<PdfDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [zoom, setZoom] = useState(1.15);
  const title = search.title ?? "PDF Viewer";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPdf(null);
    setPageNumber(1);
    setPageCount(0);

    void (async () => {
      try {
        const { GlobalWorkerOptions, getDocument } = await import("pdfjs-dist/build/pdf.mjs");
        GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

        const task = getDocument({ url: search.src! });
        const document = (await task.promise) as PdfDocumentProxy;
        if (!active) {
          void task.destroy().catch(() => {});
          return;
        }

        setPdf(document);
        setPageCount(document.numPages);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load PDF");
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [search.src]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let canceled = false;

    pdf.getPage(pageNumber).then((page) => {
      if (canceled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const viewport = page.getViewport({ scale: zoom });
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      page.render({ canvasContext: context, viewport }).promise.catch(() => {});
    });

    return () => {
      canceled = true;
    };
  }, [pageNumber, pdf, zoom]);

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <header className="glass-strong rounded-[2rem] p-5 md:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">in-app pdf.js viewer</div>
            <h1 className="mt-2 text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">PDF stays inside E-পাঠশালা with page navigation, zoom, and full-screen reading.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPageNumber((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button type="button" onClick={() => setPageNumber((current) => Math.min(pageCount || current, current + 1))} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setZoom((current) => Math.max(0.85, +(current - 0.1).toFixed(2)))} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
              Zoom -
            </button>
            <button type="button" onClick={() => setZoom((current) => Math.min(1.8, +(current + 0.1).toFixed(2)))} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
              Zoom +
            </button>
            <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 font-semibold text-white shadow-soft">
              <RotateCw className="h-4 w-4" />
              Reload
            </button>
            <Link to={search.title?.includes("Class") ? "/subjects" : "/dashboard"} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
              <ExternalLink className="h-4 w-4" />
              Back
            </Link>
          </div>
        </header>

        <section className="glass-strong rounded-[2rem] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              Page {pageNumber} / {pageCount || "?"}
            </span>
            <span>Zoom {zoom.toFixed(2)}x</span>
          </div>

          <div className="overflow-auto rounded-[1.5rem] border border-border bg-background shadow-soft">
            {loading ? (
              <div className="grid min-h-[68vh] place-items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Loading PDF...
                </div>
              </div>
            ) : error ? (
              <div className="grid min-h-[68vh] place-items-center px-6 text-center">
                <div>
                  <h2 className="text-2xl font-bold">Could not load PDF</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    If this is a remote share link, swap it for a direct PDF URL in <code>src/lib/subject-pdf-links.ts</code>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[68vh] p-4 md:p-6">
                <canvas ref={canvasRef} className="mx-auto block" />
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
