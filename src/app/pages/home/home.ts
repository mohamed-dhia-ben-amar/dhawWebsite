import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { localizedUrl } from '../../core/alternate-links';
import { HOME_CONTENT } from '../../core/home-content';
import { APP_LOCALE } from '../../core/locale';
import { SectionSpy } from '../../core/section-spy';
import { Seo } from '../../core/seo';
import { SITE_CONTENT } from '../../core/site-content';
import { StructuredData, personSchema } from '../../core/structured-data';
import { SectionStepper } from '../../ui/section-stepper/section-stepper';
import { StatStrip } from '../../ui/stat-strip/stat-strip';
import { ContactSection } from './sections/contact/contact-section';
import { ExperienceSection } from './sections/experience/experience-section';
import { HeroSection } from './sections/hero/hero-section';
import { JourneySection } from './sections/journey/journey-section';
import { ProjectsSection } from './sections/projects/projects-section';

const PERSON_ID = 'person-jsonld';

@Component({
  selector: 'app-home',
  imports: [
    ContactSection,
    ExperienceSection,
    HeroSection,
    JourneySection,
    ProjectsSection,
    SectionStepper,
    StatStrip,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly content = inject(HOME_CONTENT);
  protected readonly site = inject(SITE_CONTENT);
  /** Sections followed by the header nav and the stepper, in page order. */
  protected readonly sections = this.site.nav.links.map((link) => ({
    id: link.fragment,
    label: link.label,
  }));

  constructor() {
    const { title, description } = this.content.meta;
    inject(Seo).setPage({ title, description, path: '/' });

    const structuredData = inject(StructuredData);
    const person = this.site.seo.person;
    structuredData.set(PERSON_ID, personSchema(person, localizedUrl(inject(APP_LOCALE), '/')));
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => structuredData.remove(PERSON_ID));

    const spy = inject(SectionSpy);
    afterNextRender(() => {
      const stop = spy.track(this.sections.map((section) => section.id));
      destroyRef.onDestroy(stop);
    });
  }
}
