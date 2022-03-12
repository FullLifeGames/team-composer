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
      :monFilterOption="monFilterOption"
      :species="species"
    />
  </div>
</template>

<script setup lang="ts">
import type { Species } from "@pkmn/dex";
import type { MonFilterOption } from "@/types/monFilterOption";
import type { League } from "@/types/league";

import { parseFile, stringsToSpecies } from "@/util/parsingLogic";
import { rawCSVFileToMonsList } from "@/util/parsingLogic";

const league = ref({
  csv: "",
  displayName: "",
  requirements: [2, 2, 3, 2, 2],
  generation: 8,
} as League);

const loading = ref(false);

const species = ref([] as Species[][]);
const monFilterOption = ref({} as MonFilterOption);

async function setSpeciesList() {
  loading.value = true;

  let parsedMons = [];
  if (league.value.language === "de") {
    parsedMons = await parseFile(league.value.csv);
  } else {
    parsedMons = await rawCSVFileToMonsList(league.value.csv);
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
