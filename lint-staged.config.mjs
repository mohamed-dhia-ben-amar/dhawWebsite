/** @type {import('lint-staged').Configuration} */
export default {
  '*.{ts,html}': ['eslint --fix', 'prettier --write'],
  '*.{js,mjs,cjs,json,scss,css,md,yml,yaml}': 'prettier --write',
};
