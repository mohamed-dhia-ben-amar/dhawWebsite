import { CodeLine, jsonToCodeLines } from './code-line';

const text = (lines: CodeLine[]) => lines.map((line) => line.map((t) => t.text).join(''));

describe('jsonToCodeLines', () => {
  const value = {
    role: 'Frontend Developer',
    period: 'Dec 2024 – present',
    highlights: ['Author of 21 of the 81 team widgets', 'Vitest'],
    remote: true,
  };

  it('matches JSON.stringify(value, null, 2) line for line', () => {
    expect(text(jsonToCodeLines(value))).toEqual(JSON.stringify(value, null, 2).split('\n'));
  });

  it('highlights keys, strings and configured date keys', () => {
    const lines = jsonToCodeLines(value, { dateKeys: ['period'] });
    const kindOf = (needle: string) =>
      lines.flat().find((t) => t.text === JSON.stringify(needle))?.kind;

    expect(kindOf('role')).toBe('key');
    expect(kindOf('Frontend Developer')).toBe('string');
    expect(kindOf('Dec 2024 – present')).toBe('date');
    expect(kindOf('Vitest')).toBe('string');
  });

  it('renders non-string scalars and empty containers as plain text', () => {
    const lines = jsonToCodeLines({ n: 3, none: null, list: [], obj: {} });
    expect(text(lines)).toEqual(
      JSON.stringify({ n: 3, none: null, list: [], obj: {} }, null, 2).split('\n'),
    );
    expect(lines[1].at(-2)).toEqual({ text: '3', kind: 'plain' });
  });

  it('supports a custom indent', () => {
    expect(text(jsonToCodeLines({ a: 'b' }, { indent: 4 }))).toEqual(['{', '    "a": "b"', '}']);
  });
});
