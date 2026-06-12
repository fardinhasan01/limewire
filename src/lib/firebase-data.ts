import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirebaseDb, firebaseEnabled } from "@/lib/firebase";
import { type UserState } from "@/lib/user-store";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: number;
  seenBy: string[];
  replyTo?: string | null;
  emoji?: string;
}

export interface ChatRoomMeta {
  id: string;
  title: string;
  classLevel: number;
  typingBy: string[];
  updatedAt: number;
}

export interface ScoreRecord {
  id: string;
  userId: string;
  userName: string;
  classLevel: number;
  subject: string;
  mode: string;
  score: number;
  total: number;
  accuracy: number;
  streakBonus: number;
  createdAt: number;
}

export interface BoardSnapshot {
  id: string;
  classLevel: number;
  title: string;
  ownerId: string;
  ownerName: string;
  imageUrl: string;
  imageDataUrl?: string;
  updatedAt: number;
}

export interface CertificateRecord {
  id: string;
  userId: string;
  userName: string;
  classLevel: number;
  title: string;
  subject: string;
  score: number;
  total: number;
  issuedAt: number;
}

export interface ClassmatePreview {
  uid: string;
  name: string;
  avatar: string;
  classLevel: number;
  role: UserState["role"];
  xp: number;
  badges: string[];
  isOnline: boolean;
  lastSeen: number;
  friends: string[];
  followers: string[];
  following: string[];
  email: string;
}

const LOCAL_STORAGE_PREFIX = "epathshala:firebase-data";

function readLocalCollection<T>(name: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}:${name}`);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCollection<T>(name: string, records: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}:${name}`, JSON.stringify(records));
  window.dispatchEvent(new Event(`epathshala:${name}`));
}

function subscribeLocalCollection<T>(name: string, getSnapshot: () => T[], onChange: (items: T[]) => void) {
  onChange(getSnapshot());
  const listener = () => onChange(getSnapshot());
  window.addEventListener(`epathshala:${name}`, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(`epathshala:${name}`, listener);
    window.removeEventListener("storage", listener);
  };
}

export function listenClassmates(classLevel: number, onChange: (items: ClassmatePreview[]) => void): Unsubscribe | (() => void) {
  if (!firebaseEnabled) {
    return subscribeLocalCollection<ClassmatePreview>(
      "users",
      () =>
        readLocalCollection<ClassmatePreview>("users").filter((item) => item.classLevel === classLevel).sort((a, b) => Number(b.isOnline) - Number(a.isOnline) || b.xp - a.xp),
      onChange,
    );
  }

  const db = getFirebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "users"), where("class", "==", classLevel)),
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((entry) => {
          const data = entry.data();
          return {
            uid: entry.id,
            name: data.name ?? "শিক্ষার্থী",
            avatar: data.avatar ?? "🧑‍🎓",
            classLevel: data.class ?? classLevel,
            role: data.role ?? "student",
            xp: data.xp ?? 0,
            badges: Array.isArray(data.badges) ? data.badges : [],
            isOnline: Boolean(data.isOnline),
            lastSeen: typeof data.lastSeen === "number" ? data.lastSeen : Date.now(),
            friends: Array.isArray(data.friends) ? data.friends : [],
            followers: Array.isArray(data.followers) ? data.followers : [],
            following: Array.isArray(data.following) ? data.following : [],
            email: data.email ?? "",
          };
          })
          .sort((a, b) => Number(b.isOnline) - Number(a.isOnline) || b.lastSeen - a.lastSeen || b.xp - a.xp),
      );
    },
  );
}

export function listenChatMessages(roomId: string, onChange: (items: ChatMessage[]) => void): Unsubscribe | (() => void) {
  if (!firebaseEnabled) {
    return subscribeLocalCollection<ChatMessage>(
      "messages",
      () => readLocalCollection<ChatMessage>("messages").filter((message) => message.roomId === roomId).sort((a, b) => a.createdAt - b.createdAt),
      onChange,
    );
  }

  const db = getFirebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "messages"), where("roomId", "==", roomId)),
    (snapshot) =>
      onChange(
        snapshot.docs
          .map((entry) => {
          const data = entry.data();
          return {
            id: entry.id,
            roomId: data.roomId ?? roomId,
            senderId: data.senderId ?? "",
            senderName: data.senderName ?? "শিক্ষার্থী",
            senderAvatar: data.senderAvatar ?? "🧑‍🎓",
            text: data.text ?? "",
            createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
            seenBy: Array.isArray(data.seenBy) ? data.seenBy : [],
            replyTo: data.replyTo ?? null,
            emoji: data.emoji,
          };
          })
          .sort((a, b) => a.createdAt - b.createdAt),
      ),
  );
}

export async function sendChatMessage(message: Omit<ChatMessage, "id" | "createdAt" | "seenBy">) {
  if (!firebaseEnabled) {
    const messages = readLocalCollection<ChatMessage>("messages");
    messages.push({
      ...message,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      seenBy: [message.senderId],
    });
    writeLocalCollection("messages", messages);
    return;
  }

  const db = getFirebaseDb();
  if (!db) return;
  await addDoc(collection(db, "messages"), {
    ...message,
    createdAt: Date.now(),
    seenBy: [message.senderId],
    updatedAt: serverTimestamp(),
  });
}

