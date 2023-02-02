<template>
  <div>
    <div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-normal">Team Composer</h1>
        <br />
        <p class="fs-4">Generate, Manage or Evaluate Draft League Teams</p>
        <p>
          The first page load might take a while, afterwards the Pokémon data
          should have been cached by your browser!
        </p>
        <div class="buttonRow">
          <router-link v-slot="{ href, isExactActive }" to="/generator" custom>
            <b-button :href="href" :active="isExactActive"
              >Team Generator</b-button
            >
          </router-link>
          <router-link v-slot="{ href, isExactActive }" to="/mon-filter" custom>
            <b-button :href="href" :active="isExactActive"
              >Pokémon Filter</b-button
            >
          </router-link>
          <router-link
            v-slot="{ href, isExactActive }"
            to="/team-evaluator"
            custom
          >
            <b-button :href="href" :active="isExactActive"
              >Team Evaluator</b-button
            >
          </router-link>
          <router-link
            v-slot="{ href, isExactActive }"
            to="/draft-league-application"
            custom
          >
            <b-button :href="href" :active="isExactActive"
              >Draft League Application</b-button
            >
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buttonRow {
  margin-top: 1rem;
}
.buttonRow :deep(a) {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
}
</style>
