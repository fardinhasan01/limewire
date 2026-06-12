import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, LoaderCircle, Send, Sparkles, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "আমি E-পাঠশালা সহায়ক AI. তোমার প্রশ্ন লিখো, আমি সংক্ষেপে উত্তর দেব।",
      },
    ],
  },
] satisfies UIMessage[];

const QUICK_PROMPTS = [
  "গণিতে ভগ্নাংশ কী?",
  "বাংলা ব্যাকরণে বিশেষ্য কী?",
  "বাংলাদেশের রাজধানী কোনটি?",
  "কীভাবে দ্রুত multiplication শিখব?",
];

export const Route = createFileRoute("/bani")({
  head: () => ({ meta: [{ title: "সহায়ক AI · E-পাঠশালা" }] }),
  component: SupportAi,
});

function SupportAi() {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chat = useChat({
    transport: useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []),
    messages: INITIAL_MESSAGES,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages, chat.status]);

  const isBusy = chat.status === "submitted" || chat.status === "streaming";

  async function submitQuestion() {
    const question = draft.trim();
    if (!question || isBusy) return;

    setDraft("");
    await chat.sendMessage({ text: question });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion();
  }

  function applyPrompt(prompt: string) {
    setDraft(prompt);
  }

  function extractText(message: UIMessage) {
    return message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("")
      .trim();
  }

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <header className="rounded-[2.25rem] border border-white/60 bg-[linear-gradient(135deg,#fff8e7_0%,#fff0dc_42%,#eaf6ff_100%)] shadow-soft overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold shadow-soft">
                <Sparkles className="h-4 w-4 text-brand-orange" />
                OpenAI-powered question answerer
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  E-পাঠশালা সহায়ক AI
                </h1>
                <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-7">
                  এটি এখন আর embedded website নয়. এখানে তুমি সরাসরি প্রশ্ন করবে, আর OpenAI থেকে
                  দ্রুত, সংক্ষিপ্ত উত্তর পাবে।
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs md:text-sm font-medium text-muted-foreground">
                <span className="rounded-full bg-white/90 px-3 py-2 shadow-soft">
                  শুধু প্রশ্ন করো
                </span>
                <span className="rounded-full bg-white/90 px-3 py-2 shadow-soft">
                  Bangla + English
                </span>
                <span className="rounded-full bg-white/90 px-3 py-2 shadow-soft">
                  Streaming answers
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "চালু AI", value: "OpenAI" },
                { label: "ফোকাস", value: "Question & answer" },
                { label: "ফরম্যাট", value: "Short replies" },
                { label: "পৃষ্ঠা", value: "E-পাঠশালা" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] bg-white/90 border border-white/70 p-4 shadow-soft"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] items-start">
          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-border bg-white shadow-soft p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-white shadow-soft">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">কীভাবে ব্যবহার করবে</h2>
                  <p className="text-sm text-muted-foreground">একটি প্রশ্ন লিখো, আর উত্তর নাও।</p>
                </div>
              </div>

              <div className="space-y-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => applyPrompt(prompt)}
                    className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 text-left text-sm font-medium hover:bg-muted/60 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-brand-orange/10 p-4 text-sm leading-6 text-foreground">
                <strong>Tip:</strong> যদি প্রশ্নটা কঠিন হয়, খুব ছোট করে জিজ্ঞেস করো. আমি সেটাকে সহজ
                ভাষায় বুঝিয়ে দেব।
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-white shadow-soft p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-brand-orange" />
                Status
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Connection</span>
                <span className="font-semibold">{isBusy ? "Thinking..." : "Ready"}</span>
              </div>
              {chat.error ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {chat.error.message}
                </div>
              ) : (
                <div className="rounded-2xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  {isBusy ? "উত্তর তৈরি হচ্ছে..." : "নতুন প্রশ্নের জন্য প্রস্তুত।"}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl"
                onClick={() => {
                  chat.clearError();
                  chat.setMessages(INITIAL_MESSAGES);
                  setDraft("");
                }}
              >
                <Trash2 className="h-4 w-4" />
                Clear chat
              </Button>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-border bg-white shadow-soft overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 bg-muted/20">
              <div>
                <h2 className="text-lg font-bold">Ask a question</h2>
                <p className="text-sm text-muted-foreground">একবারে একটি প্রশ্ন লিখলেই হবে।</p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted/70 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                ফিরে যাও
              </Link>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-4 md:px-5 py-5 space-y-4 bg-[radial-gradient(circle_at_top,#fffaf2_0%,#ffffff_42%,#f7fbff_100%)]">
              {chat.messages.map((message, index) => {
                const text = extractText(message);
                const isUser = message.role === "user";
                const isAssistant = message.role === "assistant";

                return (
                  <div
                    key={message.id}
                    className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser && (
                      <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-white shadow-soft">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[92%] md:max-w-[80%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-sm",
                        isUser
                          ? "bg-gradient-hero text-white"
                          : "bg-white border border-border text-foreground",
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                        {isUser ? (
                          <>
                            <UserRound className="h-3.5 w-3.5" />
                            You
                          </>
                        ) : (
                          <>
                            <Bot className="h-3.5 w-3.5" />
                            E-পাঠশালা AI
                          </>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap">
                        {text ||
                          (isAssistant && index === chat.messages.length - 1 && isBusy
                            ? "..."
                            : "")}
                      </div>
                    </div>

                    {isUser && (
                      <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-muted text-foreground shadow-sm">
                        <UserRound className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isBusy && (
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-hero text-white shadow-soft">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="rounded-[1.5rem] border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
                    ভাবছি...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border bg-white p-4 md:p-5">
              <div className="space-y-3">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void submitQuestion();
                    }
                  }}
                  placeholder="তোমার প্রশ্ন এখানে লিখো..."
                  className="min-h-32 rounded-[1.5rem] border-border bg-muted/20 px-4 py-4 text-base"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Enter চাপলে send হবে, Shift+Enter দিলে নতুন লাইন হবে।
                  </p>
                  <Button
                    type="submit"
                    className="rounded-full px-6"
                    disabled={!draft.trim() || isBusy}
                  >
                    {isBusy ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isBusy ? "Sending" : "Send question"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
