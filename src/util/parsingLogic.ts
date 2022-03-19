import type { GenerationNum, Species } from "@pkmn/dex";
import translationUrl from "@/assets/pokemonTranslation.json?url";

import { Dex } from "@pkmn/dex";

const responseCollection: { [draftMonsUrl: string]: string } = {};

export async function retrieveFile(draftMonsUrl: string) {
  let allText = "";
  if (responseCollection[draftMonsUrl]) {
    allText = responseCollection[draftMonsUrl];
  } else {
    const response = await fetch(draftMonsUrl);
    allText = await response.text();
    responseCollection[draftMonsUrl] = allText;
  }
  return allText;
}

export async function parseFile(draftMonsUrl: string) {
  const allText = await retrieveFile(draftMonsUrl);
  return parseString(allText);
}

export async function parseString(allText: string) {
  const draftMons: string[][] = [[], [], [], [], []];
  const response = await fetch(translationUrl);
  const translation = await response.json();
  const lines = allText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mons = line.split("\t\t");
    for (let j = 0; j < mons.length; j++) {
      const mon = mons[j].trim();
      if (mon === "Lohgock (ohne Speed Boost)\t   \tCastellith") {
        draftMons[j].push("Lohgock (ohne Speed Boost)");
        draftMons[j + 1].push("Castellith");
      } else if (mon !== "") {
        if (mon === "Wolwerock-Tag/Nacht") {
          draftMons[j].push("Wolwerock-Tag");
          draftMons[j].push("Wolwerock-Nacht");
        } else {
          draftMons[j].push(mon);
        }
      }
    }
  }
  translation["Rotom-Wash"] = "Rotom-Wash";
  translation["Porygon-Z"] = "PorygonZ";

  function translatePokemon(pokemon: string) {
    pokemon = pokemon.replace(" (mit VF)", "");
    let translatedPokemon = pokemon;
    if (pokemon.includes("Mega-")) {
      let nonMega = pokemon.replace("Mega-", "");
      if (pokemon.includes(" X")) {
        nonMega = nonMega.replace(" X", "");
        translatedPokemon = `${translation[nonMega]}megax`;
      } else if (pokemon.includes(" Y")) {
        nonMega = nonMega.replace(" Y", "");
        translatedPokemon = `${translation[nonMega]}megay`;
      } else {
        translatedPokemon = `${translation[nonMega]}mega`;
      }
    } else if (pokemon.includes("Alola-")) {
      const nonAlola = pokemon.replace("Alola-", "");
      translatedPokemon = `${translation[nonAlola]}alola`;
    } else if (pokemon.includes("Giga-")) {
      const nonGmax = pokemon.replace("Giga-", "");
      translatedPokemon = `${translation[nonGmax]}gmax`;
    } else if (pokemon.includes("Galar-")) {
      const nonGalar = pokemon.replace("Galar-", "");
      translatedPokemon = `${translation[nonGalar]}galar`;
    } else if (pokemon.includes("(Tiergeistform)")) {
      translatedPokemon = `${
        translation[pokemon.substring(0, pokemon.indexOf(" "))]
      }therian`;
    } else if (pokemon.includes("(")) {
      translatedPokemon =
        translation[pokemon.substring(0, pokemon.indexOf(" "))];
    } else if (pokemon.includes("Wolwerock")) {
      let ext = pokemon.substring(pokemon.indexOf("-") + 1);
      if (ext === "Tag") ext = "";
      else if (ext === "Nacht") ext = "midnight";
      else ext = "dusk";

      translatedPokemon = translation.Wolwerock + ext;
    } else if (pokemon.includes("-") && translation[pokemon] === undefined) {
      const ext = pokemon
        .substring(pokemon.indexOf("-") + 1)
        .replace("50%", "")
        .replace("%", "");
      translatedPokemon =
        translation[pokemon.substring(0, pokemon.indexOf("-"))] + ext;
    } else if (pokemon.includes("Quajutsu")) {
      translatedPokemon = translation.Quajutsu;
    } else {
      translatedPokemon = translation[pokemon];
    }
    if (translatedPokemon !== undefined)
      return translatedPokemon.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
    else return translatedPokemon;
  }

  const monsList: string[][] = [];
  const errors: string[] = [];
  for (let i = 0; i < draftMons.length; i++) {
    const currentTierList: string[] = [];
    for (let j = 0; j < draftMons[i].length; j++) {
      const pokemon = draftMons[i][j];
      const translatedPokemon = translatePokemon(pokemon);
      if (translatedPokemon === undefined) {
        errors.push(pokemon);
      }
      currentTierList.push(translatedPokemon);
    }
    monsList.push(currentTierList);
  }
  if (errors.length > 0) {
    throw String(errors);
  }
  return monsList;
}

export async function rawCSVFileToMonsList(csvFile: string) {
  const response = await fetch(csvFile);
  const allText = await response.text();
  return rawCSVToMonsList(allText);
}

export function rawCSVToMonsList(csv: string): string[][] {
  return csv
    .split("\n")
    .map((row) => row.split("\t\t").filter((entry) => entry.trim() !== ""));
}

export function stringsToSpecies(
  generation: GenerationNum,
  monsList: string[][]
): Species[][] {
  const generationDex = Dex.forGen(generation);
  const speciesList: Species[][] = [];
  for (const monList of monsList) {
    const tempList: Species[] = [];
    for (const mon of monList) tempList.push(generationDex.species.get(mon));

    speciesList.push(tempList);
  }
  return speciesList;
}
