<template>
  <div>
    <TeamRenderer
      :evaluation-report="evaluationReport"
      :generation="generation"
      :team="team"
    />
    <b-button @click="generate"> Generate </b-button>
    <SearchUI />
  </div>
</template>

<script setup lang="ts">
import type { GenerationNum, Species } from "@pkmn/dex";
import type { Ref } from "@vue/composition-api";
import type { EvaluationReport } from "@/util/algorithm";
import { generateTeam } from "@/util/algorithm";

import { parseFile, stringsToSpecies } from "@/util/oldParsingLogic";

const generation = ref(8 as GenerationNum);
const team: Ref<Species[][]> = ref([]);
const evaluationReport: Ref<EvaluationReport> = ref({ value: 0 });

async function generate() {
  const parsedMons = await parseFile();

  const result = await generateTeam(
    generation.value,
    stringsToSpecies(generation.value, parsedMons),
    [2, 2, 3, 2, 2]
  );
  // eslint-disable-next-line no-console
  console.log(result);
  team.value = result[0];
  evaluationReport.value = result[1];
}

generate();
</script>
