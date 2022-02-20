<template>
  <div>
    <b-spinner label="Loading..." v-if="loading"></b-spinner>
    <b-row
      align-v="center"
      align-h="center"
      style="width: 100%"
      class="justify-content-md-center"
      v-else
    >
      <b-col align-self="center" cols="8">
        <div v-for="(line, key) of props.team" :key="key">
          <b-row align-h="center" class="smallBottom">
            <b-col v-for="mon of line" :key="mon.num" align-self="center">
              <MonRenderer :generation="props.generation" :mon="mon" />
            </b-col>
          </b-row>
          <b-row class="smallBottom">
            <b-col v-for="mon of line" :key="mon.num">
              <p>{{ mon.name }}</p>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col class="smallBottom" align-self="center" col>
        <b-list-group>
          <b-list-group-item
            >Value: {{ props.evaluationReport.value }}</b-list-group-item
          >
          <b-list-group-item
            >Rocker: {{ props.evaluationReport.rocker }}</b-list-group-item
          >
          <b-list-group-item
            >Hazard Removals:
            {{ props.evaluationReport.hazardRemovals }}</b-list-group-item
          >
          <b-list-group-item
            >Other Hazards:
            {{ props.evaluationReport.otherHazards }}</b-list-group-item
          >
          <b-list-group-item
            >Stat Value:
            {{ props.evaluationReport.statValue }}</b-list-group-item
          >
          <b-list-group-item
            >Type Matchup Value:
            {{ props.evaluationReport.typeMatchupValue }}</b-list-group-item
          >
          <b-list-group-item
            >Own Type Value:
            {{ props.evaluationReport.ownTypesCovered }}</b-list-group-item
          >
          <b-list-group-item
            >Momentum User:
            {{ props.evaluationReport.momentumUser }}</b-list-group-item
          >
        </b-list-group>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import type { GenerationNum, Species } from "@pkmn/dex";
import type { EvaluationReport } from "@/util/algorithm";
const props = defineProps<{
  evaluationReport: EvaluationReport;
  generation: GenerationNum;
  team: Species[][];
  loading: boolean;
}>();
</script>

<style scoped>
.smallBottom {
  margin-bottom: 0.75rem;
}
</style>
