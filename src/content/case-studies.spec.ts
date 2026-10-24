import {
  CASE_STUDY_SLUGS,
  hasOwnerPlaceholders,
  isCaseStudySlug,
  ownerPlaceholders,
} from './case-studies';
import { work as enWork } from './en/work';
import { work as frWork } from './fr/work';

describe('case studies', () => {
  it('has one case study per slug, in order, in both locales', () => {
    expect(enWork.caseStudies.map((s) => s.slug)).toEqual(CASE_STUDY_SLUGS);
    expect(frWork.caseStudies.map((s) => s.slug)).toEqual(CASE_STUDY_SLUGS);
  });

  it('recognises only known slugs', () => {
    expect(isCaseStudySlug('nova')).toBe(true);
    expect(isCaseStudySlug('nope')).toBe(false);
    expect(isCaseStudySlug(undefined)).toBe(false);
  });

  it('finds owner placeholders anywhere in a value', () => {
    expect(ownerPlaceholders({ a: ['x', { owner: 'one' }], b: { c: { owner: 'two' } } })).toEqual([
      'one',
      'two',
    ]);
    expect(ownerPlaceholders(['plain', 3, null])).toEqual([]);
  });

  // Tracks what the owner still has to supply. Update this list as placeholders are filled in;
  // a page becomes indexable once its list is empty.
  it('lists the owner placeholders still to fill', () => {
    const open = Object.fromEntries(
      enWork.caseStudies.map((s) => [s.slug, ownerPlaceholders(s).length]),
    );
    expect(open).toEqual({ 'widget-library': 2, nova: 3, 'converty-shop': 2 });
    expect(enWork.caseStudies.every(hasOwnerPlaceholders)).toBe(true);
  });
});
