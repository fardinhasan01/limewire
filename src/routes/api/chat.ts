import { createOpenAIProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const E_PATHSHALA_SYSTEM = `You are E-পাঠশালা সহায়ক AI.

Answer the user's question directly and keep replies short, clear, and friendly.
Prefer Bangla when the user writes Bangla, and simple English when the user writes English.
If the question is unclear, ask one short follow-up question.
Focus on school help, homework, and learning support.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });

        const openai = createOpenAIProvider(key);
        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: E_PATHSHALA_SYSTEM,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes("429"))
              return "E-পাঠশালা সহায়ক একটু বিরতি নিচ্ছে। একটু পরে আবার চেষ্টা করো।";
            if (message.includes("401")) return "OpenAI key ঠিকমতো সেট করা নেই।";
            return "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করো।";
          },
        });
      },
    },
  },
});
