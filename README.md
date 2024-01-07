## ViteTranslate-rollup
E' parte di un duo, rollup e components che consentono un servizio di traduzioni di semplice implementazione

```jsx
 <Translate>Esempio</Translate>
```

diviene se viene servita la lingua 'ko'
```jsx
 <span>예시</span>
```

## Demo
Una [demo complessa](https://stackblitz.com/edit/vitejs-vite-reqsax?file=README.md) è visibile su stackblitz 

## TODO
- Aggiungere funzioni di controllo del cambio lingua
   funzione handleWantChange({
    propose:'it',
    onStart: () => {}
    onError: () => {}
   })
- Eliminare il rollup in caso di non build
