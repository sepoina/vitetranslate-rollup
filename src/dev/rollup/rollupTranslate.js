import fs from "fs";
import isProduction from "../isProduction";
import pathCmd from 'path';

export default function rollupTranslate(defs) {
  return {
    name: "onRollupTranslate",
    buildStart: {
      sequential: true,
      order: "pre",
      handler: () => {
        //
        // la public dir è di solito {workspace}/public
        //
        globalThis["TranslateService"] = defs;
        globalThis["TranslateService"].baseLng = {
          __lngVersion__: CalcolaVersion(),
        }; // spazio vuoto per gli elementi
        if (!isProduction()) console.log("\n::: Vite-Translate: Start translate service in development mode, not update translation table file, make a new build for this\n");
      },
    },
    buildEnd: {
      sequential: true,
      order: "post",
      handler: () => {
        if (isProduction()) updateFileLanguage();
      },
    },
  };
}

/**
 * Aggiorna un file di lingua JSON con dati di traduzione. Se il file non esiste, crea un nuovo file
 * utilizzando i dati di traduzione di base forniti. La funzione confronta e aggiorna i dati presenti
 * nel file con i nuovi dati di traduzione, salvando le modifiche solo se sono state apportate variazioni.
 *
 * @function
 * @returns {void}
 *
 * @description
 * Questa funzione legge il contenuto di un file JSON di lingua e lo confronta con i dati di traduzione
 * di base forniti. Se il file non esiste, viene creato utilizzando i dati di traduzione di base. Se ci
 * sono variazioni nei dati di traduzione, le modifiche vengono salvate nel file. La funzione fornisce
 * messaggi di log dettagliati durante il processo.
 *
 */
function updateFileLanguage() {
  // Specifica il percorso del tuo file JSON
  // pathCmd.join(__dirname, 'public', 'locale', PredefinedLanguage)
  /* 
  
  Format  globalThis["TranslateService"]
  {  
      PredefinedLanguage:'it.json',     // predefined file usual 'xx.json' where xx iso 639-1 -> is https://en.wikipedia.org/wiki/ISO_639-1
      baseDir:__dirname,                // workspace dir, contain src, public and dist folder
      publicTableDir: ['public','locale'],  // source public file before rollup usual {workspace}/public/locale/PredefinedLanguage.json
      distTableDir: ['dist','locale'],      // distribution file after rollup usual {workspace}/dist/locale/PredefinedLanguage.json
  }
  
  */

  const filePath = pathCmd.join(globalThis["TranslateService"].baseDir, ...globalThis["TranslateService"].publicTableDir, globalThis["TranslateService"].PredefinedLanguage);
  const distPath = pathCmd.join(globalThis["TranslateService"].baseDir, ...globalThis["TranslateService"].distTableDir, globalThis["TranslateService"].PredefinedLanguage);
  const shortFilePath = pathCmd.join(...globalThis["TranslateService"].publicTableDir, globalThis["TranslateService"].PredefinedLanguage);
  const shortDistPath = pathCmd.join(...globalThis["TranslateService"].distTableDir, globalThis["TranslateService"].PredefinedLanguage);

  console.log("| Vite-Translate ---------------------------------------------");
  console.log("| Load base translation table from ", shortFilePath);
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      let state = { newest: true, changed: true },
        baseData = null;
      if (err) {
        console.log(`| The file ${shortFilePath} not exist, i make new one.`);
        baseData = globalThis["TranslateService"].baseLng; // questi i dati
      } else {
        baseData = JSON.parse(data);
        const newData = globalThis["TranslateService"].baseLng;
        state = decade(baseData, newData); // se ci sono variazioni
      }
      if (state.changed) {
        // sono avvenute variazioni, salva
        console.log(state.newest
          ? "| Create new file."
          : `| Update: (${state.added} added, ${state.deleted} removed)`);
        fs.writeFile(
          filePath,
          JSON.stringify(baseData, null, 2),
          "utf8",
          err => {
            if (err) {
              console.error(`| Error writing over ${shortFilePath}`, err);
            } else {
              console.log(`| Correct writing operation ${shortFilePath}`);
              fs.copyFile(filePath, distPath, err => {
                if (!err) console.log(`| Correct copy to ${shortDistPath}`);
                console.log(
                  "| ------------------------------------------------------------"
                );
              });
            }
          }
        );
      } else {
        console.log("| Nothing change.");
        console.log(
          "| ------------------------------------------------------------"
        );
      }
    });
  } catch (error) {
    console.error(`| Error in ${filePath}, erase this file and restart build.`, error);
    return;
  }
}

/**
 * Funzione per confrontare due oggetti e apportare modifiche.
 *
 * @param {Object} a - Primo oggetto da confrontare e modificare.
 * @param {Object} b - Secondo oggetto per il confronto.
 * @returns {boolean} Restituisce true se ci sono state modifiche, altrimenti false.
 *
 * @example
 * const oggettoA = { "App_f9xds4": "rob", "App_y3mo81": "Santanastaso" };
 * const oggettoB = { "App_f9xds4": "rob", "App_y3mo81": "Santanastaso", "NuovaChiave": "NuovoValore" };
 * const ciSonoVariazioni = decade(oggettoA, oggettoB);
 * console.log(oggettoA); // { "App_f9xds4": "rob", "App_y3mo81": "Santanastaso", "NuovaChiave": "NuovoValore" }
 * console.log('Ci sono variazioni:', ciSonoVariazioni); // Ci sono variazioni: true
 */
function decade(a, b) {
  const stats = { changed: false, deleted: 0, added: 0 };
  // Rimuovi le chiavi da 'a' che non sono presenti in 'b'
  for (const keyA in a) {
    if (!(keyA in b)) {
      delete a[keyA];
      stats.changed = true;
      stats.deleted += 1;
    }
  }
  // Aggiungi le chiavi da 'b' che non sono presenti in 'a'
  for (const keyB in b) {
    if (!(keyB in a)) {
      a[keyB] = b[keyB];
      stats.changed = true;
      stats.added += 1;
    }
  }
  if (stats.changed) a["__lngVersion__"] = b["__lngVersion__"]; // riporta in a la versione corrente
  return stats;
}

function CalcolaVersion() {
  return Date.now();
}
