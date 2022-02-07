<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <img
      :src="sprite.url"
      :width="sprite.w"
      :height="sprite.h"
      :style="
        pixelatedUsed && sprite.pixelated ? 'imageRendering: pixelated;' : ''
      "
    />
  </div>
</template>

<script setup lang="ts">
import type { GenerationNum, Species } from "@pkmn/dex";
import { Sprites } from "@pkmn/img";
const props = defineProps<{
  generation: GenerationNum;
  mon: Species;
}>();
const pixelatedUsed = false;
const sprite = computed(() => {
  return Sprites.getPokemon(props.mon.name, {
    gen: props.generation,
    shiny: Math.random() * 4096 < 1,
  });
});
</script>
