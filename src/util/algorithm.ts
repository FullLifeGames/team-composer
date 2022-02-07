/* eslint-disable semi */
import { Dex, GenerationNum, Species, StatsTable, Type } from '@pkmn/dex';
import {Generations, Types as DataTypes} from '@pkmn/data';

const gens = new Generations(Dex);

async function filter<T>(arr: readonly T[] | T[], callback: (item: T) => Promise<boolean>) {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail)
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function getAbilityMons(list: readonly Species[] | Species[], abilities: string[]) {
    return list.filter((s) => 
        abilities.includes(s.abilities[0])
        || abilities.includes(s.abilities[1] as string)
        || abilities.includes(s.abilities.H as string)
        || abilities.includes(s.abilities.S as string)
    );
}

export interface AbilityBooster {
    names: string[],
    handler: (stats: StatsTable<number>) => void,
    list: Species[]
};

export interface AlgorithmState {
    generation: GenerationNum,

    allSpecies: Species[],
    types: Type[],
    dataTypes: DataTypes,

    rocker: Species[],
    hazardRemover: Species[],
    otherHazards: Species[],

    sunSetter: Species[],
    sunUser: Species[],

    rainSetter: Species[],
    rainUser: Species[],

    sandSetter: Species[],
    sandUser: Species[],
    
    hailSetter: Species[],
    hailUser: Species[],

    prevos: Record<string, string>,

    abilityBooster: AbilityBooster[],
}

export interface EvaluationReport {
    value: number

    statValue?: number,
    rocker?: number,
    hazardRemovals?: number,
    otherHazards?: number,
    ownTypesCovered?: number,
    typeMatchupValue?: number,
}

export async function calculateData(generation: GenerationNum) : Promise<AlgorithmState> {
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
            handler: (stats: StatsTable<number>) => stats.hp *= 1.5,
            list: [] as Species[],
        },
        { 
            names: ["Huge Power", "Pure Power"], 
            handler: (stats: StatsTable<number>) => stats.atk *= 2,
            list: [] as Species[],
        },
        { 
            names: ["Gorilla Tactics"], 
            handler: (stats: StatsTable<number>) => stats.atk *= 1.5,
            list: [] as Species[],
        },
        { 
            names: ["Libero", "Protean"], 
            handler: (stats: StatsTable<number>) => stats.atk *= 1.5,
            list: [] as Species[],
        },
        { 
            names: ["Hustle", "Strong Jaw", "Tough Claws"], 
            handler: (stats: StatsTable<number>) => stats.atk *= 1.3,
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
            names: ["Intimidate"], 
            handler: (stats: StatsTable<number>) => stats.def *= 1.5,
            list: [] as Species[],
        },
        { 
            names: ["Ice Scales"], 
            handler: (stats: StatsTable<number>) => stats.spd *= 2,
            list: [] as Species[],
        },
    ] as AbilityBooster[];

    const learnsets = generationData.learnsets;
    const rocker = await filter<Species>(allSpecies, async (s) => await learnsets.canLearn(s.name, 'Stealth Rock'));
    const hazardRemover = await filter(allSpecies, async (s) =>
        await learnsets.canLearn(s.name, 'Rapid Spin')
        || await learnsets.canLearn(s.name, 'Defog')
        || await learnsets.canLearn(s.name, 'Court Change')
    );
    const otherHazards = await filter(allSpecies, async (s) =>
        await learnsets.canLearn(s.name, 'Spikes')
        || await learnsets.canLearn(s.name, 'Sticky Web')
        || await learnsets.canLearn(s.name, 'Toxic Spikes')
    );

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
        if (s.prevo) {
            prevos[s.prevo] = s.name;
        }
    });

    for (const booster of abilityBooster) {
        booster.list = getAbilityMons(allSpecies, booster.names);
    }

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
    } as AlgorithmState;
}

