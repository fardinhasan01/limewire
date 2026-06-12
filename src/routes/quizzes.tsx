import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { quizBank } from "@/lib/bangladesh-learning";
import { awardXp, useUser } from "@/lib/user-store";

type QuizSearch = {
  class?: number;
};

export const Route = createFileRoute("/quizzes")({
  validateSearch: (search: Record<string, unknown>): QuizSearch => ({
    class: (() => {
      const value = typeof search.class === "string" ? Number(search.class) : typeof search.class === "number" ? search.class : undefined;
      return typeof value === "number" && Number.isFinite(value) ? value : undefined;
    })(),
  }),
  head: () => ({ meta: [{ title: "কুইজ · E-পাঠশালা" }] }),
  component: Quizzes,
});

function Quizzes() {
  const user = useUser();
  const search = Route.useSearch();
  const [selectedClass, setSelectedClass] = useState<number>(search.class ?? user.class);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (search.class && search.class !== selectedClass) {
      setSelectedClass(search.class);
    }
    // Only reset when the chosen class actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.class]);

  const questions = quizBank.filter((q) => q.classLevel === selectedClass);
  const question = questions[questionIndex];

  useEffect(() => {
    setQuestionIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }, [selectedClass]);

  if (!question) {
    return (
      <AppShell>
        <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold">প্রশ্ন পাওয়া যায়নি</h1>
        </div>
      </AppShell>
    );
  }

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === question.answer) setScore((current) => current + 1);
  };

  const next = () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((current) => current + 1);
      setPicked(null);
      return;
    }

    awardXp(score * 25, score * 8);
    setDone(true);
  };

  const restart = () => {
    setQuestionIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <AppShell>
        <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="text-7xl animate-float">🏆</div>
          <h1 className="text-4xl font-bold">শ্রেণি {selectedClass} কুইজ শেষ!</h1>
          <p className="text-muted-foreground">
            তুমি {score} / {questions.length} পেয়েছ।
          </p>
          <div className="glass-strong rounded-3xl p-8 inline-flex flex-col items-center gap-3">
            <div className="text-5xl font-bold gradient-text">+{score * 25} XP</div>
            <div className="text-sm text-muted-foreground">+{score * 8} কয়েন পাওয়া গেছে</div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={restart}
              className="px-6 py-3 rounded-2xl bg-gradient-hero text-white font-semibold shadow-soft inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> আবার খেলো
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" /> ১০০টি শ্রেণিভিত্তিক কুইজ
            </h1>
            <div className="text-sm flex items-center gap-1">
              <Trophy className="w-4 h-4 text-brand-orange" /> {score}/{questions.length}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((classLevel) => (
              <button
                key={classLevel}
                onClick={() => setSelectedClass(classLevel)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedClass === classLevel ? "bg-gradient-hero text-white shadow-soft" : "glass hover:shadow-soft"
                }`}
              >
                শ্রেণি {classLevel}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            তুমি এখন শ্রেণি {selectedClass}-এ আছো। এই শ্রেণির ২০টি প্রশ্ন শেষ করো, তারপর অন্য শ্রেণি বেছে পুরো ব্যাংক ঘুরে দেখো।
          </p>
        </header>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-hero transition-all" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {question.subject} · শ্রেণি {selectedClass} · প্রশ্ন {questionIndex + 1} / {questions.length}
          </div>
          <h2 className="text-2xl font-bold mb-6">{question.prompt}</h2>
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isPicked = picked === idx;
              const isCorrect = idx === question.answer;
              const reveal = picked !== null;

              return (
                <button
                  key={opt}
                  onClick={() => choose(idx)}
                  disabled={reveal}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    reveal && isCorrect
                      ? "border-brand-green bg-brand-green/10"
                      : reveal && isPicked && !isCorrect
                        ? "border-destructive bg-destructive/10"
                        : "border-border hover:border-primary hover:bg-muted/60"
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                  {reveal && isCorrect && <Check className="w-5 h-5 text-brand-green" />}
                  {reveal && isPicked && !isCorrect && <X className="w-5 h-5 text-destructive" />}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-5 p-4 rounded-2xl bg-muted/60 text-sm">
              <strong>{picked === question.answer ? "দারুণ! 🎉" : "এবার হয়নি —"}</strong> {question.explain}
            </div>
          )}
        </div>

        {picked !== null && (
          <button onClick={next} className="w-full px-6 py-3.5 rounded-2xl bg-gradient-hero text-white font-semibold shadow-soft hover:shadow-glow">
            {questionIndex + 1 < questions.length ? "পরের প্রশ্ন →" : "কুইজ শেষ করো"}
          </button>
        )}
      </div>
    </AppShell>
  );
}
