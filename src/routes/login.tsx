import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Chrome, LoaderCircle, LogIn, Mail, School2, User, Users2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/lib/user-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "প্রবেশ · E-পাঠশালা" }] }),
  component: Login,
});

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState(3);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [pending, setPending] = useState<null | "email" | "google">(null);
  const [error, setError] = useState<string>("");

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return "/dashboard";
    const url = new URL(window.location.href);
    return url.searchParams.get("redirect") ?? "/dashboard";
  }, []);

  useEffect(() => {
    if (!auth.loading && auth.authUser) {
      void navigate({ to: redirectTo as "/dashboard" });
    }
  }, [auth.authUser, auth.loading, navigate, redirectTo]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setPending("email");

    try {
      if (mode === "signup") {
        await auth.signUpWithEmail({
          email: email.trim(),
          password,
          name: name.trim(),
          classLevel,
          role,
        });
      } else {
        await auth.signInWithEmail(email.trim(), password);
      }

      void navigate({ to: redirectTo as "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "প্রবেশ করা যায়নি।");
    } finally {
      setPending(null);
    }
  };

  const googleLogin = async () => {
    setError("");
    setPending("google");
    try {
      await auth.signInWithGoogle();
      void navigate({ to: redirectTo as "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google লগইন ব্যর্থ হয়েছে।");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 grid lg:grid-cols-[1fr_0.9fr] gap-6 items-stretch">
      <section className="rounded-[2rem] overflow-hidden shadow-soft border border-white/40 bg-[linear-gradient(135deg,#fff4d9_0%,#dff7ff_46%,#f3e8ff_100%)]">
        <div className="p-6 md:p-10 lg:p-12 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/assets/e-pathshala-logo.png" alt="E-পাঠশালা" className="w-14 h-14 rounded-2xl object-cover bg-white shadow-soft" />
              <div>
                <div className="text-2xl font-bold">E-পাঠশালা</div>
                <div className="text-sm text-muted-foreground">Firebase-powered digital school</div>
              </div>
            </Link>

            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow-soft">
                <School2 className="h-4 w-4 text-brand-orange" /> ক্লাস 1–10 · ছাত্র ও শিক্ষক
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-[0.95]">
                এক লগইনেই <span className="text-brand-orange">পড়া</span>, <span className="text-brand-green">খেলা</span>, আর <span className="text-brand-blue">সংযোগ</span>।
              </h1>
              <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-7">
                Email/password এবং Google login, persistent Firebase session, class profile, Firebase chat, quiz score, free board, আর certificate tracking সব এক জায়গায়।
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-10">
            {[
              { icon: Mail, title: "Email sign-in", text: "Secure local session or Firebase auth." },
              { icon: Users2, title: "Class rooms", text: "Class 1–10 students and teachers." },
              { icon: LogIn, title: "Auto restore", text: "Persistent session with seamless return." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass rounded-3xl p-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-hero text-white grid place-items-center shadow-soft mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-full max-w-xl glass-strong rounded-[2rem] p-6 md:p-8 shadow-glow">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-sm text-muted-foreground">Welcome back</div>
              <h2 className="text-2xl font-bold">{mode === "signin" ? "প্রবেশ করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}</h2>
            </div>
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${mode === "signin" ? "bg-gradient-hero text-white shadow-soft" : "text-muted-foreground"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${mode === "signup" ? "bg-gradient-hero text-white shadow-soft" : "text-muted-foreground"}`}
              >
                Sign up
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void googleLogin()}
            disabled={pending !== null}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-semibold hover:bg-muted/70 transition-colors disabled:opacity-60"
          >
            {pending === "google" ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
            Google দিয়ে প্রবেশ
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-sm font-medium">নাম</label>
                  <div className="mt-1 flex items-center gap-2 rounded-2xl border border-input bg-background px-4 py-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="যেমন: আরাভ"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">ক্লাস</label>
                  <div className="mt-2 grid grid-cols-5 gap-2 md:grid-cols-10">
                    {CLASSES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setClassLevel(item)}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold ${classLevel === item ? "bg-gradient-hero text-white shadow-soft" : "glass hover:shadow-soft"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(
                      [
                        ["student", "শিক্ষার্থী"],
                        ["teacher", "শিক্ষক"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`rounded-xl px-4 py-3 text-sm font-semibold ${role === value ? "bg-gradient-blue text-white shadow-soft" : "glass hover:shadow-soft"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@school.edu"
                className="mt-1 w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            {error ? <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

            <button
              type="submit"
              disabled={pending !== null}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3.5 text-white font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-60"
            >
              {pending === "email" ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {mode === "signin" ? "প্রবেশ করুন" : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            This login is now wired directly to Firebase. Make sure your `VITE_FIREBASE_*` env vars are set and Firebase Email/Password auth is enabled in the console.
          </p>
        </div>
      </section>
    </div>
  );
}