export async function evaluateTeam(teamPokemon: Species[] | Species[][], algorithmState: AlgorithmState | GenerationNum) : Promise<EvaluationReport> {
    if (typeof algorithmState === 'number') {
        algorithmState = await calculateData(algorithmState);
    }
    const mergedTeam: Species[] = [];
    if (teamPokemon.length > 0) {
        for (let i = 0; i < teamPokemon.length; i++) {
            const entry = teamPokemon[i];
            if (Array.isArray(entry)) {
                for (let j = 0; j < entry.length; j++) {
                    mergedTeam.push(entry[j]);
                }
            } else {
                mergedTeam.push(entry);
            }
        }
    }
    const numberOfPokemon = mergedTeam.length;

    const evaluationReport: EvaluationReport = {
        value: 1
    };
    if (numberOfPokemon > 0) {
        const rockers = algorithmState.rocker.filter((s) => mergedTeam.includes(s)).length;
        const hazardRemovals = algorithmState.hazardRemover.filter((s) => mergedTeam.includes(s)).length;
        const otherHazards = algorithmState.otherHazards.filter((s) => mergedTeam.includes(s)).length;
        const typeMatchups = algorithmState.types.map((type) => { return { name: type.name, value: 1 } });
        const typeExists = algorithmState.types.map((type) => { return { name: type.name, value: 0 } });

        let statValue = 0;

        for (const mon of mergedTeam) {
            const stats = mon.baseStats;
            // Eviolite boost
            if (algorithmState.generation >= 5 && mon.name in algorithmState.prevos) {
                stats.def *= 1.5;
                stats.spd *= 1.5;
            }
            // Handle stat boosting abilities
            for (const abilityBoost of algorithmState.abilityBooster) {
                if (getAbilityMons([mon], abilityBoost.names).length > 0) {
                    abilityBoost.handler(stats);
                }
            }
            let statTotal = stats.atk + stats.def + stats.hp + stats.spa + stats.spd + stats.spe;
            statValue += statTotal;

            for (const typeMatchup of typeMatchups) {
                typeMatchup.value += algorithmState.dataTypes.totalEffectiveness(typeMatchup.name, mon.types);
            }
            for (const type of mon.types) {
                typeExists
                    .filter((typeExistance) => typeExistance.name == type)
                    .forEach((typeExistance) => typeExistance.value = 1);
            }

        }

        for (const typeMatchup of typeMatchups) {
            typeMatchup.value /= numberOfPokemon;
        }
        const typeMatchupValue = typeMatchups.reduce((previousValue: number, currentValue) => previousValue + currentValue.value, 0) / algorithmState.types.length;
        const ownTypesCovered = typeExists.reduce((previousValue: number, currentValue) => previousValue + currentValue.value, 0) / algorithmState.types.length;

        evaluationReport.statValue = statValue;
        evaluationReport.rocker = rockers;
        evaluationReport.hazardRemovals = hazardRemovals;
        evaluationReport.otherHazards = otherHazards;
        evaluationReport.ownTypesCovered = ownTypesCovered;
        evaluationReport.typeMatchupValue = typeMatchupValue;

        evaluationReport.value 
            = 
                // Using 600 as a basemark of good stats
                (statValue / (600 * numberOfPokemon))
                // If balanced, should be around 1
                * typeMatchupValue
                // +1 since essential
                * Math.log(rockers + 1)
                // +1 since essential
                * Math.log(hazardRemovals + 1)
                // +2 since not essential
                * Math.log(otherHazards + 2)
                // Can only reduce, since max is 1
                * ownTypesCovered
                // TODO: Implement Weather Bonus
        ;
    }

    return evaluationReport;
}

export async function generateTeam(generation: GenerationNum, species: Species[][], requirements: number[], iterations = 1000): Promise<[Species[][], EvaluationReport]> {
    const algorithmState = await calculateData(generation);

    let bestTeam = [] as Species[][];
    let bestEvaluation: EvaluationReport = {
        value: 0
    };

    for (let i = 0; i < iterations; i++) {
        const newTeam = [];
        for (let j = 0; j < requirements.length; j++) {
            const currentRequirementSpecies: Species[] = [];
            const workingSpecies = species[j];
            for (let k = 0; k < requirements[j]; k++) {
                // TODO: Deal with mons found twice
                const foundMon = getRandomInt(workingSpecies.length);
                currentRequirementSpecies.push(workingSpecies[foundMon]);
            }
            newTeam.push(currentRequirementSpecies);
        }
        const teamEvaluation = await evaluateTeam(newTeam, algorithmState);
        if (teamEvaluation.value > bestEvaluation.value) {
            bestEvaluation = teamEvaluation;
            bestTeam = newTeam;
        }
    }

    return [bestTeam, bestEvaluation];
}
