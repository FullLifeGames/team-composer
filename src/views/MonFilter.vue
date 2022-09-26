<template>
  <div>
    <LeagueSelector
      class="spacedElement"
      route-name="MonFilter"
      @change="changeDraftMonsUrl"
    />
    <MonFilterOptions :league="league" @change="changeMonFilterOption" />
    <MonTable
      :league="league"
      :mon-filter-option="monFilterOption"
      :species="species"
    />
  </div>
</template>

<script setup lang="ts">
import type { Species } from "@pkmn/dex";
import type { MonFilterOption } from "@/types/monFilterOption";
import type { League } from "@/types/league";

import {
  parseFile,
  parseString,
  rawCSVToMonsList,
  stringsToSpecies,
} from "@/util/parsingLogic";
import { rawCSVFileToMonsList } from "@/util/parsingLogic";

const league = ref({
  csvLink: "",
  displayName: "",
  requirements: [2, 2, 3, 2, 2],
  generation: 8,
} as League);

const loading = ref(false);

const species = ref([] as Species[][]);
const monFilterOption = ref({} as MonFilterOption);

async function setSpeciesList() {
  loading.value = true;

  let parsedMons: string[][] = [];
  if (league.value.csvFunc) {
    if (league.value.language === "de") {
      parsedMons = await parseString(league.value.csvFunc());
    } else {
      parsedMons = rawCSVToMonsList(league.value.csvFunc());
    }
  } else if (league.value.csvLink) {
    if (league.value.language === "de") {
      parsedMons = await parseFile(league.value.csvLink);
    } else {
      parsedMons = await rawCSVFileToMonsList(league.value.csvLink);
    }
  }
  species.value = stringsToSpecies(league.value.generation, parsedMons);

  loading.value = false;
}

function changeDraftMonsUrl(newLeague: League) {
  league.value = newLeague;
  setSpeciesList();
}
function changeMonFilterOption(definedMonFilterOption: MonFilterOption) {
  monFilterOption.value = definedMonFilterOption;
}
</script>

<style scoped>
.spacedElement {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
