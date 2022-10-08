<template>
  <div id="app">
    <NavbarHeader />
    <ProgressBar />
    <b-container class="text-center team-container">
      <RouterView />
    </b-container>
  </div>
</template>

<style scoped>
.team-container {
  margin-top: 0.5rem;
}
</style>
