<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid class="pa-4">
    <!-- ปุ่มสำหรับเปิด dialog เลือกไฟล์ -->
    <v-row dense align="center" justify="space-between">
      <!-- ปุ่มเลือกไฟล์ Excel -->
      <v-col cols="12" sm="4" md="2">
        <v-btn
          color="primary"
          prepend-icon="mdi-file-excel-outline"
          @click="triggerFileInput"
          block
          elevation="2"
        >
          เลือกไฟล์ Excel
        </v-btn>
      </v-col>

      <!-- ปุ่มดาวน์โหลด Template -->
      <v-col cols="12" sm="4" md="2">
        <v-btn
          target="_blank"
          rel="noopener noreferrer"
          color="yellow"
          prepend-icon="mdi-download"
          block
          elevation="2"
          @click="downloadExcelMaterial"
        >
          ดาวน์โหลดไฟล์ Template
        </v-btn>
      </v-col>
    </v-row>
    <!-- แสดงชื่อไฟล์ที่เลือก และปุ่มล้างไฟล์ -->
    <div v-if="selectedFile" class="file-info mt-3">
      <v-icon color="blue" size="24">mdi-file-excel</v-icon>
      <span class="file-name">{{ selectedFile.name }}</span>
      <v-btn icon variant="text" color="red" @click="clearFile">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- ซ่อน v-file-input แต่ใช้ ref เพื่อ trigger -->
    <v-file-input
      ref="fileInputRef"
      accept=".xlsx, .xls"
      style="display: none"
      @change="handleFileUpload"
    />
    <v-row dense v-if="iExcelFile.length !== 0">
      <v-col>
        <v-btn color="success" class="fab" large absolute bottom right @click="submit">
          <v-icon>mdi-plus</v-icon>บันทึก
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense align="center" justify="start" class="mt-3">
      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="iExcelFile"
        class="data-table"
        dense
        rounded
        :items-per-page="10"
        :items-per-page-options="[10, 30, 100, 200]"
      >
        <template v-slot:item.actions="{ item }">
          <v-tooltip text="Delete Item" location="bottom" color="red" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="deleteItem(item)">
                <v-icon color="red">mdi-delete-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-row>

    <loading :isLoading="isLoading" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as XLSX from "xlsx"; // นำเข้า SheetJS
import loading from "@/components/Loading.vue";
import { pInsertSpeedStd, gSpeedStd } from "@/services/apiOee.js";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";

const isLoading = ref(false);
const iExcelFile = ref([]);
const selectedFile = ref(null);
const fileInputRef = ref(null);
const headers = [
  { title: "No.", align: "left", key: "index" },
  { title: "Line Process ID", align: "left", key: "lineProcessID" },
  { title: "Line Process Name", align: "left", key: "lineProcessName" },
  { title: "Material Code", align: "left", key: "materialCode" },
  { title: "Material Desc.", align: "left", key: "materialDescriptionTH" },
  { title: "Speed Std.", align: "left", key: "speedSTD" },
  { title: "Actions", align: "left", key: "actions" },
];
const rawReservations = ref([]);

