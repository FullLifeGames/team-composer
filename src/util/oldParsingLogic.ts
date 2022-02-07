import translationUrl from "@/assets/pokemonTranslation.json?url";
import draftMonsUrl from "@/assets/DraftMons.csv?url";
import { Dex, GenerationNum, Species } from "@pkmn/dex";

export async function parseFile() {
    let response = await fetch(translationUrl);
    const translation = await response.json();
    response = await fetch(draftMonsUrl);
    var draftMons: string[][] = [
        [],
        [],
        [],
        [],
        []
    ];
    var allText = await response.text();
    var lines = allText.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var mons = line.split("\t\t");
        for (var j = 0; j < mons.length; j++) {
            var mon = mons[j].trim();
            if (mon == "Lohgock (ohne Speed Boost)	   	Castellith") {
                draftMons[j].push("Lohgock (ohne Speed Boost)");
                draftMons[j + 1].push("Castellith");
            } else if (mon != "") {
                if (mon == "Wolwerock-Tag/Nacht") {
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
        var translatedPokemon = pokemon;
        if (pokemon.indexOf("Mega-") !== -1) {
            var nonMega = pokemon.replace("Mega-", "");
            if (pokemon.indexOf(" X") !== -1) {
                nonMega = nonMega.replace(" X", "");
                translatedPokemon = translation[nonMega] + "megax";
            } else if (pokemon.indexOf(" Y") !== -1) {
                nonMega = nonMega.replace(" Y", "");
                translatedPokemon = translation[nonMega] + "megay";
            } else {
                translatedPokemon = translation[nonMega] + "mega";
            }
        } else if (pokemon.indexOf("Alola-") !== -1) {
            var nonAlola = pokemon.replace("Alola-", "");
            translatedPokemon = translation[nonAlola] + "alola";
        } else if (pokemon.indexOf("Giga-") !== -1) {
            var nonGmax = pokemon.replace("Giga-", "");
            translatedPokemon = translation[nonGmax] + "gmax";
        } else if (pokemon.indexOf("Galar-") !== -1) {
            var nonGalar = pokemon.replace("Galar-", "");
            translatedPokemon = translation[nonGalar] + "galar";
        } else if (pokemon.indexOf("(Tiergeistform)") !== -1) {
            translatedPokemon = translation[pokemon.substring(0, pokemon.indexOf(" "))] + "therian";
        } else if (pokemon.indexOf("(") !== -1) {
            translatedPokemon = translation[pokemon.substring(0, pokemon.indexOf(" "))];
        } else if (pokemon.indexOf("Wolwerock") !== -1) {
            var ext = pokemon.substring(pokemon.indexOf("-") + 1);
            if (ext == "Tag") {
                ext = "";
            } else if (ext == "Nacht") {
                ext = "midnight";
            } else {
                ext = "dusk";
            }
            translatedPokemon = translation["Wolwerock"] + ext;
        } else if (pokemon.indexOf("-") !== -1 && translation[pokemon] == undefined) {
            var ext = pokemon.substring(pokemon.indexOf("-") + 1).replace("50%", "").replace("%", "");
            translatedPokemon = translation[pokemon.substring(0, pokemon.indexOf("-"))] + ext;
        } else if (pokemon.indexOf("Quajutsu") !== -1) {
            translatedPokemon = translation["Quajutsu"];
        } else {
            translatedPokemon = translation[pokemon];
        }
        if (translatedPokemon != undefined) {
            return translatedPokemon.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        } else {
            return translatedPokemon;
        }
    }

    const monsList: string[][] = [];
    for (var i = 0; i < draftMons.length; i++) {
        const currentTierList: string[] = [];
        for (var j = 0; j < draftMons[i].length; j++) {
            var pokemon = draftMons[i][j];
            var translatedPokemon = translatePokemon(pokemon);
            currentTierList.push(translatedPokemon);
        }
        monsList.push(currentTierList);
    }
    return monsList;
}

export function stringsToSpecies(generation: GenerationNum, monsList: string[][]): Species[][] {
    const generationDex = Dex.forGen(generation);
    const speciesList: Species[][] = [];
    for (const monList of monsList) {
        const tempList: Species[] = [];
        for (const mon of monList) {
            tempList.push(generationDex.species.get(mon));
        }
        speciesList.push(tempList);
    }
    return speciesList;
}
