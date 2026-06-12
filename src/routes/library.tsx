import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, PlayCircle, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

type LibraryVideo = {
  title: string;
  channel: string;
  url: string;
  classLevel: number;
  subject: string;
};

const youtubeIdFromUrl = (url: string) => {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
};

const educationalVideos: LibraryVideo[] = [
  {
    title: "বাংলা বর্ণমালা ও পাঠ",
    channel: "শিক্ষামূলক ভিডিও",
    url: "https://youtu.be/48ZRxmIMgNQ?si=eUrEmNz3Z7Lb7tcJ",
    classLevel: 1,
    subject: "বাংলা",
  },
  {
    title: "গণিতের সহজ ব্যাখ্যা",
    channel: "শিক্ষামূলক ভিডিও",
    url: "https://youtu.be/jaTwx7vUq54?si=i_LWBrGnD-OvtpOL",
    classLevel: 2,
    subject: "গণিত",
  },
  {
    title: "বিজ্ঞানের মজার ক্লাস",
    channel: "শিক্ষামূলক ভিডিও",
    url: "https://youtu.be/FpoowsMdb_s?si=HLa_JOIfS5Sc14Vb",
    classLevel: 4,
    subject: "বিজ্ঞান",
  },
  {
    title: "সাধারণ জ্ঞানের ক্লিপ",
    channel: "শিক্ষামূলক ভিডিও",
    url: "https://youtu.be/nSXWaOa566Q?si=Ao7YPhoPTQWfz-R7",
    classLevel: 5,
    subject: "সাধারণ জ্ঞান",
  },
  {
    title: "দেশ ও সমাজের কথা",
    channel: "শিক্ষামূলক ভিডিও",
    url: "https://youtu.be/Ra3FjOvZ9QY?si=rd6B8FsKKmM_HzuM",
    classLevel: 6,
    subject: "সাধারণ জ্ঞান",
  },
];

const featuredShorts = [
  {
    title: "শর্টস: বাংলা শেখা",
    channel: "শিক্ষামূলক শর্টস",
    url: "https://youtube.com/shorts/7ArLIKTaW5Y?si=R2jNPmjM8wZgwHAr",
    classLevel: 1,
    subject: "বাংলা",
  },
  {
    title: "শর্টস: দ্রুত গণিত",
    channel: "শিক্ষামূলক শর্টস",
    url: "https://youtube.com/shorts/VhbIzWHCS_w?si=NNnT1EDU5wBIVsB7",
    classLevel: 2,
    subject: "গণিত",
  },
  {
    title: "শর্টস: বিজ্ঞান টিপস",
    channel: "শিক্ষামূলক শর্টস",
    url: "https://youtube.com/shorts/2_6WUHbmjDU?si=3v50CfOG83Z6OOYy",
    classLevel: 3,
    subject: "বিজ্ঞান",
  },
  {
    title: "শর্টস: সাধারণ জ্ঞান",
    channel: "শিক্ষামূলক শর্টস",
    url: "https://youtube.com/shorts/qino3UWRoLk?si=FqbvhfuKq3484ieV",
    classLevel: 4,
    subject: "সাধারণ জ্ঞান",
  },
  {
    title: "শর্টস: রিভিশন",
    channel: "শিক্ষামূলক শর্টস",
    url: "https://youtube.com/shorts/MVkwReTgtAM?si=CveiK9mnGrKqT3f0",
    classLevel: 5,
    subject: "সাধারণ জ্ঞান",
  },
];

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "লাইব্রেরি · E-পাঠশালা" }] }),
  component: Library,
});

