import type { GenerationNum, Species, StatsTable, Type } from "@pkmn/dex";
import { Dex } from "@pkmn/dex";
import type { Types as DataTypes } from "@pkmn/data";
import { Generations } from "@pkmn/data";

const gens = new Generations(Dex);

async function filter<T>(
  arr: readonly T[] | T[],
  callback: (item: T) => Promise<boolean>
) {
  const fail = Symbol("test");
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail);
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getAbilityMons(
  list: readonly Species[] | Species[],
  abilities: string[]
) {
  return list.filter(
    (s) =>
      abilities.includes(s.abilities[0]) ||
      abilities.includes(s.abilities[1] as string) ||
      abilities.includes(s.abilities.H as string) ||
      abilities.includes(s.abilities.S as string)
  );
}

export interface AbilityBooster {
  names: string[];
  handler: (stats: StatsTable<number>) => void;
  list: Species[];
}

export interface AlgorithmState {
  generation: GenerationNum;

  allSpecies: Species[];
  types: Type[];
  dataTypes: DataTypes;

  rocker: Species[];
  hazardRemover: Species[];
  otherHazards: Species[];

  sunSetter: Species[];
  sunUser: Species[];

  rainSetter: Species[];
  rainUser: Species[];

  sandSetter: Species[];
  sandUser: Species[];

  hailSetter: Species[];
  hailUser: Species[];

  prevos: Record<string, string>;

  abilityBooster: AbilityBooster[];

  momentumUser: Species[];

  quickGuardUser: Species[];
  wideGuardUser: Species[];
  fakeOutUser: Species[];
  tailwindUser: Species[];
  intimidateUser: Species[];
}

export interface EvaluationReport {
  value: number;

  statValue?: number;
  rocker?: number;
  hazardRemovals?: number;
  otherHazards?: number;
  ownTypesCovered?: number;
  typeMatchupValue?: number;
  momentumUser?: number;
  quickGuardUser?: number;
  wideGuardUser?: number;
  fakeOutUser?: number;
  tailwindUser?: number;
  intimidateUser?: number;
}

