import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { localizedUrl } from '../../core/alternate-links';
import { HOME_CONTENT } from '../../core/home-content';
import { APP_LOCALE } from '../../core/locale';
import { Seo } from '../../core/seo';
import { SITE_CONTENT } from '../../core/site-content';
import { StructuredData, personSchema } from '../../core/structured-data';
import { StatStrip } from '../../ui/stat-strip/stat-strip';
import { ContactSection } from './sections/contact/contact-section';
import { ExperienceSection } from './sections/experience/experience-section';
import { HeroSection } from './sections/hero/hero-section';
import { ProjectsSection } from './sections/projects/projects-section';

const PERSON_ID = 'person-jsonld';

@Component({
  selector: 'app-home',
  imports: [ContactSection, ExperienceSection, HeroSection, ProjectsSection, StatStrip],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly content = inject(HOME_CONTENT);

  constructor() {
    const { title, description } = this.content.meta;
    inject(Seo).setPage({ title, description, path: '/' });

    const structuredData = inject(StructuredData);
    const person = inject(SITE_CONTENT).seo.person;
    structuredData.set(PERSON_ID, personSchema(person, localizedUrl(inject(APP_LOCALE), '/')));
    inject(DestroyRef).onDestroy(() => structuredData.remove(PERSON_ID));
  }
}