export async function updateTypingState(roomId: string, user: Pick<UserState, "uid" | "name"> & { class: number }, isTyping: boolean) {
  if (!firebaseEnabled) return;
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(
    doc(db, "chats", roomId),
    {
      roomId,
      classLevel: user.class,
      typingBy: isTyping ? arrayUnion(user.uid) : arrayRemove(user.uid),
      typingName: user.name,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function markMessagesSeen(roomId: string, userId: string) {
  if (!firebaseEnabled) return;
  const db = getFirebaseDb();
  if (!db) return;
  const snapshot = await getDocs(query(collection(db, "messages"), where("roomId", "==", roomId), limit(50)));
  const batch = writeBatch(db);
  snapshot.docs.forEach((entry) => {
    batch.update(entry.ref, {
      seenBy: arrayUnion(userId),
    });
  });
  await batch.commit();
}

export function listenChatRoom(roomId: string, onChange: (room: ChatRoomMeta | null) => void): Unsubscribe | (() => void) {
  if (!firebaseEnabled) {
    return subscribeLocalCollection<ChatRoomMeta>(
      "rooms",
      () => readLocalCollection<ChatRoomMeta>("rooms").find((room) => room.id === roomId) ?? null,
      onChange,
    );
  }

  const db = getFirebaseDb();
  if (!db) return () => {};
  return onSnapshot(doc(db, "chats", roomId), (snapshot) => {
    if (!snapshot.exists()) {
      onChange(null);
      return;
    }

    const data = snapshot.data();
    onChange({
      id: snapshot.id,
      title: data.title ?? roomId,
      classLevel: data.classLevel ?? 0,
      typingBy: Array.isArray(data.typingBy) ? data.typingBy : [],
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
    });
  });
}

export async function saveQuizScore(record: Omit<ScoreRecord, "id" | "createdAt">) {
  if (!firebaseEnabled) {
    const scores = readLocalCollection<ScoreRecord>("scores");
    scores.unshift({
      ...record,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    });
    writeLocalCollection("scores", scores.slice(0, 100));
    return;
  }

  const db = getFirebaseDb();
  if (!db) return;
  await addDoc(collection(db, "scores"), {
    ...record,
    createdAt: Date.now(),
  });
}

export async function saveBoardSnapshot(record: Omit<BoardSnapshot, "id" | "updatedAt">) {
  if (!firebaseEnabled) {
    const boards = readLocalCollection<BoardSnapshot>("boards");
    const next = {
      ...record,
      imageUrl: record.imageUrl || record.imageDataUrl || "",
      imageDataUrl: record.imageDataUrl || record.imageUrl || "",
      id: record.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || crypto.randomUUID(),
      updatedAt: Date.now(),
    };
    writeLocalCollection("boards", [next, ...boards.filter((board) => board.id !== next.id)]);
    return next;
  }

  const db = getFirebaseDb();
  if (!db) return null;
  const ref = doc(collection(db, "boards"));
  const next = {
    ...record,
    imageUrl: record.imageUrl || record.imageDataUrl || "",
    imageDataUrl: record.imageDataUrl || record.imageUrl || "",
    id: ref.id,
    updatedAt: Date.now(),
  };
  await setDoc(ref, {
    ...record,
    imageUrl: record.imageUrl || record.imageDataUrl || "",
    imageDataUrl: record.imageDataUrl || record.imageUrl || "",
    updatedAt: Date.now(),
  });
  return next;
}

export function listenBoardSnapshots(classLevel: number, onChange: (items: BoardSnapshot[]) => void): Unsubscribe | (() => void) {
  if (!firebaseEnabled) {
    return subscribeLocalCollection<BoardSnapshot>(
      "boards",
      () => readLocalCollection<BoardSnapshot>("boards").filter((board) => board.classLevel === classLevel).sort((a, b) => b.updatedAt - a.updatedAt),
      onChange,
    );
  }

  const db = getFirebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "boards"), where("classLevel", "==", classLevel)),
    (snapshot) =>
      onChange(
        snapshot.docs
          .map((entry) => {
          const data = entry.data();
          return {
            id: entry.id,
            classLevel: data.classLevel ?? classLevel,
            title: data.title ?? "Untitled board",
            ownerId: data.ownerId ?? "",
            ownerName: data.ownerName ?? "",
            imageUrl: data.imageUrl ?? data.imageDataUrl ?? "",
            imageDataUrl: data.imageDataUrl ?? data.imageUrl ?? "",
            updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
          };
          })
          .sort((a, b) => b.updatedAt - a.updatedAt),
      ),
  );
}

export async function saveCertificate(record: Omit<CertificateRecord, "id" | "issuedAt">) {
  if (!firebaseEnabled) {
    const certificates = readLocalCollection<CertificateRecord>("certificates");
    certificates.unshift({
      ...record,
      id: crypto.randomUUID(),
      issuedAt: Date.now(),
    });
    writeLocalCollection("certificates", certificates.slice(0, 100));
    return;
  }

  const db = getFirebaseDb();
  if (!db) return;
  await addDoc(collection(db, "certificates"), {
    ...record,
    issuedAt: Date.now(),
  });
}

export function listenCertificates(userId: string, onChange: (items: CertificateRecord[]) => void): Unsubscribe | (() => void) {
  if (!firebaseEnabled) {
    return subscribeLocalCollection<CertificateRecord>(
      "certificates",
      () => readLocalCollection<CertificateRecord>("certificates").filter((certificate) => certificate.userId === userId),
      onChange,
    );
  }

  const db = getFirebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "certificates"), where("userId", "==", userId)),
    (snapshot) =>
      onChange(
        snapshot.docs
          .map((entry) => {
          const data = entry.data();
          return {
            id: entry.id,
            userId: data.userId ?? userId,
            userName: data.userName ?? "",
            classLevel: data.classLevel ?? 0,
            title: data.title ?? "",
            subject: data.subject ?? "",
            score: data.score ?? 0,
            total: data.total ?? 0,
            issuedAt: typeof data.issuedAt === "number" ? data.issuedAt : Date.now(),
          };
          })
          .sort((a, b) => b.issuedAt - a.issuedAt),
      ),
  );
}
