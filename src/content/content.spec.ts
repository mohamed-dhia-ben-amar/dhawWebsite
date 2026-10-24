import { home as enHome } from './en/home';
import { site as enSite } from './en/site';
import { notFound as enNotFound } from './en/not-found';
import { work as enWork } from './en/work';
import { home as frHome } from './fr/home';
import { notFound as frNotFound } from './fr/not-found';
import { site as frSite } from './fr/site';
import { work as frWork } from './fr/work';

/** Replaces every string with its type so two locales can be compared structurally. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  }
  return typeof value;
}

describe('content parity between locales', () => {
  it('has the same structure in English and French', () => {
    expect(shape(frSite)).toEqual(shape(enSite));
    expect(shape(frHome)).toEqual(shape(enHome));
    expect(shape(frWork)).toEqual(shape(enWork));
    expect(shape(frNotFound)).toEqual(shape(enNotFound));
  });

  it('keeps case-study slugs, files, stacks, metrics and links identical', () => {
    const pick = (w: typeof enWork) =>
      w.caseStudies.map((s) => ({
        slug: s.slug,
        file: s.file,
        stack: s.stack,
        metrics: s.results.metrics.map((m) => m.label),
        links: s.links?.map((l) => l.href),
      }));
    expect(pick(frWork)).toEqual(pick(enWork));
  });

  it('keeps locale-independent values identical', () => {
    const pick = (h: typeof enHome) => ({
      cv: h.hero.cta.cv.files.map((f) => [f.short, f.href, f.hreflang]),
      profiles: h.hero.cta.profiles.map((p) => p.href),
      projects: h.work.projects.map((p) => [p.slug, p.file, p.stack, p.stats.map((s) => s.label)]),
      files: h.experience.items.map((i) => [i.file, i.company]),
      email: h.contact.email,
      commands: h.hero.terminal.entries.map((e) => e.command),
    });
    expect(pick(frHome)).toEqual(pick(enHome));
    expect(frSite.nav.links.map((l) => l.fragment)).toEqual(
      enSite.nav.links.map((l) => l.fragment),
    );
    expect(frSite.languages.options).toEqual(enSite.languages.options);
  });

  it('declares its own locale', () => {
    expect(enSite.locale).toBe('en');
    expect(frSite.locale).toBe('fr');
  });
});
