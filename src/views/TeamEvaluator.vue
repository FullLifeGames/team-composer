<template>
  <div>
    <TeamRenderer
      v-if="team.length > 0"
      :evaluation-report="evaluationReport"
      :league="league"
      :loading="false"
      :team="team"
    />
    <b-form-textarea
      class="moreSpace"
      id="textarea"
      v-model="teamDefinition"
      placeholder="Input Showdown Importable"
      rows="3"
    ></b-form-textarea>
    <b-form-select
      class="moreSpace"
      v-model="generation"
      :options="options"
    ></b-form-select>
    <b-button class="moreSpace" @click="evaluate"> Evaluate </b-button>
  </div>
</template>

<script setup lang="ts">
import type { GenerationNum, Species } from "@pkmn/dex";
import { Sets } from "@pkmn/sets";
import type { Ref } from "@vue/composition-api";
import type { EvaluationReport } from "@/util/algorithm";
import { evaluateTeam } from "@/util/algorithm";
import type { League } from "@/types/league";

import { Dex } from "@pkmn/dex";

const currentGen = 8;

const generation = ref(currentGen as GenerationNum);

const options: { value: GenerationNum; text: string }[] = [];

for (let i = 1; i <= currentGen; i++) {
  options.push({ value: i as GenerationNum, text: i + "" });
}

const team: Ref<Species[][]> = ref([]);
const evaluationReport: Ref<EvaluationReport> = ref({ value: 0 });

const teamDefinition = ref("");

const league = ref({
  generation: generation.value,
} as League);

const splitter = 3;

async function evaluate() {
  const sets = teamDefinition.value.split("\n\n");
  const dex = Dex.forGen(generation.value);
  team.value = [];
  for (let i = 0; i < sets.length; i++) {
    if (i % 3 == 0) {
      team.value.push([]);
    }
    if (sets[i].trim() !== "") {
      const setObj = Sets.importSet(sets[i]);
      team.value[team.value.length - 1].push(dex.species.get(setObj.species));
    }
  }
  evaluationReport.value = await evaluateTeam(team.value, generation.value);
}
</script>

<style scoped>
.moreSpace {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