export async function calculateData(
  generation: GenerationNum
): Promise<AlgorithmState> {
  const generationDex = Dex.forGen(generation);
  const allSpecies = generationDex.species.all();
  const generationData = gens.get(generation);

  const sunAbilities = ["Drought"];
  const rainAbilities = ["Drizzle"];
  const sandAbilities = ["Sand Stream", "Sand Spit"];
  const hailAbilities = ["Snow Warning"];

  const sunUseAbilities = ["Chlorophyll", "Solar Power", "Flower Gift"];
  const rainUseAbilities = ["Swift Swim", "Rain Dish", "Dry Skin"];
  const sandUseAbilities = ["Sand Force", "Sand Rush"];
  const hailUseAbilities = ["Slush Rush"];

  const abilityBooster = [
    {
      names: ["Regenerator"],
      handler: (stats: StatsTable<number>) => (stats.hp *= 1.5),
      list: [] as Species[],
    },
    {
      names: ["Huge Power", "Pure Power"],
      handler: (stats: StatsTable<number>) => (stats.atk *= 2),
      list: [] as Species[],
    },
    {
      names: ["Gorilla Tactics"],
      handler: (stats: StatsTable<number>) => (stats.atk *= 1.5),
      list: [] as Species[],
    },
    {
      names: ["Libero", "Protean"],
      handler: (stats: StatsTable<number>) => (stats.atk *= 1.5),
      list: [] as Species[],
    },
    {
      names: ["Hustle", "Strong Jaw", "Tough Claws"],
      handler: (stats: StatsTable<number>) => (stats.atk *= 1.3),
      list: [] as Species[],
    },
    {
      names: ["Sheer Force"],
      handler: (stats: StatsTable<number>) => {
        stats.atk *= 1.3;
        stats.spa *= 1.3;
      },
      list: [] as Species[],
    },
    {
      names: ["Mega Launcher"],
      handler: (stats: StatsTable<number>) => {
        stats.spa *= 1.5;
      },
      list: [] as Species[],
    },
    {
      names: ["Intimidate"],
      handler: (stats: StatsTable<number>) => (stats.def *= 1.5),
      list: [] as Species[],
    },
    {
      names: ["Ice Scales"],
      handler: (stats: StatsTable<number>) => (stats.spd *= 2),
      list: [] as Species[],
    },
  ] as AbilityBooster[];

  const learnsets = generationData.learnsets;
  const rocker = await filter(
    allSpecies,
    async (s) => await learnsets.canLearn(s.name, "Stealth Rock")
  );
  const hazardRemover = await filter(
    allSpecies,
    async (s) =>
      (await learnsets.canLearn(s.name, "Rapid Spin")) ||
      (generation >= 6 && (await learnsets.canLearn(s.name, "Defog"))) ||
      (await learnsets.canLearn(s.name, "Court Change"))
  );
  const otherHazards = await filter(
    allSpecies,
    async (s) =>
      (await learnsets.canLearn(s.name, "Spikes")) ||
      (await learnsets.canLearn(s.name, "Sticky Web")) ||
      (await learnsets.canLearn(s.name, "Toxic Spikes"))
  );
  const momentumUser = await filter(
    allSpecies,
    async (s) =>
      (await learnsets.canLearn(s.name, "U-turn")) ||
      (await learnsets.canLearn(s.name, "Volt Switch")) ||
      (await learnsets.canLearn(s.name, "Baton Pass")) ||
      (await learnsets.canLearn(s.name, "Flip Turn")) ||
      (generation >= 8 && (await learnsets.canLearn(s.name, "Teleport")))
  );
  const quickGuardUser = await filter(
    allSpecies,
    async (s) => await learnsets.canLearn(s.name, "Quick Guard")
  );
  const wideGuardUser = await filter(
    allSpecies,
    async (s) => await learnsets.canLearn(s.name, "Wide Guard")
  );
  const fakeOutUser = await filter(
    allSpecies,
    async (s) => await learnsets.canLearn(s.name, "Fake Out")
  );
  const tailwindUser = await filter(
    allSpecies,
    async (s) => await learnsets.canLearn(s.name, "Tailwind")
  );
  const intimidateUser = getAbilityMons(allSpecies, ["Intimidate"]);

  const sunSetter = getAbilityMons(allSpecies, sunAbilities);
  const rainSetter = getAbilityMons(allSpecies, rainAbilities);
  const sandSetter = getAbilityMons(allSpecies, sandAbilities);
  const hailSetter = getAbilityMons(allSpecies, hailAbilities);

  const sunUser = getAbilityMons(allSpecies, sunUseAbilities);
  const rainUser = getAbilityMons(allSpecies, rainUseAbilities);
  const sandUser = getAbilityMons(allSpecies, sandUseAbilities);
  const hailUser = getAbilityMons(allSpecies, hailUseAbilities);

  const prevos = {} as Record<string, string>;
  allSpecies.forEach((s) => {
    if (s.prevo) prevos[s.prevo] = s.name;
  });

  for (const booster of abilityBooster)
    booster.list = getAbilityMons(allSpecies, booster.names);

  return {
    generation,

    allSpecies,
    types: generationDex.types.all(),
    dataTypes: generationData.types,

    rocker: rocker as Species[],
    hazardRemover: hazardRemover as Species[],
    otherHazards: otherHazards as Species[],

    sunSetter,
    sunUser,

    rainSetter,
    rainUser,

    sandSetter,
    sandUser,

    hailSetter,
    hailUser,

    prevos,

    abilityBooster,

    momentumUser,

    quickGuardUser,
    wideGuardUser,
    fakeOutUser,
    tailwindUser,
    intimidateUser,
  } as AlgorithmState;
}

