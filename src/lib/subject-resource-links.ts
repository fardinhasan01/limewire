export type SubjectResourceLink = {
  slug: string;
  label: string;
  href: string;
};

export const subjectResourceLinks: SubjectResourceLink[] = [
  {
    slug: "english",
    label: "ENGLISH",
    href: "https://drive.egovcloud.gov.bd/index.php/s/CobRtJNoc1ISrGv",
  },
  {
    slug: "math",
    label: "MATH",
    href: "https://drive.egovcloud.gov.bd/index.php/s/HwrCrAtDhb9K484",
  },
  {
    slug: "ict",
    label: "ICT",
    href: "https://drive.egovcloud.gov.bd/index.php/s/PjriLZ5LTTdrkDc",
  },
  {
    slug: "physics",
    label: "PHYSICS",
    href: "https://drive.egovcloud.gov.bd/index.php/s/KOdI1T0gyhPiFRz",
  },
  {
    slug: "chemistry",
    label: "Chemistry",
    href: "https://drive.egovcloud.gov.bd/index.php/s/sDHVsdQgt7dVQzO",
  },
];

export const subjectResourceLinkByLabel = Object.fromEntries(
  subjectResourceLinks.map((item) => [item.label.toLowerCase(), item]),
) as Record<string, SubjectResourceLink>;

export const subjectResourceLinkBySlug = Object.fromEntries(
  subjectResourceLinks.map((item) => [item.slug, item]),
) as Record<string, SubjectResourceLink>;
