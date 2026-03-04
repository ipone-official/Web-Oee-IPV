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
      item-value="reviewID"
      :items-per-page="10"
      :items-per-page-options="[10, 30, 100, 200]"
    >
      <template v-slot:top>
        <v-toolbar flat class="custom-toolbar">
          <v-toolbar-title class="centered-title">Complains</v-toolbar-title>
          <v-tooltip text="Refresh" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="fetchComplains">
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
      <template v-slot:item.materialCode="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.materialCode }}
        </div>
      </template>
      <template v-slot:item.materialDescriptionEN="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.materialDescriptionEN }}
        </div>
      </template>
      <template v-slot:item.displayStatus="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.displayStatus }}
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
              <v-icon color="primary">mdi-message-alert-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Delete Item" location="bottom" color="red" text-color="white">
          <template v-slot:activator="{ props }">
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
        @click="createdComplains"
      >
        <v-icon left>mdi-plus</v-icon> Add
      </v-btn>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title"
            >✨ {{ createMode ? "Add Complains" : "Edit Complains" }} ✨</span
          >
          <v-btn icon @click="resetForm" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- Form Content -->

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6" md="4">
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
                  multiple
                  :color="'primary'"
                  active-class="custom-active-class"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Line Process
                  </template></v-autocomplete
                >
              </v-col>
              <v-col cols="12" sm="6" md="5">
                <v-autocomplete
                  v-model="mMaterial"
                  :items="iMaterial"
                  item-title="display"
                  item-value="materialCode"
                  :readonly="!createMode"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  hide-details
                  return-object
                  :clearable="createMode ? true : false"
                  :color="'primary'"
                  active-class="custom-active-class"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Material
                  </template></v-autocomplete
                >
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="mActiveStatus"
                  :items="iActiveStatus"
                  item-title="text"
                  item-value="key"
                  variant="outlined"
                  density="compact"
                  class="input-field"
                  return-object
                  :color="'primary'"
                  active-class="custom-active-class"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Status
                  </template></v-autocomplete
                >
              </v-col>

              <v-col cols="12" md="12">
                <v-textarea
                  v-model="mMsgComplians"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="input-field"
                  maxlength="1000"
                  rows="4"
                  ><template v-slot:label>
                    <span style="color: red">*</span> Msg.
                  </template></v-textarea
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
import { ref, computed, onMounted, watch } from "vue";
import loading from "@/components/Loading.vue";
import {
  gLineProcess,
  gComplains,
  DeleteComplains,
  InsertComplains,
  gMaterialBySpeed,
} from "@/services/apiOee";
import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";

const userStore = useUserStore();

const headers = [
  { title: "Line Process ID", align: "start", key: "lineProcessID" },
  { title: "Line Process Name", align: "start", key: "lineProcessName" },
  { title: "Material Code", align: "start", key: "materialCode" },
  { title: "Material Desc.", align: "start", key: "materialDescriptionEN" },
  { title: "Status", align: "start", key: "displayStatus" },
  { title: "Actions", align: "center", key: "actions" },
];

const isLoading = ref(false);
const iLineProcess = ref([]);
const mLineProcess = ref(null);
const iMaterial = ref([]);
const mMaterial = ref(null);
const mSearch = ref("");
const mFilterProcess = ref(null);
const rawReservations = ref([]);
const createMode = ref(false);
const dialog = ref(false);
const iActiveStatus = ref([
  {
    key: "Y",
    text: "Active",
  },
  {
    key: "N",
    text: "InActive",
  },
]);
const mActiveStatus = ref({
  key: "Y",
  text: "Active",
});
const mMsgComplians = ref(null);

const createdComplains = () => {
  resetForm();
  dialog.value = true;
  createMode.value = true;
};

const resetForm = () => {
  dialog.value = false;
  createMode.value = false;
  mMsgComplians.value = null;
  mMaterial.value = null;
  mLineProcess.value = [];
  mActiveStatus.value = {
    key: "Y",
    text: "Active",
  };
};

watch(mLineProcess, (val) => {
  const hasSelectAll = val.some((item) => item.lineProcessID === "__all__");

  if (hasSelectAll && val.length > 1) {
    // ถ้าเลือก Select All แล้ว ให้เหลือแค่ select all อย่างเดียว
    mLineProcess.value = val.filter((item) => item.lineProcessID === "__all__");
  }
});

const editItem = (item) => {
  resetForm();
  dialog.value = true;
  mMsgComplians.value = item.msgComplain;
  mLineProcess.value = [
    {
      lineProcessID: item.lineProcessID,
      lineProcessName: item.lineProcessName,
    },
  ];
  mMaterial.value = {
    materialCode: item.materialCode,
    display: `${item.materialCode} : ${item.materialDescriptionEN}`,
  };
  mActiveStatus.value = {
    key: item.isActive,
    text: item.isActive == "Y" ? "Active" : "InActive",
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

const getRealSelectedLineProcess = () => {
  const isSelectAll =
    mLineProcess.value.length === 1 && mLineProcess.value[0].lineProcessID === "__all__";

  return isSelectAll
    ? iLineProcess.value.filter((i) => i.lineProcessID !== "__all__")
    : mLineProcess.value;
};

const submitForm = async () => {
  if (mLineProcess.value.length == 0) {
    return showSnackbars("Please input line process");
  }
  if (!mMaterial.value) {
    return showSnackbars("Please input material");
  }
  if (!mMsgComplians.value) {
    return showSnackbars("Please input msg. complians");
  }

  isLoading.value = true;
  const selectedLineProcess = getRealSelectedLineProcess();

  const data = {
    lineProcessID: selectedLineProcess.map((item) => item.lineProcessID),
    materialCode: mMaterial.value.materialCode,
    isActive: mActiveStatus.value.key,
    msgComplain: mMsgComplians.value,
    updatedBy: userStore.empId,
  };

  dialog.value = false;
  try {
    await InsertComplains(data);
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
        fetchComplains();
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
const deleteItem = async (item) => {
  Swal.fire({
    html: `Would you like to delete item  <br/> Line Process Name :<strong>  ${item.lineProcessName}</strong> <br/> Material (TH) :<strong>  ${item.materialDescriptionEN}</strong> ?`,
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
          lineProcessID: item.lineProcessID,
          materialCode: item.materialCode,
        };
        await DeleteComplains(init);
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
            fetchComplains();
          }
        });
      } catch (e) {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "Delete Itemไม่สำเร็จ กรุณาลองใหม่",
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

const fetchComplains = async () => {
  isLoading.value = true;
  try {
    const response = await gComplains();
    rawReservations.value = response.results.map((item) => ({
      ...item,
      // display: `${item.fullName} (${item.pc_merchandiser})`,
      displayStatus: item.isActive == "Y" ? "Active" : "InActive",
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
    // สร้าง option "Select All"
    const selectAllOption = {
      lineProcessID: "__all__",
      lineProcessName: "Select All",
    };
    // ใส่ option ไว้บนสุด
    iLineProcess.value = [selectAllOption, ...results];
  } catch (err) {
    console.error("❌ Error while loading Line Process:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchMasterMaterial = async () => {
  isLoading.value = true;
  try {
    const response = await gMaterialBySpeed();
    iMaterial.value = response.results.map((item) => ({
      ...item,
      display: `${item.materialCode} (${item.materialDescriptionEN})`,
    }));
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  fetchComplains();
  fetchMasterLineProcess();
  fetchMasterMaterial();
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
