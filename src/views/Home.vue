<template>
  <div>
    <LeagueSelector class="spacedElement" @change="changeDraftMonsUrl" />
    <TeamRenderer
      class="spacedElement"
      :evaluation-report="evaluationReport"
      :generation="league.generation"
      :loading="loading"
      :team="team"
    />
    <b-button @click="generate"> Generate </b-button>
    <SearchUI
      class="spacedElement"
      :league="league"
      @changeFilter="changeFilter"
    />
  </div>
</template>

<script setup lang="ts">
import type { Species } from "@pkmn/dex";
import type { Ref } from "@vue/composition-api";
import type { EvaluationReport } from "@/util/algorithm";
import { generateTeam } from "@/util/algorithm";

import { parseFile, stringsToSpecies } from "@/util/oldParsingLogic";
import { League } from "@/types/league";

const league = ref({
  csv: "",
  displayName: "",
  requirements: [2, 2, 3, 2, 2],
  generation: 8,
} as League);

const team: Ref<Species[][]> = ref([]);
const loading = ref(false);
const evaluationReport: Ref<EvaluationReport> = ref({ value: 0 });

const filter = ref([] as (Species | null)[][]);

async function generate() {
  loading.value = true;
  const parsedMons = await parseFile(league.value.csv);

  const result = await generateTeam(
    league.value.generation,
    stringsToSpecies(league.value.generation, parsedMons),
    league.value.requirements,
    filter.value
  );
  // eslint-disable-next-line no-console
  console.log(result);
  team.value = result[0];
  evaluationReport.value = result[1];
  loading.value = false;
}

function changeFilter(changedFilter: (Species | null)[][]) {
  filter.value = changedFilter;
  generate();
}

function changeDraftMonsUrl(newLeague: League) {
  league.value = newLeague;
  generate();
}
</script>

<style scoped>
.spacedElement {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
