<template>
  <div>
    <b-row v-for="(entry, index) in league.requirements" :key="index">
      <b-col class="spacedElement" v-for="i in entry" :key="i">
        <b-form-select
          v-model="filter[index][i - 1]"
          :options="allSpeciesOptions"
          @change="changeFilter"
          text-field="name"
          value-field="species"
        >
          <b-form-select-option :value="null"
            >Please select an option</b-form-select-option
          >
        </b-form-select>
      </b-col>
    </b-row>
    <b-button class="spacedElement" @click="resetFilter">
      Reset Search
    </b-button>
  </div>
</template>

<script setup lang="ts">
import { League } from "@/types/league";
import { Dex, Species } from "@pkmn/dex";

const props = defineProps<{
  league: League;
}>();
const emit = defineEmits<{
  (e: "changeFilter", filter: (Species | null)[][]): void;
}>();
const generationDex = computed(() => Dex.forGen(props.league.generation));
const allSpecies = computed(() =>
  generationDex.value.species
    .all()
    .filter((species) => species.exists)
    .sort()
);
const allSpeciesOptions = computed(() =>
  allSpecies.value.map((species) => {
    return {
      name: species.name,
      species: species,
    };
  })
);
const filter = ref([] as (Species | null)[][]);
function setFilter() {
  filter.value = [];
  for (let j = 0; j < props.league.requirements.length; j++) {
    const entryArray = reactive([] as (Species | null)[]);
    for (let k = 0; k < props.league.requirements[j]; k++) {
      entryArray.push(null);
    }
    filter.value.push(entryArray);
  }
}
setFilter();

function changeFilter() {
  emit("changeFilter", filter.value);
}

function resetFilter() {
  setFilter();
  changeFilter();
}
</script>

<style scoped>
.spacedElement {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}
</style>
