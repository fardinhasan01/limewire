import type { ClassLevel } from "@/lib/bangladesh-learning";
import type { SubjectSlug } from "@/lib/subjects";

export type SubjectPdfMap = Record<SubjectSlug, Partial<Record<ClassLevel, string>>>;

export const subjectPdfLinks: SubjectPdfMap = {
  math: {},
  english: {
    1: "https://drive.egovcloud.gov.bd/index.php/s/CW6nYiJRMJE8trb",
    2: "https://drive.egovcloud.gov.bd/index.php/s/Qg7pzPPvzl1AnPS",
    3: "https://drive.google.com/uc?export=download&id=1gy7q4njDpOKGULXzGQVvhq2ZGpZMOfif",
    4: "https://drive.egovcloud.gov.bd/index.php/s/5UGmR1vSkxM0dU0",
    5: "https://drive.egovcloud.gov.bd/index.php/s/rOVIdpFOa2DA8AT",
    6: "https://drive.egovcloud.gov.bd/index.php/s/00PDZJDuOCv9ttL",
    7: "https://drive.egovcloud.gov.bd/index.php/s/gL2i3wNhvieyZbQ",
    8: "https://drive.egovcloud.gov.bd/index.php/s/gnSVZ8LoHftPSdo",
    9: "https://drive.egovcloud.gov.bd/index.php/s/6cNd5kYL7lbK62r",
    10: "https://drive.egovcloud.gov.bd/index.php/s/6cNd5kYL7lbK62r",
  },
  physics: {},
  chemistry: {},
  bangla: {},
  science: {},
  social: {},
  ict: {},
  gk: {},
  islamic: {},
};

const normalizePdfLink = (url: string) => {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  return url;
};

export const getSubjectPdfLink = (subject: SubjectSlug, classLevel: ClassLevel) =>
  normalizePdfLink(subjectPdfLinks[subject][classLevel] ?? "");
