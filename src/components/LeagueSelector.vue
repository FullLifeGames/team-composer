<template>
  <div>
    <b-form-select
      v-model="selectedLeague"
      :options="leagues"
      text-field="displayName"
      value-field="displayName"
    ></b-form-select>
  </div>
</template>

<script setup lang="ts">
import type { League } from "@/types/league";

import brlS2CSV from "@/assets/leagues/BRL_S2.csv?url";
import gplS5CSV from "@/assets/leagues/GPL_S5.csv?url";
import gplS6CSV from "@/assets/leagues/GPL_S6.csv?url";
import gplS7CSV from "@/assets/leagues/GPL_S7.csv?url";
import gplS8CSV from "@/assets/leagues/GPL_S8.csv?url";
import npblS6CSV from "@/assets/leagues/NPBL_S6.csv?url";
import pbaS2CSV from "@/assets/leagues/PBA_S2.csv?url";
import pbaS3CSV from "@/assets/leagues/PBA_S3.csv?url";
import rclCSV from "@/assets/leagues/RCL.csv?url";
import smlCSV from "@/assets/leagues/SML.csv?url";

const leagues: League[] = [
  {
    displayName: "BRL S2",
    csv: brlS2CSV,
    generation: 4,
    requirements: [3, 4, 4],
  },
  {
    displayName: "GPL S5",
    csv: gplS5CSV,
    generation: 7,
    requirements: [2, 2, 3, 2, 2],
  },
  {
    displayName: "GPL S6",
    csv: gplS6CSV,
    generation: 7,
    requirements: [2, 2, 3, 2, 2],
  },
  {
    displayName: "GPL S7",
    csv: gplS7CSV,
    generation: 8,
    requirements: [2, 3, 3, 3],
  },
  {
    displayName: "GPL S8",
    csv: gplS8CSV,
    generation: 8,
    requirements: [2, 2, 3, 2, 2],
  },
  {
    displayName: "NPBL S6",
    csv: npblS6CSV,
    generation: 8,
    requirements: [2, 2, 3, 2, 2],
  },
  {
    displayName: "PBA S2",
    csv: pbaS2CSV,
    generation: 5,
    requirements: [2, 3, 3, 3],
  },
  {
    displayName: "PBA S3",
    csv: pbaS3CSV,
    generation: 6,
    requirements: [2, 3, 3, 3],
  },
  {
    displayName: "RCL",
    csv: rclCSV,
    generation: 8,
    requirements: [2, 3, 3, 3],
  },
  {
    displayName: "SML",
    csv: smlCSV,
    generation: 8,
    requirements: [3, 3, 3, 3],
  },
];

const emit = defineEmits<{
  (e: "change", league: League): void;
}>();

const selectedLeague = ref(
  leagues.find((league) => league.displayName === "GPL S8")!.displayName
);

emit(
  "change",
  leagues.find((league) => league.displayName === selectedLeague.value)!
);

watch(selectedLeague, () => {
  emit(
    "change",
    leagues.find((league) => league.displayName === selectedLeague.value)!
  );
});
</script>
