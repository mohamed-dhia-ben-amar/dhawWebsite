import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import type { SiteContent } from '../../content/types';

/** schema.org Person for the site owner (brief §8), built from the site content. */
export function personSchema(person: SiteContent['seo']['person'], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    url,
    email: `mailto:${person.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: person.locality,
      addressCountry: person.countryCode,
    },
    worksFor: { '@type': 'Organization', name: person.worksFor },
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs,
  };
}

/** Adds and removes `<script type="application/ld+json">` blocks in the head. */
@Injectable({ providedIn: 'root' })
export class StructuredData {
  private readonly document = inject(DOCUMENT);

  set(id: string, data: object): void {
    this.remove(id);
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    // Escape "<" so no value can close the script element.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }

  remove(id: string): void {
    this.document.getElementById(id)?.remove();
  }
}
