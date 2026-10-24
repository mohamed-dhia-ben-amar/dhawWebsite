export type CodeTokenKind = 'plain' | 'key' | 'string' | 'date';

export interface CodeToken {
  readonly text: string;
  readonly kind: CodeTokenKind;
}

export type CodeLine = readonly CodeToken[];

export type JsonValue = string | number | boolean | null | readonly JsonValue[] | JsonObject;
export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export interface JsonLinesOptions {
  /** String values under these keys are highlighted as dates (warm) instead of strings. */
  readonly dateKeys?: readonly string[];
  /** Spaces per nesting level. Defaults to 2. */
  readonly indent?: number;
}

/**
 * Turns a JSON value into highlighted, pretty-printed lines (same layout as
 * `JSON.stringify(value, null, 2)`), so content can stay typed data instead of markup.
 */
export function jsonToCodeLines(value: JsonValue, options: JsonLinesOptions = {}): CodeLine[] {
  const dateKeys = new Set(options.dateKeys ?? []);
  const unit = ' '.repeat(options.indent ?? 2);
  const lines: CodeToken[][] = [];
  const plain = (text: string): CodeToken => ({ text, kind: 'plain' });

  const scalar = (v: string | number | boolean | null, key?: string): CodeToken =>
    typeof v === 'string'
      ? {
          text: JSON.stringify(v),
          kind: key !== undefined && dateKeys.has(key) ? 'date' : 'string',
        }
      : plain(String(v));

  const visit = (v: JsonValue, depth: number, prefix: CodeToken[], key?: string, comma = '') => {
    const pad = unit.repeat(depth);
    const start = (tokens: CodeToken[]) => [plain(pad), ...prefix, ...tokens];

    if (v === null || typeof v !== 'object') {
      lines.push([...start([scalar(v, key)]), ...(comma ? [plain(comma)] : [])]);
      return;
    }

    const entries: [string | undefined, JsonValue][] = Array.isArray(v)
      ? (v as readonly JsonValue[]).map((item) => [undefined, item])
      : Object.entries(v as JsonObject);
    const [open, close] = Array.isArray(v) ? ['[', ']'] : ['{', '}'];

    if (entries.length === 0) {
      lines.push(start([plain(open + close + comma)]));
      return;
    }

    lines.push(start([plain(open)]));
    entries.forEach(([childKey, child], i) => {
      const childComma = i < entries.length - 1 ? ',' : '';
      const childPrefix: CodeToken[] =
        childKey === undefined
          ? []
          : [{ text: JSON.stringify(childKey), kind: 'key' }, plain(': ')];
      // Array items inherit the parent key so a list of dates stays warm.
      visit(child, depth + 1, childPrefix, childKey ?? key, childComma);
    });
    lines.push([plain(pad + close + comma)]);
  };

  visit(value, 0, []);
  return lines.map((line) => line.filter((token) => token.text !== ''));
}
