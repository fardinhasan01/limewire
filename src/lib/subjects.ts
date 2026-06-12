export type SubjectSlug =
  | "math"
  | "english"
  | "physics"
  | "chemistry"
  | "bangla"
  | "science"
  | "social"
  | "ict"
  | "gk"
  | "islamic";

export interface Subject {
  slug: SubjectSlug;
  name: string;
  emoji: string;
  gradient: string;
  lessons: number;
  progress: number;
  description: string;
}

export const subjects: Subject[] = [
  { slug: "math",     name: "গণিত",            emoji: "🔢", gradient: "bg-gradient-blue",   lessons: 48, progress: 62, description: "সংখ্যা, আকার, আর পাজল" },
  { slug: "english",  name: "ইংরেজি",          emoji: "📖", gradient: "bg-gradient-purple", lessons: 42, progress: 48, description: "শব্দ, ব্যাকরণ, আর গল্প" },
  { slug: "physics",  name: "পদার্থবিজ্ঞান",   emoji: "⚛️", gradient: "bg-gradient-orange", lessons: 34, progress: 22, description: "বল, গতি, আর শক্তির জগৎ" },
  { slug: "chemistry", name: "রসায়ন",          emoji: "🧪", gradient: "bg-gradient-pink",   lessons: 30, progress: 20, description: "পদার্থের গঠন আর বিক্রিয়া" },
  { slug: "bangla",   name: "বাংলা",            emoji: "🇧🇩", gradient: "bg-gradient-green",  lessons: 40, progress: 55, description: "মাতৃভাষার সৌন্দর্য" },
  { slug: "science",  name: "বিজ্ঞান",         emoji: "🔬", gradient: "bg-gradient-orange", lessons: 36, progress: 30, description: "চারপাশের দুনিয়া বুঝো" },
  { slug: "social",   name: "সমাজবিজ্ঞান",     emoji: "🌍", gradient: "bg-gradient-pink",   lessons: 28, progress: 18, description: "মানুষ, সমাজ, আর দেশ" },
  { slug: "ict",      name: "আইসিটি",           emoji: "💻", gradient: "bg-gradient-blue",   lessons: 24, progress: 12, description: "কম্পিউটার ও প্রযুক্তি" },
  { slug: "gk",       name: "সাধারণ জ্ঞান",     emoji: "🧠", gradient: "bg-gradient-sunny",  lessons: 32, progress: 40, description: "মজার সব তথ্য" },
  { slug: "islamic",  name: "ইসলাম শিক্ষা",    emoji: "🕌", gradient: "bg-gradient-green",  lessons: 26, progress: 25, description: "মূল্যবোধ ও শেখা" },
];

export const getSubject = (slug: string) => subjects.find((s) => s.slug === slug);

export const mockLessons = (subject: Subject) =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `${subject.slug}-${i + 1}`,
    title: `Lesson ${i + 1}: ${subject.name} basics ${i + 1}`,
    duration: `${8 + ((i * 3) % 12)} min`,
    completed: i < Math.floor(subject.progress / 10),
    locked: i > Math.floor(subject.progress / 10) + 2,
  }));