const fetchSpeedStd = async () => {
  isLoading.value = true;
  try {
    const response = await gSpeedStd();
    rawReservations.value = response.results.map((item) => ({
      ...item,
    }));
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    isLoading.value = false;
  }
};
const downloadExcelMaterial = async () => {
  isLoading.value = true;
  try {
    const data = rawReservations.value || [];
    if (!data.length) return;

    const sortedData = [...data].sort((a, b) => {
      const A = (a.lineProcessID || "").toString().trim();
      const B = (b.lineProcessID || "").toString().trim();
      return A.localeCompare(B);
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Exported");

    // ⭐ Freeze Header Row
    sheet.views = [
      {
        state: "frozen",
        ySplit: 1, // แถวแรกจะถูก freeze
      },
    ];

    sheet.columns = [
      { header: "No.", key: "no", width: 6 },
      { header: "Line Process ID", key: "lineProcessID", width: 10 },
      { header: "Line Process Name", key: "lineProcessName", width: 15 },
      { header: "Material Code", key: "materialCode", width: 20 },
      { header: "Material Description", key: "materialDescriptionTH", width: 35 },
      { header: "Speed Std.", key: "speedSTD", width: 10 },
    ];

    // Add rows
    sortedData.forEach((item, index) => {
      const row = sheet.addRow({
        no: index + 1,
        lineProcessID: item.lineProcessID || "",
        lineProcessName: item.lineProcessName || "",
        materialCode: item.materialCode || "",
        materialDescriptionTH: item.materialDescriptionTH || "",
        speedSTD: item.speedSTD || 0,
      });

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Header style
    const headerRow = sheet.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF007FC4" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // ⭐ Add Auto Filter
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount },
    };

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Exported_SpeedStandard.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

// 📌 ฟังก์ชันเปิดหน้าต่างเลือกไฟล์
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.$el.querySelector("input").click();
  }
};

// 📌 ฟังก์ชันล้างไฟล์
const clearFile = () => {
  selectedFile.value = null;
  iExcelFile.value = [];
};

// 📌 ฟังก์ชันอัปโหลดไฟล์ Excel และแปลงเป็น JSON
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  event.target.value = null;
  selectedFile.value = file;
  isLoading.value = true;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Safe string helper
    const safeString = (v) => {
      if (v === null || v === undefined) return "";
      return String(v).trim();
    };

    // ----------------------------
    // 1) REQUIRED HEADER CHECK
    // ----------------------------
    const requiredHeaders = [
      "Line Process ID",
      "Line Process Name",
      "Material Code",
      "Material Description",
      "Speed Std.",
    ];

    const firstRowHeaders = Object.keys(jsonData[0] || {});
    const missing = requiredHeaders.filter((h) => !firstRowHeaders.includes(h));

    if (missing.length > 0) {
      Swal.fire(
        "Invalid Format",
        `Missing required column(s): <br><b>${missing.join(", ")}</b>`,
        "error"
      );
      isLoading.value = false;
      return;
    }

    // ----------------------------
    // 2) MAP EXCEL → OBJECT
    // ----------------------------
    const uploadedData = jsonData.map((item, index) => ({
      index: index + 1,
      lineProcessID: safeString(item["Line Process ID"]),
      lineProcessName: safeString(item["Line Process Name"]),
      materialCode: safeString(item["Material Code"]),
      materialDescriptionTH: safeString(item["Material Description"]),
      speedSTD: safeString(item["Speed Std."]),
    }));

    // ----------------------------
    // 3) REQUIRED VALUE CHECK
    // ----------------------------
    const requiredValid = (row) =>
      row.lineProcessID !== "" && row.materialCode !== "" && row.speedSTD !== "";

    // ----------------------------
    // 4) BUILD FAST LOOKUP MAP
    // ----------------------------
    const originalMap = new Map();
    rawReservations.value.forEach((item) => {
      const key = `${item.lineProcessID.trim()}__${item.materialCode.trim()}__${item.speedSTD}`;
      originalMap.set(key, item);
    });

    // ----------------------------
    // 5) DIFF CHECK — ULTRA FAST
    // ----------------------------
    const changedRows = uploadedData.filter((row) => {
      const key = `${row.lineProcessID}__${row.materialCode}__${row.speedSTD}`;
      const original = originalMap.get(key);

      // ถ้าข้อมูลไม่ครบ → skip
      if (!requiredValid(row)) return false;

      // ถ้าไม่มีใน original → ถือว่าเป็นข้อมูลใหม่
      if (!original) return true;

      // Compare safely
      return (
        safeString(original.lineProcessName) !== row.lineProcessName ||
        safeString(original.materialDescriptionTH) !== row.materialDescriptionTH ||
        Number(original.speedSTD) !== Number(row.speedSTD)
      );
    });

    // ----------------------------
    // 6) ALERT
    // ----------------------------
    if (changedRows.length === 0) {
      Swal.fire("No Changes Found", "Uploaded file has no new or updated data.", "info");
      isLoading.value = false;
      return;
    }

    // ----------------------------
    // 7) SEND TO UI
    // ----------------------------
    iExcelFile.value = changedRows;

    Swal.fire(
      "Data Loaded",
      `Found <b>${changedRows.length}</b> updated or new records.`,
      "success"
    );

    isLoading.value = false;
  };

  reader.readAsArrayBuffer(file);
};

// 📌 ฟังก์ชันลบข้อมูลจากตาราง
const deleteItem = (item) => {
  Swal.fire({
    html: `Are you sure you want to delete this speed standard?<br>
           Line Process: <b>${item.lineProcessID} — ${item.lineProcessName}</b><br>
           Material: <b>${item.materialCode} — ${item.materialDescriptionTH}</b>`,
    icon: "warning",
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      iExcelFile.value = iExcelFile.value.filter((i) => i !== item);
    }
  });
};

const submit = async () => {
  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!iExcelFile.value || iExcelFile.value.length === 0) {
    console.log("Data iExcelFile not found!");
    return;
  }

  // แปลง iExcelFile ให้เป็น array ของ models
  const models = iExcelFile.value.map((item) => ({
    lineProcessID: item.lineProcessID,
    materialCode: item.materialCode.toString(),
    speedSTD: Number(item.speedSTD),
  }));
  isLoading.value = true;
  try {
    await pInsertSpeedStd(models);
    Swal.fire({
      title: "Successfully 🎉",
      icon: "success",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clearFile();
        fetchSpeedStd();
      }
    });
  } catch (error) {
    console.error("Error RegisterPlanQueue:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  fetchSpeedStd();
});
</script>

<style scoped>
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

::v-deep(.data-table td, .data-table th) {
  text-align: left !important; /* บังคับข้อความให้ชิดซ้าย */
  vertical-align: middle !important; /* จัดให้อยู่ตรงกลางแนวตั้ง */
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f3f7ff, #e3eafc);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.file-info:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.file-name {
  flex-grow: 1;
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.v-icon {
  transition: transform 0.3s ease-in-out;
}

.v-icon:hover {
  transform: scale(1.1);
}

.fab {
  color: white !important;
  bottom: -13px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2) !important;
  z-index: 100 !important;
}
.fab:hover {
  background-color: #007fc4 !important; /* สีเหลืองเข้มเมื่อ hover */
}
.custom-confirm-button {
  color: white !important; /* เปลี่ยนสีตัวอักษรเป็นสีขาว */
  background-color: #3085d6 !important; /* สีพื้นหลังปุ่ม */
  border-color: #3085d6 !important; /* สีขอบปุ่ม */
}
</style>
