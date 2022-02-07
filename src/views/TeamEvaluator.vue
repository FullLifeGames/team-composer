<template>
  <div>
    <TeamRenderer
      v-if="team.length > 0"
      :evaluation-report="evaluationReport"
      :generation="generation"
      :team="team"
    />
    <b-form-textarea
      id="textarea"
      v-model="teamDefinition"
      placeholder="Input Showdown Importable"
      rows="3"
    ></b-form-textarea>
    <b-form-select v-model="generation" :options="options"></b-form-select>
    <b-button @click="evaluate"> Evaluate </b-button>
  </div>
</template>

<script setup lang="ts">
import { Dex, GenerationNum, Species } from "@pkmn/dex";
import { Sets } from "@pkmn/sets";
import type { Ref } from "@vue/composition-api";
import type { EvaluationReport } from "@/util/algorithm";
import { evaluateTeam } from "@/util/algorithm";

const currentGen = 8;

const generation = ref(currentGen as GenerationNum);

const options: { value: GenerationNum; text: string }[] = [];

for (let i = 1; i <= currentGen; i++) {
  options.push({ value: i as GenerationNum, text: i + "" });
}

const team: Ref<Species[][]> = ref([]);
const evaluationReport: Ref<EvaluationReport> = ref({ value: 0 });

const teamDefinition = ref("");

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
