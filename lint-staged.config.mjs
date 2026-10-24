/** @type {import('lint-staged').Configuration} */
export default {
  '*.{ts,html}': ['eslint --fix', 'prettier --write'],
  '*.scss': ['stylelint --fix', 'prettier --write'],
  '*.{js,mjs,cjs,json,css,md,yml,yaml}': 'prettier --write',
};
