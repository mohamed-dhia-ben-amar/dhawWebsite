import type { DocumentGroup, DocumentSlug } from './types';

/** A certificate in public/docs: the same files in every locale, described in home.ts. */
export interface DocumentFile {
  readonly slug: DocumentSlug;
  readonly group: DocumentGroup;
  /**
   * Relative, so it resolves against the locale's base href (/en/docs/…, /fr/docs/…): public/ is
   * copied into every locale, and no multi-segment rewrite is needed.
   */
  readonly href: string;
  readonly pages: number;
  /** First-page thumbnail (public/docs/thumbs), with its size to reserve the space. */
  readonly thumb: { readonly src: string; readonly width: number; readonly height: number };
}

const file = (
  slug: DocumentSlug,
  group: DocumentGroup,
  path: string,
  pages: number,
  width: number,
  height: number,
): DocumentFile => ({
  slug,
  group,
  href: `docs/${path}`,
  pages,
  thumb: { src: `docs/thumbs/${slug}.jpg`, width, height },
});

/**
 * Every document, in display order. Scans supplied by the owner with ID numbers, birth date and
 * verification codes blacked out and burned into the images (each page only draws one image).
 */
export const DOCUMENTS: readonly DocumentFile[] = [
  file('tcf-french-c1', 'languages', '1_Languages/TCF_French_C1_2025.pdf', 1, 313, 480),
  file(
    'japanese-levels-1-2',
    'languages',
    '1_Languages/Japanese_Language_Levels_1-2_2022-2023.pdf',
    2,
    480,
    337,
  ),
  file(
    'converty-internship',
    'internships',
    '2_Internships/Converty_Internship_2024.pdf',
    1,
    337,
    480,
  ),
  file(
    'ibspace-internship',
    'internships',
    '2_Internships/IB_Space_Internship_2023.pdf',
    1,
    350,
    480,
  ),
  file(
    'inoteqia-internship',
    'internships',
    '2_Internships/Inoteqia_Internship_2022.pdf',
    1,
    337,
    480,
  ),
  file(
    'azure-devops-training',
    'training',
    '3_Training/ISAM_Cloud_Azure_DevOps_2025.pdf',
    1,
    480,
    341,
  ),
  file(
    'emotional-coaching',
    'training',
    '3_Training/ISG_Coach_Emotional_and_Relational_Coaching_2022.pdf',
    1,
    480,
    341,
  ),
  file(
    'gcc-esprit-membership',
    'activities',
    '4_Activities/GCC_ESPRIT_Membership.pdf',
    1,
    318,
    480,
  ),
  file(
    'ismpt-study-day',
    'activities',
    '4_Activities/ISMPT_Study_Day_Participation_2026.pdf',
    1,
    480,
    346,
  ),
];

/** Every page of every document in one PDF. */
export const ALL_DOCUMENTS = { href: 'docs/All_Documents.pdf', pages: 10 } as const;

export const DOCUMENT_GROUPS: readonly DocumentGroup[] = [
  'languages',
  'internships',
  'training',
  'activities',
];

export function isDocumentSlug(value: string | null | undefined): value is DocumentSlug {
  return DOCUMENTS.some((doc) => doc.slug === value);
}
