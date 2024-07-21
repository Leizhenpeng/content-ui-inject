# content-ui-inject

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Boost content-ui injection for better extension developer experience.

## Quick start

1. Inject shadowRoot to content-ui

```tsx
import { createShadowRootUI } from 'content-ui-injector'
const app = await createShadowRootUI({
  name: 'react-boilerplate',

  position: 'inline',
  injectAnchor: 'body',
  injectMode: 'before',
  styleOptions: {
    textContent: tailwindcssOutput,
  },
  onMount: (uiContainer) => {
    createRoot(uiContainer).render(<App />)
  },
})

app.mount()
```
## License

[MIT](./LICENSE) License © 2023-PRESENT [leizhenpeng](https://github.com/leizhenpeng)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/content-ui-inject?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/content-ui-inject
[npm-downloads-src]: https://img.shields.io/npm/dm/content-ui-inject?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/content-ui-inject
[bundle-src]: https://img.shields.io/bundlephobia/minzip/content-ui-inject?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=content-ui-inject
[license-src]: https://img.shields.io/github/license/leizhenpeng/content-ui-inject.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/leizhenpeng/content-ui-inject/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/content-ui-inject
