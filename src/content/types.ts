export type Locale = 'en' | 'fr';

export interface NavLink {
  /** Visible label, e.g. `./work`. */
  readonly label: string;
  /** Homepage section id the link scrolls to. */
  readonly fragment: string;
}

export interface LanguageOption {
  readonly locale: Locale;
  /** Visible short code, e.g. `EN`. */
  readonly short: string;
  /** Full name in its own language, read by screen readers, e.g. `Français`. */
  readonly name: string;
}

export interface SiteContent {
  readonly locale: Locale;
  readonly skipLink: string;
  readonly logo: {
    readonly text: string;
    readonly prompt: string;
    /** Appended for screen readers so the link reads as "mdba:~$ Mohamed Dhia Ben Amar, home". */
    readonly srSuffix: string;
  };
  readonly nav: {
    readonly label: string;
    readonly links: readonly NavLink[];
  };
  readonly languages: {
    readonly label: string;
    readonly options: readonly LanguageOption[];
  };
  readonly footer: {
    readonly status: string;
    readonly copyright: string;
  };
}

export interface ExternalLink {
  readonly label: string;
  readonly href: string;
}

export interface TerminalEntry {
  readonly command: string;
  readonly output: string;
  /** Prefix the output with a warm status dot. */
  readonly status?: boolean;
}

export interface StatContent {
  readonly value: string;
  readonly caption: string;
}

export interface ProjectContent {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly file: string;
  readonly stack: string;
  readonly stats: readonly { readonly label: string; readonly value: string }[];
}

export interface ExperienceContent {
  /** Explorer file name, e.g. `minotore.json`. */
  readonly file: string;
  readonly role: string;
  readonly company: string;
  readonly industry: string;
  readonly location: string;
  readonly period: string;
  readonly highlights: readonly string[];
}

export interface SectionHeading {
  readonly prompt: string;
  readonly title: string;
}

export interface HomeContent {
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: {
    readonly availability: string;
    readonly headline: { readonly before: string; readonly accent: string; readonly after: string };
    readonly intro: string;
    readonly cta: {
      readonly contact: string;
      readonly cv: {
        readonly label: string;
        readonly files: readonly {
          readonly short: string;
          readonly srLabel: string;
          readonly href: string;
          readonly hreflang: string;
        }[];
      };
      readonly profiles: readonly ExternalLink[];
    };
    readonly terminal: {
      readonly title: string;
      readonly label: string;
      readonly entries: readonly TerminalEntry[];
    };
  };
  readonly highlights: { readonly label: string; readonly stats: readonly StatContent[] };
  readonly work: SectionHeading & {
    readonly caseStudyLabel: string;
    readonly projects: readonly ProjectContent[];
  };
  readonly experience: SectionHeading & {
    readonly explorerLabel: string;
    readonly explorerHeading: string;
    readonly items: readonly ExperienceContent[];
  };
  readonly contact: SectionHeading & {
    readonly windowTitle: string;
    readonly body: string;
    readonly email: string;
  };
}

/**
 * A fact the owner still has to supply. Rendered as a visible `[OWNER: …]` marker, and any page
 * containing one is noindex until it is replaced (brief §6).
 */
export interface OwnerPlaceholder {
  readonly owner: string;
}

/** Text, or a placeholder where a fact is missing. */
export type Fact = string | OwnerPlaceholder;

export function isOwnerPlaceholder(value: unknown): value is OwnerPlaceholder {
  return typeof value === 'object' && value !== null && 'owner' in value;
}

export interface FlowStep {
  readonly label: string;
  readonly detail?: string;
}

/** A simple flow diagram drawn for the site (no screenshots or internal material). */
export interface FlowDiagramContent {
  readonly caption: string;
  readonly steps: readonly FlowStep[];
}

export type CaseStudySlug = 'widget-library' | 'nova' | 'converty-shop';

export interface CaseStudyContent {
  readonly slug: CaseStudySlug;
  readonly meta: { readonly title: string; readonly description: string };
  /** File shown in the editor tab, e.g. `nova/README.md`. */
  readonly file: string;
  readonly title: string;
  readonly summary: string;
  readonly facts: {
    readonly role: Fact;
    readonly company: Fact;
    readonly period: Fact;
    readonly location: Fact;
  };
  readonly stack: readonly string[];
  /** Context → Problem → What I did → Stack → Results → What I'd do next (brief §6). */
  readonly context: readonly Fact[];
  readonly problem: readonly Fact[];
  readonly approach: readonly Fact[];
  readonly diagram: FlowDiagramContent | OwnerPlaceholder;
  readonly results: {
    readonly metrics: readonly { readonly label: string; readonly value: string }[];
    readonly notes: readonly Fact[];
  };
  readonly next: readonly Fact[];
  readonly links?: readonly ExternalLink[];
}

export interface WorkContent {
  readonly ui: {
    readonly sections: {
      readonly context: string;
      readonly problem: string;
      readonly approach: string;
      readonly stack: string;
      readonly results: string;
      readonly next: string;
    };
    readonly facts: {
      readonly label: string;
      readonly role: string;
      readonly company: string;
      readonly period: string;
      readonly location: string;
    };
    readonly ownerLabel: string;
    readonly linksLabel: string;
    readonly navLabel: string;
    readonly back: string;
    readonly nextStudy: string;
  };
  readonly caseStudies: readonly CaseStudyContent[];
}

export interface NotFoundContent {
  readonly meta: { readonly title: string; readonly description: string };
  readonly prompt: string;
  readonly title: string;
  readonly body: string;
  readonly terminal: { readonly title: string; readonly error: string };
  readonly links: readonly { readonly label: string; readonly fragment?: string }[];
}
