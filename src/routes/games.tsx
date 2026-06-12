import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, ChevronRight, Clock3, Maximize2, RotateCcw, ShieldCheck, Sparkles, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { quizBank } from "@/lib/bangladesh-learning";
import { saveCertificate, saveQuizScore } from "@/lib/firebase-data";
import { useAuth, useUser } from "@/lib/user-store";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "গেমস · E-পাঠশালা" }] }),
  component: Games,
});

const SUBJECTS = [
  { label: "সব বিষয়", value: "all" },
  { label: "গণিত", value: "গণিত" },
  { label: "ইংরেজি", value: "ইংরেজি" },
  { label: "বাংলা", value: "বাংলা" },
  { label: "বিজ্ঞান", value: "বিজ্ঞান" },
  { label: "বাংলাদেশ & গ্লোবাল স্টাডিজ", value: "সাধারণ জ্ঞান" },
] as const;

type SubjectFilter = (typeof SUBJECTS)[number]["value"];

function Games() {
  const auth = useAuth();
  const user = useUser();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const completeGuardRef = useRef(false);
  const soundEnabledRef = useRef(true);
  const [selectedClass, setSelectedClass] = useState<number>(user.class);
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>("all");
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [questions, setQuestions] = useState(() => buildQuestions(user.class, "all", 10));
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<null | { correct: boolean; text: string }>(null);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question = questions[index];
  const streak = useMemo(() => {
    if (!questions.length) return 0;
    let count = 0;
    for (let i = 0; i < index; i += 1) {
      if (questions[i]?.__correct && questions[i].__answeredCorrect) count += 1;
      else count = 0;
    }
    return count;
  }, [index, questions]);

  useEffect(() => {
    setQuestions(buildQuestions(selectedClass, selectedSubject, questionCount));
    setIndex(0);
    setSelectedAnswer(null);
    setSecondsLeft(timeLimit);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setFinished(false);
    setSubmitted(false);
    completeGuardRef.current = false;
  }, [questionCount, selectedClass, selectedSubject, timeLimit]);

  useEffect(() => {
    if (finished || !question || selectedAnswer !== null) return;
    setSecondsLeft(timeLimit);
  }, [finished, index, question, selectedAnswer, timeLimit]);

  useEffect(() => {
    if (finished || selectedAnswer !== null || !question) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          void handleAnswer(-1);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, question, selectedAnswer]);

  useEffect(() => {
    if (finished || submitted || !auth.profile.uid) return;
    if (index < questions.length) return;
    setFinished(true);
  }, [auth.profile.uid, finished, index, questions.length, submitted]);

  useEffect(() => {
    if (!finished || completeGuardRef.current) return;
    completeGuardRef.current = true;
    const percent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
    const streakBonus = Math.max(0, correctCount - 1) * 2;
    void saveQuizCompletion(percent, score, questions.length, streakBonus);
  }, [correctCount, finished, questions.length, score]);

  async function saveQuizCompletion(percent: number, finalScore: number, total: number, streakBonus: number) {
    const subjectLabel = selectedSubject === "all" ? "Mixed subject" : selectedSubject;
    await saveQuizScore({
      userId: auth.profile.uid,
      userName: auth.profile.name,
      classLevel: selectedClass,
      subject: subjectLabel,
      mode: "fullscreen-quiz",
      score: finalScore,
      total,
      accuracy: percent,
      streakBonus,
    });

    const xpGain = Math.max(25, finalScore * 8 + streakBonus * 3);
    const coinGain = Math.max(5, Math.floor(percent / 10) + streakBonus);
    await auth.awardProgress({
      xp: xpGain,
      coins: coinGain,
      lessonsCompleted: percent >= 80 ? 1 : 0,
      badges: percent >= 80 ? [`${subjectLabel} Champ`] : [],
    });

    if (percent >= 80) {
      await saveCertificate({
        userId: auth.profile.uid,
        userName: auth.profile.name,
        classLevel: selectedClass,
        title: `Certificate of Excellence in ${subjectLabel}`,
        subject: subjectLabel,
        score: finalScore,
        total,
      });
    }

    setSubmitted(true);
  }

  function playSound(ok: boolean) {
    if (!audioEnabled || !soundEnabledRef.current || typeof window === "undefined") return;
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = ok ? 880 : 220;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.16);
  }

  async function handleAnswer(choice: number) {
    if (!question || selectedAnswer !== null || finished) return;
    const correct = choice === question.answer;
    const nextQuestions = questions.slice();
    nextQuestions[index] = { ...question, __correct: true, __answeredCorrect: correct } as typeof question & {
      __correct?: boolean;
      __answeredCorrect?: boolean;
    };
    setQuestions(nextQuestions);
    setSelectedAnswer(choice);
    setFeedback({
      correct,
      text: correct ? "দারুণ! তুমি সঠিক উত্তর দিয়েছ।" : `সঠিক উত্তর: ${question.options[question.answer]}`,
    });
    playSound(correct);

    const timeBonus = Math.max(0, timeLimit - secondsLeft);
    const streakBonus = correct ? Math.max(1, Math.min(5, Math.floor(index / 2) + 1)) : 0;
    const earned = correct ? 10 + streakBonus + Math.floor(timeBonus / 4) : 0;

    if (correct) setCorrectCount((current) => current + 1);
    setScore((current) => current + earned);

    window.setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((current) => current + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  }

  async function enterFullscreen() {
    if (!boardRef.current?.requestFullscreen) return;
    await boardRef.current.requestFullscreen().catch(() => {});
  }

  function restart() {
    setQuestions(buildQuestions(selectedClass, selectedSubject, questionCount));
    setIndex(0);
    setSelectedAnswer(null);
    setSecondsLeft(timeLimit);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setFinished(false);
    setSubmitted(false);
    completeGuardRef.current = false;
  }

  const percent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <AppShell>
      <div ref={boardRef} className="min-h-[calc(100vh-2rem)] px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="glass-strong rounded-[2rem] p-5 md:p-6 flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-brand-orange" /> fullscreen quiz arena
                </div>
                <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">Bangladesh curriculum game mode</h1>
                <p className="mt-2 max-w-3xl text-sm md:text-base text-muted-foreground">
                  প্রতি প্রশ্নে সময়সীমা আছে, answer feedback instant, score save হয় Firebase-এ, আর high score হলে certificate auto-generate হয়।
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void enterFullscreen()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 text-white font-semibold shadow-soft"
                >
                  <Maximize2 className="h-4 w-4" />
                  Full screen
                </button>
                <button
                  type="button"
                  onClick={() => setAudioEnabled((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70"
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Sound {audioEnabled ? "on" : "off"}
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <Stat icon={<Clock3 className="h-4 w-4" />} label="Timer" value={`${secondsLeft}s`} />
              <Stat icon={<Trophy className="h-4 w-4" />} label="Score" value={score.toString()} />
              <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Accuracy" value={`${percent}%`} />
              <Stat icon={<Zap className="h-4 w-4" />} label="Streak" value={`${Math.max(0, correctCount - 1)}`} />
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-strong rounded-[2rem] p-5 md:p-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Control label="Class" value={selectedClass.toString()} onChange={(value) => setSelectedClass(Number(value))} options={Array.from({ length: 10 }, (_, idx) => `${idx + 1}`)} />
                <Control label="Subject" value={selectedSubject} onChange={(value) => setSelectedSubject(value as SubjectFilter)} options={SUBJECTS.map((item) => item.value)} optionsLabel={SUBJECTS.map((item) => item.label)} />
                <Control label="Questions" value={questionCount.toString()} onChange={(value) => setQuestionCount(Number(value))} options={["5", "10", "15", "20"]} />
              </div>

              <div className="grid md:grid-cols-[1fr_auto] items-center gap-3 rounded-3xl bg-muted/50 p-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Question {index + 1} / {questions.length}
                  </div>
                  <h2 className="mt-1 text-xl md:text-3xl font-bold leading-tight">{question?.prompt ?? "No question"}</h2>
                </div>
                <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </button>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-hero transition-all" style={{ width: `${questions.length ? ((index + 1) / questions.length) * 100 : 0}%` }} />
              </div>

              <div className="space-y-3">
                {question?.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === question.answer;
                  const isPicked = selectedAnswer === optionIndex;
                  const reveal = selectedAnswer !== null;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={reveal}
                      onClick={() => void handleAnswer(optionIndex)}
                      className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                        reveal && isCorrect
                          ? "border-brand-green bg-brand-green/10"
                          : reveal && isPicked && !isCorrect
                            ? "border-destructive bg-destructive/10"
                            : "border-border bg-background hover:border-primary hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{option}</span>
                        {reveal && isCorrect ? <CheckCircle2 className="h-5 w-5 text-brand-green" /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {feedback ? (
                <div className={`rounded-2xl p-4 text-sm ${feedback.correct ? "bg-brand-green/10" : "bg-destructive/10"}`}>
                  <strong>{feedback.correct ? "Correct" : "Try again"}:</strong> {feedback.text}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-brand-orange" />
                <span>Time limit per question is mandatory. Auto-next runs when the timer ends.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-[2rem] p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-bold">Game rules</h3>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{selectedClass}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 10–30 second timers, based on your setting.</li>
                  <li>• Correct streaks add bonus points.</li>
                  <li>• 80%+ opens certificate creation automatically.</li>
                  <li>• Scores save to Firebase or the local demo store.</li>
                </ul>
              </div>

              <div className="glass rounded-[2rem] p-5">
                <h3 className="font-bold mb-3">Live summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <TinyStat title="Correct" value={`${correctCount}`} />
                  <TinyStat title="Streak bonus" value={`${Math.max(0, correctCount - 1)}`} />
                  <TinyStat title="Timer" value={`${secondsLeft}s`} />
                  <TinyStat title="Accuracy" value={`${percent}%`} />
                </div>
              </div>

              <div className="glass rounded-[2rem] p-5">
                <h3 className="font-bold mb-3">Settings</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="mb-2 font-medium">Time per question: {timeLimit}s</div>
                    <input
                      type="range"
                      min={10}
                      max={30}
                      step={5}
                      value={timeLimit}
                      onChange={(event) => setTimeLimit(Number(event.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Audio feedback</span>
                    <button type="button" onClick={() => setAudioEnabled((current) => !current)} className="rounded-full bg-muted px-3 py-1.5 font-medium">
                      {audioEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>

              <Link to="/certificates" className="glass rounded-[2rem] p-5 flex items-center justify-between gap-3 hover:shadow-soft transition-all">
                <div>
                  <div className="font-bold">Achievement certificates</div>
                  <div className="text-sm text-muted-foreground">View generated certificates and download as PDF.</div>
                </div>
                <Award className="h-5 w-5 text-primary" />
              </Link>
            </div>
          </section>

          {finished ? (
            <section className="glass-strong rounded-[2rem] p-6 md:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    <Trophy className="h-3.5 w-3.5 text-brand-orange" /> final score
                  </div>
                  <h2 className="mt-3 text-3xl md:text-4xl font-bold">Quiz complete</h2>
                </div>
                <div className="rounded-[1.5rem] bg-gradient-hero px-6 py-5 text-white shadow-glow">
                  <div className="text-xs uppercase tracking-[0.2em] opacity-80">score</div>
                  <div className="text-4xl font-bold">{score}</div>
                  <div className="text-sm opacity-85">out of {questions.length * 15}</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <ResultCard label="Accuracy" value={`${percent}%`} />
                <ResultCard label="Correct answers" value={`${correctCount}/${questions.length}`} />
                <ResultCard label="Firebase" value={auth.firebaseReady ? "Enabled" : "Local demo"} />
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 font-semibold text-white shadow-soft">
                  <RotateCcw className="h-4 w-4" />
                  Play again
                </button>
                <Link to="/certificates" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 font-semibold hover:bg-muted/70">
                  <Award className="h-4 w-4" />
                  Open certificates
                </Link>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}

function buildQuestions(classLevel: number, subject: SubjectFilter, count: number) {
  const filtered = quizBank.filter((question) => question.classLevel === classLevel && (subject === "all" || question.subject === subject));
  const pool = filtered.length ? filtered : quizBank.filter((question) => question.classLevel === classLevel);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/80 p-4 shadow-soft border border-border">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function TinyStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-muted/50 p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Control({
  label,
  value,
  onChange,
  options,
  optionsLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionsLabel?: string[];
}) {
  return (
    <label className="space-y-2">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-medium outline-none"
      >
        {options.map((option, index) => (
          <option key={option} value={option}>
            {optionsLabel?.[index] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

