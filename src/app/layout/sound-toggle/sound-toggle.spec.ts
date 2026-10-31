import { TestBed } from '@angular/core/testing';
import { Sound } from '../../core/sound';
import { SoundToggle } from './sound-toggle';

describe('SoundToggle', () => {
  afterEach(() => localStorage.clear());

  function render() {
    const fixture = TestBed.createComponent(SoundToggle);
    fixture.componentRef.setInput('label', 'Sound effects');
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    return { fixture, button };
  }

  it('is a named toggle button, off by default, with a decorative icon', () => {
    const { button } = render();
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Sound effects');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('turns sound on and off and plays a click when turned on', () => {
    const { fixture, button } = render();
    const sound = TestBed.inject(Sound);
    const play = vi.spyOn(sound, 'play').mockImplementation(() => undefined);

    button.click();
    fixture.detectChanges();
    expect(sound.enabled()).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(play).toHaveBeenCalledWith('click');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(play).toHaveBeenCalledTimes(1);
  });
});
