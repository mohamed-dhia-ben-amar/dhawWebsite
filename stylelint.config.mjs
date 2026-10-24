/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    // BEM-style class names (`card__title`, `pane__tab--active`).
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Use kebab-case BEM class names (block__element--modifier)' },
    ],
    // Token names follow the design brief (`--surface-2`, `--text-h3`).
    'custom-property-pattern': null,
    // Tokens are grouped with blank lines.
    'custom-property-empty-line-before': null,
  },
  overrides: [
    {
      // Components only use design tokens: no literal colors.
      files: ['src/app/**/*.scss'],
      rules: {
        'color-no-hex': [true, { message: 'Use a color token from src/styles/_tokens.scss' }],
        'color-named': ['never', { message: 'Use a color token from src/styles/_tokens.scss' }],
        'function-disallowed-list': [
          ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color'],
          { message: 'Use a color token from src/styles/_tokens.scss' },
        ],
      },
    },
  ],
};
