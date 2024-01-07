import getChildrenText from "./getChildrenText";
import getVariableProps from "./getVariableProps";
import pathCmd from "path";
import hash from "fnv1a";
// import isProduction from "../isProduction";


//
// se in input trova un _%_testo_%_
// aggiunge "testo" alla tabella di traduzioni
// e trasforma "_%_testo_%_" in "_<_id_#_testo_>_"
//
function ifStaticAddTable(p, state) {
  // console.log("status:",import.meta.env);
  if (!p?.node?.value) return; // non trova l'oggetto
  if (!/_%_(.*?)_%_/.test(p.node.value)) return; // non trova il riconoscitore
  const strToAdd = /_%_(.*?)_%_/.exec(p.node.value)?.[1];
  //  console.log("trovato da rimpiazzare:", p.node.value);
  const data_translate = addToTable(strToAdd, state);
  p.node.value = getReplacedForTranslate(
    p.node.value,
    data_translate,
    strToAdd
  );
  if (p.node.extra.rawValue)
    p.node.extra.rawValue = getReplacedForTranslate(
      p.node.extra.rawValue,
      data_translate,
      strToAdd
    );
  if (p.node.extra.raw)
    p.node.extra.raw = getReplacedForTranslate(
      p.node.extra.raw,
      data_translate,
      strToAdd
    );
  // console.log("rimpiazzo:", p.node.value);
}

// getta il testo da value e trasforma "_%_testo_%_" in "_<_id_/_testo_>_"
function getReplacedForTranslate(value, data_translate, text) {
  const newString = `_<_${data_translate}_/_${text}_>_`;
  return value.replace(/_%_(.*?)_%_/, newString);
}

// aggiunge alla tabella temporanea
function addToTable(strToAdd, state) {
  //
  //
  // recupera il nome del file su cui si trova il translate
  const nameFile = pathCmd.parse(state.filename).name;
  //
  //
  // calcola l'hash
  const hex = hash(strToAdd).toString(36);
  //
  // va iniettato
  // console.log(path);
  const data_translate = `${nameFile}_${hex}`;
  // console.log(`add to table:${data_translate} value:${strToAdd}`);
  // assegna
  globalThis["TranslateService"]["baseLng"][data_translate] = strToAdd;
  return data_translate; // id
}


export default api => {
  const { types: t } = api;

  return {
    visitor: {
      // Aggiungi il tuo visitor per le stringhe costanti
      StringLiteral: ifStaticAddTable,
      JSXText: ifStaticAddTable,
      TemplateElement: ifStaticAddTable,
      JSXOpeningElement(p, state) {
        //
        // prova ad aprirlo... è translate? se no torna
        if (p.node.name.name !== "Translate") return;
        //
        // ha giù la props data-translate? torna
        const existingProp = p.node.attributes.find(
          node => node?.name?.name === "data-translate"
        );
        if (existingProp) return;
        //
        // se contiene c come props la traduzione è differita, ritorna
        //
        if (p.node.attributes.find(n => n?.name.name === "c")) return;
        //
        // se ha un props chiamato 't' lo carica altrimenti carica il contenuto
        // dei children, se nessuno dei due ha un text mostra un errore
        const textInternal = p.node.attributes.find(
          node => node?.name?.name === "t"
        );
        const text = textInternal
          ? getVariableProps("t", p)
          : getChildrenText(p);
        if (text === false)
          throw "Error, Translate require constant string";
        //
        // aggiunge alla tabella
        const data_translate = addToTable(text, state);
        const newProp = t.jSXAttribute(
          t.jSXIdentifier("data-translate"),
          t.stringLiteral(data_translate)
        );
        p.node.attributes.push(newProp);
      },
    },
  };
};
