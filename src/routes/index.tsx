import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Brain, Gamepad2, MessageCircleHeart, Sparkles, Trophy, Users, Video } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-পাঠশালা — বাংলা-প্রথম ডিজিটাল স্কুল" },
      { name: "description", content: "বাংলাদেশের শিক্ষার্থীদের জন্য ডিজিটাল শিক্ষালয়। বিষয়, PDF, লাইভ ক্লাস, কুইজ, গেম, এবং সহপাঠী চ্যাট এক জায়গায়।" },
      { property: "og:title", content: "E-পাঠশালা" },
      { property: "og:description", content: "বাংলা-প্রথম ডিজিটাল শিক্ষার প্ল্যাটফর্ম।" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: MessageCircleHeart, title: "সহায়ক AI", desc: "শেখা বুঝিয়ে দেয়, কুইজ দেয়, আর উৎসাহ দেয়।", grad: "bg-gradient-purple" },
  { icon: BookOpen, title: "বিষয়ভিত্তিক", desc: "গণিত, বাংলা, ইংরেজি, বিজ্ঞান, আইসিটি, জিকে, সমাজ, ধর্ম।", grad: "bg-gradient-blue" },
  { icon: Video, title: "লাইভ ক্লাস", desc: "শিক্ষকের সঙ্গে সরাসরি শেখা, প্রশ্ন, আর আলোচনা।", grad: "bg-gradient-green" },
  { icon: Gamepad2, title: "শেখা খেলায়", desc: "শিক্ষামূলক গেম ও রে‌ইলস দিয়ে অনুশীলন।", grad: "bg-gradient-orange" },
  { icon: Brain, title: "কুইজ", desc: "ক্লাসভিত্তিক MCQ, সত্য-মিথ্যা, এবং ফিল-ইন।", grad: "bg-gradient-pink" },
  { icon: Trophy, title: "অর্জন", desc: "XP, ব্যাজ, স্ট্রিক, আর লেভেল—সবই আছে।", grad: "bg-gradient-sunny" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/75 border-b border-white/40">
        <div className="container mx-auto px-4 py-4">
          <div className="rounded-[2rem] bg-white/90 shadow-soft px-5 py-4 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/e-pathshala-logo.png" alt="E-পাঠশালা" className="w-12 h-12 rounded-2xl object-cover shadow-glow bg-white" />
              <div>
                <div className="font-display font-bold text-xl leading-none">E-পাঠশালা</div>
                <div className="text-xs text-muted-foreground">বাংলা-প্রথম ডিজিটাল স্কুল</div>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Link to="/subjects" className="px-4 py-2 rounded-full hover:bg-muted/70 hover:text-foreground">বিষয়</Link>
              <Link to="/library" className="px-4 py-2 rounded-full hover:bg-muted/70 hover:text-foreground">ভিডিও</Link>
              <Link to="/classmates" className="px-4 py-2 rounded-full hover:bg-muted/70 hover:text-foreground">ক্লাসমেট</Link>
              <Link to="/games" className="px-4 py-2 rounded-full hover:bg-muted/70 hover:text-foreground">গেম</Link>
              <Link to="/live-class" className="px-4 py-2 rounded-full hover:bg-muted/70 hover:text-foreground">লাইভ</Link>
              <Link to="/login" className="px-4 py-2 rounded-full hover:bg-muted/70 hover:text-foreground">প্রবেশ</Link>
            </nav>
            <Link to="/dashboard" className="px-5 py-3 rounded-full bg-gradient-hero text-white font-semibold shadow-soft hover:shadow-glow transition-all inline-flex items-center gap-2">
              শুরু করুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <section className="rounded-[2.5rem] overflow-hidden shadow-soft border border-white/50 bg-[linear-gradient(135deg,#fff5da_0%,#ffe8d6_38%,#f7f1ea_62%,#dff4ff_100%)]">
          <div className="p-6 md:p-10 lg:p-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-soft text-sm font-medium">
                <Sparkles className="w-4 h-4 text-brand-orange" /> প্রথম থেকে দশম শ্রেণি
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-foreground">
                  শেখা হবে <span className="text-brand-orange">মজার</span>,<br />
                  হোক তা <span className="text-brand-green">সহজ</span>।
                </h1>
                <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-7">
                  বাংলাদেশি শিক্ষার্থীদের জন্য বাংলা-প্রথম একটি আধুনিক ডিজিটাল স্কুল। বিষয়, PDF, লাইভ ক্লাস, কুইজ, গেম, রিলস, আর ক্লাসমেট এক জায়গায়।
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard" className="px-6 py-3.5 rounded-full bg-brand-orange text-white font-semibold shadow-soft hover:shadow-glow transition-all inline-flex items-center gap-2">
                  ফ্রি শুরু করুন <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/library" className="px-6 py-3.5 rounded-full bg-white text-foreground font-semibold shadow-soft hover:shadow-glow transition-all inline-flex items-center gap-2">
                  ভিডিও দেখুন <Video className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <span className="w-10 h-10 rounded-full bg-brand-orange text-white grid place-items-center shadow-soft">১</span>
                  <span className="w-10 h-10 rounded-full bg-brand-blue text-white grid place-items-center shadow-soft">২</span>
                  <span className="w-10 h-10 rounded-full bg-brand-green text-white grid place-items-center shadow-soft">৩</span>
                  <span className="w-10 h-10 rounded-full bg-brand-purple text-white grid place-items-center shadow-soft">৪</span>
                </div>
                <span>২৫,০০০+ শিক্ষার্থী-সদৃশ অনুশীলন সেশন</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-20 w-20 rounded-3xl bg-white/80 shadow-soft" />
              <div className="absolute -right-6 bottom-0 h-24 w-24 rounded-3xl bg-white/70 shadow-soft" />
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-glow bg-white/80 backdrop-blur">
                <img src="/assets/e-pathshala-logo.png" alt="E-পাঠশালা" className="w-full aspect-[4/3] object-cover" />
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10 lg:px-14 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">তোমার শ্রেণি বেছে নাও:</span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((classLevel) => (
                <Link
                  key={classLevel}
                  to="/subjects"
                  className="px-4 py-2 rounded-full bg-white shadow-soft font-semibold hover:scale-105 transition-transform"
                >
                  শ্রেণি {classLevel}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-soft text-sm font-medium">
              <Sparkles className="w-4 h-4 text-brand-orange" /> ৬টি বিষয়
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">যা যা শিখবে তুমি</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">যা শিখতে ভালোবাসো, সেটাই এখানে পাবে—বাংলায়, সুন্দরভাবে, আর সহজে।</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="glass rounded-[2rem] p-6 hover:shadow-glow transition-all">
                <div className={`${feature.grad} w-14 h-14 rounded-2xl grid place-items-center text-white mb-4 shadow-soft`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-6">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