export async function evaluateTeam(
  teamPokemon: Species[] | Species[][],
  algorithmState: AlgorithmState | GenerationNum,
  doubles?: boolean
): Promise<EvaluationReport> {
  if (typeof algorithmState === "number")
    algorithmState = await calculateData(algorithmState);

  const mergedTeam: Species[] = [];
  if (teamPokemon.length > 0) {
    for (let i = 0; i < teamPokemon.length; i++) {
      const entry = teamPokemon[i];
      if (Array.isArray(entry)) {
        for (let j = 0; j < entry.length; j++) mergedTeam.push(entry[j]);
      } else {
        mergedTeam.push(entry);
      }
    }
  }
  const numberOfPokemon = mergedTeam.length;

  const evaluationReport: EvaluationReport = {
    value: 1,
  };
  if (numberOfPokemon > 0) {
    const rockers = algorithmState.rocker.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const hazardRemovals = algorithmState.hazardRemover.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const otherHazards = algorithmState.otherHazards.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const momentumUser = algorithmState.momentumUser.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const typeMatchups = algorithmState.types.map((type) => {
      return { name: type.name, value: 1 };
    });
    const typeExists = algorithmState.types.map((type) => {
      return { name: type.name, value: 0 };
    });
    const quickGuardUser = algorithmState.quickGuardUser.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const wideGuardUser = algorithmState.wideGuardUser.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const fakeOutUser = algorithmState.fakeOutUser.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const tailwindUser = algorithmState.tailwindUser.filter((s) =>
      mergedTeam.includes(s)
    ).length;
    const intimidateUser = algorithmState.intimidateUser.filter((s) =>
      mergedTeam.includes(s)
    ).length;

    let statValue = 0;

    for (const mon of mergedTeam) {
      const stats = { ...mon.baseStats };
      // Eviolite boost
      if (algorithmState.generation >= 5 && mon.name in algorithmState.prevos) {
        stats.def *= 1.5;
        stats.spd *= 1.5;
      }
      // Handle stat boosting abilities
      for (const abilityBoost of algorithmState.abilityBooster) {
        if (getAbilityMons([mon], abilityBoost.names).length > 0)
          abilityBoost.handler(stats);
      }

      if (
        mon.types.includes("Rock") &&
        getAbilityMons([mon], ["Sand Stream"]).length > 0
      )
        stats.spd *= 1.5;

      const statTotal =
        stats.atk + stats.def + stats.hp + stats.spa + stats.spd + stats.spe;
      statValue += statTotal;

      let hasLevitate = false;
      if (getAbilityMons([mon], ["Levitate"]).length > 0) hasLevitate = true;

      let waterImmune = false;
      if (
        getAbilityMons([mon], ["Dry Skin", "Water Absorb", "Storm Drain"])
          .length > 0
      )
        waterImmune = true;

      let electricImmune = false;
      if (
        getAbilityMons([mon], ["Volt Absorb", "Lightning Rod", "Motor Drive"])
          .length > 0
      )
        electricImmune = true;

      let fireImmune = false;
      if (getAbilityMons([mon], ["Flash Fire"]).length > 0) fireImmune = true;

      let grassImmune = false;
      if (getAbilityMons([mon], ["Sap Sipper"]).length > 0) grassImmune = true;

      for (const typeMatchup of typeMatchups) {
        if (typeMatchup.name === "Ground" && hasLevitate)
          typeMatchup.value += 2;
        else if (typeMatchup.name === "Water" && waterImmune)
          typeMatchup.value += 2;
        else if (typeMatchup.name === "Electric" && electricImmune)
          typeMatchup.value += 2;
        else if (typeMatchup.name === "Fire" && fireImmune)
          typeMatchup.value += 2;
        else if (typeMatchup.name === "Grass" && grassImmune)
          typeMatchup.value += 2;
        else
          typeMatchup.value +=
            2 -
            algorithmState.dataTypes.totalEffectiveness(
              typeMatchup.name,
              mon.types
            ) /
              2;
      }
      for (const type of mon.types) {
        typeExists
          .filter((typeExistance) => typeExistance.name === type)
          .forEach((typeExistance) => (typeExistance.value = 1));
      }
    }

    for (const typeMatchup of typeMatchups)
      typeMatchup.value /= numberOfPokemon;

    const typeMatchupValue =
      typeMatchups.reduce(
        (previousValue: number, currentValue) =>
          previousValue + currentValue.value,
        0
      ) / algorithmState.types.length;
    const ownTypesCovered =
      typeExists.reduce(
        (previousValue: number, currentValue) =>
          previousValue + currentValue.value,
        0
      ) / algorithmState.types.length;

    // Using 600 as a basemark of good stats
    statValue = statValue / (600 * numberOfPokemon);

    evaluationReport.statValue = statValue;
    evaluationReport.rocker = rockers;
    evaluationReport.hazardRemovals = hazardRemovals;
    evaluationReport.otherHazards = otherHazards;
    evaluationReport.ownTypesCovered = ownTypesCovered;
    evaluationReport.typeMatchupValue = typeMatchupValue;
    evaluationReport.momentumUser = momentumUser;

    evaluationReport.quickGuardUser = quickGuardUser;
    evaluationReport.wideGuardUser = wideGuardUser;
    evaluationReport.fakeOutUser = fakeOutUser;
    evaluationReport.tailwindUser = tailwindUser;
    evaluationReport.intimidateUser = intimidateUser;

    evaluationReport.value =
      statValue *
      // If balanced, should be around 1
      typeMatchupValue *
      // +2 since essential for Gen 4, Rest 1
      (algorithmState.rocker.length > 0 ? Math.log(rockers + 6) : 1) *
      // +2 since essential for Gen 6 >=, otherwise +6
      (algorithmState.hazardRemover.length > 0
        ? Math.log(hazardRemovals + (algorithmState.generation >= 6 ? 6 : 6))
        : 1) *
      // +3 since not essential
      (algorithmState.otherHazards.length > 0
        ? Math.log(otherHazards + 10)
        : 1) *
      // +3 since not essential
      (algorithmState.momentumUser.length > 0
        ? Math.log(momentumUser + 3)
        : 1) *
      (doubles
        ? // +3 since not essential
          (algorithmState.quickGuardUser.length > 0
            ? Math.log(quickGuardUser + 3)
            : 1) *
          // +3 since not essential
          (algorithmState.wideGuardUser.length > 0
            ? Math.log(wideGuardUser + 3)
            : 1) *
          // +3 since not essential
          (algorithmState.fakeOutUser.length > 0
            ? Math.log(fakeOutUser + 3)
            : 1) *
          // +3 since not essential
          (algorithmState.tailwindUser.length > 0
            ? Math.log(tailwindUser + 3)
            : 1) *
          // +3 since not essential
          (algorithmState.intimidateUser.length > 0
            ? Math.log(intimidateUser + 3)
            : 1)
        : 1) *
      // Can only reduce, since max is 1
      ownTypesCovered;
    // TODO: Implement Weather Bonus
  }

  return evaluationReport;
}

