<template>
  <div>
    <LeagueSelector class="spacedElement" @change="changeDraftMonsUrl" />
    <TeamRenderer
      class="spacedElement"
      :evaluation-report="evaluationReport"
      :league="league"
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

import { parseFile, stringsToSpecies } from "@/util/parsingLogic";
import { League } from "@/types/league";
import { rawCSVFileToMonsList } from "@/util/parsingLogic";

import $eventHub from "@/components/eventHub";
import router from "@/router";

$eventHub.$emit("asyncComponentLoading", router.currentRoute);

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

const parsedMons = ref([] as string[][]);
const species = ref([] as Species[][]);

async function getData() {
  loading.value = true;

  if (league.value.language === "de") {
    parsedMons.value = await parseFile(league.value.csv);
  } else {
    parsedMons.value = await rawCSVFileToMonsList(league.value.csv);
  }
  species.value = stringsToSpecies(league.value.generation, parsedMons.value);
  await generate();

  loading.value = false;
}

async function generate() {
  loading.value = true;
  $eventHub.$emit("asyncComponentLoading", router.currentRoute);

  const result = await generateTeam(
    league.value.generation,
    species.value,
    league.value.requirements,
    filter.value,
    undefined,
    league.value.doubles
  );
  team.value = result[0];
  evaluationReport.value = result[1];

  $eventHub.$emit("asyncComponentLoaded");
  loading.value = false;
}

function changeFilter(changedFilter: (Species | null)[][]) {
  filter.value = changedFilter;
  generate();
}

function changeDraftMonsUrl(newLeague: League) {
  league.value = newLeague;
  getData();
}
</script>

<style scoped>
.spacedElement {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
