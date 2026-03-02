<template>
  <loading :isLoading="isLoading" />

  <!-- Loading state -->
  <v-container v-if="isLoading" fluid class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-skeleton-loader type="image, article" class="rounded-2xl" />
      </v-col>
    </v-row>
  </v-container>

  <!-- Show report -->
  <v-container v-else fluid class="py-6">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-alert
          v-if="!hasReport"
          type="info"
          variant="tonal"
          border="start"
          class="mb-4"
        >
          No report link to display.
        </v-alert>

        <v-card
          v-if="hasReport"
          ref="cardRef"
          class="rounded-2xl overflow-hidden"
          elevation="6"
          :class="{ 'is-fullscreen': isFullscreen }"
        >
          <v-toolbar density="comfortable" color="primary" class="text-white">
            <v-btn icon @click="openNewTab" title="openNewTab">
              <v-icon>mdi-cloud-sync-outline</v-icon>
            </v-btn>
            <v-spacer />
            <v-toolbar-title
              class="font-weight-medium text-center"
              style="flex: 0 1 auto; min-width: 0"
            >
              Report Viewer
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="reload" title="Reload">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="toggleFullscreen"
              :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
            >
              <v-icon>{{
                isFullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"
              }}</v-icon>
            </v-btn>
          </v-toolbar>

          <v-progress-linear
            v-if="isLoadingIframe"
            indeterminate
            color="primary"
            height="3"
          />

          <!-- Responsive iframe without scrollbars -->
          <div class="iframe-wrapper" :class="{ fullscreen: isFullscreen }">
            <iframe
              :src="srcReport?.rUrl"
              ref="iframeEl"
              class="report-iframe"
              loading="lazy"
              allowfullscreen
              @load="isLoadingIframe = false"
            ></iframe>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import loading from "@/components/Loading.vue";
import { ref, onMounted, computed, nextTick } from "vue";

const isLoading = ref(false);
const isLoadingIframe = ref(true);
const isFullscreen = ref(false);

const srcReport = ref(null);
const iframeEl = ref(null);
const cardRef = ref(null);

const hasReport = computed(() => !!srcReport.value?.rUrl);

const fetchReport = async () => {
  isLoading.value = true;
  isLoadingIframe.value = true;
  try {
    srcReport.value = {
      rUrl:
        "https://app.powerbi.com/view?r=eyJrIjoiZGI0MWJhYWUtOTUyNy00ODhlLWI0ZWUtMmJjYjRmNDczNmRmIiwidCI6IjQwODIyY2I0LTJmOWEtNDM4ZS1iODAzLWZlZjZhNzJkNGQyZCIsImMiOjEwfQ%3D%3D",
    };
  } catch (error) {
    console.error("An error occurred while loading data:", error);
  } finally {
    isLoading.value = false;
  }
};

const reload = () => {
  if (!hasReport.value) return;
  isLoadingIframe.value = true;
  try {
    const url = new URL(srcReport.value.rUrl);
    url.searchParams.set("_", Date.now().toString());
    srcReport.value = { ...srcReport.value, rUrl: url.toString() };
  } catch {
    // fallback: reload as empty first then set back to force reload
    const current = srcReport.value.rUrl;
    srcReport.value = { ...srcReport.value, rUrl: "" };
    requestAnimationFrame(() => {
      srcReport.value = { ...srcReport.value, rUrl: current };
    });
  }
};
const openNewTab = () => {
  window.open(
    "https://iphouses.sharepoint.com/:x:/r/sites/oee/_layouts/15/Doc.aspx?sourcedoc=%7B65F8340A-11F2-4851-B75B-03BFD7E86E1A%7D&file=TargetLineProcess%20-%20(Vietnam).xlsx&action=default&mobileredirect=true",
    "_blank"
  );
};
const toggleFullscreen = async () => {
  isFullscreen.value = !isFullscreen.value;
  await nextTick();
  // Optional: Focus iframe when entering fullscreen
  if (isFullscreen.value && iframeEl.value) {
    iframeEl.value.focus();
  }
};

onMounted(fetchReport);
</script>

<style scoped>
/* Fullscreen mode for card & iframe */
.is-fullscreen {
  position: fixed !important;
  inset: 0 !important;
  z-index: 9999 !important;
  margin: 0 !important;
  border-radius: 0 !important;
  background: #fff !important;
  box-shadow: none !important;
}

/* Responsive wrapper */
.iframe-wrapper {
  width: 100%;
  height: 80vh;
  background: #f8fafc;
  overflow: hidden;
}
.iframe-wrapper.fullscreen {
  width: 100vw !important;
  height: calc(100vh - 56px) !important; /* minus toolbar */
  max-height: 100vh !important;
}
.report-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  overflow: hidden; /* Hide scrollbars inside iframe (but: iframe content itself must not overflow for this to be perfect) */
}
/* Hide outer body scroll in fullscreen */
.is-fullscreen body,
.is-fullscreen html {
  overflow: hidden !important;
}
</style>
