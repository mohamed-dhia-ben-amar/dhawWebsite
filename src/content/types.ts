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
