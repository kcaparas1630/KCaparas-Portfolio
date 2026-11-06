import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // `views` is the pages layer under a Next-safe name, Steiger can't see it,
    // so every widget reads as unreferenced.
    rules: { 'fsd/insignificant-slice': 'off' },
  },
  {
    // Server code sits outside the FSD layers. It may only reach into entity
    // `model` files, because their barrels also export client hooks and UI.
    files: ['./src/server/**'],
    rules: { 'fsd/no-public-api-sidestep': 'off' },
  },
  {
    files: ['./src/shared/styles/**'],
    rules: { 'fsd/public-api': 'off' },
  },
  {
    files: ['./src/app/**'],
    rules: { 'fsd/segments-by-purpose': 'off' },
  },
]);