function Library() {
  const [selectedClass, setSelectedClass] = useState<number | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const filteredVideos = useMemo(
    () =>
      educationalVideos.filter(
        (video) =>
          (selectedClass === "all" || video.classLevel === selectedClass) &&
          (selectedSubject === "all" || video.subject === selectedSubject),
      ),
    [selectedClass, selectedSubject],
  );

  const filteredReels = useMemo(
    () =>
      featuredShorts.filter(
        (reel) =>
          (selectedClass === "all" || reel.classLevel === selectedClass) &&
          (selectedSubject === "all" || reel.subject === selectedSubject),
      ),
    [selectedClass, selectedSubject],
  );

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero text-white grid place-items-center shadow-soft">
                <Video className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">শিক্ষামূলক ভিডিও লাইব্রেরি</h1>
                <p className="text-muted-foreground mt-1">YouTube-স্টাইলের কার্ডে ভিডিও, চ্যানেল, আর রিলস দেখো।</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/live-class" className="px-4 py-2 rounded-xl glass font-medium hover:shadow-soft transition-all">
                লাইভ ক্লাসে যাও
              </Link>
              <Link to="/bangladesh-map" className="px-4 py-2 rounded-xl glass font-medium hover:shadow-soft transition-all">
                মানচিত্র দেখো
              </Link>
            </div>
          </div>
        </header>

        <section className="glass rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-lg">ফিল্টার</h2>
            <button
              onClick={() => {
                setSelectedClass("all");
                setSelectedSubject("all");
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              ফিল্টার রিসেট করো
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["all", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((classLevel) => (
              <button
                key={String(classLevel)}
                onClick={() => setSelectedClass(classLevel)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedClass === classLevel ? "bg-gradient-hero text-white shadow-soft" : "bg-background border border-border hover:border-primary"
                }`}
              >
                {classLevel === "all" ? "সব শ্রেণি" : `শ্রেণি ${classLevel}`}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["all", "গণিত", "বাংলা", "বিজ্ঞান", "সাধারণ জ্ঞান"].map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSubject === subject ? "bg-gradient-blue text-white shadow-soft" : "bg-background border border-border hover:border-primary"
                }`}
              >
                {subject === "all" ? "সব বিষয়" : subject}
              </button>
            ))}
          </div>
        </section>

        <section className="glass-strong rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <PlayCircle className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">ভিডিও ফিড</h2>
              <p className="text-sm text-muted-foreground">কার্ডে থাম্বনেইল দেখো, ক্লিক করলে YouTube-এ খুলবে।</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <a
                key={video.url + video.title}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-3xl overflow-hidden shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all bg-card"
              >
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={`https://i.ytimg.com/vi/${youtubeIdFromUrl(video.url)}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.parentElement?.querySelector("[data-fallback]");
                      if (fallback instanceof HTMLElement) fallback.style.display = "grid";
                    }}
                  />
                  <div
                    data-fallback
                    className="hidden absolute inset-0 place-items-center bg-gradient-to-br from-sky-100 via-white to-amber-100 text-center px-6"
                  >
                    <div>
                      <div className="text-5xl mb-2">▶</div>
                      <div className="font-bold text-slate-700">{video.title}</div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 text-white text-xs font-semibold">
                    শ্রেণি {video.classLevel}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold leading-snug">{video.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between gap-2">
                    <span>{video.channel}</span>
                    <span>{video.subject}</span>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                    YouTube-এ দেখো <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
          {filteredVideos.length === 0 && <div className="text-sm text-muted-foreground mt-4">এই ফিল্টারে কোনো ভিডিও নেই।</div>}
        </section>

        <section className="glass-strong rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-orange text-white grid place-items-center shadow-soft text-xl">
              shorts
            </div>
            <div>
              <h2 className="text-2xl font-bold">রিলস ও শর্টস</h2>
              <p className="text-sm text-muted-foreground">YouTube shorts-ধাঁচের শিক্ষামূলক ক্লিপ।</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredReels.map((reel) => (
              <a
                key={reel.url}
                href={reel.url}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-3xl overflow-hidden shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all bg-card"
              >
                <div className="relative aspect-[9/16] grid place-items-center text-6xl bg-gradient-blue text-white overflow-hidden">
                  <img
                    src={`https://i.ytimg.com/vi/${youtubeIdFromUrl(reel.url)}/hqdefault.jpg`}
                    alt={reel.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 text-white text-xs font-semibold">
                    Shorts
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold">{reel.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                    <span>{reel.subject}</span>
                    <span>শ্রেণি {reel.classLevel}</span>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                    শর্টস দেখো <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
          {filteredReels.length === 0 && <div className="text-sm text-muted-foreground mt-4">এই ফিল্টারে কোনো রিলস নেই।</div>}
        </section>
      </div>
    </AppShell>
  );
}
