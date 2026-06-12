import { createFileRoute } from "@tanstack/react-router";
import { Award, BadgeCheck, Download, FileText, Layers3, Share2, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { listenCertificates, saveCertificate, type CertificateRecord } from "@/lib/firebase-data";
import { useAuth, useUser } from "@/lib/user-store";

export const Route = createFileRoute("/certificates")({
  head: () => ({ meta: [{ title: "সার্টিফিকেট · E-পাঠশালা" }] }),
  component: Certificates,
});

function Certificates() {
  const auth = useAuth();
  const user = useUser();
  const [records, setRecords] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    const unsubscribe = listenCertificates(auth.profile.uid, setRecords);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      else unsubscribe?.();
    };
  }, [auth.profile.uid]);

  const eligible = useMemo(
    () => [
      {
        id: "quiz-excellence",
        title: "Quiz score > 80%",
        description: "High accuracy on the fullscreen quiz game unlocks an excellence certificate.",
        active: records.some((record) => record.title.includes("Certificate of Excellence")),
      },
      {
        id: "lesson-milestone",
        title: "10 lessons completed",
        description: "Reach the lesson milestone and create a class progress certificate.",
        active: user.lessonsCompleted >= 10,
      },
      {
        id: "streak-win",
        title: "Winning streaks",
        description: "Sustained streak performance unlocks recognition badges and a streak certificate.",
        active: user.streak >= 7,
      },
    ],
    [records, user.lessonsCompleted, user.streak],
  );

  const createLessonCertificate = async () => {
    await saveCertificate({
      userId: auth.profile.uid,
      userName: auth.profile.name,
      classLevel: user.class,
      title: `Certificate of Progress in Class ${user.class}`,
      subject: "Class progress",
      score: user.lessonsCompleted,
      total: 10,
    });
  };

  const createStreakCertificate = async () => {
    await saveCertificate({
      userId: auth.profile.uid,
      userName: auth.profile.name,
      classLevel: user.class,
      title: `Certificate of Streak Excellence`,
      subject: "Learning streak",
      score: user.streak,
      total: 7,
    });
  };

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <header className="glass-strong rounded-[2rem] p-6 md:p-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <Award className="h-3.5 w-3.5 text-brand-orange" /> achievements
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">Automatic certificates</h1>
            <p className="max-w-2xl text-sm md:text-base text-muted-foreground">
              Quiz score, lesson milestones, and streak achievements are stored in Firebase and can be downloaded or shared as a print-ready PDF.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <Metric label="Records" value={records.length.toString()} />
            <Metric label="Eligible" value={eligible.filter((item) => item.active).length.toString()} />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-strong rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-brand-orange" /> Generate milestones
                </h2>
                <p className="text-sm text-muted-foreground">Use the buttons below to generate manual milestone certificates.</p>
              </div>
              <FileText className="h-5 w-5 text-primary" />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {eligible.map((item) => (
                <div key={item.id} className={`rounded-3xl p-5 ${item.active ? "bg-brand-green/10 border border-brand-green/20" : "bg-muted/50"}`}>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className={`h-4 w-4 ${item.active ? "text-brand-green" : "text-muted-foreground"}`} />
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.active ? "bg-brand-green text-white" : "bg-muted text-muted-foreground"}`}>
                      {item.active ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void createLessonCertificate()}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 font-semibold text-white shadow-soft"
              >
                <Sparkles className="h-4 w-4" />
                Lesson certificate
              </button>
              <button
                type="button"
                onClick={() => void createStreakCertificate()}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70"
              >
                <Trophy className="h-4 w-4" />
                Streak certificate
              </button>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Your certificates</h2>
                <p className="text-sm text-muted-foreground">Click any card to download or share.</p>
              </div>
              <Layers3 className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3">
              {records.length ? (
                records.map((record) => <CertificateCard key={record.id} record={record} />)
              ) : (
                <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No certificates yet. Complete a quiz with 80%+ or create a milestone certificate.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function CertificateCard({ record }: { record: CertificateRecord }) {
  const issuedAt = new Date(record.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const downloadPdf = async () => {
    const win = window.open("", "_blank", "width=1200,height=900");
    if (!win) return;
    win.document.write(renderCertificateHtml(record, issuedAt));
    win.document.close();
    win.focus();
  };

  const shareCertificate = async () => {
    const shareData = {
      title: record.title,
      text: `${record.userName} earned ${record.title} in E-পাঠশালা.`,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
      return;
    }

    await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`).catch(() => {});
  };

  return (
    <div className="rounded-3xl border border-border bg-background/90 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Certificate</div>
          <h3 className="mt-1 text-lg font-bold">{record.title}</h3>
        </div>
        <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange">{record.score}/{record.total}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {record.userName} · Class {record.classLevel} · {record.subject}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Issued {issuedAt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => void downloadPdf()} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button type="button" onClick={() => void shareCertificate()} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted/70">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-background/80 p-4 shadow-soft border border-border">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function renderCertificateHtml(record: CertificateRecord, issuedAt: string) {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(record.title)}</title>
      <style>
        @page { size: A4 landscape; margin: 0; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
        body {
          font-family: system-ui, sans-serif;
          background: linear-gradient(135deg, #fff5da 0%, #dff7ff 50%, #f3e8ff 100%);
          color: #1b1b1b;
        }
        .sheet {
          box-sizing: border-box;
          width: 100vw;
          height: 100vh;
          padding: 44px;
        }
        .card {
          height: 100%;
          border: 12px solid rgba(255,255,255,0.8);
          border-radius: 36px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          padding: 48px;
          box-shadow: 0 40px 80px rgba(54, 78, 120, 0.18);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .eyebrow { letter-spacing: 0.28em; font-size: 12px; text-transform: uppercase; color: #6b7280; }
        h1 { font-size: 52px; margin: 12px 0 8px; line-height: 1.02; }
        .name { font-size: 48px; font-weight: 800; color: #7c3aed; margin: 8px 0; }
        .desc { font-size: 20px; line-height: 1.6; max-width: 900px; color: #374151; }
        .meta { display: flex; gap: 18px; flex-wrap: wrap; font-size: 18px; color: #374151; }
        .footer { display: flex; justify-content: space-between; align-items: end; gap: 16px; font-size: 16px; color: #4b5563; }
        .badge { padding: 10px 16px; border-radius: 999px; background: #111827; color: white; font-weight: 700; }
        .stamp { width: 160px; height: 160px; border-radius: 50%; border: 8px solid rgba(124,58,237,0.35); display: grid; place-items: center; color: #7c3aed; font-weight: 800; transform: rotate(-8deg); }
      </style>
    </head>
    <body>
      <div class="sheet">
        <div class="card">
          <div>
            <div class="eyebrow">E-পাঠশালা</div>
            <h1>Certificate of Excellence</h1>
            <p class="desc">This certificate is proudly awarded to</p>
            <div class="name">${escapeHtml(record.userName)}</div>
            <p class="desc">for outstanding achievement in <strong>${escapeHtml(record.title)}</strong> with a score of <strong>${record.score}/${record.total}</strong>.</p>
            <div class="meta" style="margin-top: 20px;">
              <span class="badge">Class ${record.classLevel}</span>
              <span class="badge">${escapeHtml(record.subject)}</span>
              <span class="badge">Issued ${issuedAt}</span>
            </div>
          </div>
          <div class="footer">
            <div>
              <div style="font-weight: 700;">E-পাঠশালা</div>
              <div>National learning ecosystem</div>
            </div>
            <div class="stamp">Awarded</div>
          </div>
        </div>
      </div>
      <script>
        window.addEventListener('load', () => setTimeout(() => window.print(), 300));
      </script>
    </body>
  </html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}
