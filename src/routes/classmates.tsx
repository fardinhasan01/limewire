import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Mic, Send, ShieldAlert, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import {
  listenChatMessages,
  listenChatRoom,
  listenClassmates,
  markMessagesSeen,
  sendChatMessage,
  updateTypingState,
  type ChatMessage,
  type ClassmatePreview,
} from "@/lib/firebase-data";
import { followUser, useAuth, useUser } from "@/lib/user-store";

export const Route = createFileRoute("/classmates")({
  head: () => ({ meta: [{ title: "ক্লাসমেট · E-পাঠশালা" }] }),
  component: Classmates,
});

type Mode = "group" | "dm";

function Classmates() {
  const auth = useAuth();
  const user = useUser();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const [selectedClass, setSelectedClass] = useState(user.class);
  const [members, setMembers] = useState<ClassmatePreview[]>([]);
  const [mode, setMode] = useState<Mode>("group");
  const [selectedPeer, setSelectedPeer] = useState<ClassmatePreview | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [roomTyping, setRoomTyping] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "people" | "boards" | "safety">("chat");

  const roomId = useMemo(() => {
    if (mode === "group") return `class-${selectedClass}`;
    if (!selectedPeer) return `class-${selectedClass}`;
    return [user.uid, selectedPeer.uid].sort().join("-");
  }, [mode, selectedClass, selectedPeer, user.uid]);

  useEffect(() => {
    const unsubscribe = listenClassmates(selectedClass, setMembers);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      else unsubscribe?.();
    };
  }, [selectedClass]);

  useEffect(() => {
    const unsubscribeMessages = listenChatMessages(roomId, setMessages);
    const unsubscribeRoom = listenChatRoom(roomId, (room) => setRoomTyping(room?.typingBy ?? []));
    void markMessagesSeen(roomId, user.uid);
    return () => {
      if (typeof unsubscribeMessages === "function") unsubscribeMessages();
      else unsubscribeMessages?.();
      if (typeof unsubscribeRoom === "function") unsubscribeRoom();
      else unsubscribeRoom?.();
    };
  }, [roomId, user.uid]);

  const onlinePeers = members.filter((member) => member.uid !== user.uid);
  const typingCount = roomTyping.filter((id) => id !== user.uid).length;

  async function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    await sendChatMessage({
      roomId,
      senderId: user.uid,
      senderName: user.name,
      senderAvatar: user.avatar,
      text,
      replyTo: null,
      emoji: "💬",
    });
    setDraft("");
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    void updateTypingState(roomId, user, false);
  }

  function handleDraftChange(value: string) {
    setDraft(value);
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    void updateTypingState(roomId, user, true);
    typingTimeoutRef.current = window.setTimeout(() => {
      void updateTypingState(roomId, user, false);
    }, 1200);
  }

  async function openDM(peer: ClassmatePreview) {
    setMode("dm");
    setSelectedPeer(peer);
    setActiveTab("chat");
    setDraft("");
    inputRef.current?.focus();
  }

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" /> Classmate rooms
              </h1>
              <p className="text-muted-foreground mt-2">
                Class-based groups, online indicators, friend/follow actions, and real-time chats for students and teachers.
              </p>
            </div>
            <div className="flex items-center gap-2 glass rounded-2xl px-3 py-2">
              <ShieldAlert className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium">Teacher moderation</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, index) => index + 1).map((classLevel) => (
              <button
                key={classLevel}
                type="button"
                onClick={() => setSelectedClass(classLevel)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${selectedClass === classLevel ? "bg-gradient-hero text-white shadow-soft" : "glass hover:shadow-soft"}`}
              >
                Class {classLevel}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "chat", label: "Chat", icon: MessageSquare },
              { value: "people", label: "People", icon: Users },
              { value: "boards", label: "Boards", icon: Mic },
              { value: "safety", label: "Safety", icon: ShieldAlert },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value as typeof activeTab)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === value ? "bg-gradient-blue text-white shadow-soft" : "glass hover:shadow-soft"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="glass-strong rounded-[2rem] p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold">Class {selectedClass} people</h2>
                  <p className="text-sm text-muted-foreground">{members.length} members online and offline</p>
                </div>
                <span className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green">{onlinePeers.filter((member) => member.isOnline).length} online</span>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
                  {members.map((member) => {
                  const following = user.following?.includes(member.uid);
                  const selected = selectedPeer?.uid === member.uid;
                  return (
                    <div
                      key={member.uid}
                      role="button"
                      tabIndex={0}
                      onClick={() => void openDM(member)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void openDM(member);
                        }
                      }}
                      className={`w-full rounded-3xl border p-4 text-left transition-all ${selected ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted/50"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-orange text-2xl shadow-soft">{member.avatar}</div>
                          <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${member.isOnline ? "bg-brand-green" : "bg-muted-foreground"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold truncate">{member.name}</div>
                            <span className="text-xs rounded-full bg-muted px-2 py-1">XP {member.xp}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Class {member.classLevel} · {member.role} · {member.isOnline ? "online now" : "recently active"}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {member.badges.slice(0, 3).map((badge) => (
                              <span key={badge} className="rounded-full bg-brand-orange/10 px-2 py-1 text-[11px] font-medium text-brand-orange">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void followUser(member.uid);
                          }}
                          className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold ${following ? "bg-brand-green text-white" : "bg-muted hover:bg-muted/80"}`}
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            {following ? "Following" : "Follow"}
                          </button>
                        <span className="inline-flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-xs font-semibold">
                          <span className={`h-2 w-2 rounded-full ${member.isOnline ? "bg-brand-green" : "bg-muted-foreground"}`} />
                          {member.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="glass-strong rounded-[2rem] p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{mode === "group" ? "Group room" : "Direct message"}</div>
                  <h2 className="text-2xl font-bold">
                    {mode === "group" ? `Class ${selectedClass} study room` : selectedPeer ? `${selectedPeer.name} · DM` : "Direct message"}
                  </h2>
                  <div className="text-sm text-muted-foreground">{typingCount > 0 ? `${typingCount} user(s) typing...` : "Real-time messaging, emoji-friendly and classroom-safe."}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("group");
                      setSelectedPeer(null);
                    }}
                    className={`rounded-2xl px-4 py-2 font-semibold ${mode === "group" ? "bg-gradient-hero text-white shadow-soft" : "glass hover:shadow-soft"}`}
                  >
                    Group chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("dm");
                      if (!selectedPeer && members[0]) setSelectedPeer(members[0]);
                    }}
                    className={`rounded-2xl px-4 py-2 font-semibold ${mode === "dm" ? "bg-gradient-blue text-white shadow-soft" : "glass hover:shadow-soft"}`}
                  >
                    One-to-one
                  </button>
                </div>
              </div>

              {activeTab === "chat" ? (
                <>
                  <div className="space-y-3 max-h-[560px] overflow-auto pr-1">
                    {messages.map((message, index) => {
                      const mine = message.senderId === user.uid;
                      const seen = message.seenBy.length > 1 || (message.seenBy.length === 1 && message.seenBy[0] !== message.senderId);
                      return (
                        <div key={`${message.id}-${index}`} className={`rounded-3xl p-4 ${mine ? "bg-gradient-hero text-white" : "glass"}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs opacity-80">
                              {message.senderAvatar} {message.senderName}
                            </div>
                            <div className="text-[11px] opacity-70">{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
                          </div>
                          <div className="mt-2 text-sm leading-relaxed">{message.text}</div>
                          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] opacity-80">
                            <span>{message.emoji ?? "💬"}</span>
                            <span>{mine ? (seen ? "Seen" : "Sent") : "Received"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-3xl border border-border bg-background p-3">
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(event) => handleDraftChange(event.target.value)}
                      placeholder={mode === "group" ? "Write to the class room..." : "Send a direct message..."}
                      className="flex-1 bg-transparent px-2 py-2 outline-none"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void sendMessage();
                      }}
                    />
                    <button type="button" onClick={() => void sendMessage()} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3 text-white font-semibold shadow-soft">
                      <Send className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </>
              ) : null}

              {activeTab === "people" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {members.map((member) => (
                    <div key={member.uid} className="rounded-3xl border border-border bg-background p-5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-orange text-2xl">{member.avatar}</div>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Class {member.classLevel} · {member.role}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.badges.map((badge) => (
                          <span key={badge} className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "boards" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Teacher + student collaborative board",
                    "Math sketch and equation solving",
                    "Vocabulary wall and spelling practice",
                    "Science diagrams and quick notes",
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-border bg-background p-5">
                      <div className="font-semibold">{item}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Open the free board to sketch, write, and save a class snapshot in Firebase.
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "safety" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Teacher moderation on",
                    "Anti-spam filters",
                    "Report harmful content",
                    "Typing indicators",
                    "Seen/unseen status",
                    "Friendly emoji support",
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-border bg-background p-5 text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
