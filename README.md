## ViteTranslate-rollup
E' parte di un duo, rollup e components che consentono un servizio di traduzioni di semplice implementazione

```jsx
 <Translate>Esempio</Translate>
```

diviene se viene servita la lingua 'ko'
```jsx
 <span></span>
```

## TODO
- Aggiungere funzioni di controllo del cambio lingua
   funzione handleWantChange({
    propose:'it',
    onStart: () => {}
    onError: () => {}
   })
- Eliminare il rollup in caso di non build
