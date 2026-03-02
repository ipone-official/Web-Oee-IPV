<template>
  <div id="app">
    <!-- anonymous -->
    <template v-if="isAnonymousRoute">
      <router-view />
    </template>

    <!-- protected -->
    <template v-else>
      <v-app>
        <loading v-if="!user.isUserReady" :isLoading="isLoading" />

        <template v-else>
          <page-navigation :isOpen="isDrawerOpen" @close="toggleDrawer" />
          <page-toolbar @toggle-drawer="toggleDrawer" />
          <v-main>
            <page-breadcrumbs v-if="hasBreadcrumbs" :items="route.meta.breadcrumb" />
            <router-view />
          </v-main>
          <page-footer />
        </template>
      </v-app>
    </template>

    <!-- 🔔 Session Expired Dialog -->
    <v-dialog v-model="showDialog" persistent max-width="420">
      <v-card class="rounded-xl elevation-3 pa-4">
        <div class="text-center">
          <v-avatar size="64" class="mx-auto mb-3" color="primary" variant="tonal">
            <v-icon size="36" color="primary"> mdi-lock-clock </v-icon>
          </v-avatar>

          <v-card-title class="text-h6 font-weight-bold justify-center">
            Session Expired
          </v-card-title>

          <v-card-text class="text-body-2 text-medium-emphasis text-center mb-2">
            Your session has expired due to inactivity. Please sign in again to continue
            using the system.
          </v-card-text>

          <v-btn
            color="primary"
            class="mt-3 text-white px-6"
            size="large"
            @click="handleReLogin"
          >
            <v-icon start>mdi-login</v-icon>
            Sign in again
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import eventBus from "@/plugins/eventBus";
import loading from "@/components/Loading.vue";

const route = useRoute();
const router = useRouter();
const user = useUserStore();

const isDrawerOpen = ref(false);
const isLoading = ref(false);
const showDialog = ref(false);

/* ✅ SAFE meta access */
const isAnonymousRoute = computed(() => {
  return route.meta?.allowAnonymous === true;
});

const hasBreadcrumbs = computed(() => {
  return Array.isArray(route.meta?.breadcrumb);
});

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const handleReLogin = () => {
  showDialog.value = false;
  router.replace({ name: "Login" });
};

/* 🔔 EventBus */
const onSessionExpired = () => {
  showDialog.value = true;
};

onMounted(async () => {
  eventBus.on('auth:session-expired', onSessionExpired)

  const isAnonymous = route.meta?.allowAnonymous === true

  // 🕵️ Anonymous → ข้าม auth ทั้งหมด
  if (isAnonymous) {
    return
  }

  // 🔐 Protected → hydrate user
  if (!user.isUserReady) {
    await user.initFromStorage?.()
  }
})

onUnmounted(() => {
  eventBus.off('auth:session-expired', onSessionExpired)
})
</script>

<style>
@font-face {
  font-family: "IBMPlexSansThai";
  src: url("../src/assets/fonts/IBMPlexSansThai-Light.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: "IBMPlexSansThai", sans-serif !important;
}

#app {
  font-family: "IBMPlexSansThai", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body,
#app {
  font-family: "IBMPlexSansThai", sans-serif;
}

.v-snackbar__content {
  color: white !important;
  text-align: center !important; /* จัดข้อความให้อยู่ตรงกลาง */
}

.v-card-title {
  font-family: "IBMPlexSansThai", sans-serif;
}

.swal2-container {
  z-index: 3000 !important;
}

.gradient-toolbar {
  background: linear-gradient(135deg, #6dd5fa, #2980b9, #004e92) !important;
  /* เพิ่มมิติสีฟ้าเข้ม-ฟ้าสดใส-น้ำเงินเข้ม */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* เพิ่มเงาให้ toolbar */
  border-radius: 8px; /* เพิ่มขอบมนให้ดูนุ่มนวล */
  padding: 10px 20px; /* เพิ่ม padding ให้มีพื้นที่รอบๆ ภายใน */
  color: white !important; /* บังคับให้ตัวอักษรสีขาว */
}

.gradient-toolbar-title {
  font-size: 24px; /* ปรับขนาดตัวอักษรของหัวข้อ */
  font-weight: bold; /* เพิ่มความหนาให้ตัวอักษร */
  letter-spacing: 1px; /* เพิ่มระยะห่างระหว่างตัวอักษร */
}

.logo-image {
  max-height: 65px;
  max-width: 65px;
  margin-left: 10px; /* เพิ่ม margin ด้านซ้าย */
  margin-right: 10px; /* เพิ่ม margin ด้านขวา */
}

nav {
  padding: 25px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
