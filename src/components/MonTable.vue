<template>
  <div>
    <b-table
      striped
      hover
      :items="speciesRows"
      :fields="fields"
      :is-busy="isBusy"
      :sort-by-formatted="true"
      :sort-null-last="true"
    >
      <template #cell()="data">
        <div v-if="data.item[data.field.key]" class="align-middle">
          {{ data.value }}
          <MonRenderer
            :generation="props.league.generation"
            :mon="data.item[data.field.key]"
          />
        </div>
      </template>
    </b-table>
  </div>
</template>

<script setup lang="ts">
import type { League } from "@/types/league";
import type { MonFilterOption } from "@/types/monFilterOption";
import { Generations } from "@pkmn/data";
import type { Species } from "@pkmn/dex";

import { Dex } from "@pkmn/dex";
import "@pkmn/dex/build/learnsets.min.js";
import type { Ref } from "vue";

const props = defineProps<{
  league: League;
  monFilterOption: MonFilterOption;
  species: Species[][];
}>();

const gens = new Generations(Dex);
const generationData = computed(() => gens.get(props.league.generation));

const stringFilter = computed(() => {
  if (props.monFilterOption.filter) {
    return props.monFilterOption.filter.toLowerCase().trim();
  } else {
    return "";
  }
});

const isBusy = ref(false);

const fields = computed(() => {
  return props.league.requirements.map((value, index) => {
    return {
      key: `Tier ${index + 1}`,
      label: `Tier ${index + 1}`,
      sortable: true,
      formatter: (value: Species) => {
        return value?.name;
      },
      sortByFormatted: true,
    };
  });
});
async function asyncFilter<T>(
  arr: T[],
  predicate: (entry: T) => Promise<boolean>
) {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}

async function filterSpeciesArray(speciesList: Species[]) {
  return await asyncFilter(speciesList, async (entry) => {
    let filterResult = true;
    if (props.monFilterOption.filter) {
      filterResult = entry.name.toLowerCase().includes(stringFilter.value);
    }
    if (
      filterResult &&
      props.monFilterOption.filterMove &&
      props.monFilterOption.filterMove !== -1
    ) {
      filterResult = await generationData.value.learnsets.canLearn(
        entry.name,
        props.monFilterOption.filterMove
      );
    }
    if (
      filterResult &&
      props.monFilterOption.filterType1 &&
      props.monFilterOption.filterType1 !== -1
    ) {
      filterResult = entry.types.includes(
        props.monFilterOption.filterType1.name
      );
    }
    if (
      filterResult &&
      props.monFilterOption.filterType2 &&
      props.monFilterOption.filterType2 !== -1
    ) {
      filterResult = entry.types.includes(
        props.monFilterOption.filterType2.name
      );
    }
    if (
      filterResult &&
      props.monFilterOption.filterAbility &&
      props.monFilterOption.filterAbility !== -1
    ) {
      filterResult =
        props.monFilterOption.filterAbility.name === entry.abilities[0] ||
        props.monFilterOption.filterAbility.name === entry.abilities[1] ||
        props.monFilterOption.filterAbility.name === entry.abilities.H ||
        props.monFilterOption.filterAbility.name === entry.abilities.S;
    }
    return filterResult;
  });
}

const filteredSpecies: Ref<Species[][]> = asyncComputed(async () => {
  return await Promise.all(
    props.species.map(
      async (speciesList) => await filterSpeciesArray(speciesList)
    )
  );
});

const speciesRows = computed(() => {
  if (filteredSpecies.value) {
    const maxLength = Math.max(
      ...filteredSpecies.value.map((entry) => entry.length)
    );
    const returnList: { [fieldName: string]: Species | null }[] = [];
    for (let i = 0; i < maxLength; i++) {
      const currentObject: { [fieldName: string]: Species | null } = {};
      fields.value.forEach((field, index) => {
        currentObject[field.key] =
          filteredSpecies.value[index] &&
          filteredSpecies.value[index].length > i
            ? filteredSpecies.value[index][i]
            : null;
      });
      returnList.push(currentObject);
    }
    return returnList;
  } else {
    return [];
  }
});
</script>
