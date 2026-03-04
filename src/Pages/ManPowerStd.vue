<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid class="pa-4">
    <v-row dense align="center" class="filter-row">
      <v-col cols="12" sm="3" md="3" class="filter-col mb-3">
        <v-autocomplete
          v-model="mFilterProcess"
          :items="iFilterProcess"
          label="Line Process"
          item-title="display"
          item-value="key"
          outlined
          dense
          class="filter-select input-field custom-autocomplete"
          return-object
          multiple
          :color="'primary'"
          active-class="custom-active-class"
          clearable
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="8" md="8" class="filter-col mb-3">
        <v-text-field
          v-model="mSearch"
          label="Search"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          class="search-bar input-field"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <!-- ตารางข้อมูล -->
    <v-data-table
      :headers="headers"
      :items="filteredReservations"
      :search="mSearch"
      class="data-table"
      dense
      rounded
      item-value="lineProcessID"
      :items-per-page="10"
      :items-per-page-options="[10, 30, 100, 200]"
    >
      <template v-slot:top>
        <v-toolbar flat class="custom-toolbar">
          <v-toolbar-title class="centered-title">Man Power Std.</v-toolbar-title>
          <v-tooltip text="Refresh" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="fetchManPowerStd">
                <v-icon color="white">mdi-refresh</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
      </template>

      <template v-slot:item.lineProcessID="{ item }">
        <div
          class="flex items-center gap-2 justify-start text-start"
          style="color: #007fc4; font-weight: bold; cursor: pointer"
          @click="editItem(item)"
        >
          {{ item.lineProcessID }}
        </div>
      </template>
      <template v-slot:item.lineProcessName="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.lineProcessName }}
        </div>
      </template>
      <template v-slot:item.manPowerSTD="{ item }">
        <div class="flex items-center gap-2 justify-end text-end">
          {{ Number(item.manPowerSTD).toLocaleString() }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip
          text="Edit & View Details"
          location="bottom"
          color="primary"
          text-color="white"
        >
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" @click="editItem(item)">
              <v-icon color="primary">mdi-human-edit</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row class="d-flex justify-center">
      <v-btn
        color="primary"
        large
        elevation="6"
        class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
        @click="createdManPower"
      >
        <v-icon left>mdi-plus</v-icon> Add
      </v-btn>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="60%">
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title"
            >✨ {{ createMode ? "Add Man Power Std." : "Edit Man Power Std." }} ✨</span
          >
          <v-btn icon @click="resetForm" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- Form Content -->

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6" md="5">
                <v-autocomplete
                  v-model="mLineProcess"
                  :items="iLineProcess"
                  :readonly="!createMode"
                  item-title="lineProcessName"
                  item-value="lineProcessID"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  hide-details
                  return-object
                  :color="'primary'"
                  active-class="custom-active-class"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Line Process
                  </template></v-autocomplete
                >
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="displayManPower"
                  outlined
                  dense
                  prepend-inner-icon="mdi-human-edit"
                  variant="outlined"
                  density="compact"
                  clearable
                  @input="formatInput"
                  class="search-bar input-field"
                  maxlength="4"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Man power std.
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-row class="d-flex justify-center">
            <v-btn
              color="success"
              large
              elevation="6"
              class="rounded-xl text-white font-weight-bold px-8 py-2 transition mt-5"
              @click="submitForm"
            >
              <v-icon left>mdi-check-circle-outline</v-icon> Save
            </v-btn>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red-darken-1"
            variant="flat"
            class="rounded-pill"
            @click="dialog = false"
          >
            <v-icon start>mdi-close</v-icon> Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      :color="snackbarColor"
      rounded="pill"
      class="text-center"
    >
      {{ msgSnackbar }}
    </v-snackbar>

    <loading :isLoading="isLoading" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import loading from "@/components/Loading.vue";
import { gLineProcess, gManPowerStd, pManPowerStd } from "@/services/apiOee";
import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";

const userStore = useUserStore();

const headers = [
  { title: "Line Process ID", align: "start", key: "lineProcessID" },
  { title: "Line Process Name", align: "start", key: "lineProcessName" },
  { title: "Man Power STD.", align: "end", key: "manPowerSTD" },
  { title: "Actions", align: "center", key: "actions" },
];

const isLoading = ref(false);
const iLineProcess = ref([]);
const mLineProcess = ref(null);
const mManPower = ref("");
const displayManPower = ref("");
const mSearch = ref("");
const mFilterProcess = ref(null);
const rawReservations = ref([]);
const createMode = ref(false);
const dialog = ref(false);

const formatInput = () => {
  // ลบ comma ออกจากค่าที่ user พิมพ์
  const raw = displayManPower.value.replace(/,/g, "");

  // เก็บค่าแบบไม่มี comma ไว้ใน v-model จริง
  mManPower.value = raw;

  // แสดงแบบมี comma
  if (!isNaN(raw) && raw !== "") {
    displayManPower.value = Number(raw).toLocaleString();
  }
};

const createdManPower = () => {
  resetForm();
  dialog.value = true;
  createMode.value = true;
};

const resetForm = () => {
  dialog.value = false;
  createMode.value = false;
  mManPower.value = "";
  displayManPower.value = "";
  mLineProcess.value = [];
};

const editItem = (item) => {
  resetForm();
  dialog.value = true;
  mLineProcess.value = [
    {
      lineProcessID: item.lineProcessID,
      lineProcessName: item.lineProcessName,
    },
  ];
  displayManPower.value = item.manPowerSTD;
  mManPower.value = item.manPowerSTD.toString();
};
const showSnackbar = ref(false);
const msgSnackbar = ref("");
const snackbarColor = ref("success");

const showSnackbars = (message, color = "yellow") => {
  msgSnackbar.value = message;
  snackbarColor.value = color;
  showSnackbar.value = true;
};

const submitForm = async () => {
  if (mLineProcess.value.length == 0) {
    return showSnackbars("Please input line process");
  }
  if (!mManPower.value) {
    return showSnackbars("Please input man power standard");
  }
  isLoading.value = true;

  const data = {
    lineProcessID: mLineProcess.value?.[0]?.lineProcessID || null,
    manPowerStd: Number(mManPower.value),
    updatedBy: userStore.empId,
  };

  dialog.value = false;
  try {
    await pManPowerStd(data);
    Swal.fire({
      icon: "success",
      title: "Successfully 🎉",
      confirmButtonText: "OK",
      confirmButtonColor: "#007fc4",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        resetForm();
        fetchManPowerStd();
      }
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "บันทึกรายการไม่สำเร็จ กรุณาลองใหม่",
      confirmButtonColor: "#007fc4",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    }).then(() => {
      dialog.value = true;
    });
  } finally {
    isLoading.value = false;
  }
};
const iFilterProcess = computed(() => {
  const mapped = rawReservations.value.map((item) => ({
    key: item.lineProcessID,
    display: `${item.lineProcessName}`,
  }));

  // กรองซ้ำด้วย Map
  return [...new Map(mapped.map((item) => [item.key, item])).values()];
});

