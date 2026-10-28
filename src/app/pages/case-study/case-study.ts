import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CASE_STUDY_SLUGS, hasOwnerPlaceholders } from '../../../content/case-studies';
import { type Fact, isOwnerPlaceholder } from '../../../content/types';
import { Seo } from '../../core/seo';
import { WORK_CONTENT } from '../../core/work-content';
import { EditorPane } from '../../ui/editor-pane/editor-pane';
import { FactText } from '../../ui/fact-text/fact-text';
import { FlowDiagram } from '../../ui/flow-diagram/flow-diagram';
import { OwnerNote } from '../../ui/owner-note/owner-note';
import { PromptLabel } from '../../ui/prompt-label/prompt-label';
import { Reveal } from '../../ui/reveal/reveal';

/**
 * Case study at /work/:slug. Structure from the brief: Context → Problem → What I did → Stack →
 * Results → What I'd do next. Pages with owner placeholders left are noindex.
 */
@Component({
  selector: 'app-case-study',
  imports: [EditorPane, FactText, FlowDiagram, OwnerNote, PromptLabel, Reveal, RouterLink],
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudy {
  /** Route parameter (component input binding). The route only matches known slugs. */
  readonly slug = input.required<string>();

  protected readonly content = inject(WORK_CONTENT);
  protected readonly ui = this.content.ui;

  protected readonly study = computed(
    () =>
      this.content.caseStudies.find((s) => s.slug === this.slug()) ?? this.content.caseStudies[0],
  );
  protected readonly next = computed(() => {
    const index = CASE_STUDY_SLUGS.indexOf(this.study().slug);
    const nextSlug = CASE_STUDY_SLUGS[(index + 1) % CASE_STUDY_SLUGS.length];
    return this.content.caseStudies.find((s) => s.slug === nextSlug);
  });
  protected readonly tabs = computed(() => [
    { label: this.study().file, active: true },
    { label: this.study().stack.join(' · ') },
  ]);
  protected readonly factRows = computed(() => {
    const { facts } = this.study();
    const labels = this.ui.facts;
    const rows = [
      { label: labels.role, value: facts.role },
      { label: labels.company, value: facts.company },
      { label: labels.period, value: facts.period },
      { label: labels.location, value: facts.location },
    ];
    return rows.filter((row): row is { label: string; value: Fact } => row.value !== undefined);
  });
  protected readonly diagram = computed(() => {
    const diagram = this.study().diagram;
    return isOwnerPlaceholder(diagram) ? null : diagram;
  });
  protected readonly diagramOwner = computed(() => {
    const diagram = this.study().diagram;
    return isOwnerPlaceholder(diagram) ? diagram.owner : null;
  });

  constructor() {
    const seo = inject(Seo);
    effect(() => {
      const study = this.study();
      seo.setPage({
        title: study.meta.title,
        description: study.meta.description,
        path: `/work/${study.slug}`,
        image: study.slug,
        type: 'article',
        // Incomplete pages (owner placeholders left) stay out of search results.
        robots: hasOwnerPlaceholders(study) ? 'noindex, follow' : undefined,
      });
    });
  }
}
