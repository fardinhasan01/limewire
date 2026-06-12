import type { SubjectSlug } from "@/lib/subjects";

export const classLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type ClassLevel = (typeof classLevels)[number];

export interface QuizQuestion {
  id: string;
  classLevel: ClassLevel;
  subject: "গণিত" | "ইংরেজি" | "বাংলা" | "বিজ্ঞান" | "সাধারণ জ্ঞান";
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface StudyAction {
  id: string;
  classLevel: ClassLevel;
  title: string;
  subtitle: string;
  subject: string;
  emoji: string;
  href: string;
  external?: boolean;
  cta: string;
}

export interface ReelLink {
  title: string;
  query: string;
  classLevel: ClassLevel;
  subject: string;
  emoji: string;
}

export interface NctbLink {
  title: string;
  href: string;
  note: string;
  subject?: SubjectSlug | "all";
}

export const nctbLinks: NctbLink[] = [
  {
    title: "Official NCTB portal",
    href: "https://www.nctb.gov.bd/",
    note: "Open the National Curriculum and Textbook Board site for the latest textbook notices and resources.",
    subject: "all",
  },
  {
    title: "Primary curriculum notice board",
    href: "https://www.nctb.gov.bd/",
    note: "Use this to reach the current official announcements for Class 1–5 curriculum support.",
    subject: "all",
  },
];

export const liveClasses = [
  {
    classLevel: 1 as ClassLevel,
    title: "সংখ্যা আর গল্পের প্রথম ধাপ",
    teacher: "Ms. Rina",
    time: "Today · 6:00 PM",
    room: "EPathshala-BD-Class-1",
    description: "পড়া, গণনা, আর রিয়েল-টাইম প্রশ্নের জন্য সহজ-সাবলীল লাইভ রুম।",
  },
  {
    classLevel: 2 as ClassLevel,
    title: "বাংলা, ইংরেজি, আর মজার গণিত অনুশীলন",
    teacher: "Mr. Arif",
    time: "Tomorrow · 5:30 PM",
    room: "EPathshala-BD-Class-2",
    description: "শিক্ষকের ফিডব্যাক আর শিক্ষার্থীদের অংশগ্রহণসহ ছোট লাইভ প্র্যাকটিস।",
  },
  {
    classLevel: 3 as ClassLevel,
    title: "সমস্যা সমাধানের ঘণ্টা",
    teacher: "Ms. Nadia",
    time: "Wed · 5:00 PM",
    room: "EPathshala-BD-Class-3",
    description: "শ্রেণি ৩-এর শিক্ষার্থীরা টেবিল, ব্যাকরণ, আর বিজ্ঞানের তথ্য অনুশীলন করে।",
  },
  {
    classLevel: 4 as ClassLevel,
    title: "পড়া, বলা, আর কুইজের সময়",
    teacher: "Mr. Hasan",
    time: "Thu · 6:15 PM",
    room: "EPathshala-BD-Class-4",
    description: "প্র্যাকটিস টাস্ক আর দ্রুত রিভিশন রাউন্ডসহ লাইভ ক্লাস।",
  },
  {
    classLevel: 5 as ClassLevel,
    title: "বাংলাদেশ পড়ার স্প্রিন্ট",
    teacher: "Ms. Jannat",
    time: "Fri · 7:00 PM",
    room: "EPathshala-BD-Class-5",
    description: "উচ্চ প্রাথমিক শিক্ষার্থীদের জন্য ফোকাসড লাইভ সেশন।",
  },
  {
    classLevel: 6 as ClassLevel,
    title: "মাধ্যমিক ব্রিজ ক্লাস",
    teacher: "Mr. Rafi",
    time: "Sat · 5:15 PM",
    room: "EPathshala-BD-Class-6",
    description: "প্রাথমিক মাধ্যমিক শিক্ষার্থীদের জন্য মূল পাঠের রিভিশন রুম।",
  },
  {
    classLevel: 7 as ClassLevel,
    title: "ইংরেজি ও বিজ্ঞান ক্লিনিক",
    teacher: "Ms. Tahmina",
    time: "Sun · 6:00 PM",
    room: "EPathshala-BD-Class-7",
    description: "রিডিং, ব্যাকরণ, আর বিজ্ঞান সমস্যা সমাধানের অনুশীলন।",
  },
  {
    classLevel: 8 as ClassLevel,
    title: "গণিত ও আইসিটি ল্যাব",
    teacher: "Mr. Hasan",
    time: "Mon · 6:30 PM",
    room: "EPathshala-BD-Class-8",
    description: "গণনা, ডিজিটাল বেসিক, আর গাইডেড প্র্যাকটিসের লাইভ ক্লাস।",
  },
  {
    classLevel: 9 as ClassLevel,
    title: "পরীক্ষা প্রস্তুতি লাইভ রুম",
    teacher: "Ms. Nabila",
    time: "Tue · 7:00 PM",
    room: "EPathshala-BD-Class-9",
    description: "বড় শিক্ষার্থীদের জন্য ফোকাসড রিভিশন আর কুইজ ড্রিল।",
  },
  {
    classLevel: 10 as ClassLevel,
    title: "বোর্ড প্রস্তুতি রুম",
    teacher: "Mr. Adnan",
    time: "Wed · 7:30 PM",
    room: "EPathshala-BD-Class-10",
    description: "প্রশ্ন, নোট, আর লাইভ সহায়তাসহ সিনিয়র শ্রেণির স্টাডি রুম।",
  },
];

export const reels: ReelLink[] = [
  { title: "বাংলা বর্ণমালা রিভিশন", query: "Bangla alphabet educational shorts", classLevel: 1, subject: "বাংলা", emoji: "🔤" },
  { title: "সংখ্যার মজার ট্রিকস", query: "addition tricks for kids educational shorts", classLevel: 1, subject: "গণিত", emoji: "➕" },
  { title: "বাংলায় গল্প পড়া", query: "Bangla story reading for kids shorts", classLevel: 2, subject: "বাংলা", emoji: "📖" },
  { title: "গুণের টেবিল রিল", query: "multiplication table kids shorts", classLevel: 3, subject: "গণিত", emoji: "✖️" },
  { title: "বিজ্ঞানের মজার তথ্য", query: "science facts for children educational shorts", classLevel: 4, subject: "বিজ্ঞান", emoji: "🔬" },
  { title: "বাংলাদেশ তথ্য রিল", query: "Bangladesh facts for kids shorts", classLevel: 5, subject: "সাধারণ জ্ঞান", emoji: "🇧🇩" },
];

const WORDS = {
  easyNouns: ["apple", "book", "cat", "ball", "tree", "sun"],
  pluralNouns: ["book", "pen", "box", "cat", "bus", "flower"],
  antonyms: [
    ["hot", "cold"],
    ["big", "small"],
    ["early", "late"],
    ["fast", "slow"],
    ["open", "close"],
    ["happy", "sad"],
  ] as const,
  banglaWords: [
    ["book", "বই"],
    ["water", "পানি"],
    ["school", "স্কুল"],
    ["flower", "ফুল"],
    ["home", "বাড়ি"],
    ["friend", "বন্ধু"],
  ] as const,
  scienceFacts: [
    ["Which organ helps you hear?", "ear", ["nose", "hand", "leg"]],
    ["Which part of a plant makes food?", "leaf", ["root", "stem", "flower"]],
    ["What do plants need to grow?", "water", ["toys", "noise", "chalk"]],
    ["Which planet do we live on?", "Earth", ["Mars", "Venus", "Jupiter"]],
    ["Which energy is clean and renewable?", "solar", ["coal", "smoke", "plastic"]],
  ] as const,
  bdFacts: [
    ["What is the capital of Bangladesh?", "Dhaka", ["Chattogram", "Rajshahi", "Khulna"]],
    ["What is the national flower of Bangladesh?", "Shapla", ["Rose", "Lily", "Sunflower"]],
    ["What is the national fish of Bangladesh?", "Hilsa", ["Rui", "Katla", "Pabda"]],
    ["How many divisions are in Bangladesh?", "8", ["6", "7", "9"]],
    ["What is the currency of Bangladesh?", "Taka", ["Rupee", "Dollar", "Peso"]],
    ["Which day is Language Martyrs' Day?", "21 February", ["26 March", "16 December", "1 January"]],
    ["Which is the largest mangrove forest in Bangladesh?", "Sundarbans", ["Sylhet", "Teknaf", "Kaptai"]],
  ] as const,
};

const placeCorrect = (correct: string, wrongs: string[], seed: number) => {
  const options = [...wrongs.slice(0, 3)];
  const answer = seed % 4;
  options.splice(answer, 0, correct);
  return { options, answer };
};

const makeMathQuestion = (classLevel: ClassLevel, variant: number) => {
  const seed = classLevel * 10 + variant;
  if (classLevel === 1) {
    const a = 2 + variant;
    const b = 1 + (variant % 3);
    const correct = a + b;
    const { options, answer } = placeCorrect(String(correct), [String(correct - 1), String(correct + 1), String(correct + 2)], seed);
    return {
      prompt: `What is ${a} + ${b}?`,
      options,
      answer,
      explain: `${a} + ${b} = ${correct}.`,
    };
  }
  if (classLevel === 2) {
    const a = 12 + variant;
    const b = 2 + (variant % 4);
    const correct = a - b;
    const { options, answer } = placeCorrect(String(correct), [String(correct - 1), String(correct + 1), String(correct + 3)], seed);
    return {
      prompt: `What is ${a} - ${b}?`,
      options,
      answer,
      explain: `${a} - ${b} = ${correct}.`,
    };
  }
  if (classLevel === 3) {
    const a = 2 + (variant % 4);
    const b = 3 + ((variant + 1) % 4);
    const correct = a * b;
    const { options, answer } = placeCorrect(String(correct), [String(correct - a), String(correct + b), String(correct + a)], seed);
    return {
      prompt: `What is ${a} × ${b}?`,
      options,
      answer,
      explain: `${a} × ${b} = ${correct}.`,
    };
  }
  if (classLevel === 4) {
    const divisor = 2 + (variant % 4);
    const quotient = 2 + ((variant + 1) % 4);
    const dividend = divisor * quotient;
    const { options, answer } = placeCorrect(String(quotient), [String(quotient - 1), String(quotient + 1), String(quotient + 2)], seed);
    return {
      prompt: `What is ${dividend} ÷ ${divisor}?`,
      options,
      answer,
      explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
    };
  }
  const a = 4 + variant;
  const b = 2 + (variant % 3);
  const c = 1 + (variant % 2);
  const correct = a + b - c;
  const { options, answer } = placeCorrect(String(correct), [String(correct - 2), String(correct + 1), String(correct + 2)], seed);
  return {
    prompt: `What is ${a} + ${b} - ${c}?`,
    options,
    answer,
    explain: `Work left to right: ${a} + ${b} - ${c} = ${correct}.`,
  };
};

const makeEnglishQuestion = (classLevel: ClassLevel, variant: number) => {
  const seed = classLevel * 10 + variant;
  if (classLevel === 1) {
    const sets = [
      { letter: "B", correct: "ball", wrongs: ["cat", "rice", "sun"] },
      { letter: "C", correct: "cat", wrongs: ["book", "tree", "star"] },
      { letter: "M", correct: "moon", wrongs: ["pen", "dog", "kite"] },
      { letter: "S", correct: "school", wrongs: ["ship", "shoe", "apple"] },
    ];
    const item = sets[variant % sets.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return {
      prompt: `Which word starts with "${item.letter}"?`,
      options,
      answer,
      explain: `"${item.correct}" starts with ${item.letter}.`,
    };
  }
  if (classLevel === 2) {
    const singular = WORDS.pluralNouns[variant % WORDS.pluralNouns.length];
    const correct = singular + (singular.endsWith("s") || singular.endsWith("x") || singular.endsWith("ch") || singular.endsWith("sh") ? "es" : "s");
    const wrongs = [
      singular,
      singular.endsWith("s") || singular.endsWith("x") || singular.endsWith("ch") || singular.endsWith("sh")
        ? `${singular}s`
        : `${singular}es`,
      `${singular}ed`,
    ].filter((w) => w !== correct);
    const { options, answer } = placeCorrect(correct, wrongs, seed);
    return {
      prompt: `Which is the plural of "${singular}"?`,
      options,
      answer,
      explain: `The plural form is "${correct}".`,
    };
  }
  if (classLevel === 3) {
    const pair = WORDS.antonyms[variant % WORDS.antonyms.length];
    const [word, correct] = pair;
    const wrongs = WORDS.antonyms
      .map(([a, b]) => (a === word ? b : a))
      .filter((w) => w !== correct)
      .slice(0, 3);
    const { options, answer } = placeCorrect(correct, wrongs.length >= 3 ? wrongs : ["hot", "big", "fast"], seed);
    return {
      prompt: `What is the opposite of "${word}"?`,
      options,
      answer,
      explain: `"${correct}" is the opposite of "${word}".`,
    };
  }
  if (classLevel === 4) {
    const sentence = [
      "i like to read books",
      "bangladesh is my country",
      "my teacher is kind",
      "we play football",
    ][variant % 4];
    const correct = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    const wrongs = [sentence + "!", sentence.charAt(0).toUpperCase() + sentence.slice(1), sentence + "?"];
    const { options, answer } = placeCorrect(correct, wrongs, seed);
    return {
      prompt: `Which sentence is written correctly?`,
      options,
      answer,
      explain: `A proper sentence starts with a capital letter and ends with a full stop.`,
    };
  }
  const verbs = ["play", "clean", "visit", "travel"];
  const verb = verbs[variant % verbs.length];
  const correct = `${verb}ed`;
  const wrongs = [`${verb}s`, `${verb}ing`, `${verb.charAt(0).toUpperCase()}${verb.slice(1)}s`];
  const { options, answer } = placeCorrect(correct, wrongs, seed);
  return {
    prompt: `Choose the best past-tense form for "${verb}".`,
    options,
    answer,
    explain: `The correct form here is "${correct}".`,
  };
};

const makeBanglaQuestion = (classLevel: ClassLevel, variant: number) => {
  const seed = classLevel * 10 + variant;
  if (classLevel === 1) {
    const correct = ["ক", "খ", "গ", "ম"][variant % 4];
    const wrongs = ["1", "@", "9", "A"];
    const { options, answer } = placeCorrect(correct, wrongs, seed);
    return {
      prompt: "Which one is a Bangla letter?",
      options,
      answer,
      explain: `"${correct}" is a Bangla letter.`,
    };
  }
  if (classLevel === 2) {
    const pair = WORDS.banglaWords[variant % WORDS.banglaWords.length];
    const [english, bangla] = pair;
    const wrongs = WORDS.banglaWords
      .map(([, word]) => word)
      .filter((w) => w !== bangla)
      .slice(0, 3);
    const { options, answer } = placeCorrect(bangla, wrongs, seed);
    return {
      prompt: `What is the Bangla word for "${english}"?`,
      options,
      answer,
      explain: `"${bangla}" means "${english}".`,
    };
  }
  if (classLevel === 3) {
    const items = [
      { prompt: "How many vowels are in the Bangla alphabet?", correct: "১১", wrongs: ["৮", "১০", "১২"], explain: "Bangla has 11 vowels." },
      { prompt: "Which letter comes after 'ক'?", correct: "খ", wrongs: ["গ", "ঘ", "ঙ"], explain: "The letter after ক is খ." },
      { prompt: "Which one is a Bangla numeral?", correct: "১", wrongs: ["A", "B", "3"], explain: "১ is a Bangla numeral." },
      { prompt: "Which word is written in Bangla script?", correct: "বাংলা", wrongs: ["Bangla", "English", "Math"], explain: "বাংলা is written in Bangla script." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return {
      prompt: item.prompt,
      options,
      answer,
      explain: item.explain,
    };
  }
  if (classLevel === 4) {
    const correct = ["আমি", "তুমি", "সে", "আমরা"][variant % 4];
    const wrongs = ["পানি", "বই", "গাছ", "ফুল"];
    const { options, answer } = placeCorrect(correct, wrongs, seed);
    return {
      prompt: "Which one is a pronoun in Bangla?",
      options,
      answer,
      explain: `"${correct}" is used as a pronoun.`,
    };
  }
  const items = [
    { prompt: "Which word is a good synonym for 'সুন্দর'?", correct: "মনোরম", wrongs: ["কঠিন", "মোটা", "গরম"], explain: `"মনোরম" matches the meaning of "সুন্দর".` },
    { prompt: "Which word means 'happy' in Bangla?", correct: "আনন্দিত", wrongs: ["দুঃখিত", "চুপ", "কঠিন"], explain: `"আনন্দিত" means happy.` },
    { prompt: "Which word means 'quick' in Bangla?", correct: "দ্রুত", wrongs: ["ধীর", "লম্বা", "গভীর"], explain: `"দ্রুত" means quick.` },
    { prompt: "Which word means 'good' in Bangla?", correct: "ভালো", wrongs: ["খারাপ", "মন্দ", "দুষ্ট"], explain: `"ভালো" means good.` },
  ];
  const item = items[variant % items.length];
  const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
  return {
    prompt: item.prompt,
    options,
    answer,
    explain: item.explain,
  };
};

const makeScienceQuestion = (classLevel: ClassLevel, variant: number) => {
  const seed = classLevel * 10 + variant;
  if (classLevel === 1) {
    const items = [
      { prompt: "Which organ helps you hear?", correct: "ear", wrongs: ["nose", "hand", "leg"], explain: "The ear helps us hear sounds." },
      { prompt: "Which organ helps you see?", correct: "eye", wrongs: ["nose", "ear", "hand"], explain: "The eye helps us see." },
      { prompt: "Which part helps you smell?", correct: "nose", wrongs: ["mouth", "foot", "knee"], explain: "The nose helps us smell." },
      { prompt: "Which part helps you taste?", correct: "tongue", wrongs: ["arm", "ear", "hair"], explain: "The tongue helps us taste." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  if (classLevel === 2) {
    const items = [
      { prompt: "What do plants need to grow well?", correct: "water", wrongs: ["noise", "stones", "toys"], explain: "Plants need water, sunlight, and air." },
      { prompt: "Which one gives light to Earth?", correct: "sunlight", wrongs: ["moon dust", "rain", "clouds"], explain: "Sunlight helps plants and living things." },
      { prompt: "What do animals need to stay alive?", correct: "food", wrongs: ["toys", "chalk", "ink"], explain: "Animals need food, water, and air." },
      { prompt: "Which is a healthy habit?", correct: "washing hands", wrongs: ["throwing trash", "eating only chips", "sleeping late"], explain: "Washing hands keeps us healthy." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  if (classLevel === 3) {
    const items = [
      { prompt: "Which one is a solid?", correct: "stone", wrongs: ["water", "air", "steam"], explain: "Stone keeps its shape, so it is a solid." },
      { prompt: "Which one is a liquid?", correct: "juice", wrongs: ["rock", "smoke", "ice"], explain: "Juice flows, so it is a liquid." },
      { prompt: "Which one is a gas?", correct: "air", wrongs: ["sand", "wood", "milk"], explain: "Air is a gas." },
      { prompt: "Which animal lays eggs?", correct: "hen", wrongs: ["cow", "goat", "dog"], explain: "Hens lay eggs." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  if (classLevel === 4) {
    const items = [
      { prompt: "Which planet do we live on?", correct: "Earth", wrongs: ["Mars", "Venus", "Jupiter"], explain: "Humans live on Earth." },
      { prompt: "What do clouds usually bring?", correct: "rain", wrongs: ["sand", "fire", "snowflakes"], explain: "Clouds often bring rain." },
      { prompt: "Which part of the Earth has salt water?", correct: "sea", wrongs: ["mountain", "field", "desert"], explain: "Seas and oceans have salt water." },
      { prompt: "Which is used to measure temperature?", correct: "thermometer", wrongs: ["ruler", "eraser", "bottle"], explain: "A thermometer measures temperature." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  const items = [
    { prompt: "Which energy source is renewable?", correct: "solar", wrongs: ["coal", "diesel", "smoke"], explain: "Solar energy is renewable and clean." },
    { prompt: "Which one is good for a healthy diet?", correct: "fruits", wrongs: ["chips", "soda", "candy"], explain: "Fruits help our body stay healthy." },
    { prompt: "Which practice saves electricity?", correct: "turning off lights", wrongs: ["leaving fans on", "opening the fridge often", "charging overnight"], explain: "Turning off lights saves electricity." },
    { prompt: "Which one is a clean transport choice?", correct: "walking", wrongs: ["smoke", "noise", "trash"], explain: "Walking is healthy and clean." },
  ];
  const item = items[variant % items.length];
  const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
  return { prompt: item.prompt, options, answer, explain: item.explain };
};

const makeBangladeshQuestion = (classLevel: ClassLevel, variant: number) => {
  const seed = classLevel * 10 + variant;
  if (classLevel === 1) {
    const items = [
      { prompt: "What is the capital of Bangladesh?", correct: "Dhaka", wrongs: ["Rajshahi", "Khulna", "Sylhet"], explain: "Dhaka is the capital city of Bangladesh." },
      { prompt: "What is the national flower of Bangladesh?", correct: "Shapla", wrongs: ["Rose", "Lily", "Jasmine"], explain: "The national flower is Shapla (water lily)." },
      { prompt: "What color is in the Bangladesh flag?", correct: "green", wrongs: ["purple", "black", "orange"], explain: "The flag is red and green." },
      { prompt: "Which animal is a symbol of Bangladesh?", correct: "Royal Bengal Tiger", wrongs: ["panda", "lion", "camel"], explain: "The Royal Bengal Tiger is our national animal." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  if (classLevel === 2) {
    const items = [
      { prompt: "What is the national fish of Bangladesh?", correct: "Hilsa", wrongs: ["Rui", "Katla", "Pabda"], explain: "Hilsa is the national fish of Bangladesh." },
      { prompt: "Which day is Language Martyrs' Day?", correct: "21 February", wrongs: ["26 March", "16 December", "1 January"], explain: "We observe Language Martyrs' Day on 21 February." },
      { prompt: "What is the currency of Bangladesh?", correct: "Taka", wrongs: ["Rupee", "Dollar", "Peso"], explain: "Bangladesh uses Taka." },
      { prompt: "Which is the largest mangrove forest in Bangladesh?", correct: "Sundarbans", wrongs: ["Sylhet", "Teknaf", "Kaptai"], explain: "The Sundarbans is the largest mangrove forest." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  if (classLevel === 3) {
    const items = [
      { prompt: "How many divisions are in Bangladesh?", correct: "8", wrongs: ["6", "7", "9"], explain: "Bangladesh currently has 8 divisions." },
      { prompt: "Which is the longest sea beach in Bangladesh?", correct: "Cox's Bazar", wrongs: ["Kuakata", "Patenga", "Inani"], explain: "Cox's Bazar is the longest sea beach." },
      { prompt: "Which day is Independence Day?", correct: "26 March", wrongs: ["21 February", "16 December", "14 April"], explain: "Independence Day is observed on 26 March." },
      { prompt: "Which day is Victory Day?", correct: "16 December", wrongs: ["26 March", "21 February", "1 May"], explain: "Victory Day is observed on 16 December." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  if (classLevel === 4) {
    const items = [
      { prompt: "What is the name of Bangladesh's parliament?", correct: "Jatiya Sangsad", wrongs: ["Shonar Bangla", "Bharat Sangsad", "Rastriya Sabha"], explain: "The national parliament is Jatiya Sangsad." },
      { prompt: "Which river is strongly linked with Bangladesh geography?", correct: "Padma", wrongs: ["Nile", "Danube", "Amazon"], explain: "Padma is one of Bangladesh's major rivers." },
      { prompt: "Which city is famous as the port city of Bangladesh?", correct: "Chattogram", wrongs: ["Panchagarh", "Barishal", "Mymensingh"], explain: "Chattogram is Bangladesh's major port city." },
      { prompt: "Which is the national anthem of Bangladesh?", correct: "Amar Sonar Bangla", wrongs: ["Joy Bangla", "Dhono Dhanyo", "Bharoto Bhagyo Bidhata"], explain: "Amar Sonar Bangla is the national anthem." },
    ];
    const item = items[variant % items.length];
    const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
    return { prompt: item.prompt, options, answer, explain: item.explain };
  }
  const items = [
    { prompt: "What is the name of Bangladesh's national fruit?", correct: "Jackfruit", wrongs: ["Mango", "Guava", "Banana"], explain: "Jackfruit is the national fruit." },
    { prompt: "What is the name of the national bird of Bangladesh?", correct: "Doyel", wrongs: ["Crow", "Sparrow", "Pigeon"], explain: "The Doyel is the national bird." },
    { prompt: "Which hill district is in Bangladesh?", correct: "Rangamati", wrongs: ["Delhi", "Paris", "Tokyo"], explain: "Rangamati is a hill district in Bangladesh." },
    { prompt: "Which is a famous wetland in Bangladesh?", correct: "Hakaluki Haor", wrongs: ["Sahara", "Andes", "Alps"], explain: "Hakaluki Haor is a well-known wetland." },
  ];
  const item = items[variant % items.length];
  const { options, answer } = placeCorrect(item.correct, item.wrongs, seed);
  return { prompt: item.prompt, options, answer, explain: item.explain };
};

const categoryBuilders = [
  makeMathQuestion,
  makeEnglishQuestion,
  makeBanglaQuestion,
  makeScienceQuestion,
  makeBangladeshQuestion,
] as const;

const categoryNames: QuizQuestion["subject"][] = ["গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "সাধারণ জ্ঞান"];

export const buildQuizBank = (): QuizQuestion[] => {
  const bank: QuizQuestion[] = [];
  classLevels.forEach((classLevel) => {
    categoryBuilders.forEach((builder, categoryIndex) => {
      for (let variant = 0; variant < 4; variant += 1) {
        const built = builder(classLevel, variant);
        bank.push({
          id: `class-${classLevel}-${categoryIndex}-${variant}`,
          classLevel,
          subject: categoryNames[categoryIndex],
          prompt: built.prompt,
          options: built.options,
          answer: built.answer,
          explain: built.explain,
        });
      }
    });
  });
  return bank;
};

const activityTemplates = [
  { emoji: "🧠", subject: "কুইজ", title: "কুইজ স্প্রিন্ট", subtitle: "দ্রুত ৫ প্রশ্নের চ্যালেঞ্জ", href: "/quizzes", cta: "কুইজ শুরু" },
  { emoji: "🎥", subject: "লাইভ", title: "লাইভ ক্লাস রুম", subtitle: "রিয়েল-টাইমে শিক্ষকের সঙ্গে", href: "/live-class", cta: "লাইভে ঢুকো" },
  { emoji: "📺", subject: "রিলস", title: "শিক্ষামূলক রিলস", subtitle: "ছোট YouTube লার্নিং ক্লিপ", href: "/library", cta: "রিলস দেখো" },
  { emoji: "🗺️", subject: "মানচিত্র", title: "বাংলাদেশ মানচিত্র হান্ট", subtitle: "দেশের মানচিত্র ঘুরে দেখো", href: "/bangladesh-map", cta: "মানচিত্র খুলুন" },
  { emoji: "📘", subject: "NCTB", title: "অফিশিয়াল NCTB বই", subtitle: "পাঠ্যপুস্তক পোর্টাল খুলুন", href: "https://www.nctb.gov.bd/", external: true, cta: "NCTB খুলুন" },
  { emoji: "🏃", subject: "গেম", title: "RunBD স্পেশাল গেম", subtitle: "বাছাই করা রানিং গেম খেলো", href: "https://runbd.netlify.app", external: true, cta: "এখনই খেলো" },
] as const;

const activityThemes = [
  "সংখ্যা দৌড়",
  "বাংলা অক্ষর অনুসন্ধান",
  "গল্প সময় স্প্রিন্ট",
  "বিজ্ঞানের অভিযান",
  "বাংলাদেশ তথ্য অভিযান",
  "শব্দ বানাও",
  "গণনা ও তুলনা",
  "পড়ার রকেট",
  "প্রকৃতি নোট",
  "মানচিত্র মাস্টার",
  "কুইজ ল্যাডার",
  "বানান তারকা",
  "টেবিল চেজ",
  "আকার সাফারি",
  "সবুজ অভ্যাস গেম",
  "নদী রান",
  "প্রোনাউন পপ",
  "নবায়নযোগ্য জ্বালানি রাশ",
  "রাজধানী ধরো",
  "বিজয় দৌড়",
] as const;

export const buildActivityBank = (): StudyAction[] => {
  const items: StudyAction[] = [];
  classLevels.forEach((classLevel) => {
    for (let variant = 0; variant < 20; variant += 1) {
      const template = activityTemplates[variant % activityTemplates.length];
      const subjectGroup = categoryNames[(classLevel + variant) % categoryNames.length];
      const theme = activityThemes[variant];
      items.push({
        id: `activity-${classLevel}-${variant}`,
        classLevel,
        title: `${theme} · শ্রেণি ${classLevel}`,
        subtitle: `${template.title} · ${template.subtitle} · ${subjectGroup}`,
        subject: subjectGroup,
        emoji: template.emoji,
        href: template.href,
        external: template.external,
        cta: template.cta,
      });
    }
  });
  return items;
};

export const quizBank = buildQuizBank();
export const activityBank = buildActivityBank();

export const getSubjectNctbLinks = (subject: SubjectSlug) => {
  const titleMap: Record<SubjectSlug, string> = {
    math: "গণিত পাঠ্যপুস্তক পোর্টাল",
    english: "ইংরেজি পাঠ্যপুস্তক পোর্টাল",
    physics: "পদার্থবিজ্ঞান পাঠ্যপুস্তক পোর্টাল",
    chemistry: "রসায়ন পাঠ্যপুস্তক পোর্টাল",
    bangla: "বাংলা পাঠ্যপুস্তক পোর্টাল",
    science: "বিজ্ঞান পাঠ্যপুস্তক পোর্টাল",
    social: "সমাজবিজ্ঞান পাঠ্যপুস্তক পোর্টাল",
    ict: "আইসিটি পাঠ্যপুস্তক পোর্টাল",
    gk: "সাধারণ জ্ঞান পাঠ্যপুস্তক পোর্টাল",
    islamic: "ইসলাম শিক্ষা পাঠ্যপুস্তক পোর্টাল",
  };

  return [
    {
      title: `${titleMap[subject]} - official NCTB`,
      href: "https://www.nctb.gov.bd/",
      note: "Open the official NCTB site to reach the latest approved books and notices.",
      subject,
    },
  ];
};
