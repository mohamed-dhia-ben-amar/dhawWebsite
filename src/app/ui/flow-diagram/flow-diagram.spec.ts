import { TestBed } from '@angular/core/testing';
import { FlowDiagram } from './flow-diagram';

describe('FlowDiagram', () => {
  function render() {
    const fixture = TestBed.createComponent(FlowDiagram);
    fixture.componentRef.setInput('caption', 'The NOVA loop');
    fixture.componentRef.setInput('steps', [
      { label: 'Developers', detail: '~30 across 4 teams' },
      { label: 'Claude Code agent' },
      { label: 'Widget', detail: 'tested against real data' },
    ]);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a captioned figure with the steps as an ordered list', () => {
    const el = render();
    expect(el.querySelector('figure figcaption')?.textContent).toBe('The NOVA loop');
    expect(el.querySelector('ol')?.getAttribute('role')).toBe('list');
    expect([...el.querySelectorAll('.flow__label')].map((l) => l.textContent)).toEqual([
      'Developers',
      'Claude Code agent',
      'Widget',
    ]);
  });

  it('renders details only when given and marks the last step', () => {
    const steps = render().querySelectorAll('li');
    expect(steps[0].querySelector('.flow__detail')?.textContent).toBe('~30 across 4 teams');
    expect(steps[1].querySelector('.flow__detail')).toBeNull();
    expect(steps[2].classList).toContain('flow__step--last');
  });
});