export async function generateTeam(
  generation: GenerationNum,
  species: Species[][],
  requirements: number[],
  filterList: (Species | null)[][] = [],
  algorithmState?: AlgorithmState,
  doubles?: boolean,
  iterations = 1000
): Promise<[Species[][], EvaluationReport]> {
  if (!algorithmState) algorithmState = await calculateData(generation);

  let bestTeam = [] as Species[][];
  let bestEvaluation: EvaluationReport = {
    value: 0,
  };

  for (let i = 0; i < iterations; i++) {
    const newTeam: Species[][] = [];
    for (let j = 0; j < requirements.length; j++) {
      const currentRequirementSpecies: Species[] = [];
      const workingSpecies = species[j];
      for (let k = 0; k < requirements[j]; k++) {
        if (filterList[j] && filterList[j][k]) {
          const fixedSpecies = filterList[j][k];
          if (fixedSpecies) {
            currentRequirementSpecies.push(fixedSpecies);
          }
        } else {
          const numberOfTries = 100;
          let foundMon = 0;
          for (let l = 0; l < numberOfTries; l++) {
            foundMon = getRandomInt(workingSpecies.length);
            // Species Clause
            if (
              !newTeam.some((entryList) =>
                entryList.some((s) =>
                  filterPokemonList(s, workingSpecies, foundMon)
                )
              ) &&
              !currentRequirementSpecies.some((s) =>
                filterPokemonList(s, workingSpecies, foundMon)
              )
            )
              break;
          }
          currentRequirementSpecies.push(workingSpecies[foundMon]);
        }
      }
      newTeam.push(currentRequirementSpecies);
    }
    const teamEvaluation = await evaluateTeam(newTeam, algorithmState, doubles);
    if (teamEvaluation.value > bestEvaluation.value) {
      bestEvaluation = teamEvaluation;
      bestTeam = newTeam;
    }
  }

  return [bestTeam, bestEvaluation];
}

function filterPokemonList(
  value: Species,
  workingSpecies: Species[],
  foundMon: number
): boolean {
  return (
    value.num === workingSpecies[foundMon].num ||
    (value.name.includes("-Mega") &&
      workingSpecies[foundMon].name.includes("-Mega"))
  );
}
