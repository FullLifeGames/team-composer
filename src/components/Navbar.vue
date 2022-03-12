<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <router-link to="/" custom v-slot="{ href }">
        <b-navbar-brand :href="href">Team Composer</b-navbar-brand>
      </router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link to="/" custom v-slot="{ href, isExactActive }">
            <b-nav-item :href="href" :active="isExactActive"
              >Team Generator</b-nav-item
            >
          </router-link>
          <router-link to="/mon-filter" custom v-slot="{ href, isExactActive }">
            <b-nav-item :href="href" :active="isExactActive"
              >Pokémon Filter</b-nav-item
            >
          </router-link>
          <router-link
            to="/team-evaluator"
            custom
            v-slot="{ href, isExactActive }"
          >
            <b-nav-item :href="href" :active="isExactActive"
              >Team Evaluator</b-nav-item
            >
          </router-link>
          <router-link
            to="/draft-league-application"
            custom
            v-slot="{ href, isExactActive }"
          >
            <b-nav-item :href="href" :active="isExactActive"
              >Draft League Application</b-nav-item
            >
          </router-link>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto navbarImage">
          <b-nav-item href="https://www.youtube.com/user/FullLifeGames"
            ><BIconYoutube
          /></b-nav-item>
          <b-nav-item href="https://twitter.com/fulllifegames"
            ><BIconTwitter
          /></b-nav-item>
          <b-nav-item href="https://github.com/FullLifeGames/team-composer"
            ><BIconGithub
          /></b-nav-item>
          <b-nav-item href="https://fulllifegames.com"
            ><img
              class="img-fluid img-profile rounded-circle mx-auto mb-2 navbarImage"
              src="https://fulllifegames.com/img/profile.jpg"
              alt=""
          /></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<style scoped>
.navbarImage {
  height: 40px;
}
.navbarImage >>> img {
  margin-top: -8px;
}
</style>
