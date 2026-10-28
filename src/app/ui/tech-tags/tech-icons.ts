import {
  siAngular,
  siClaude,
  siExpo,
  siExpress,
  siFirebase,
  siFlutter,
  siGo,
  siKeycloak,
  siNodedotjs,
  siNx,
  siReact,
  siReactivex,
  siRedux,
  siSolidity,
  siStorybook,
  siTypescript,
  siVitest,
} from 'simple-icons';

/**
 * Logos for the stack tags: 24×24 SVG paths from Simple Icons (CC0), drawn in the accent colour.
 * Named imports only, so just these paths ship. Technologies without a logo get the › mark.
 */
export const TECH_ICONS: Readonly<Record<string, string>> = {
  Angular: siAngular.path,
  'Claude Code': siClaude.path,
  Expo: siExpo.path,
  Express: siExpress.path,
  Firebase: siFirebase.path,
  Flutter: siFlutter.path,
  Golang: siGo.path,
  Keycloak: siKeycloak.path,
  'Node.js': siNodedotjs.path,
  Nx: siNx.path,
  React: siReact.path,
  'React Native': siReact.path,
  Redux: siRedux.path,
  RxJS: siReactivex.path,
  Solidity: siSolidity.path,
  Storybook: siStorybook.path,
  TypeScript: siTypescript.path,
  Vitest: siVitest.path,
};
