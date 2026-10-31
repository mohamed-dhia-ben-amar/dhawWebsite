export type Locale = 'en' | 'fr';

export type NavIcon = 'home' | 'work' | 'experience' | 'journey' | 'contact';

export interface NavLink {
  /** Visible label, e.g. `Work`. */
  readonly label: string;
  /** Homepage section id the link scrolls to (also the scroll-spy id). */
  readonly fragment: string;
  readonly icon: NavIcon;
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
  readonly seo: {
    /** og:site_name. */
    readonly siteName: string;
    /** Person structured data (JSON-LD) on the homepage. Facts from the brief only. */
    readonly person: {
      readonly name: string;
      readonly jobTitle: string;
      readonly email: string;
      readonly locality: string;
      readonly countryCode: string;
      readonly worksFor: string;
      readonly knowsAbout: readonly string[];
      readonly sameAs: readonly string[];
    };
  };
  readonly skipLink: string;
  /** Accessible name of the floating back-to-top button. */
  readonly backToTop: string;
  /** Names of the header theme toggle: what pressing it does. */
  readonly theme: { readonly toLight: string; readonly toDark: string };
  readonly logo: {
    readonly text: string;
    readonly prompt: string;
    /** Appended for screen readers so the link reads as "mdba:~$ Mohamed Dhia Ben Amar, home". */
    readonly srSuffix: string;
  };
  readonly nav: {
    readonly label: string;
    /** Accessible name of the homepage section stepper. */
    readonly sectionsLabel: string;
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

type FieldErrors = Readonly<Record<'required' | 'too_short' | 'too_long' | 'invalid', string>>;

export interface ContactFormContent {
  /** Accessible name of the form. */
  readonly label: string;
  readonly labels: { readonly name: string; readonly email: string; readonly message: string };
  readonly requiredNote: string;
  readonly honeypotLabel: string;
  readonly submit: string;
  readonly sending: string;
  readonly summaryTitle: string;
  readonly errors: {
    readonly name: FieldErrors;
    readonly email: FieldErrors;
    readonly message: FieldErrors;
  };
  readonly success: { readonly title: string; readonly body: string; readonly again: string };
  readonly failure: { readonly generic: string; readonly rateLimited: string };
}

export type JourneyKind = 'work' | 'education' | 'community';

/** One step of the "My journey so far" timeline (facts from the CV only). */
export interface JourneyEntry {
  readonly kind: JourneyKind;
  readonly period: string;
  readonly title: string;
  readonly org: string;
  readonly note?: string;
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
    /** Icon tags under the hero; names must exist in the tech-icon registry or get the › mark. */
    readonly stack: { readonly label: string; readonly items: readonly string[] };
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
  readonly journey: SectionHeading & {
    /** Labels of the entry kinds, shown as `type: …`. */
    readonly kinds: Readonly<Record<JourneyKind, string>>;
    readonly entries: readonly JourneyEntry[];
  };
  readonly contact: SectionHeading & {
    readonly windowTitle: string;
    readonly body: string;
    readonly email: string;
    readonly form: ContactFormContent;
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
    /** Omitted when unknown; the row is then not shown. */
    readonly period?: Fact;
    readonly location: Fact;
  };
  readonly stack: readonly string[];
  /**
   * Context → Problem → What I did → Stack → Results → What I'd do next (brief §6). A section
   * with no facts (an empty array) is not shown.
   */
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
