import type { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';
import { onViewTransitionCreated, routePath } from './page-transitions';

/** A root snapshot whose single child has the given URL segments. */
function snapshot(...paths: string[]): ActivatedRouteSnapshot {
  const child = { url: paths.map((path) => ({ path })), firstChild: null };
  return { url: [], firstChild: child } as unknown as ActivatedRouteSnapshot;
}

describe('page transitions', () => {
  let reduced = false;
  beforeEach(() => {
    reduced = false;
    vi.stubGlobal('matchMedia', () => ({ matches: reduced }) as MediaQueryList);
  });
  afterEach(() => vi.unstubAllGlobals());

  function run(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot) {
    const skipTransition = vi.fn();
    onViewTransitionCreated({
      transition: { skipTransition },
      from,
      to,
    } as unknown as ViewTransitionInfo);
    return skipTransition;
  }

  it('builds the route path from the snapshot tree', () => {
    expect(routePath(snapshot('work', 'nova'))).toBe('work/nova');
    expect(routePath(snapshot())).toBe('');
  });

  it('animates a change of page', () => {
    expect(run(snapshot(), snapshot('work', 'nova'))).not.toHaveBeenCalled();
  });

  it('skips fragment-only navigations (the homepage nav) and reduced motion', () => {
    expect(run(snapshot(), snapshot())).toHaveBeenCalled();
    reduced = true;
    expect(run(snapshot(), snapshot('work', 'nova'))).toHaveBeenCalled();
  });
});
