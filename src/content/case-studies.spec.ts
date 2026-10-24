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

  // A placeholder keeps a page out of search; the published case studies have none.
  it('has no owner placeholders left, so every case study is indexable', () => {
    for (const work of [enWork, frWork]) {
      for (const study of work.caseStudies) {
        expect(ownerPlaceholders(study), study.slug).toEqual([]);
        expect(hasOwnerPlaceholders(study)).toBe(false);
      }
    }
  });
});
