<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid class="pa-4">
    <v-row dense align="center" class="filter-row">
      <v-spacer></v-spacer>
      <v-col cols="12" sm="8" md="8" class="filter-col">
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
      item-value="reviewID"
      :items-per-page="10"
      :items-per-page-options="[10, 30, 100, 200]"
    >
      <template v-slot:top>
        <v-toolbar flat class="custom-toolbar">
          <v-toolbar-title class="centered-title">Reason Master</v-toolbar-title>
          <v-tooltip text="Refresh" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="fetchReason">
                <v-icon color="white">mdi-refresh</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
      </template>

      <template v-slot:item.reasonDescID="{ item }">
        <div
          class="flex items-center gap-2 justify-start text-start"
          style="color: #007fc4; font-weight: bold; cursor: pointer"
          @click="editItem(item)"
        >
          {{ item.reasonDescID }}
        </div>
      </template>
      <template v-slot:item.reasonDesc="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.reasonDesc }}
        </div>
      </template>
      <template v-slot:item.displayDamageStatus="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.displayDamageStatus }}
        </div>
      </template>
      <template v-slot:item.displayStatus="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.displayStatus }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip
          text="แก้ไขและดูรายละเอียด"
          location="bottom"
          color="primary"
          text-color="white"
        >
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" @click="editItem(item)">
              <v-icon color="primary">mdi-head-lightbulb-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="ลบรายการ" location="bottom" color="red" text-color="white">
          <template v-if="item.isDeletable == 'Y'" v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" @click="deleteItem(item)">
              <v-icon color="red">mdi-delete-outline</v-icon>
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
        @click="createdReason"
      >
        <v-icon left>mdi-plus</v-icon> Add
      </v-btn>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="70%">
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title"
            >✨ {{ createMode ? "Add Reason" : "Edit Reason" }} ✨</span
          >
          <v-btn icon @click="resetForm" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- Form Content -->

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  v-model="mReasonDesc"
                  outlined
                  dense
                  prepend-inner-icon="mdi-human-edit"
                  variant="outlined"
                  density="compact"
                  clearable
                  class="search-bar input-field"
                  maxlength="255"
                  rows="2"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Reason Description
                  </template>
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  v-model="mDamageStatus"
                  :items="iDamageStatus"
                  item-title="text"
                  item-value="key"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  hide-details
                  return-object
                  :color="'primary'"
                  active-class="custom-active-class"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Damage Status
                  </template></v-autocomplete
                >
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  v-model="mStatus"
                  :items="iStatus"
                  item-title="text"
                  item-value="key"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  hide-details
                  return-object
                  :color="'primary'"
                  active-class="custom-active-class"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Status
                  </template></v-autocomplete
                >
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
import { gReasonMaster, iReasonMaster, dReasonMaster } from "@/services/apiOee";
import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";

const userStore = useUserStore();

const headers = [
  { title: "Reason ID", align: "start", key: "reasonDescID" },
  { title: "Reason Desc.", align: "start", key: "reasonDesc" },
  { title: "Damage Status", align: "start", key: "displayDamageStatus" },
  { title: "Status", align: "start", key: "displayStatus" },
  { title: "Actions", align: "center", key: "actions" },
];

const mReasonID = ref("");
const isLoading = ref(false);
const mReasonDesc = ref("");
const mSearch = ref("");
const rawReservations = ref([]);
const createMode = ref(false);
const dialog = ref(false);
const mDamageStatus = ref(null);
const iDamageStatus = ref([
  {
    key: "Y",
    text: "Damage",
  },
  {
    key: "N",
    text: "No Damage",
  },
]);
const mStatus = ref({
  key: "Y",
  text: "Active",
});
const iStatus = ref([
  {
    key: "Y",
    text: "Active",
  },
  {
    key: "N",
    text: "InActive",
  },
]);
const createdReason = () => {
  resetForm();
  dialog.value = true;
  createMode.value = true;
};

const resetForm = () => {
  dialog.value = false;
  createMode.value = false;
  mReasonDesc.value = "";
  mReasonID.value = "";
  mDamageStatus.value = null;
  mStatus.value = {
    key: "Y",
    text: "Active",
  };
};

const editItem = (item) => {
  resetForm();
  dialog.value = true;
  mReasonID.value = item.reasonDescID;
  mReasonDesc.value = item.reasonDesc;
  mDamageStatus.value = {
    key: item.damageStatus,
    text: item.damageStatus == "Y" ? "Damage" : "No Damage",
  };
  mStatus.value = {
    key: item.status,
    text: item.status == "Y" ? "Active" : "InActive",
  };
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
  if (!mReasonDesc.value) {
    return showSnackbars("Please input reason description.");
  }
  if (!mDamageStatus.value) {
    return showSnackbars("Please select damage status.");
  }

  isLoading.value = true;

  const data = {
    reasonDescID: mReasonID.value || "",
    reasonDesc: mReasonDesc.value || "",
    damageStatus: mDamageStatus.value.key,
    status: mStatus.value.key,
    empBy: userStore.empId,
  };

  dialog.value = false;
  try {
    await iReasonMaster(data);
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
        fetchReason();
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

const filteredReservations = computed(() => {
  let items = rawReservations.value;
  return items;
});

const deleteItem = async (item) => {
  Swal.fire({
    html: `Would you like to delete item  <br/> Reason ID :<strong>  ${item.reasonDescID}</strong> <br/> Reason Desc. :<strong>  ${item.reasonDesc}</strong> ?`,
    icon: "warning",
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonText: "OK",
    didOpen: () => {
      document.querySelector(".swal2-confirm").style.color = "white";
      document.querySelector(".swal2-cancel").style.color = "white";
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      isLoading.value = true;
      try {
        const init = {
          reasonDescID: item.reasonDescID,
        };
        await dReasonMaster(init);
        Swal.fire({
          title: "Successfully 🎉",
          icon: "success",
          confirmButtonText: "OK",
          didOpen: () => {
            document.querySelector(".swal2-confirm").style.color = "white";
          },
        }).then((result) => {
          if (result.isConfirmed) {
            resetForm();
            fetchReason();
          }
        });
      } catch (e) {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ลบรายการไม่สำเร็จ กรุณาลองใหม่",
          confirmButtonColor: "#007fc4",
          didOpen: () => {
            document.querySelector(".swal2-confirm").style.color = "white";
          },
        });
      } finally {
        isLoading.value = false;
      }
    }
  });
};

const fetchReason = async () => {
  isLoading.value = true;
  try {
    const response = await gReasonMaster();
    rawReservations.value = response.results.map((item) => ({
      ...item,
      displayDamageStatus: item.damageStatus == "Y" ? "Damage" : "No Damage",
      displayStatus: item.status == "Y" ? "Active" : "InActive",
    }));
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  fetchReason();
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
