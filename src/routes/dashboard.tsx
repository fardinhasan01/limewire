import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calendar, Flame, MapPinned, MessageCircleHeart, Play, Sparkles, Star, Target, Trophy, Users, Video } from "lucide-react";
import { useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { activityBank, liveClasses } from "@/lib/bangladesh-learning";
import { subjects } from "@/lib/subjects";
import { useUser } from "@/lib/user-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "ড্যাশবোর্ড · E-পাঠশালা" }] }),
  component: Dashboard,
});

function Dashboard() {
  const user = useUser();
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "সুপ্রভাত";
    if (h < 17) return "শুভ অপরাহ্ন";
    return "শুভ সন্ধ্যা";
  })();

  const topSubjects = subjects.slice(0, 4);
  const roleLabel = user.role === "student" ? "শিক্ষার্থী" : user.role === "teacher" ? "শিক্ষক" : "অভিভাবক";

  useEffect(() => {
    const audio = introAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }, []);

  return (
    <AppShell>
      <audio ref={introAudioRef} src="/assets/dashboard-intro.mp3" preload="auto" autoPlay />
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">{greeting},</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              {user.name} <span className="text-3xl">{user.avatar}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              আজ কী নতুন শিখবে? শ্রেণি {user.class} · {roleLabel}
            </p>
          </div>
          <Link to="/bani" className="px-5 py-3 rounded-2xl bg-gradient-hero text-white font-semibold shadow-soft hover:shadow-glow flex items-center gap-2">
            <MessageCircleHeart className="w-4 h-4" /> সহায়ক AI
          </Link>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Flame className="w-5 h-5" />} label="স্ট্রিক" value={`${user.streak} দিন`} grad="bg-gradient-orange" />
          <StatCard icon={<Star className="w-5 h-5" />} label="XP" value={user.xp.toLocaleString()} grad="bg-gradient-purple" />
          <StatCard icon={<Trophy className="w-5 h-5" />} label="লেভেল" value={user.level.toString()} grad="bg-gradient-pink" />
          <StatCard icon={<Target className="w-5 h-5" />} label="কয়েন" value={user.coins.toString()} grad="bg-gradient-sunny" />
        </div>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Link to="/classmates" className="glass rounded-3xl p-5 hover:shadow-glow hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-pink text-white grid place-items-center shadow-soft mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-bold text-lg">ক্লাসমেট</div>
            <div className="text-sm text-muted-foreground mt-1">ক্লাসভিত্তিক চ্যাট, নোট, পোল, আর স্টাডি রুম।</div>
          </Link>
          <Link to="/live-class" className="glass rounded-3xl p-5 hover:shadow-glow hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-hero text-white grid place-items-center shadow-soft mb-3">
              <Video className="w-5 h-5" />
            </div>
            <div className="font-bold text-lg">লাইভ ভিডিও ক্লাস</div>
            <div className="text-sm text-muted-foreground mt-1">
              {liveClasses.find((room) => room.classLevel === user.class)?.time ?? "সাপ্তাহিক সময়সূচি"} · শিক্ষকের সঙ্গে সরাসরি।
            </div>
          </Link>
          <Link to="/library" className="glass rounded-3xl p-5 hover:shadow-glow hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-blue text-white grid place-items-center shadow-soft mb-3">
              <Video className="w-5 h-5" />
            </div>
            <div className="font-bold text-lg">ভিডিও ও রিলস</div>
            <div className="text-sm text-muted-foreground mt-1">শুধু শিক্ষামূলক YouTube সার্চ লিংক।</div>
          </Link>
          <Link to="/bangladesh-map" className="glass rounded-3xl p-5 hover:shadow-glow hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-green text-white grid place-items-center shadow-soft mb-3">
              <MapPinned className="w-5 h-5" />
            </div>
            <div className="font-bold text-lg">বাংলাদেশ মানচিত্র</div>
            <div className="text-sm text-muted-foreground mt-1">Google Maps খুলে নদী, বিভাগ, আর স্থাপনা দেখো।</div>
          </Link>
          <a
            href="https://www.nctb.gov.bd/"
            target="_blank"
            rel="noreferrer"
            className="glass rounded-3xl p-5 hover:shadow-glow hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-orange text-white grid place-items-center shadow-soft mb-3">
              📘
            </div>
            <div className="font-bold text-lg">NCTB বই</div>
            <div className="text-sm text-muted-foreground mt-1">অফিশিয়াল পাঠ্যপুস্তক বোর্ডের লিংক।</div>
          </a>
        </section>

        <section className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" /> পড়াশোনা চালিয়ে যাও
            </h2>
            <Link to="/subjects" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              সব দেখো <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSubjects.slice(0, 3).map((s) => (
              <Link
                key={s.slug}
                to="/subjects/$slug"
                params={{ slug: s.slug }}
                className={`${s.gradient} rounded-2xl p-5 text-white shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{s.emoji}</span>
                  <span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full">{s.progress}%</span>
                </div>
                <div className="font-bold text-lg">{s.name}</div>
                <div className="text-sm opacity-80 mb-3">পাঠ {Math.floor((s.lessons * s.progress) / 100) + 1}</div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" /> আজকের AI পড়ার পরিকল্পনা
            </h2>
            <ul className="space-y-2">
              {[
                { t: "গুণের অনুশীলন ৬×", time: "১০ মিনিট", subj: "গণিত", done: true },
                { t: "পড়ো: দুষ্ট বিড়াল (অধ্যায় ৩)", time: "১২ মিনিট", subj: "ইংরেজি", done: true },
                { t: "দেখো: জলচক্র 🌧️", time: "৮ মিনিট", subj: "বিজ্ঞান", done: false },
                { t: "কুইজ: বিশ্বের রাজধানী", time: "৬ মিনিট", subj: "সাধারণ জ্ঞান", done: false },
                { t: "সহায়ক AI-এর সঙ্গে ৫ মিনিট চ্যাট", time: "৫ মিনিট", subj: "সহায়ক", done: false },
              ].map((task, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/60 transition-colors">
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-xs ${task.done ? "bg-brand-green text-white" : "border-2 border-muted-foreground/30"}`}>{task.done ? "✓" : ""}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.t}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.subj} · {task.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-brand-orange" /> সাম্প্রতিক ব্যাজ
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-full bg-gradient-sunny text-sm font-medium text-white shadow-soft">
                    🏅 {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-brand-blue" /> আসন্ন লাইভ ক্লাস
              </h3>
              <div className="bg-gradient-blue rounded-2xl p-4 text-white">
                <div className="text-xs opacity-80">{liveClasses.find((room) => room.classLevel === user.class)?.time ?? "আগামীকাল · ১০:০০ AM"}</div>
                <div className="font-bold mt-1">{liveClasses.find((room) => room.classLevel === user.class)?.title ?? "লাইভ লার্নিং রুম"}</div>
                <div className="text-xs opacity-80 mt-1">
                  {liveClasses.find((room) => room.classLevel === user.class)?.teacher ?? "শিক্ষকের সঙ্গে"} · শ্রেণি {user.class}
                </div>
                <Link to="/live-class" className="mt-3 inline-flex px-3 py-1.5 rounded-lg bg-white text-primary text-xs font-semibold">
                  এখনই যোগ দাও
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> বিষয়গুলো দেখো
            </h2>
            <Link to="/subjects" className="text-sm font-medium text-primary hover:underline">
              সব দেখো
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topSubjects.map((s) => (
              <Link
                key={s.slug}
                to="/subjects/$slug"
                params={{ slug: s.slug }}
                className="glass rounded-2xl p-5 hover:shadow-glow hover:scale-[1.02] transition-all"
              >
                <div className={`${s.gradient} w-12 h-12 rounded-xl grid place-items-center text-2xl mb-3`}>{s.emoji}</div>
                <div className="font-bold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.lessons} পাঠ</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold">আজকের মিশন স্ট্রিক</h2>
              <p className="text-sm text-muted-foreground">বাংলাদেশি শিক্ষার্থীদের জন্য দ্রুত স্টাডি লুপ।</p>
            </div>
            <Link to="/games" className="text-sm font-medium text-primary hover:underline">
              গেম বোর্ড খুলুন
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {activityBank
              .filter((item) => item.classLevel === user.class)
              .slice(0, 3)
              .map((item) =>
                item.external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass rounded-2xl p-4 hover:shadow-soft transition-all"
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.subtitle}</div>
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href as "/quizzes" | "/live-class" | "/library" | "/bangladesh-map"}
                    className="glass rounded-2xl p-4 hover:shadow-soft transition-all"
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.subtitle}</div>
                  </Link>
                ),
              )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, grad }: { icon: React.ReactNode; label: string; value: string; grad: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className={`${grad} w-11 h-11 rounded-xl grid place-items-center text-white shadow-soft`}>{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold text-lg leading-none">{value}</div>
      </div>
    </div>
  );
}
