import { TestBed } from '@angular/core/testing';
import { home } from '../../../../../content/en/home';
import { ExperienceTabs, experienceJson, experienceSlug } from './experience-tabs';

describe('ExperienceTabs', () => {
  afterEach(() => history.replaceState(null, '', '/'));

  function render(urlParam?: string) {
    const fixture = TestBed.createComponent(ExperienceTabs);
    if (urlParam) fixture.componentRef.setInput('urlParam', urlParam);
    fixture.componentRef.setInput('items', home.experience.items);
    fixture.componentRef.setInput('explorerLabel', home.experience.explorerLabel);
    fixture.componentRef.setInput('explorerHeading', home.experience.explorerHeading);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const panels = () => [...el.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    const visible = () => panels().filter((p) => !p.hidden);
    return { fixture, el, panels, visible };
  }

  it('prerenders one panel per experience, each labelled by its tab', () => {
    const { el, panels } = render();
    expect(panels().map((p) => p.id)).toEqual([
      'experience-panel-minotore',
      'experience-panel-converty',
      'experience-panel-ibspace',
      'experience-panel-inoteqia',
    ]);
    for (const panel of panels()) {
      const tab = el.querySelector(`#${panel.getAttribute('aria-labelledby')}`);
      expect(tab?.getAttribute('role')).toBe('tab');
      expect(tab?.getAttribute('aria-controls')).toBe(panel.id);
    }
    expect(panels()[3].textContent).toContain('"Inoteqia"');
  });

  it('shows only the first file initially, also in the pane tab bar', () => {
    const { el, visible } = render();
    expect(visible().map((p) => p.id)).toEqual(['experience-panel-minotore']);
    expect(el.querySelector('.pane__tab--active')?.textContent).toBe('minotore.json');
  });

  it('opens another file when its tab is clicked', () => {
    const { fixture, el, visible } = render();
    el.querySelector<HTMLButtonElement>('#experience-tab-converty')?.click();
    fixture.detectChanges();
    expect(visible().map((p) => p.id)).toEqual(['experience-panel-converty']);
    expect(visible()[0].textContent).toContain('"Full-Stack Engineer Intern"');
    expect(el.querySelector('.pane__tab--active')?.textContent).toBe('converty.json');
    expect(fixture.componentInstance.active()).toBe('converty.json');
  });

  it('names files in the URL without the extension', () => {
    expect(experienceSlug('converty.json')).toBe('converty');
  });

  it('with urlParam, keeps the open file in the query string', () => {
    const { fixture, el } = render('experience');
    el.querySelector<HTMLButtonElement>('#experience-tab-ibspace')?.click();
    fixture.detectChanges();
    expect(new URLSearchParams(location.search).get('experience')).toBe('ibspace');
  });

  it('with urlParam, opens the file named in the URL after hydration', async () => {
    history.replaceState(null, '', '/?experience=inoteqia');
    const { fixture, visible } = render('experience');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(visible().map((p) => p.id)).toEqual(['experience-panel-inoteqia']);
  });

  it('without urlParam, leaves the URL alone', () => {
    const { fixture, el } = render();
    el.querySelector<HTMLButtonElement>('#experience-tab-ibspace')?.click();
    fixture.detectChanges();
    expect(location.search).toBe('');
  });

  it('highlights the period of every experience as a date', () => {
    const dates = [...render().el.querySelectorAll('.tok--date')].map((d) => d.textContent);
    expect(dates).toEqual(home.experience.items.map((i) => JSON.stringify(i.period)));
  });

  it('builds the editor JSON from the content fields', () => {
    expect(Object.keys(experienceJson(home.experience.items[0]))).toEqual([
      'role',
      'company',
      'industry',
      'period',
      'highlights',
    ]);
  });
});
