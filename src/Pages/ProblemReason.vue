<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid class="pa-4">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      show-arrows
      class="custom-tabs"
      grow
    >
      <v-tab value="ManageReason">
        <v-icon start>mdi-head-lightbulb-outline</v-icon>
        Reason
      </v-tab>

      <v-tab value="ManageProblem">
        <v-icon start>mdi-alert</v-icon>
        Problem
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="ManageReason"> <Reason /> </v-window-item>
      <v-window-item value="ManageProblem"> <Problem /> </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import Problem from "./ProblemReason/Problem.vue";
import Reason from "./ProblemReason/Reason.vue";
const tab = ref("ManageReason");
</script>

<style scoped>
.custom-tabs .v-tab {
  background-color: #007fc4;
  color: white;
  transition: background-color 0.3s ease;
  justify-content: center;
  text-align: center;
  height: 48px; /* ปรับความสูงถ้าต้องการ */
}
.custom-tabs .v-tab--selected {
  background-color: #f8c849 !important;
  color: black;
}
</style>
