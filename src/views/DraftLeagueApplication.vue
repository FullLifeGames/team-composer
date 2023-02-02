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

    <div class="mb-3">
      <label for="formFile" class="form-label">Choose a file</label>
      <input
        id="formFile"
        class="form-control"
        type="file"
        accept=".csv"
        @change="validateFile"
      />
    </div>

    <br />

    <p v-if="report">{{ report }}</p>
  </div>
</template>

<script setup lang="ts">
import { parseString, stringsToSpecies } from "@/util/parsingLogic";
import { rawCSVToMonsList } from "@/util/parsingLogic";
import { GenerationNum } from "@pkmn/dex";

const report = ref("");

const currentGeneration = ref(9 as GenerationNum);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateFile = (event: any) => {
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
  reader.readAsText(event.target.files[0]);
};
</script>

<style scoped></style>
