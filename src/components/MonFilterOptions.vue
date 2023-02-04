<template>
  <div>
    <b-form-group label="Move" label-for="move-input">
      <b-form-select
        id="move-input"
        v-model="filterMove"
        :options="moves"
        text-field="name"
        value-field="move"
        @update:modelValue="changeFilter"
      >
        <b-form-select-option :value="-1"
          >Select a move to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Type 1" label-for="type1-input">
      <b-form-select
        id="type1-input"
        v-model="filterType1"
        :options="types"
        text-field="name"
        value-field="type"
        @update:modelValue="changeFilter"
      >
        <b-form-select-option :value="-1"
          >Select a type to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Type 2" label-for="type2-input">
      <b-form-select
        id="type2-input"
        v-model="filterType2"
        :options="types"
        text-field="name"
        value-field="type"
        @update:modelValue="changeFilter"
      >
        <b-form-select-option :value="-1"
          >Select a type to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Ability" label-for="ability-input">
      <b-form-select
        id="ability-input"
        v-model="filterAbility"
        :options="abilities"
        text-field="name"
        value-field="ability"
        @update:modelValue="changeFilter"
      >
        <b-form-select-option :value="-1"
          >Select an ability to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Name Filter" label-for="filter-input">
      <b-input-group size="sm">
        <b-form-input
          id="filter-input"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
          debounce="1000"
          @update:modelValue="changeFilter"
        ></b-form-input>

        <b-input-group-append>
          <b-button @click="removeFilters">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script setup lang="ts">
import type { League } from "@/types/league";
import type { MonFilterOption } from "@/types/monFilterOption";
import type { Type } from "@pkmn/dex";
import type { Ability, Move } from "@pkmn/dex-types";

import { Dex } from "@pkmn/dex";

const props = defineProps<{
  league: League;
}>();

const emit = defineEmits<{
  (e: "change", filterOptions: MonFilterOption): void;
}>();

const generationDex = computed(() => Dex.forGen(props.league.generation));

const filterMove = ref(-1 as Move | -1);

const filterType1 = ref(-1 as Type | -1);
const filterType2 = ref(-1 as Type | -1);

const filterAbility = ref(-1 as Ability | -1);

const moves = computed(() => {
  return generationDex.value.moves.all().map((move) => {
    return {
      move: move,
      name: move.name,
    };
  });
});

const types = computed(() => {
  return generationDex.value.types.all().map((type) => {
    return {
      type: type,
      name: type.name,
    };
  });
});

const abilities = computed(() => {
  return generationDex.value.abilities.all().map((ability) => {
    return {
      ability: ability,
      name: ability.name,
    };
  });
});

const filter = ref("");

function changeFilter() {
  emit("change", {
    filter: filter.value,
    filterMove: filterMove.value,
    filterType1: filterType1.value,
    filterType2: filterType2.value,
    filterAbility: filterAbility.value,
  });
}

function removeFilters() {
  filter.value = "";
  filterMove.value = -1;
  filterType1.value = -1;
  filterType2.value = -1;
  filterAbility.value = -1;
  changeFilter();
}
</script>
