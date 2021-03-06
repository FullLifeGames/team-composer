<template>
  <div>
    <b-form-group label="Move" label-for="move-input">
      <b-form-select
        id="move-input"
        v-model="filterMove"
        :options="moves"
        @change="changeFilter"
        text-field="name"
        value-field="move"
      >
        <b-form-select-option :value="null"
          >Select a move to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Type 1" label-for="type1-input">
      <b-form-select
        id="type1-input"
        v-model="filterType1"
        :options="types"
        @change="changeFilter"
        text-field="name"
        value-field="type"
      >
        <b-form-select-option :value="null"
          >Select a type to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Type 2" label-for="type2-input">
      <b-form-select
        id="type2-input"
        v-model="filterType2"
        :options="types"
        @change="changeFilter"
        text-field="name"
        value-field="type"
      >
        <b-form-select-option :value="null"
          >Select a type to filter</b-form-select-option
        >
      </b-form-select>
    </b-form-group>
    <b-form-group label="Ability" label-for="ability-input">
      <b-form-select
        id="ability-input"
        v-model="filterAbility"
        :options="abilities"
        @change="changeFilter"
        text-field="name"
        value-field="ability"
      >
        <b-form-select-option :value="null"
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
          @change="changeFilter"
          debounce="1000"
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

const filterMove = ref(null as Move | null);

const filterType1 = ref(null as Type | null);
const filterType2 = ref(null as Type | null);

const filterAbility = ref(null as Ability | null);

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
  filterMove.value = null;
  filterType1.value = null;
  filterType2.value = null;
  filterAbility.value = null;
  changeFilter();
}
</script>
