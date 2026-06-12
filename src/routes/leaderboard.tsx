import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crown, Medal } from "lucide-react";
import { useUser } from "@/lib/user-store";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "লিডারবোর্ড · E-পাঠশালা" }] }),
  component: Leaderboard,
});

const BOARD = [
  { name: "Sumaiya", avatar: "🦄", xp: 3450, badge: "গণিত চ্যাম্পিয়ন" },
  { name: "Rafi", avatar: "🐯", xp: 2980, badge: "বিজ্ঞান অভিযাত্রী" },
  { name: "Mira", avatar: "🐼", xp: 2510, badge: "পড়ার নায়ক" },
  { name: "Ayan", avatar: "🐧", xp: 1980, badge: "কুইজ মাস্টার" },
  { name: "Tania", avatar: "🦊", xp: 1700, badge: "বানান তারকা" },
];

function Leaderboard() {
  const user = useUser();
  const merged = [...BOARD, { name: `${user.name} (তুমি)`, avatar: user.avatar, xp: user.xp, badge: "তুমি" }].sort((a, b) => b.xp - a.xp);

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
        <header className="mb-6 text-center">
          <Crown className="w-12 h-12 mx-auto text-brand-orange mb-2" />
          <h1 className="text-3xl md:text-4xl font-bold">শ্রেণি লিডারবোর্ড</h1>
          <p className="text-muted-foreground">এই সপ্তাহের সেরা শিক্ষার্থীরা</p>
        </header>
        <div className="glass-strong rounded-3xl p-2 space-y-1">
          {merged.map((row, idx) => (
            <div
              key={row.name}
              className={`flex items-center gap-4 p-4 rounded-2xl ${row.name.includes("(তুমি)") ? "bg-gradient-hero text-white shadow-soft" : "hover:bg-muted/60"}`}
            >
              <div className={`w-9 h-9 rounded-full grid place-items-center font-bold ${idx === 0 ? "bg-brand-yellow text-foreground" : idx === 1 ? "bg-muted-foreground/30" : idx === 2 ? "bg-brand-orange/40" : "bg-muted"}`}>
                {idx + 1}
              </div>
              <div className="text-3xl">{row.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{row.name}</div>
                <div className={`text-xs ${row.name.includes("(তুমি)") ? "opacity-80" : "text-muted-foreground"}`}>{row.badge}</div>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <Medal className="w-4 h-4" /> {row.xp.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
