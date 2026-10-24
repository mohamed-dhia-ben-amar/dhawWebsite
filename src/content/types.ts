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
