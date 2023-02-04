<template>
  <div>
    <b-row v-for="(entry, index) in league.requirements" :key="index">
      <b-col v-for="i in entry" :key="i" class="spacedElement">
        <b-form-select
          v-model="filter[index][i - 1]"
          :options="allSpeciesOptions"
          text-field="name"
          value-field="species"
          @update:modelValue="changeFilter"
        >
          <b-form-select-option :value="-1"
            >Please select an option</b-form-select-option
          >
        </b-form-select>
      </b-col>
    </b-row>
    <br />
    <b-row>
      <b-col>
        <b-form-group
          label="Exclude the following:"
          label-for="tags-component-select"
        >
          <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
          <b-form-tags
            id="tags-component-select"
            v-model="excluded"
            size="lg"
            class="mb-2"
            add-on-change
            no-outer-focus
            @input="changeFilter"
          >
            <template
              #default="{
                tags,
                inputAttrs,
                inputHandlers,
                disabled,
                removeTag,
              }"
            >
              <ul
                v-if="tags.length > 0"
                class="list-inline d-inline-block mb-2"
              >
                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                  <b-form-tag
                    :title="tag"
                    :disabled="disabled"
                    variant="info"
                    @remove="removeTag(tag)"
                    >{{ tag }}</b-form-tag
                  >
                </li>
              </ul>
              <b-form-select
                v-bind="inputAttrs"
                :disabled="
                  disabled || !excludedOptions || excludedOptions.length === 0
                "
                :options="excludedOptions"
                text-field="name"
                value-field="species"
                v-on="inputHandlers"
              >
                <template #first>
                  <!-- This is required to prevent bugs with Safari -->
                  <option disabled value="">
                    Choose a Pokémon to exclude ...
                  </option>
                </template>
              </b-form-select>
            </template>
          </b-form-tags>
        </b-form-group>
      </b-col>
    </b-row>
    <b-button class="spacedElement" @click="resetFilter">
      Reset Search
    </b-button>
  </div>
</template>

<script setup lang="ts">
import type { League } from "@/types/league";
import type { Species, SpeciesName } from "@pkmn/dex";

import { Dex } from "@pkmn/dex";

const props = defineProps<{
  league: League;
}>();
const emit = defineEmits<{
  (
    e: "changeFilter",
    filter: (Species | -1)[][],
    excluded: SpeciesName[]
  ): void;
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
const filter = ref([] as (Species | -1)[][]);
function setFilter() {
  filter.value = [];
  for (let j = 0; j < props.league.requirements.length; j++) {
    const entryArray = reactive([] as (Species | -1)[]);
    for (let k = 0; k < props.league.requirements[j]; k++) {
      entryArray.push(-1);
    }
    filter.value.push(entryArray);
  }
}
setFilter();

const excluded = ref([] as SpeciesName[]);
const excludedOptions = computed(() =>
  allSpeciesOptions.value
    .map((mon) => mon.name)
    .filter((opt) => excluded.value.indexOf(opt) === -1)
);

function changeFilter() {
  emit("changeFilter", filter.value, excluded.value);
}

function resetFilter() {
  setFilter();
  excluded.value = [];
  changeFilter();
}
</script>

<style scoped>
.spacedElement {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}
</style>
