<template>
  <div>
    <p class="h1">Application Notice</p>
    <hr />
    <p>
      If you are running a draft league, you can contact
      <a href="mailto:bene@fulllifegames.com">bene@fulllifegames.com</a> to add
      your league into this website.
    </p>
    <p>
      The application should contain a working English or German CSV file, the
      targeted generation, the pick requirements (e.g. 2 S, 2 A, 3 B, 2 C and 2
      D) and the name of your draft league.
    </p>
    <p>
      Please make sure that in your CSV the rows are divided by one line break
      ("\n") and the columns by two tabs ("\t\t").
    </p>
    <p>
      Down below there is an upload form for you to upload your CSV and test if
      the submission will work. Only working submissions will be accepted!
    </p>

    <br />

    <b-form-file
      v-model="file1"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept=".csv"
    ></b-form-file>

    <br />

    <p v-if="file1 !== null">{{ report }}</p>
  </div>
</template>

<script setup lang="ts">
import { parseString, stringsToSpecies } from "@/util/parsingLogic";
import { rawCSVToMonsList } from "@/util/parsingLogic";
import { GenerationNum } from "@pkmn/dex";

const file1 = ref(null as null | Blob);
const report = ref("");

const currentGeneration = ref(8 as GenerationNum);

watch(file1, () => {
  if (file1.value !== null) {
    const reader = new FileReader();
    reader.addEventListener("load", async (event) => {
      if (event && event.target) {
        try {
          const csvData = event.target.result as string;
          try {
            const mons = rawCSVToMonsList(csvData);
            stringsToSpecies(currentGeneration.value, mons);
          } catch {
            const result = await parseString(csvData);
            stringsToSpecies(currentGeneration.value, result);
          }
          report.value = "Works!";
        } catch (e) {
          report.value = "Broken: " + String(e);
        }
      }
    });
    reader.readAsText(file1.value);
  }
});
</script>

<style scoped></style>
