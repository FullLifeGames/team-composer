<template>
  <div>
    <b-form-select
      v-model="selectedLeague"
      :options="leaguesOptions"
      text-field="name"
      value-field="league"
    ></b-form-select>
  </div>
</template>

<script setup lang="ts">
import type { League } from "@/types/league";

import { Dex, type GenerationNum } from "@pkmn/dex";

import brlS2CSV from "@/assets/leagues/BRL_S2.csv?url";
import gplS5CSV from "@/assets/leagues/GPL_S5.csv?url";
import gplS6CSV from "@/assets/leagues/GPL_S6.csv?url";
import gplS7CSV from "@/assets/leagues/GPL_S7.csv?url";
import gplS8CSV from "@/assets/leagues/GPL_S8.csv?url";
import gplS9CSV from "@/assets/leagues/GPL_S9.csv?url";
import miniHKPCSV from "@/assets/leagues/Mini-HKP.csv?url";
import mplCSV from "@/assets/leagues/MPL.csv?url";
import npblS6CSV from "@/assets/leagues/NPBL_S6.csv?url";
import npblS7CSV from "@/assets/leagues/NPBL_S7.csv?url";
import pbaS2CSV from "@/assets/leagues/PBA_S2.csv?url";
import pbaS3CSV from "@/assets/leagues/PBA_S3.csv?url";
import pbaS5CSV from "@/assets/leagues/PBA_S5.csv?url";
import rclCSV from "@/assets/leagues/RCL.csv?url";
import smlS8CSV from "@/assets/leagues/SML_S8.csv?url";
import smlS9CSV from "@/assets/leagues/SML_S9.csv?url";
import mtlCSV from "@/assets/leagues/MTL.csv?url";
import ubrlCSV from "@/assets/leagues/UBRL.csv?url";
import vblS3CSV from "@/assets/leagues/VBL_S3.csv?url";
import { useRouter } from "vue-router";

const router = useRouter();

function dexReceiver(generation: GenerationNum): League {
  function createCSV() {
    const genDex = Dex.forGen(generation);
    const allSpecies = genDex.species.all();
    const genOUMons = allSpecies.filter(
      (species) =>
        species.tier === "OU" ||
        species.tier === "(OU)" ||
        species.tier === "UUBL",
    );
    const genUUMons = allSpecies.filter(
      (species) => species.tier === "UU" || species.tier === "RUBL",
    );
    const genRUMons = allSpecies.filter(
      (species) => species.tier === "RU" || species.tier === "NUBL",
    );
    const genNUMons = allSpecies.filter(
      (species) => species.tier === "NU" || species.tier === "PUBL",
    );

    let csv = "";
    if (generation > 4) {
      csv +=
        genOUMons.join("\t\t") +
        "\n" +
        genUUMons.join("\t\t") +
        "\n" +
        genRUMons.join("\t\t") +
        "\n" +
        genNUMons.join("\t\t");
    } else {
      csv +=
        genOUMons.join("\t\t") +
        "\n" +
        genUUMons.join("\t\t") +
        "\t\t" +
        genRUMons.join("\t\t") +
        "\n" +
        genNUMons.join("\t\t");
    }
    return csv;
  }

  return {
    displayName: `Gen ${generation}`,
    generation: generation,
    language: "en",
    requirements: generation > 4 ? [3, 3, 3, 3] : [4, 4, 4],
    csvFunc: createCSV,
  };
}

const props = defineProps({
  routeName: {
    type: String,
    default: "LeagueSelected",
  },
});

let initalLeagueObject: League = {
  displayName: "NPBL S7",
  csvLink: npblS7CSV,
  generation: 9,
  requirements: [1, 2, 3, 3, 2],
  language: "de",
};

const leagues: League[] = [
  {
    displayName: "BRL S2",
    csvLink: brlS2CSV,
    generation: 4,
    requirements: [3, 4, 4],
    language: "de",
  },
  dexReceiver(1),
  dexReceiver(2),
  dexReceiver(3),
  dexReceiver(4),
  dexReceiver(5),
  dexReceiver(6),
  dexReceiver(7),
  dexReceiver(8),
  dexReceiver(9),
  {
    displayName: "GPL S5",
    csvLink: gplS5CSV,
    generation: 7,
    requirements: [2, 2, 3, 2, 2],
    language: "de",
  },
  {
    displayName: "GPL S6",
    csvLink: gplS6CSV,
    generation: 7,
    requirements: [2, 2, 3, 2, 2],
    language: "de",
  },
  {
    displayName: "GPL S7",
    csvLink: gplS7CSV,
    generation: 8,
    requirements: [2, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "GPL S8",
    csvLink: gplS8CSV,
    generation: 8,
    requirements: [2, 2, 3, 2, 2],
    language: "de",
  },
  {
    displayName: "GPL S9",
    csvLink: gplS9CSV,
    generation: 8,
    requirements: [2, 3, 3, 2, 1],
    language: "de",
    doubles: true,
  },
  {
    displayName: "Mini-KHP",
    csvLink: miniHKPCSV,
    generation: 3,
    requirements: [2, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "MPL (Nat Dex)",
    csvLink: mplCSV,
    generation: 8,
    requirements: [2, 2, 3, 2, 2],
    language: "de",
  },
  {
    displayName: "NPBL S6",
    csvLink: npblS6CSV,
    generation: 8,
    requirements: [2, 2, 3, 2, 2],
    language: "de",
  },
  initalLeagueObject,
  {
    displayName: "PBA S2",
    csvLink: pbaS2CSV,
    generation: 5,
    requirements: [2, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "PBA S3",
    csvLink: pbaS3CSV,
    generation: 6,
    requirements: [2, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "PBA S5",
    csvLink: pbaS5CSV,
    generation: 5,
    requirements: [2, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "RCL",
    csvLink: rclCSV,
    generation: 8,
    requirements: [2, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "SML S8",
    csvLink: smlS8CSV,
    generation: 8,
    requirements: [3, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "SML S9",
    csvLink: smlS9CSV,
    generation: 9,
    requirements: [3, 3, 3, 3],
    language: "de",
  },
  {
    displayName: "MTL",
    csvLink: mtlCSV,
    generation: 9,
    requirements: [2, 3, 3, 2, 1],
    language: "de",
  },
  {
    displayName: "UBRL",
    csvLink: ubrlCSV,
    generation: 4,
    requirements: [3, 8],
    language: "de",
  },
  {
    displayName: "VBL S3 (Nat Dex)",
    csvLink: vblS3CSV,
    generation: 9,
    requirements: [2, 2, 3, 3, 1],
    language: "de",
  },
];

const leaguesOptions = computed(() =>
  leagues.map((league) => {
    return {
      name: `${league.displayName} (Gen ${league.generation})`,
      league: league,
    };
  }),
);

const emit = defineEmits<{
  (e: "change", league: League): void;
}>();

const leagueParam = router.currentRoute.value.params.league;
if (leagueParam) {
  const paramLeagueObject = leagues.find(
    (league) => league.displayName === leagueParam,
  );
  if (paramLeagueObject) {
    initalLeagueObject = paramLeagueObject;
  }
} else {
  router.replace({
    name: props.routeName,
    params: { league: initalLeagueObject.displayName },
  });
}
const selectedLeague = ref(initalLeagueObject);

emit("change", initalLeagueObject);

watch(selectedLeague, () => {
  if (selectedLeague) {
    router.replace({
      name: props.routeName,
      params: { league: selectedLeague.value.displayName },
    });
    emit("change", selectedLeague.value);
  }
});
</script>
