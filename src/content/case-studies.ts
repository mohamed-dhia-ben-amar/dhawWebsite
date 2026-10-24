import type { CaseStudyContent, CaseStudySlug } from './types';
import { isOwnerPlaceholder } from './types';

/** Every case-study route, prerendered for each locale. */
export const CASE_STUDY_SLUGS: readonly CaseStudySlug[] = [
  'widget-library',
  'nova',
  'converty-shop',
];

export function isCaseStudySlug(value: string | undefined): value is CaseStudySlug {
  return CASE_STUDY_SLUGS.includes(value as CaseStudySlug);
}

/** All owner placeholders left in a value (deep), so incomplete pages can be kept out of search. */
export function ownerPlaceholders(value: unknown): string[] {
  if (isOwnerPlaceholder(value)) return [value.owner];
  if (Array.isArray(value)) return value.flatMap(ownerPlaceholders);
  if (value && typeof value === 'object') return Object.values(value).flatMap(ownerPlaceholders);
  return [];
}

export function hasOwnerPlaceholders(study: CaseStudyContent): boolean {
  return ownerPlaceholders(study).length > 0;
}
