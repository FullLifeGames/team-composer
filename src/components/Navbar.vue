<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <router-link to="/" custom v-slot="{ href }">
        <b-navbar-brand :href="href">Team Composer</b-navbar-brand>
      </router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link to="/" custom v-slot="{ href }">
            <b-nav-item :href="href">Home</b-nav-item>
          </router-link>
          <router-link to="/team-evaluator" custom v-slot="{ href }">
            <b-nav-item :href="href">Team Evaluator</b-nav-item>
          </router-link>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
