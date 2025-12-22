import type { GenerationNum, Species } from "@pkmn/dex";

import "@pkmn/dex/build/learnsets.min.js";
import { Restriction } from "@/types/league";
import { type AlgorithmState, calculateData } from "./algorithm";

export type OrderingReport = {
  species: Species;
  rank: number;
}[];

export async function orderSpecies(
  species: Species[] | Species[][],
  algorithmState: AlgorithmState | GenerationNum,
  restriction?: Restriction,
): Promise<OrderingReport> {
  if (typeof algorithmState === "number")
    algorithmState = await calculateData(algorithmState, restriction);

  const allSpecies: Species[] = [];
  if (species.length > 0) {
    for (let i = 0; i < species.length; i++) {
      const entry = species[i];
      if (Array.isArray(entry)) {
        for (let j = 0; j < entry.length; j++) allSpecies.push(entry[j]);
      } else {
        allSpecies.push(entry);
      }
    }
  }
  const numberOfPokemon = allSpecies.length;

  const orderingReport: OrderingReport = [];
  if (numberOfPokemon > 0) {
    for (const mon of allSpecies) {
      let monValue = 0;
      monValue += algorithmState.fakeOutUser.filter(
        (s) => mon.id === s.id,
      ).length;
      monValue += algorithmState.tailwindUser.filter(
        (s) => mon.id === s.id,
      ).length;
      monValue += algorithmState.redirectUser.filter(
        (s) => mon.id === s.id,
      ).length;
      monValue += algorithmState.intimidateUser.filter(
        (s) => mon.id === s.id,
      ).length;
      monValue += algorithmState.speedControlUser.filter(
        (s) => mon.id === s.id,
      ).length;
      monValue += algorithmState.trickRoomUser.filter(
        (s) => mon.id === s.id,
      ).length;
      orderingReport.push({
        species: mon,
        rank: monValue,
      });
    }
  }

  orderingReport.sort((a, b) => b.rank - a.rank);

  return orderingReport;
}
