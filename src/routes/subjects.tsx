import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { subjectResourceLinks } from "@/lib/subject-resource-links";
import { subjects } from "@/lib/subjects";

export const Route = createFileRoute("/subjects")({
  head: () => ({ meta: [{ title: "বিষয়সমূহ · E-পাঠশালা" }] }),
  component: Subjects,
});

function Subjects() {
  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">সব বিষয়</h1>
          <p className="text-muted-foreground mt-1">একটা বিষয় বেছে নাও, তারপর ক্লাস সিলেক্ট করে PDF খুলে ফেলো।</p>
        </header>

        <section className="glass-strong rounded-[2rem] p-5 md:p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-orange" />
            <h2 className="text-xl font-bold">Quick subject buttons</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            These shortcuts open the requested Drive resources without leaving the platform flow.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subjectResourceLinks.map((item) => {
              const subject = subjects.find((entry) => entry.slug === item.slug);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${subject?.gradient ?? "bg-gradient-hero"} rounded-[1.5rem] p-4 text-white shadow-soft hover:shadow-glow transition-all`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] opacity-80">direct link</div>
                      <div className="mt-1 text-xl font-bold">{subject?.name ?? item.label}</div>
                      <div className="mt-1 text-sm opacity-90">{item.label}</div>
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{subject?.progress ?? 0}%</span>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${subject?.progress ?? 0}%` }} />
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                    Open resource
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              to="/subjects/$slug"
              params={{ slug: s.slug }}
              className={`${s.gradient} rounded-3xl p-6 text-white shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{s.emoji}</span>
                <span className="text-xs bg-white/20 backdrop-blur px-2.5 py-1 rounded-full font-medium">{s.progress}%</span>
              </div>
              <div className="font-bold text-xl">{s.name}</div>
              <div className="text-sm opacity-80 mt-1 mb-4">{s.description}</div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full" style={{ width: `${s.progress}%` }} />
              </div>
              <div className="text-xs opacity-80">{s.lessons} পাঠ</div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
