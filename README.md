## ViteTranslate-rollup
E' parte di un duo, [rollup](https://github.com/sepoina/vitetranslate-rollup) e [components](https://github.com/sepoina/vitetranslate-components) che consentono un servizio di traduzioni di semplice implementazione

```jsx
 <Translate>Esempio</Translate>
```

diviene se viene servita la lingua 'ko'
```jsx
 <span>예시</span>
```

## Demo
Una [demo complessa](https://stackblitz.com/edit/vitejs-vite-reqsax?file=README.md) è visibile su stackblitz 

## Installazione

via npm
```bash
 npm install @sepoina/vitetranslate-rollup --save-dev
 npm install @sepoina/vitetranslate-components 
```
via yarn
```bash
 yarn add @sepoina/vitetranslate-rollup -D
 yarn add @sepoina/vitetranslate-components
```

## Ambiente Vite
E' necessario l'ambiente vite-react per l'esecuzione del codice.<br/>
questo un esempio di implementazione in vite.config.js [vedi quello della demo](https://stackblitz.com/edit/vitejs-vite-reqsax?file=vite.config.js)
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { rollupTranslate, babelTranslate } from '@sepoina/vitetranslate-rollup';
//
//
export default defineConfig({
  plugins: [
    // Write table translation
    rollupTranslate({
      // predefined file usual 'xx.json' where xx iso 639-1 -> is https://en.wikipedia.org/wiki/ISO_639-1
      PredefinedLanguage: 'it.json',
      // workspace dir, contain src, public and dist folder
      baseDir: __dirname,
      // source public file before rollup usual {workspace}/public/locale/PredefinedLanguage.json
      publicTableDir: ['public', 'locale'],
      // distribution file after rollup usual {workspace}/dist/locale/PredefinedLanguage.json
      distTableDir: ['dist', 'locale'],
    }),
    react({
      babel: {
        plugins: [
          // Create table translation and inject in jsx <Translate> and _%_string_%_ costant
          [babelTranslate, { legacy: true }],
        ],
      },
    }),
    // ... other
  ],
});
```

## TODO
- cache system
