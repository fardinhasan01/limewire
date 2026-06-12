import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  DoorOpen,
  Gamepad2,
  Home,
  MessageCircleHeart,
  Palette,
  ScrollText,
  Swords,
  Users,
  Trophy,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth, useRequireAuth } from "@/lib/user-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "শুরু", icon: Home },
  { to: "/subjects", label: "বিষয়", icon: BookOpen },
  { to: "/bani", label: "সহায়ক", icon: MessageCircleHeart },
  { to: "/quizzes", label: "কুইজ", icon: Brain },
  { to: "/games", label: "গেম", icon: Gamepad2 },
  { to: "/special-game", label: "Special Game", icon: Swords },
  { to: "/free-board", label: "বোর্ড", icon: Palette },
  { to: "/classmates", label: "ক্লাসমেট", icon: Users },
  { to: "/live-class", label: "লাইভ", icon: Video },
  { to: "/library", label: "লাইব্রেরি", icon: Video },
  { to: "/certificates", label: "সার্টিফিকেট", icon: ScrollText },
  { to: "/leaderboard", label: "র‍্যাঙ্ক", icon: Trophy },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const auth = useRequireAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = auth.profile;

  if (auth.loading) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="glass-strong rounded-[2rem] p-8 text-center max-w-md w-full">
          <div className="text-4xl mb-3 animate-float">📚</div>
          <h1 className="text-2xl font-bold">তোমার স্কুল লোড হচ্ছে</h1>
          <p className="text-sm text-muted-foreground mt-2">সেশন যাচাই করা হচ্ছে, একটু অপেক্ষা করো।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col gap-2 p-4 sticky top-0 h-screen">
        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-4">
          <img src="/assets/e-pathshala-logo.png" alt="E-পাঠশালা" className="w-12 h-12 rounded-2xl object-cover shadow-glow bg-white" />
          <div>
            <div className="font-display font-bold text-lg leading-none">E-পাঠশালা</div>
            <div className="text-xs text-muted-foreground">ডিজিটাল শেখার স্কুল</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1 mt-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-hero text-white shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-orange grid place-items-center text-2xl">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                Class {user.class} · {user.role.charAt(0).toUpperCase() + user.role.slice(1)} · Lv {user.level}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">🔥 {user.streak}d</span>
            <span className="flex items-center gap-1">⭐ {user.xp}</span>
            <span className="flex items-center gap-1">🪙 {user.coins}</span>
          </div>
          <button
            type="button"
            onClick={() => void auth.signOut()}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            <DoorOpen className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-8">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
        {nav.slice(0, 9).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <footer className="fixed left-1/2 -translate-x-1/2 bottom-20 lg:bottom-4 z-30 pointer-events-none">
        <div className="pointer-events-auto glass-strong px-4 py-2 rounded-full text-[11px] md:text-xs text-muted-foreground shadow-soft text-center">
          Created &amp; Developed by Fardin Hasan, Kachua Govt Pilot High School. Firebase-powered learning workspace.
        </div>
      </footer>
    </div>
  );
}
