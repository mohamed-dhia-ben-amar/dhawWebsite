import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../core/home-content';
import { StatStrip } from '../../ui/stat-strip/stat-strip';
import { ContactSection } from './sections/contact/contact-section';
import { ExperienceSection } from './sections/experience/experience-section';
import { HeroSection } from './sections/hero/hero-section';
import { ProjectsSection } from './sections/projects/projects-section';

@Component({
  selector: 'app-home',
  imports: [ContactSection, ExperienceSection, HeroSection, ProjectsSection, StatStrip],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly content = inject(HOME_CONTENT);

  constructor() {
    inject(Title).setTitle(this.content.meta.title);
    inject(Meta).updateTag({ name: 'description', content: this.content.meta.description });
  }
}
