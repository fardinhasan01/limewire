import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ExternalLink, Layers3, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { classLevels } from "@/lib/bangladesh-learning";
import { subjectResourceLinkBySlug } from "@/lib/subject-resource-links";
import { getSubjectPdfLink } from "@/lib/subject-pdf-links";
import { getSubject } from "@/lib/subjects";
import { useUser } from "@/lib/user-store";

export const Route = createFileRoute("/subjects/$slug")({
  head: ({ params }) => {
    const subject = getSubject(params.slug);
    return { meta: [{ title: `${subject?.name ?? params.slug} · E-পাঠশালা` }] };
  },
  loader: ({ params }) => {
    const subject = getSubject(params.slug);
    if (!subject) throw notFound();
    return { subject };
  },
  component: SubjectDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-2">বিষয়টি পাওয়া যায়নি</h1>
        <Link to="/subjects" className="text-primary hover:underline">
          বিষয় তালিকায় ফিরে যাও
        </Link>
      </div>
    </AppShell>
  ),
});

function SubjectDetail() {
  const { subject } = Route.useLoaderData();
  const user = useUser();
  const [selectedClass, setSelectedClass] = useState<number>(user.class);

  const pdfUrl = useMemo(() => getSubjectPdfLink(subject.slug, selectedClass as (typeof classLevels)[number]), [subject.slug, selectedClass]);
  const quickLink = useMemo(() => subjectResourceLinkBySlug[subject.slug], [subject.slug]);

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto space-y-6">
        <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> সব বিষয়ে ফিরে যান
        </Link>

        <div className={`${subject.gradient} rounded-[2rem] p-8 md:p-10 text-white shadow-glow`}>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-6xl md:text-7xl">{subject.emoji}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{subject.name}</h1>
              <p className="opacity-90 mt-1">{subject.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>{subject.lessons} পাঠ</span>
            <span>·</span>
            <span>শ্রেণি {selectedClass}</span>
          </div>

          {quickLink ? (
            <div className="mt-5 rounded-3xl bg-white/15 border border-white/20 p-4 backdrop-blur-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">{quickLink.label} resource</div>
                    <div className="text-sm opacity-85">Open the linked Drive resource in a new tab.</div>
                  </div>
                </div>
                <a
                  href={quickLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-soft hover:shadow-glow transition-all"
                >
                  Open resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : null}
        </div>

        <section className="glass-strong rounded-[2rem] p-6 md:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Layers3 className="w-6 h-6 text-primary" /> প্রথমে ক্লাস বেছে নিন
              </h2>
              <p className="text-sm text-muted-foreground">ক্লাস নির্বাচন করলে PDF এই পাতার ভেতরেই খুলবে।</p>
            </div>
            <div className="text-sm text-muted-foreground">চলতি ক্লাস: {selectedClass}</div>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {classLevels.map((classLevel) => (
              <button
                key={classLevel}
                onClick={() => setSelectedClass(classLevel)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                  selectedClass === classLevel ? "bg-gradient-hero text-white shadow-soft" : "glass hover:shadow-soft"
                }`}
              >
                {classLevel}
              </button>
            ))}
          </div>

          {pdfUrl ? (
            <div className="rounded-[1.5rem] border border-border bg-background p-5 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold">Open in PDF.js viewer</h3>
                  <p className="text-sm text-muted-foreground">The PDF stays inside E-পাঠশালা with page navigation and zoom controls.</p>
                </div>
                <Link
                  to="/pdf-viewer"
                  search={{ src: pdfUrl, title: `${subject.name} · Class ${selectedClass}` }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 font-semibold text-white shadow-soft"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open viewer
                </Link>
              </div>
              <div className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
                Selected PDF source: {subject.slug} · class {selectedClass}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-muted/60 p-5 text-sm text-muted-foreground">
              এই ক্লাসের PDF লিংক এখনো যোগ করা হয়নি। `src/lib/subject-pdf-links.ts` ফাইলে লিংক বসালে এখানে দেখাবে।
            </div>
          )}
        </section>

        <section className="glass-strong rounded-[2rem] p-6">
          <h2 className="text-xl font-bold mb-3">লিংক ফাইল</h2>
          <p className="text-sm text-muted-foreground leading-6">
            আপনি চাইলে `src/lib/subject-pdf-links.ts` ফাইলে বাকি বিষয়গুলোর PDF URL ম্যানুয়ালি যোগ করতে পারবেন।
          </p>
        </section>
      </div>
    </AppShell>
  );
}
