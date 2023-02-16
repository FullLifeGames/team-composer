<template>
  <div>
    <b-navbar toggleable="lg" :dark="true" type="dark" variant="dark">
      <router-link v-slot="{ href }" to="/" custom>
        <b-navbar-brand :href="href">Team Composer</b-navbar-brand>
      </router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link v-slot="{ href, isExactActive }" to="/generator" custom>
            <b-nav-item :href="href" :active="isExactActive"
              >Team Generator</b-nav-item
            >
          </router-link>
          <router-link v-slot="{ href, isExactActive }" to="/mon-filter" custom>
            <b-nav-item :href="href" :active="isExactActive"
              >Pokémon Filter</b-nav-item
            >
          </router-link>
          <router-link
            v-slot="{ href, isExactActive }"
            to="/team-evaluator"
            custom
          >
            <b-nav-item :href="href" :active="isExactActive"
              >Team Evaluator</b-nav-item
            >
          </router-link>
          <router-link
            v-slot="{ href, isExactActive }"
            to="/draft-league-application"
            custom
          >
            <b-nav-item :href="href" :active="isExactActive"
              >Draft League Application</b-nav-item
            >
          </router-link>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ms-auto navbarImage">
          <b-nav-item href="https://www.youtube.com/user/FullLifeGames"
            ><i-bi-youtube
          /></b-nav-item>
          <b-nav-item href="https://twitter.com/fulllifegames"
            ><i-bi-twitter
          /></b-nav-item>
          <b-nav-item href="https://github.com/FullLifeGames/team-composer"
            ><i-bi-github
          /></b-nav-item>
          <li class="nav-item">
            <form
              action="https://www.paypal.com/donate"
              method="post"
              target="_top"
            >
              <input
                type="hidden"
                name="hosted_button_id"
                value="LSAEWSQK7NJBJ"
              />
              <a
                class="nav-link"
                href="javascript:;"
                onclick="parentNode.submit();"
              >
                <i-bi-paypal />
              </a>
            </form>
          </li>
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
.navbarImage :deep(img) {
  margin-top: -8px;
}
</style>
