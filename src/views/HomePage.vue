<template>
  <div>
    <b-jumbotron
      header="Team Composer"
      lead="Generate, Manage or Evaluate Draft League Teams"
    >
      <div class="buttonRow">
        <router-link to="/generator" custom v-slot="{ href, isExactActive }">
          <b-button :href="href" :active="isExactActive"
            >Team Generator</b-button
          >
        </router-link>
        <router-link to="/mon-filter" custom v-slot="{ href, isExactActive }">
          <b-button :href="href" :active="isExactActive"
            >Pokémon Filter</b-button
          >
        </router-link>
        <router-link
          to="/team-evaluator"
          custom
          v-slot="{ href, isExactActive }"
        >
          <b-button :href="href" :active="isExactActive"
            >Team Evaluator</b-button
          >
        </router-link>
        <router-link
          to="/draft-league-application"
          custom
          v-slot="{ href, isExactActive }"
        >
          <b-button :href="href" :active="isExactActive"
            >Draft League Application</b-button
          >
        </router-link>
      </div>
    </b-jumbotron>
  </div>
</template>

<style scoped>
.buttonRow {
  margin-top: 1rem;
}
.buttonRow >>> a {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
}
</style>
