"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const v=require("path"),d=require("fs");function b(e){var a,t,r;if(((t=(a=e==null?void 0:e.container)==null?void 0:a.children)==null?void 0:t.length)===1){const n=e.container.children[0];return n.type==="JSXText"?n.value:n.type==="JSXExpressionContainer"&&((r=n==null?void 0:n.expression)!=null&&r.value)?n.expression.value:!1}return!1}function S(e,a){var r,n,l,o;const t=a.node.attributes.find(i=>{var u;return((u=i==null?void 0:i.name)==null?void 0:u.name)===e});return t?((r=t==null?void 0:t.value)==null?void 0:r.type)==="StringLiteral"?t.value.value:((n=t==null?void 0:t.value)==null?void 0:n.type)==="JSXExpressionContainer"&&((o=(l=t==null?void 0:t.value)==null?void 0:l.expression)==null?void 0:o.type)==="StringLiteral"?t.value.expression.value:!1:!1}function x(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var _={exports:{}};(function(e,a){Object.defineProperty(a,"__esModule",{value:!0}),t.BASE=2166136261;function t(r,n=t.BASE){const l=r.length;for(let o=0;o<l;o++)n^=r.charCodeAt(o),n+=(n<<1)+(n<<4)+(n<<7)+(n<<8)+(n<<24);return n>>>0}a.default=t,e.exports=t})(_,_.exports);var m=_.exports;const h=x(m);function f(e,a){var n,l;if(!((n=e==null?void 0:e.node)!=null&&n.value)||!/_%_(.*?)_%_/.test(e.node.value))return;const t=(l=/_%_(.*?)_%_/.exec(e.node.value))==null?void 0:l[1];if(!t)return;const r=T(t,a);e.node.value=g(e.node.value,r,t),e.node.extra.rawValue&&(e.node.extra.rawValue=g(e.node.extra.rawValue,r,t)),e.node.extra.raw&&(e.node.extra.raw=g(e.node.extra.raw,r,t))}function g(e,a,t){const r=`_<_${a}_/_${t}_>_`;return e.replace(/_%_(.*?)_%_/,r)}function T(e,a){const t=v.parse(a.filename).name,r=h(e).toString(36),n=`${t}_${r}`;return globalThis.TranslateService.baseLng[n]=e,n}const p=e=>{const{types:a}=e;return{visitor:{StringLiteral:f,JSXText:f,TemplateElement:f,JSXOpeningElement(t,r){if(t.node.name.name!=="Translate"||t.node.attributes.find(s=>{var c;return((c=s==null?void 0:s.name)==null?void 0:c.name)==="data-translate"})||t.node.attributes.find(s=>(s==null?void 0:s.name.name)==="c"))return;const o=t.node.attributes.find(s=>{var c;return((c=s==null?void 0:s.name)==null?void 0:c.name)==="t"})?S("t",t):b(t);if(o===!1)throw"Errore, Translate deve contenere solo stringhe";const i=T(o,r),u=a.jSXAttribute(a.jSXIdentifier("data-translate"),a.stringLiteral(i));t.node.attributes.push(u)}}}};function E(e){return{name:"onRollupTranslate",buildStart:{sequential:!0,order:"pre",handler:()=>{globalThis.TranslateService=e,globalThis.TranslateService.baseLng={__lngVersion__:A()},console.log("Preparo il servizio traduzioni.")}},buildEnd:{sequential:!0,order:"post",handler:()=>{y()}}}}function y(){const e=globalThis.TranslateService.file,a=globalThis.TranslateService.dist;console.log("TRANSLATE ---------------------------------------------"),console.log("Carico traduzione base.");try{d.readFile(e,"utf8",(t,r)=>{let n={newest:!0,changed:!0},l=null;if(t)console.log(`Non esiste ancora il file ${e}, tento di crearlo`),l=globalThis.TranslateService.baseLng;else{l=JSON.parse(r);const o=globalThis.TranslateService.baseLng;n=w(l,o)}if(n.changed){const o=n.newest?"Nuovo file,":`(${n.added} agginte, ${n.deleted} rimosse)`;console.log(`Update avvenuto: ${o} salvo.`),d.writeFile(e,JSON.stringify(l,null,2),"utf8",i=>{i?console.error(`Errore durante la scrittura su ${e}`,i):(console.log(`Dati scritti con successo su ${e}`),d.copyFile(e,a,u=>{u||console.log(`Copiato con successo su ${a}`),console.log("END TRANSLATE ---------------------------------------------")}))})}else console.log("Nessun cambiamento."),console.log("END TRANSLATE ---------------------------------------------")})}catch(t){console.error(`Errore l'elaborazione di ${e}, cancellalo`,t);return}}function w(e,a){const t={changed:!1,deleted:0,added:0};for(const r in e)r in a||(delete e[r],t.changed=!0,t.deleted+=1);for(const r in a)r in e||(e[r]=a[r],t.changed=!0,t.added+=1);return t.changed&&(e.__lngVersion__=a.__lngVersion__),t}function A(){return Date.now()}exports.babelTranslate=p;exports.rollupTranslate=E;
//# sourceMappingURL=index.cjs.map
