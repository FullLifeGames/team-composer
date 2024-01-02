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
    <div class="ml-2 mb-3">
      <b-button :disabled="loading" @click="generate"> Generate </b-button>
      <b-button
        :disabled="loading"
        style="margin-left: 0.5rem"
        @click="toggleSearch"
      >
        Toggle Search
      </b-button>
    </div>
    <div v-if="searchEnabled">
      <SearchUI
        class="spacedElement"
        :league="league"
        :loading="loading"
        @change-filter="changeFilter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Species, SpeciesName } from "@pkmn/dex";
import type { Ref } from "vue";
import type { EvaluationReport } from "@/util/algorithm";
import { getGenerateTeam } from "@/util/algorithmImport";

import {
  parseFile,
  parseString,
  rawCSVToMonsList,
  stringsToSpecies,
} from "@/util/parsingLogic";
import { League } from "@/types/league";
import { rawCSVFileToMonsList } from "@/util/parsingLogic";
import { useRouter } from "vue-router";
import useEmitter from "@/plugins/emitter";

const router = useRouter();
const emitter = useEmitter();

emitter.emit("asyncComponentLoading", router.currentRoute);

const league = ref({
  csvLink: "",
  displayName: "",
  requirements: [2, 2, 3, 2, 2],
  generation: 8,
} as League);

const team: Ref<Species[][]> = ref([]);
const loading = ref(false);
const evaluationReport: Ref<EvaluationReport> = ref({ value: 0 });

const filter = ref([] as (Species | -1)[][]);
const excluded = ref([] as SpeciesName[]);

const parsedMons = ref([] as string[][]);
const species = ref([] as Species[][]);

async function getData() {
  loading.value = true;

  if (league.value.csvFunc) {
    if (league.value.language === "de") {
      parsedMons.value = await parseString(league.value.csvFunc());
    } else {
      parsedMons.value = rawCSVToMonsList(league.value.csvFunc());
    }
  } else if (league.value.csvLink) {
    if (league.value.language === "de") {
      parsedMons.value = await parseFile(league.value.csvLink);
    } else {
      parsedMons.value = await rawCSVFileToMonsList(league.value.csvLink);
    }
  }

  species.value = stringsToSpecies(league.value.generation, parsedMons.value);
  await generate();

  loading.value = false;
}

async function generate() {
  loading.value = true;
  emitter.emit("asyncComponentLoading", router.currentRoute);

  const generateTeam = await getGenerateTeam();
  const result = await generateTeam(
    league.value.generation,
    species.value.map((speciesList) =>
      speciesList.filter(
        (mon) => !excluded.value.some((monName) => monName === mon.name),
      ),
    ),
    league.value.requirements,
    filter.value,
    undefined,
    league.value.doubles,
    1000,
    league.value.restriction,
  );
  team.value = result[0];
  evaluationReport.value = result[1];

  emitter.emit("asyncComponentLoaded");
  loading.value = false;
}

function changeFilter(
  changedFilter: (Species | -1)[][],
  changedExcluded: SpeciesName[],
) {
  filter.value = changedFilter;
  excluded.value = changedExcluded;
}

const searchEnabled = ref(false);
function toggleSearch() {
  searchEnabled.value = !searchEnabled.value;
}

const mounted = ref(false);

function changeDraftMonsUrl(newLeague: League) {
  league.value = newLeague;
  if (mounted.value) {
    getData();
  }
}

onMounted(() => {
  mounted.value = true;
  if (league.value.csvLink) {
    getData();
  }
});
</script>

<style scoped>
.spacedElement {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
