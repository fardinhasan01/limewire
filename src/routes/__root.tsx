import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/user-store";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#7c3aed" },
      { title: "E-পাঠশালা — Bangla digital school" },
      { name: "description", content: "বাংলাদেশের শিক্ষার্থীদের জন্য এক আধুনিক ডিজিটাল শিক্ষালয়। বিষয়, PDF, লাইভ ক্লাস, গেম, কুইজ, এবং সহপাঠী চ্যাট এক জায়গায়।" },
      { property: "og:title", content: "E-পাঠশালা" },
      { property: "og:description", content: "বাংলা-প্রথম ডিজিটাল শিক্ষার প্ল্যাটফর্ম।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem("bani:intro-seen");
    if (!seen) {
      setShowIntro(true);
      const timer = window.setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("bani:intro-seen", "1");
      }, 3600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <div className="relative">
          {showIntro && <IntroSplash />}
          <Outlet />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function IntroSplash() {
  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-white/20 blur-2xl animate-float" />
        <div className="absolute right-16 top-20 h-32 w-32 rounded-full bg-brand-yellow/30 blur-2xl animate-float" />
        <div className="absolute bottom-16 left-1/4 h-28 w-28 rounded-full bg-brand-green/25 blur-2xl animate-float" />
        <div className="absolute bottom-24 right-1/4 h-20 w-20 rounded-full bg-white/20 blur-2xl animate-float" />
      </div>
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
        <div className="max-w-2xl space-y-5">
          <img src="/assets/e-pathshala-logo.png" alt="E-পাঠশালা" className="mx-auto h-28 w-28 rounded-[2rem] object-cover bg-white shadow-glow backdrop-blur-md animate-pulse-glow" />
          <p className="text-sm uppercase tracking-[0.4em] opacity-80">Created & Developed by</p>
          <h1 className="text-3xl md:text-5xl font-bold animate-float">Fardin Hasan and his team</h1>
          <p className="text-xl md:text-2xl font-semibold opacity-95">Kachua Govt Pilot High School</p>
          <p className="text-sm md:text-base opacity-80">বাংলা-প্রথম শিক্ষালয় · ক্লাস · PDF · লাইভ ক্লাস · কুইজ · গেম</p>
        </div>
      </div>
    </div>
  );
}