const filteredReservations = computed(() => {
  let items = rawReservations.value;

  if (mFilterProcess.value && mFilterProcess.value.length > 0) {
    const filterKeys = mFilterProcess.value.map((a) => a.key);
    items = items.filter((i) => filterKeys.includes(i.lineProcessID));
  }

  return items;
});

const fetchManPowerStd = async () => {
  isLoading.value = true;
  try {
    const response = await gManPowerStd();
    rawReservations.value = response.results.map((item) => ({
      ...item,
    }));
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchMasterLineProcess = async () => {
  isLoading.value = true;

  try {
    const { results } = await gLineProcess();
    iLineProcess.value = [...results];
  } catch (err) {
    console.error("❌ Error while loading Line Process:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  fetchManPowerStd();
  fetchMasterLineProcess();
});
</script>

<style scoped>
.custom-toolbar {
  background: linear-gradient(
    360deg,
    rgba(255, 219, 122, 1) 0%,
    rgba(248, 200, 73, 1) 35%,
    rgba(240, 176, 6, 1) 100%
  ) !important;
  border-radius: 10px 10px 0px 0px !important;
}
/* Center the title */
::v-deep(.centered-title) {
  flex: 1; /* ใช้ flex เต็มพื้นที่ */
  text-align: center;
  font-weight: bold;
  color: #1e1e1e;
}

@media (min-width: 600px) {
  .filter-row {
    gap: 16px;
  }
  .filter-col {
    margin-bottom: 8px;
  }
}
.input-field {
  margin-bottom: -10px;
  color: #007fc4 !important;
}
@media (min-width: 960px) {
  .filter-row {
    gap: 24px;
  }
  .filter-col {
    margin-bottom: 0;
  }
  .input-field {
    margin-bottom: -10px;
    color: #007fc4 !important;
  }
}

/* Table Styles */
.data-table {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-table .v-data-table-header th {
  background: linear-gradient(90deg, #007fc4, #005f9c);
  color: white;
  font-weight: bold;
  text-align: left;
}

::v-deep(.v-data-table__th) {
  background: linear-gradient(
    90deg,
    rgba(0, 127, 196, 1) 0%,
    rgba(0, 127, 196, 1) 35%,
    rgba(0, 127, 196, 1) 100%
  ) !important;
  color: white !important;
}

/* Dialog Card Styles */
.dialog-card {
  border-radius: 24px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  animation: fadeIn 0.5s ease-in-out;
  overflow: hidden; /* ป้องกันส่วนที่เกินจาก Header */
  position: relative; /* สำหรับปุ่ม Close */
  max-height: 100vh;
  overflow-y: auto;
}

/* Header */
.dialog-header {
  background: linear-gradient(90deg, #007fc4, #005f9c);
  color: white;
  padding: 16px;
  font-size: 1.4rem;
  font-weight: bold;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  color: #007fc4;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  z-index: 10;
}
.close-btn:hover {
  background-color: #f8c849;
  color: white !important;
}
</style>
