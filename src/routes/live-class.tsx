import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Camera, Clock3, MessageSquare, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { liveClasses } from "@/lib/bangladesh-learning";
import { useUser } from "@/lib/user-store";

export const Route = createFileRoute("/live-class")({
  head: () => ({ meta: [{ title: "লাইভ ক্লাস · E-পাঠশালা" }] }),
  component: LiveClass,
});

function LiveClass() {
  const user = useUser();
  const currentRoom = liveClasses.find((room) => room.classLevel === user.class) ?? liveClasses[0];

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">সরাসরি ক্লাসরুম</p>
              <h1 className="text-3xl md:text-4xl font-bold">লাইভ ভিডিও ক্লাস</h1>
              <p className="text-muted-foreground mt-1">ক্লাসে ঢুকো, প্রশ্ন করো, আর শিক্ষককে সঙ্গে নিয়ে রিয়েল-টাইমে শিখো।</p>
            </div>
            <a
              href={`https://meet.jit.si/${currentRoom.room}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-hero text-white font-semibold shadow-soft hover:shadow-glow flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> লাইভ রুমে ঢুকো
            </a>
          </div>
        </header>

        <section className="grid lg:grid-cols-[1.35fr_0.85fr] gap-5">
          <div className="glass-strong rounded-[2rem] overflow-hidden shadow-soft">
            <div className="bg-gradient-hero text-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm/6 opacity-85">চলতি রুম</p>
                <h2 className="text-2xl font-bold">
                  শ্রেণি {currentRoom.classLevel} · {currentRoom.title}
                </h2>
                <p className="text-sm opacity-90 mt-1">{currentRoom.description}</p>
              </div>
              <div className="text-sm bg-white/15 backdrop-blur px-3 py-2 rounded-xl">
                <div className="font-semibold">{currentRoom.time}</div>
                <div className="opacity-85">{currentRoom.teacher}</div>
              </div>
            </div>
            <iframe
              title={`শ্রেণি ${currentRoom.classLevel} লাইভ ক্লাস রুম`}
              src={`https://meet.jit.si/${currentRoom.room}`}
              className="w-full h-[620px] border-0 bg-background"
              allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-read; clipboard-write"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="space-y-4">
            <div className="glass rounded-3xl p-5">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" /> লাইভ রুমের নিয়ম
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• শিক্ষক বলার আগে মাইক মিউট রাখো।</li>
                <li>• ছোট প্রশ্ন ও উত্তর চ্যাটে দাও।</li>
                <li>• পুরো ক্লাস থাকলে প্র্যাকটিস পয়েন্ট পাওয়া যাবে।</li>
              </ul>
            </div>

            <div className="glass rounded-3xl p-5">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <CalendarDays className="w-5 h-5 text-brand-blue" /> সাপ্তাহিক লাইভ ক্লাস
              </h3>
              <div className="space-y-3">
                {liveClasses.map((room) => (
                  <div key={room.room} className={`rounded-2xl p-4 ${room.classLevel === currentRoom.classLevel ? "bg-muted/60" : "bg-card"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">শ্রেণি {room.classLevel}</div>
                      <span className="text-xs text-muted-foreground">{room.time}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{room.title}</div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{room.teacher}</span>
                      <a
                        href={`https://meet.jit.si/${room.room}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        এই রুমে ঢুকো
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-brand-orange" /> শিক্ষার্থীদের টিপস
              </h3>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock3 className="w-4 h-4 mt-0.5 text-primary" />
                <p>৫ মিনিট আগে ঢুকো, খাতা-কলম রাখো, আর ক্লাস শেষে কুইজ পেজে রিভিশন করো।</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
