<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid class="pa-4">
    <v-row dense align="center" justify="space-start" class="filter-row">
      <v-col cols="8" sm="3">
        <CustomDatepicker
          v-model="sDateStart"
          label="Start Date"
          class="filter-select input-field"
          :minOffset="-90"
          :maxOffset="0"
          :disabled="sDisabledDate"
        />
      </v-col>
      To
      <v-col cols="8" sm="3">
        <CustomDatepicker
          v-model="sDateEnd"
          label="End Date"
          class="filter-select input-field"
          :minOffset="-90"
          :maxOffset="0"
          :disabled="sDisabledDate"
        />
      </v-col>
      <v-tooltip top color="teal" v-if="!sDisabledDate">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
            @click="fetchProcessOrders"
          >
            <v-icon size="20">mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span>Search</span>
      </v-tooltip>
      <v-tooltip top color="teal" v-else-if="sDisabledDate">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="red"
            dark
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
            @click="closeSearchProcessOrders"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Close Search</span>
      </v-tooltip>
    </v-row>
    <v-row dense align="center" class="filter-row">
      <v-col cols="12" sm="2" md="2" class="filter-col mb-3">
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
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="2" md="2" class="filter-col mb-3">
        <v-autocomplete
          v-model="mFilterOperator"
          :items="iFilterOperator"
          label="Operator"
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
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="2" md="2" class="filter-col mb-3">
        <v-autocomplete
          v-model="mFilterShift"
          :items="iFilterShift"
          label="Shift"
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
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="2" md="2" class="filter-col mb-3">
        <v-autocomplete
          v-model="mFilterStatus"
          :items="iFilterStatus"
          label="Status"
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
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="2" md="2" class="filter-col mb-3">
        <v-text-field
          v-model="mSearch"
          label="Search"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          class="search-bar input-field"
          variant="outlined"
          density="compact"
          hide-details
        />
      </v-col>
    </v-row>
    <!-- ตารางข้อมูล -->
    <v-data-table
      :headers="headers"
      :items="filteredReservations"
      :search="mSearch"
      class="data-table mt-2"
      dense
      rounded
      item-value="processID"
      :items-per-page="5"
      :items-per-page-options="[5, 15, 30, 100, 200]"
    >
      <template v-slot:top>
        <v-toolbar flat class="custom-toolbar">
          <v-toolbar-title class="centered-title">Line Process Orders</v-toolbar-title>
          <v-tooltip text="Refresh" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="fetchProcessOrders">
                <v-icon color="white">mdi-refresh</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
      </template>

      <template v-slot:item.processID="{ item }">
        <div
          class="flex items-center gap-2 justify-start text-start"
          style="color: #007fc4; font-weight: bold; cursor: pointer"
          @click="editItem(item)"
        >
          {{ item.processID }}
        </div>
      </template>
      <template v-slot:item.lineProcessName="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.lineProcessName }}
        </div>
      </template>
      <template v-slot:item.username="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.username }}
        </div>
      </template>
      <template v-slot:item.shift="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.shift }}
        </div>
      </template>
      <template v-slot:item.materialCode="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.materialCode }}
        </div>
      </template>
      <template v-slot:item.materialDesc="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.materialDesc }}
        </div>
      </template>
      <template v-slot:item.displayCheckin="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.displayCheckin }}
        </div>
      </template>
      <template v-slot:item.displayCheckOut="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.displayCheckOut }}
        </div>
      </template>
      <template v-slot:item.statusProcess="{ item }">
        <div class="flex items-center gap-2 justify-start text-start">
          {{ item.statusProcess }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip text="edit" location="bottom" color="primary" text-color="white">
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" @click="editItem(item)">
              <v-icon color="primary">mdi-washing-machine-alert</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="check-out" location="bottom" color="primary" text-color="white">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              v-bind="props"
              @click="updateProcessOrder(item)"
              v-if="item.statusProcess == 'InProcess'"
            >
              <v-icon color="yellow">mdi-door-open</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Delete" location="bottom" color="primary" text-color="white">
          <template #activator="{ props }">
            <v-btn
              v-if="canDelete(item)"
              icon
              variant="text"
              v-bind="props"
              @click="DeleteProcessList(item)"
            >
              <v-icon color="red">mdi-delete</v-icon>
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
        @click="createdProcessOrder"
      >
        <v-icon left>mdi-plus</v-icon> Add
      </v-btn>
    </v-row>
    <v-dialog v-model="dialogCreated" persistent max-width="80%">
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title">✨ Add Process Order ✨</span>
          <v-btn icon @click="resetFormCreate" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- Form Content -->

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row justify="end" class="mt-1">
              <v-sheet
                color="primary"
                variant="tonal"
                rounded="xl"
                class="pa-3 text-body-2"
                style="max-width: 320px; width: 100%"
              >
                <!-- Desktop -->
                <div class="d-none d-sm-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    {{ userStore.samAccount }}
                  </div>
                </div>
                <!-- Mobile -->
                <div class="d-flex d-sm-none flex-column">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    {{ userStore.samAccount }}
                  </div>
                </div>
              </v-sheet>
            </v-row>

            <v-row>
              <v-col cols="12" sm="4" md="3">
                <CustomDatepicker
                  v-model="createdCheckin"
                  label="Check-In Date"
                  class="filter-select input-field"
                  :minOffset="-90"
                  :maxOffset="0"
                  :require="' * '"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <CustomTimePicker
                  v-model="createdTime"
                  label="Check-In Time"
                  :require="' * '"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-autocomplete
                  v-model="createdLineProcess"
                  :items="iLineProcess"
                  item-title="lineProcessName"
                  item-value="lineProcessID"
                  variant="outlined"
                  density="compact"
                  class="input-field filter-select"
                  hide-details
                  return-object
                  @update:modelValue="onSelectLineProcess"
                >
                  <template v-slot:label>
                    <span style="color: red">*</span> Line Process
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="3" class="d-flex align-center input-field">
                <v-radio-group
                  v-model="selectedRadioProdMat"
                  hide-details
                  column
                  density="compact"
                >
                  <v-radio label="Production Order" value="Production"></v-radio>
                  <v-radio label="Material Master" value="Material"></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" sm="3" md="3">
                <v-autocomplete
                  v-model="createdFilms"
                  :items="iFilms"
                  item-title="filmDescription"
                  item-value="filmID"
                  variant="outlined"
                  density="compact"
                  class="input-field filter-select"
                  hide-details
                  return-object
                  :color="'primary'"
                  active-class="custom-active-class"
                  prepend-inner-icon="mdi-movie"
                  clearable
                  @click:clear="clearFilms"
                >
                  <template v-slot:label>
                    <span style="color: red"></span> Films
                  </template></v-autocomplete
                >
              </v-col>
              <v-col cols="12" sm="5" md="9">
                <v-combobox
                  v-if="createdFilms"
                  v-model:search="filmInput"
                  :model-value="films"
                  @update:modelValue="() => {}"
                  @click:clear="clearFilms"
                  label="Films"
                  multiple
                  chips
                  clearable
                  hide-selected
                  small-chips
                  placeholder="Type film name and press Enter or paste multiple items"
                  @keydown.enter.prevent="addFilm"
                  @paste="handlePasteFilms"
                  :items="[]"
                  :item-title="null"
                  :item-value="null"
                  class="input-field"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-movie"
                >
                  <!-- Custom chip -->
                  <template #chip="{ item, index }">
                    <v-chip closable @click:close="removeFilm(index)">
                      {{ getFilmText(item) }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col cols="12" sm="4" md="4" class="filter-col">
                <v-text-field
                  v-if="tableItems.length > 0"
                  v-model="createdSearch"
                  label="Search"
                  outlined
                  dense
                  prepend-inner-icon="mdi-magnify"
                  class="search-bar input-field"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-data-table
              v-model="selectedRow"
              :headers="computedHeaders"
              :items="tableItems"
              :search="createdSearch"
              item-value="_rowId"
              show-select
              select-strategy="single"
              return-object
              class="mt-4"
              active-class="custom-active-class"
              :color="'primary'"
              :items-per-page="5"
              :items-per-page-options="[5, 15, 30, 50]"
            />
          </v-form>
          <v-row class="d-flex justify-center">
            <v-btn
              color="success"
              large
              elevation="6"
              class="rounded-xl text-white font-weight-bold px-8 py-2 transition mt-5"
              @click="submitFormCreated"
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
            @click="resetFormCreate"
          >
            <v-icon start>mdi-close</v-icon> Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCheckedOut" persistent max-width="80%">
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title">✨ Checked Out Process Order ✨</span>
          <v-btn icon @click="resetFormUpdateCheckedOut" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- Form Content -->

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row justify="end" class="mt-1">
              <v-sheet
                color="primary"
                variant="tonal"
                rounded="xl"
                class="pa-3 text-body-2"
                style="max-width: 340px; width: 100%"
              >
                <!-- Desktop -->
                <div class="d-none d-sm-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-cog</v-icon>
                    Process: {{ processList.processID }}
                  </div>

                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    {{ userStore.samAccount }}
                  </div>
                </div>
                <!-- Mobile -->
                <div class="d-flex d-sm-none flex-column">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="16" class="mr-1">mdi-cog</v-icon>
                    Process: {{ processList.processID }}
                  </div>

                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    {{ userStore.samAccount }}
                  </div>
                </div>
              </v-sheet>
            </v-row>
            <v-row>
              <v-col cols="12" sm="4" md="3">
                <CustomDatepicker
                  v-model="updatedCheckOut"
                  label="Check-Out Date"
                  class="input-field"
                  :minOffset="-90"
                  :maxOffset="0"
                  :require="' * '"
                  :disabled="true"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <CustomTimePicker
                  v-model="updatedTimeCheckOut"
                  label="Check-Out Time"
                  :require="' * '"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-row class="d-flex justify-center">
            <v-btn
              color="success"
              large
              elevation="6"
              class="rounded-xl text-white font-weight-bold px-8 py-2 transition mt-5"
              @click="submitFormCheckedOut"
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
            @click="resetFormUpdateCheckedOut"
          >
            <v-icon start>mdi-close</v-icon> Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditProcessList" persistent max-width="80%">
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title">✨ Edit Process Order ✨</span>
          <v-btn icon @click="resetFormEdit" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- Form Content -->

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row justify="end" class="mt-1">
              <v-sheet
                color="primary"
                variant="tonal"
                rounded="xl"
                class="pa-3 text-body-2"
                style="max-width: 340px; width: 100%"
              >
                <!-- Desktop -->
                <div class="d-none d-sm-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-cog</v-icon>
                    Process: {{ processList.processID }}
                  </div>

                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    {{ processList.username }}({{ processList.shift }})
                  </div>
                </div>
                <!-- Mobile -->
                <div class="d-flex d-sm-none flex-column">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="16" class="mr-1">mdi-cog</v-icon>
                    Process: {{ processList.processID }}
                  </div>

                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    {{ processList.username }} ({{ processList.shift }})
                  </div>
                </div>
              </v-sheet>
            </v-row>
            <v-row>
              <v-col cols="12" v-show="msgComplain">
                <v-chip
                  class="warning-chip elevation-2"
                  color="#fff4e5"
                  text-color="#c67100"
                  label
                >
                  <v-icon class="mr-3" size="28" color="#fb8c00">mdi-alert-circle</v-icon>

                  <div class="chip-text">
                    {{ msgComplain }}
                  </div>
                </v-chip>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="4" md="3" v-if="canEditUI">
                <CustomDatepicker
                  v-model="createdCheckin"
                  label="Check-In Date"
                  class="input-field"
                  :minOffset="-90"
                  :maxOffset="0"
                  :require="' * '"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3" v-if="canEditUI">
                <CustomTimePicker
                  v-model="createdTime"
                  label="Check-In Time"
                  :require="' * '"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3" v-show="isCheckOutVisible" v-if="canEditUI">
                <CustomDatepicker
                  v-model="updatedCheckOut"
                  label="Check-Out Date"
                  class="input-field"
                  :minOffset="-90"
                  :maxOffset="0"
                  :require="' * '"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3" v-show="isCheckOutVisible" v-if="canEditUI">
                <CustomTimePicker
                  v-model="updatedTimeCheckOut"
                  label="Check-Out Time"
                  :require="' * '"
                />
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-btn
                v-if="canApproved"
                color="green"
                large
                elevation="6"
                class="rounded-xl text-white font-weight-bold px-8 py-2 transition mr-3"
                @click="updateProcessStatus('Completed')"
              >
                <v-icon left>mdi-hand-okay</v-icon> Approved
              </v-btn>
              <v-btn
                v-if="canConfirmed"
                color="primary"
                large
                elevation="6"
                class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
                @click="updateProcessStatus('WaitApproved')"
              >
                <v-icon left>mdi-check-bold</v-icon> Confirmed
              </v-btn>
            </v-row>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              show-arrows
              class="custom-tabs mt-4"
              grow
            >
              <v-tab value="Detail">
                <v-icon start>mdi-file-document-outline</v-icon>
                Detail
              </v-tab>
              <v-tab value="Reason">
                <v-icon start>mdi-head-lightbulb-outline</v-icon>
                Reason
              </v-tab>

              <v-tab value="Problem">
                <v-icon start>mdi-alert</v-icon>
                Problem
              </v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <v-window-item value="Detail">
                <v-row class="mt-2" dense>
                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="primary">mdi-cog</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Line Process</div>
                        <div class="info-value">
                          {{ processList.lineProcessName || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="blue">mdi-filmstrip</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Film</div>
                        <div class="info-value">
                          {{ processList.filmDescription || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="green"
                          >mdi-package-variant-closed</v-icon
                        >
                      </div>
                      <div class="info-content">
                        <div class="info-title">Material</div>
                        <div class="info-value">
                          {{ processList.materialCode || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="orange">mdi-text-box</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Description</div>
                        <div class="info-value">
                          {{ processList.materialDesc || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-row class="mt-2" dense>
                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="primary">mdi-palette</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Color</div>
                        <div class="info-value">
                          {{ processList.materialColor || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="blue">mdi-ruler</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Size</div>
                        <div class="info-value">
                          {{ processList.materialSize || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="green">mdi-shape</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Category</div>
                        <div class="info-value">
                          {{ processList.materialCategory || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="orange">mdi-counter</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Beginning Qty. (DZ)</div>
                        <div class="info-value">
                          {{ formattedQtyDozen }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="4" md="4" class="filter-col">
                    <v-text-field
                      v-model="mSpeedStdDisplay"
                      prepend-inner-icon="mdi-speedometer"
                      class="input-field"
                      variant="outlined"
                      density="compact"
                      hide-details
                      inputmode="numeric"
                      :readonly="canEditSppedStd"
                    >
                      <template #label>
                        <span style="color: red"> * </span>Speed Std.
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="4" md="4" class="filter-col">
                    <v-text-field
                      v-model="mManPowerStdDisplay"
                      prepend-inner-icon="mdi-account-group"
                      class="input-field"
                      variant="outlined"
                      density="compact"
                      hide-details
                      inputmode="numeric"
                      :readonly="canEditManPower"
                    >
                      <template #label>
                        <span style="color: red"> * </span>Man Power Std.
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="4" md="4" class="filter-col">
                    <v-text-field
                      v-model="mQtyDzDisplay"
                      prepend-inner-icon="mdi-numeric"
                      class="input-field"
                      variant="outlined"
                      density="compact"
                      hide-details
                      inputmode="numeric"
                      :readonly="!canEditUI"
                    >
                      <template #label>
                        <span style="color: red"> * </span>Qty. (DZ)
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="12" md="12" class="filter-col">
                    <v-combobox
                      v-if="createdFilms"
                      v-model:search="filmInput"
                      :model-value="films"
                      @update:modelValue="() => {}"
                      @click:clear="clearFilms"
                      label="Films"
                      multiple
                      chips
                      :clearable="canEditUI"
                      hide-selected
                      small-chips
                      placeholder="Type film name and press Enter or paste multiple items"
                      @keydown.enter.prevent="addFilm"
                      @paste="handlePasteFilms"
                      :items="[]"
                      :item-title="null"
                      :item-value="null"
                      class="input-field"
                      variant="outlined"
                      density="compact"
                      hide-details
                      prepend-inner-icon="mdi-movie"
                      :readonly="!canEditUI"
                    >
                      <!-- Custom chip -->
                      <template #chip="{ item, index }">
                        <v-chip closable @click:close="removeFilm(index)">
                          {{ getFilmText(item) }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
                <hr class="custom-hr blue-yellow" />

                <v-row class="mt-2" dense>
                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="primary">mdi-counter</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Qty. (EA)</div>
                        <div class="info-value">
                          {{ formatNumberComma(processList.qtyEA) }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="blue">mdi-timer-outline</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Std. CycleTime</div>
                        <div class="info-value">
                          {{ processList.stdCycleTime || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="green">mdi-clock-outline</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Operating Time</div>
                        <div class="info-value">
                          {{ processList.operatingTime || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="orange">mdi-speedometer-slow</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Speed Lose</div>
                        <div class="info-value">
                          {{ processList.speedLose || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-row class="mt-2" dense>
                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="primary"
                          >mdi-account-clock-outline</v-icon
                        >
                      </div>
                      <div class="info-content">
                        <div class="info-title">Working Time(Min)</div>
                        <div class="info-value">
                          {{ formatNumberComma(processList.workingTimeMin) }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="blue">mdi-cog-clockwise</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Machine Working Time(Min)</div>
                        <div class="info-value">
                          {{ formatNumberComma(processList.machineWorkingTime) }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="green">mdi-alert-circle-outline</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Damage%</div>
                        <div class="info-value">
                          {{ processList.damagePercentage || "-" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>

                <v-row class="mt-2" dense>
                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="primary">mdi-calendar-clock</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Planned Downtime(Min)</div>
                        <div class="info-value">
                          {{ formatNumberComma(processList.plannedDowntime) }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="blue">mdi-alert-octagon-outline</v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">UnPlan Downtime(Min)</div>
                        <div class="info-value">
                          {{ formatNumberComma(processList.unplannedDowntime) }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="green"
                          >mdi-chart-timeline-variant</v-icon
                        >
                      </div>
                      <div class="info-content">
                        <div class="info-title">Summary Downtime(Min)</div>
                        <div class="info-value">
                          {{ formatNumberComma(processList.summaryDowntime) }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>
                <hr v-if="canViewOEE" class="custom-hr blue-yellow" />
                <v-row class="mt-2" dense v-if="canViewOEE">
                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="indigo-darken-2">
                          mdi-calendar-check-outline
                        </v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Availability (A)</div>
                        <div class="info-value">
                          {{ processList.availability || "0" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="blue-darken-2"> mdi-speedometer </v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Performance (P)</div>
                        <div class="info-value">
                          {{ processList.performance || "0" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="green-darken-2">
                          mdi-check-decagram-outline
                        </v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">Quality (Q)</div>
                        <div class="info-value">
                          {{ processList.quality || "0" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-sheet class="info-box">
                      <div class="info-icon">
                        <v-icon size="22" color="orange-darken-2">
                          mdi-chart-donut
                        </v-icon>
                      </div>
                      <div class="info-content">
                        <div class="info-title">%OEE</div>
                        <div class="info-value">
                          {{ processList.oeePercentage || "0" }}
                        </div>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-window-item>
              <v-window-item value="Reason">
                <v-row class="mt-2" dense v-if="canEditUI">
                  <v-col cols="12" sm="3" md="3">
                    <v-autocomplete
                      v-model="mReason"
                      :items="iReasonDamage"
                      item-title="reasonHeader"
                      item-value="reasonID"
                      variant="outlined"
                      density="compact"
                      class="input-field filter-select"
                      hide-details
                      return-object
                      :color="'primary'"
                      active-class="custom-active-class"
                      prepend-inner-icon="mdi-alert-circle-outline"
                    >
                      <template v-slot:label>
                        <span style="color: red"> * </span> Reason
                      </template></v-autocomplete
                    >
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-autocomplete
                      v-model="mReasonDesc"
                      :items="iReasonDamageDesc"
                      item-title="reasonDesc"
                      item-value="reasonDescID"
                      variant="outlined"
                      density="compact"
                      class="input-field filter-select"
                      hide-details
                      return-object
                      :color="'primary'"
                      active-class="custom-active-class"
                      prepend-inner-icon="mdi-text-box-outline"
                    >
                      <template v-slot:label>
                        <span style="color: red"> * </span> Reason Description
                      </template></v-autocomplete
                    >
                  </v-col>
                  <v-col cols="12" sm="3" md="3" class="filter-col">
                    <v-text-field
                      v-model="mQtyReasonDisplay"
                      prepend-inner-icon="mdi-speedometer"
                      class="input-field"
                      variant="outlined"
                      density="compact"
                      hide-details
                      inputmode="numeric"
                    >
                      <template #label>
                        <span style="color: red"> * </span>Qty. (EA)
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-tooltip
                      text="edit"
                      location="bottom"
                      color="primary"
                      text-color="white"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          color="#007fc4"
                          dark
                          class="ma-1 small-export-button"
                          v-bind="attrs"
                          v-on="on"
                          @click="AddReasonItem()"
                        >
                          <v-icon size="20">
                            {{
                              editReasonMode ? "mdi-pencil-outline" : "mdi-plus"
                            }}</v-icon
                          >
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip top color="teal" v-if="editReasonMode">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          color="red"
                          dark
                          class="ma-2 small-export-button"
                          v-bind="attrs"
                          v-on="on"
                          @click="clearReason"
                        >
                          <v-icon size="20">mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>Close Search</span>
                    </v-tooltip>
                  </v-col>
                </v-row>

                <v-data-table
                  :headers="headerReason"
                  :items="itemReasonDetail"
                  class="data-table mt-2"
                  dense
                  rounded
                  item-value="itemNo"
                  :items-per-page="5"
                  :items-per-page-options="[5, 15, 30, 100, 200]"
                >
                  <template v-slot:top>
                    <v-toolbar flat class="custom-toolbar">
                      <v-toolbar-title class="centered-title">Reason</v-toolbar-title>
                      <v-tooltip
                        text="Refresh"
                        location="bottom"
                        color="blue"
                        text-color="white"
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            variant="text"
                            v-bind="props"
                            @click="fetchReasonDataInTable(processList.processID)"
                          >
                            <v-icon color="white">mdi-refresh</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </v-toolbar>
                  </template>

                  <template v-slot:item.itemNo="{ item }">
                    <div
                      class="flex items-center gap-2 justify-start text-start"
                      style="color: #007fc4; font-weight: bold; cursor: pointer"
                    >
                      {{ item.itemNo }}
                    </div>
                  </template>
                  <template v-slot:item.reasonHeader="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ item.reasonHeader }}
                    </div>
                  </template>
                  <template v-slot:item.reasonDesc="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ item.reasonDesc }}
                    </div>
                  </template>
                  <template v-slot:item.qtyEa="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ formatNumberComma(item.qtyEa) }}
                    </div>
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <!-- ===== EDIT / DELETE MODE ===== -->
                    <template v-if="canEditUI">
                      <!-- Edit -->
                      <v-tooltip text="Edit" location="bottom">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            variant="text"
                            v-bind="props"
                            @click="editReasonItem(item)"
                          >
                            <v-icon color="primary">mdi-pencil-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>

                      <!-- Delete -->
                      <v-tooltip v-if="!editReasonMode" text="Delete" location="bottom">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            variant="text"
                            v-bind="props"
                            @click="deleteReasonItem(item)"
                          >
                            <v-icon color="red">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </template>

                    <!-- ===== VIEW ONLY MODE ===== -->
                    <template v-else>
                      <v-tooltip text="Checked" location="bottom">
                        <template #activator="{ props }">
                          <v-btn icon variant="text" v-bind="props" disabled>
                            <v-icon color="green">mdi-check</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </template>
                  </template>
                </v-data-table>
              </v-window-item>
              <v-window-item value="Problem">
                <v-row class="mt-2" dense v-if="canEditUI">
                  <v-col cols="12" sm="5" md="4">
                    <v-autocomplete
                      v-model="mProblemMachine"
                      :items="iProblem"
                      item-title="machineDescription"
                      item-value="machineID"
                      variant="outlined"
                      density="compact"
                      class="input-field filter-select"
                      hide-details
                      return-object
                      :color="'primary'"
                      active-class="custom-active-class"
                      prepend-inner-icon="mdi-cog-outline"
                    >
                      <template v-slot:label>
                        <span style="color: red"> * </span> Machine & Problem
                      </template></v-autocomplete
                    >
                  </v-col>

                  <v-col cols="12" sm="3" md="2" class="d-flex align-center">
                    <v-radio-group v-model="selectedPlanStatus" hide-details>
                      <v-row
                        dense
                        class="d-flex align-center search-bar input-field mt-1"
                      >
                        <v-col cols="auto">
                          <v-radio label="Plan" value="Plan"></v-radio>
                        </v-col>
                        <v-col cols="auto">
                          <v-radio label="UnPlan" value="UnPlan"></v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-col>

                  <!-- Checkbox -->
                  <v-col cols="12" sm="3" md="2" class="d-flex align-center">
                    <v-checkbox
                      v-if="selectedPlanStatus === 'Plan'"
                      v-model="UnControl"
                      label="UnControl"
                      class="input-field"
                      hide-details
                    ></v-checkbox>
                  </v-col>

                  <v-col cols="12" sm="4" md="4">
                    <v-autocomplete
                      v-model="mProblemMachineDesc"
                      :items="iProblemMachineDesc"
                      item-title="problemDescription"
                      item-value="problemID"
                      variant="outlined"
                      density="compact"
                      class="input-field filter-select"
                      hide-details
                      return-object
                      :color="'primary'"
                      active-class="custom-active-class"
                      prepend-inner-icon="mdi-alert-circle-outline"
                    >
                      <template v-slot:label>
                        <span style="color: red"> * </span> Problem Description
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row class="mt-2" dense v-if="showProblemOther">
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="mProblemOther"
                      outlined
                      dense
                      prepend-inner-icon="mdi-text-long"
                      variant="outlined"
                      density="compact"
                      clearable
                      class="search-bar input-field"
                      maxlength="100"
                      rows="1"
                    >
                      <template v-slot:label>
                        <span style="color: red">*</span> Problem Description
                      </template>
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row class="mt-2" dense justify="end" v-if="canEditUI">
                  <v-col cols="12" sm="3" md="2" class="filter-col">
                    <v-text-field
                      v-model="mDowntimeDisplay"
                      prepend-inner-icon="mdi-timer-outline"
                      class="input-field"
                      variant="outlined"
                      density="compact"
                      hide-details
                      inputmode="numeric"
                    >
                      <template #label>
                        <span style="color: red"> * </span>Downtime (min)
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- 🔥 ตรงนี้ -->
                  <v-col cols="auto" class="d-flex align-center">
                    <v-tooltip
                      text="edit"
                      location="bottom"
                      color="primary"
                      text-color="white"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          color="#007fc4"
                          dark
                          class="ma-1 small-export-button"
                          v-bind="attrs"
                          v-on="on"
                          @click="AddProblemItem()"
                        >
                          <v-icon size="20">
                            {{
                              editProblemMode ? "mdi-pencil-outline" : "mdi-plus"
                            }}</v-icon
                          >
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip top color="teal" v-if="editProblemMode">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          color="red"
                          dark
                          class="ma-2 small-export-button"
                          v-bind="attrs"
                          v-on="on"
                          @click="clearProblem"
                        >
                          <v-icon size="20">mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>Clear</span>
                    </v-tooltip>
                  </v-col>
                </v-row>

                <v-data-table
                  :headers="headerProblem"
                  :items="itemProblemDetail"
                  class="data-table mt-2"
                  dense
                  rounded
                  item-value="itemNo"
                  :items-per-page="5"
                  :items-per-page-options="[5, 15, 30, 100, 200]"
                >
                  <template v-slot:top>
                    <v-toolbar flat class="custom-toolbar">
                      <v-toolbar-title class="centered-title">Problem</v-toolbar-title>
                      <v-tooltip
                        text="Refresh"
                        location="bottom"
                        color="blue"
                        text-color="white"
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            variant="text"
                            v-bind="props"
                            @click="fetchProblemDataInTable(processList.processID)"
                          >
                            <v-icon color="white">mdi-refresh</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </v-toolbar>
                  </template>

                  <template v-slot:item.itemNo="{ item }">
                    <div
                      class="flex items-center gap-2 justify-start text-start"
                      style="color: #007fc4; font-weight: bold; cursor: pointer"
                    >
                      {{ item.itemNo }}
                    </div>
                  </template>
                  <template v-slot:item.displayDateTime="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ item.displayDateTime }}
                    </div>
                  </template>
                  <template v-slot:item.machineDescription="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ item.machineDescription }}
                    </div>
                  </template>
                  <template v-slot:item.problemDescription="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ item.problemDescription }}
                    </div>
                  </template>
                  <template v-slot:item.downtime="{ item }">
                    <div class="flex items-center gap-2 justify-start text-start">
                      {{ formatNumberComma(item.downtime) }}
                    </div>
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <!-- ===== EDIT / DELETE MODE ===== -->
                    <template v-if="canEditUI">
                      <!-- Edit -->
                      <v-tooltip text="Edit" location="bottom">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            variant="text"
                            v-bind="props"
                            @click="editProblemItem(item)"
                          >
                            <v-icon color="primary">mdi-pencil-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>

                      <!-- Delete -->
                      <v-tooltip v-if="!editReasonMode" text="Delete" location="bottom">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            variant="text"
                            v-bind="props"
                            @click="deleteProblemItem(item)"
                          >
                            <v-icon color="red">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </template>

                    <!-- ===== VIEW ONLY MODE ===== -->
                    <template v-else>
                      <v-tooltip text="Checked" location="bottom">
                        <template #activator="{ props }">
                          <v-btn icon variant="text" v-bind="props" disabled>
                            <v-icon color="green">mdi-check</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </template>
                  </template>
                </v-data-table>
              </v-window-item>
            </v-window>
          </v-form>
          <v-row class="d-flex justify-center">
            <v-btn
              v-if="canEditUI"
              color="success"
              large
              elevation="6"
              class="rounded-xl text-white font-weight-bold px-8 py-2 transition mt-5"
              @click="submitFormUpdate"
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
            @click="resetFormEdit"
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
import CustomDatepicker from "@/components/CustomDatepicker.vue";
import {
  gTProcessListBy,
  gFilms,
  gLineProcessUse,
  gProductionOrders,
  gMaterialMaster,
  pTProcessList,
  pDeletedTProcessList,
  gComplainsByID,
  gReasonDamage,
  gReasonDetailByID,
  gProblemByID,
  gProblemDetailByID,
  pUpdateDetailProcessList,
} from "@/services/apiOee";
import { useUserStore } from "@/stores/userStore";
import CustomTimePicker from "@/components/CustomTimePicker.vue";
import Swal from "sweetalert2";

const dialogEditProcessList = ref(false);
const msgComplain = ref("");
const tab = ref("Detail");
const mSpeedStd = ref("0");
const mManPowerStd = ref("0");
const mQtyDz = ref("0");
const rawReasonDamage = ref([]); // data จาก API (ทั้งหมด)
const iReasonDamage = ref([]); // reason (ไม่ซ้ำ)
const iReasonDamageDesc = ref([]); // reason desc (ตามที่เลือก)

const mReason = ref(null);
const mReasonDesc = ref(null);
const mReasonQty = ref("0");
const editReasonMode = ref(false);
const editIndex = ref(null);

const headerReason = [
  { title: "No", align: "start", value: "itemNo" },
  { title: "Reason", align: "start", value: "reasonHeader" },
  {
    title: "Description",
    align: "start",
    value: "reasonDesc",
  },
  { title: "Qty. (EA)", align: "start", value: "qtyEa" },
  { title: "Actions", align: "start", value: "actions" },
];
const headerProblem = [
  { title: "No", align: "start", value: "itemNo" },
  { title: "Date Time", align: "start", value: "displayDateTime" },
  {
    title: "Machine & Problem",
    align: "start",
    value: "machineDescription",
  },
  { title: "Problem Description", align: "start", value: "problemDescription" },
  { title: "Downtime(Min)", align: "start", value: "downtime" },
  { title: "Actions", align: "start", value: "actions" },
];
const itemReasonDetail = ref([]);
const itemProblemDetail = ref([]);
const rawProblem = ref([]);
const mDownTime = ref("0");
const editProblemMode = ref(false);
const editProblemIndex = ref(null);
const mProblemMachine = ref(null);
const mProblemMachineDesc = ref(null);
const selectedPlanStatus = ref("Plan");
const mProblemOther = ref("");
const UnControl = ref(false);

const buildReasonHeader = () => {
  const map = new Map();

  rawReasonDamage.value.forEach((item) => {
    if (!map.has(item.reasonID)) {
      map.set(item.reasonID, {
        reasonID: item.reasonID,
        reasonHeader: item.reasonHeader,
      });
    }
  });

  iReasonDamage.value = Array.from(map.values());

  // ✅ ถ้ามีแค่ 1 ตัว → auto select
  if (iReasonDamage.value.length === 1) {
    mReason.value = iReasonDamage.value[0];
  }
};

watch(mReason, (val) => {
  // ✅ ถ้าอยู่โหมดแก้ไข ไม่ต้องไปยุ่งกับ desc
  if (editReasonMode.value) {
    return;
  }

  mReasonDesc.value = null;

  if (!val) {
    iReasonDamageDesc.value = [];
    return;
  }

  iReasonDamageDesc.value = rawReasonDamage.value.filter(
    (x) => x.reasonID === val.reasonID
  );

  // auto select ถ้ามี desc เดียว
  if (iReasonDamageDesc.value.length === 1) {
    mReasonDesc.value = iReasonDamageDesc.value[0];
  }
});

const formatNumber = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  return isNaN(num) ? "" : num.toLocaleString();
};

const parseNumber = (val) => {
  if (!val) return null;
  return Number(val.toString().replace(/,/g, ""));
};
const mDowntimeDisplay = computed({
  get: () => formatNumber(mDownTime.value),
  set: (val) => (mDownTime.value = parseNumber(val)),
});

const mQtyReasonDisplay = computed({
  get: () => formatNumber(mReasonQty.value),
  set: (val) => (mReasonQty.value = parseNumber(val)),
});

const mSpeedStdDisplay = computed({
  get: () => formatNumber(mSpeedStd.value),
  set: (val) => (mSpeedStd.value = parseNumber(val)),
});

const mManPowerStdDisplay = computed({
  get: () => formatNumber(mManPowerStd.value),
  set: (val) => (mManPowerStd.value = parseNumber(val)),
});

const mQtyDzDisplay = computed({
  get: () => formatNumber(mQtyDz.value),
  set: (val) => (mQtyDz.value = parseNumber(val)),
});

const isCheckOutVisible = computed(() => {
  return processList.value?.statusProcess !== "InProcess";
});
const formattedQtyDozen = computed(() => {
  if (!processList.value?.qtyDozen) return "-";
  return Number(processList.value.qtyDozen).toLocaleString("en-US");
});

const canConfirmed = computed(() => {
  const status = processList.value?.statusProcess;
  const group = userStore.group;

  if (group.includes("ADMIN")) return true;

  if (group.includes("SUPERVISOR") && status === "WaitConfirm") return true;

  return false;
});
const canApproved = computed(() => {
  const status = processList.value?.statusProcess;
  const group = userStore.group;

  if (group.includes("ADMIN")) return true;

  if (group.includes("MANAGER") && status === "WaitApproved") return true;

  return false;
});

const canEditUI = computed(() => {
  const status = processList.value?.statusProcess;
  const group = userStore.group;

  if (group.includes("ADMIN")) return true;

  if (group.includes("MANAGER") && status !== "Completed") return true;

  if (group.includes("SUPERVISOR") && status !== "WaitApproved" && status !== "Completed")
    return true;

  if (group.includes("OPERATOR") && status === "InProcess") return true;

  return false;
});

const canEditSppedStd = computed(() => {
  const status = processList.value?.statusProcess;
  const group = userStore.group;

  if (group.includes("ADMIN")) return false;

  if (group.includes("MANAGER") && status !== "Completed") return false;
  return true;
});

const canEditManPower = computed(() => {
  const status = processList.value?.statusProcess;
  const group = userStore.group;

  if (group.includes("ADMIN")) return false;

  if (group.includes("MANAGER") && status !== "Completed") return false;

  if (group.includes("SUPERVISOR") && status !== "WaitApproved" && status !== "Completed")
    return false;
  return true;
});

const canViewOEE = computed(() => {
  const group = userStore.group || [];
  return group.includes("ADMIN") || group.includes("MANAGER");
});
const splitDateTime = (str) => {
  if (!str) return ["", ""];
  const parts = str.split(" ");
  return [parts[0] || "", parts[1] || ""];
};

const formatNumberComma = (value, { fallback = "-", decimal = null, unit = "" } = {}) => {
  if (value === null || value === undefined || value === "") return fallback;

  const num = Number(value);
  if (isNaN(num)) return fallback;

  const formatted =
    decimal !== null
      ? num.toLocaleString(undefined, {
          minimumFractionDigits: decimal,
          maximumFractionDigits: decimal,
        })
      : num.toLocaleString();

  return unit ? `${formatted} ${unit}` : formatted;
};

const editItem = async (item) => {
  // เปิด dialog + set state พื้นฐาน (ไม่ async)
  dialogEditProcessList.value = true;
  processList.value = item;

  [createdCheckin.value, createdTime.value] = splitDateTime(item.checkIn);
  [updatedCheckOut.value, updatedTimeCheckOut.value] = splitDateTime(item.checkOut);

  createdFilms.value = item.filmDescription;
  films.value = item.lotFilms ? item.lotFilms.split(",").map((x) => x.trim()) : [];

  mSpeedStd.value = item.machineSTD || "0";
  mManPowerStd.value = item.manPowerSTD || "0";

  try {
    // 🔥 ยิง API พร้อมกัน
    const [complainResult] = await Promise.all([
      fetchComplain(item),
      fetchReasonDataInTable(item.processID),
      fetchProblem(item),
      fetchProblemDataInTable(item.processID),
    ]);

    msgComplain.value = complainResult;
  } catch (err) {
    console.error("❌ Error while loading editItem:", err);
  }
};

const resetFormEdit = () => {
  dialogEditProcessList.value = false;
  processList.value = [];
  msgComplain.value = "";
  createdCheckin.value = getTodayYYYYMMDD();
  createdTime.value = "00:00";
  updatedCheckOut.value = getTodayYYYYMMDD();
  updatedTimeCheckOut.value = "00:00";
  createdFilms.value = null;
  films.value = [];
  mSpeedStd.value = "0";
  mManPowerStd.value = "0";
  mQtyDz.value = "0";
  clearReason();
  itemReasonDetail.value = [];
  clearProblem();
  itemProblemDetail.value = [];
  tab.value = "Detail";
};
const clearReason = () => {
  editReasonMode.value = false;
  editIndex.value = null;
  mReasonDesc.value = null;
  mReasonQty.value = "0";
};
const fetchComplain = async (item) => {
  const response = await gComplainsByID(item.lineProcessID, item.materialCode);
  return response?.results?.[0]?.msgComplain || "";
};

const fetchProblem = async (item) => {
  try {
    const { results } = await gProblemByID(item.lineProcessID);
    rawProblem.value = results.map((item) => ({
      ...item,
    }));
  } catch (err) {
    console.error("❌ Error while loading fetchReasonDamage:", err);
  }
};
const AddReasonItem = () => {
  // ---------- 1) Validation ----------
  if (!mReason.value) {
    return showSnackbars("The reason cannot be left blank.");
  }

  if (!mReasonDesc.value) {
    return showSnackbars("The description cannot be left blank.");
  }

  const qty = Number(mReasonQty.value);
  if (!qty || qty <= 0) {
    return showSnackbars("Quantity (EA) cannot be blank or set to 0.");
  }

  const itemData = {
    reasonID: mReason.value.reasonID,
    reasonHeader: mReason.value.reasonHeader,
    reasonDescID: mReasonDesc.value.reasonDescID,
    reasonDesc: mReasonDesc.value.reasonDesc,
    qtyEa: qty,
  };

  // ---------- 2) EDIT MODE ----------
  if (editReasonMode.value && editIndex.value !== null) {
    itemReasonDetail.value.splice(editIndex.value, 1, {
      ...itemData,
      itemNo: editIndex.value + 1,
    });
  }
  // ---------- 3) ADD MODE ----------
  else {
    const map = new Map();

    itemReasonDetail.value.forEach((item) => {
      const key = `${item.reasonID}-${item.reasonDescID}`;
      map.set(key, { ...item, qtyEa: Number(item.qtyEa) });
    });

    const key = `${itemData.reasonID}-${itemData.reasonDescID}`;
    if (map.has(key)) {
      map.get(key).qtyEa += itemData.qtyEa;
    } else {
      map.set(key, itemData);
    }

    itemReasonDetail.value = Array.from(map.values()).map((item, index) => ({
      ...item,
      itemNo: index + 1,
    }));
  }

  // ---------- 4) reset ----------
  mReasonQty.value = "0";
  mReasonDesc.value = null;
  editReasonMode.value = false;
  editIndex.value = null;
};

const editReasonItem = (item) => {
  editReasonMode.value = true;
  editIndex.value = item.itemNo - 1;
  mReason.value = {
    reasonID: item.reasonID,
    reasonHeader: item.reasonHeader,
  };
  mReasonDesc.value = {
    reasonDesc: item.reasonDesc,
    reasonDescID: item.reasonDescID,
  };
  mReasonQty.value = item.qtyEa;
};
const deleteReasonItem = async (item) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This item will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0c80c4",
    cancelButtonColor: "#C0C0C0",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    allowOutsideClick: false,
    didOpen: () => {
      document.querySelector(".swal2-confirm").style.color = "white";
      document.querySelector(".swal2-cancel").style.color = "white";
    },
  });

  if (!result.isConfirmed) return;

  // itemNo เป็น 1-based → แปลงเป็น index 0-based
  const idx = Number(item.itemNo) - 1;
  if (idx < 0 || idx >= itemReasonDetail.value.length) return;

  itemReasonDetail.value.splice(idx, 1);

  // re-run itemNo ให้เรียงใหม่
  itemReasonDetail.value = itemReasonDetail.value.map((it, i) => ({
    ...it,
    itemNo: i + 1,
  }));

  // reset edit state ถ้าลบตัวที่กำลังแก้
  if (editReasonMode.value) {
    editReasonMode.value = false;
    editIndex.value = null;
    mReason.value = null;
    mReasonDesc.value = null;
    mReasonQty.value = "0";
  }

  Swal.fire({
    icon: "success",
    title: "Deleted!",
    text: "The item has been deleted successfully.",
    timer: 1500,
    showConfirmButton: false,
  });
};

const iProblem = computed(() => {
  const map = new Map();

  (rawProblem.value || []).forEach((x) => {
    if (!x.machineID) return;
    if (!map.has(x.machineID)) map.set(x.machineID, x); // เอาตัวแรก
  });

  return Array.from(map.values());
});

watch(
  iProblem,
  (list) => {
    // ถ้ามีค่าแล้วไม่ต้องทับ (กัน user เลือกเอง)
    if (mProblemMachine.value) return;

    const defaultMachine = list.find((x) => x.machineID === "M000");
    if (defaultMachine) mProblemMachine.value = defaultMachine;
  },
  { immediate: true }
);

const iProblemMachineDesc = computed(() => {
  if (!mProblemMachine.value) return [];

  return rawProblem.value.filter((x) => {
    // 1. filter ตาม machine
    if (x.machineID !== mProblemMachine.value.machineID) return false;

    // 2. filter ตาม Plan / UnPlan
    if (selectedPlanStatus.value === "Plan" && x.planStatus !== "Y") {
      return false;
    }

    if (selectedPlanStatus.value === "UnPlan" && x.planStatus !== "N") {
      return false;
    }

    // 3. filter ตาม UnControl (เฉพาะตอน Plan)
    if (selectedPlanStatus.value === "Plan") {
      if (UnControl.value && x.unControlStatus !== "Y") return false;
      if (!UnControl.value && x.unControlStatus !== "N") return false;
    }

    return true;
  });
});

watch([mProblemMachine, selectedPlanStatus, UnControl], () => {
  if (editProblemMode.value) {
    return;
  }
  mProblemMachineDesc.value = null; // ✅ เคลียร์เสมอ
});

watch(selectedPlanStatus, (val) => {
  if (val === "UnPlan") {
    UnControl.value = false; // ✅ เคลียร์ UnControl
    // mProblemMachineDesc.value = null; // (optional) เคลียร์ problem desc ด้วย ถ้าควร reset
  }
});

const showProblemOther = computed(() => {
  const id = Number(mProblemMachineDesc.value?.problemID.slice(2));
  return !!id && id > 9000;
});

watch(showProblemOther, (val) => {
  if (!val) {
    mProblemOther.value = null;
  }
});

const AddProblemItem = () => {
  // ---------- 1) Validation ----------
  if (!mProblemMachineDesc.value) {
    return showSnackbars("Problem description cannot be left blank.");
  }

  if (showProblemOther.value && !mProblemOther.value) {
    return showSnackbars("Remark cannot be blank.");
  }

  const downtime = Number(mDownTime.value);
  if (!downtime || downtime <= 0) {
    return showSnackbars("Downtime cannot be blank or set to 0.");
  }
  const itemData = {
    problemID: mProblemMachineDesc.value?.problemID,
    problemDescription: showProblemOther.value
      ? mProblemOther.value
      : mProblemMachineDesc.value?.problemDescription,
    lineProcessID: mProblemMachine.value?.lineProcessID,
    lineProcessName: mProblemMachine.value?.lineProcessName,
    machineID: mProblemMachine.value?.machineID,
    machineDescription: mProblemMachine.value?.machineDescription,
    planStatus: selectedPlanStatus.value == "Plan" ? "Y" : "N",
    unControlStatus: UnControl.value == true ? "Y" : "N",
    downtime: mDownTime.value,
    updateDate: getCurrentDateTime(),
    displayDateTime: convertToCustomFormat(getCurrentDateTime()),
  };
  // ---------- 2) EDIT MODE ----------
  if (editProblemMode.value && editProblemIndex.value !== null) {
    itemProblemDetail.value.splice(editProblemIndex.value, 1, {
      ...itemData,
      itemNo: editProblemIndex.value + 1,
    });
  }
  // ---------- 3) ADD MODE ----------
  else {
    const map = new Map();

    itemProblemDetail.value.forEach((item) => {
      const key = `${item.machineID}-${item.problemID}`;
      map.set(key, { ...item, downtime: Number(item.downtime) });
    });

    const key = `${itemData.machineID}-${itemData.problemID}`;
    if (map.has(key)) {
      map.get(key).downtime += itemData.downtime;
    } else {
      map.set(key, itemData);
    }

    itemProblemDetail.value = Array.from(map.values()).map((item, index) => ({
      ...item,
      itemNo: index + 1,
    }));
  }
  mProblemOther.value = null;
  mProblemMachineDesc.value = null;
  mDownTime.value = "0";
  editProblemMode.value = false;
  editProblemIndex.value = null;
};
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มต้นจาก 0
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}${month}${day} ${hours}:${minutes}`;
};
const editProblemItem = (item) => {
  if (!item) return;
  // ---------- 1) set edit state ----------
  editProblemMode.value = true;
  editProblemIndex.value = item.itemNo - 1;
  mDownTime.value = item.downtime;
  // ---------- 2) หา problem จาก raw ----------
  const problem = rawProblem.value.find((x) => x.problemID === item.problemID);
  if (!problem) {
    console.warn("Problem not found in rawProblem:", item.problemID);
    return;
  }
  // ---------- 3) set machine ----------
  mProblemMachine.value = {
    machineID: problem.machineID,
    machineDescription: problem.machineDescription,
    lineProcessID: problem.lineProcessID,
    lineProcessName: problem.lineProcessName,
  };
  // ---------- 4) set plan / uncontrol ----------
  selectedPlanStatus.value = problem.planStatus === "Y" ? "Plan" : "UnPlan";
  UnControl.value = problem.unControlStatus === "Y";
  // ---------- 5) set problem description ----------
  mProblemMachineDesc.value = {
    problemID: problem.problemID,
    problemDescription: problem.problemDescription,
  };
  // ---------- 6) set other description (เฉพาะกรณี > 9000) ----------
  mProblemOther.value = showProblemOther.value ? item.problemDescription : null;
};

const deleteProblemItem = async (item) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This item will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0c80c4",
    cancelButtonColor: "#C0C0C0",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    allowOutsideClick: false,
    didOpen: () => {
      document.querySelector(".swal2-confirm").style.color = "white";
      document.querySelector(".swal2-cancel").style.color = "white";
    },
  });

  if (!result.isConfirmed) return;

  // itemNo เป็น 1-based → แปลงเป็น index 0-based
  const idx = Number(item.itemNo) - 1;
  if (idx < 0 || idx >= itemProblemDetail.value.length) return;

  itemProblemDetail.value.splice(idx, 1);

  // re-run itemNo ให้เรียงใหม่
  itemProblemDetail.value = itemProblemDetail.value.map((it, i) => ({
    ...it,
    itemNo: i + 1,
  }));

  // reset edit state ถ้าลบตัวที่กำลังแก้
  if (editProblemMode.value) {
    clearProblem();
  }

  Swal.fire({
    icon: "success",
    title: "Deleted!",
    text: "The item has been deleted successfully.",
    timer: 1500,
    showConfirmButton: false,
  });
};
const clearProblem = () => {
  selectedPlanStatus.value = "Plan";
  mDownTime.value = "0";
  UnControl.value = false;
  mProblemOther.value = null;
  mProblemMachineDesc.value = null;
  editProblemMode.value = false;
  editProblemIndex.value = null;
};

// --------------------------------------------------------------

const updateProcessStatus = async (item) => {
  const isCompleted = item === "Completed";

  const result = await Swal.fire({
    title: "Confirm Status Change",
    html: isCompleted
      ? `Are you sure you want to change the status of process No. ${processList.value?.processID} to <strong>Approved</strong> ?`
      : `Are you sure you want to change the status of process No. ${processList.value?.processID} to <strong>Confirmed</strong> ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0c80c4",
    cancelButtonColor: "#C0C0C0",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    allowOutsideClick: false,
    didOpen: () => {
      document.querySelector(".swal2-confirm").style.color = "white";
      document.querySelector(".swal2-cancel").style.color = "white";
    },
  });

  if (!result.isConfirmed) return;

  const { processID, lineProcessID, materialCode, filmID, lotFilms } =
    processList.value || {};

  const checkInDateTime = `${createdCheckin.value} ${createdTime.value}`;
  const checkOutDateTime = `${updatedCheckOut.value} ${updatedTimeCheckOut.value}`;

  const dataUpdate = {
    processID,
    lineProcessID,
    userID: userStore.empId,
    prodOrderID: "",
    material_Code: materialCode,
    filmID,
    lotFilms,
    checkIN: checkInDateTime,
    checkOut: checkOutDateTime,
    status: item,
  };
  isLoading.value = true;
  try {
    await pTProcessList(dataUpdate);
    Swal.fire({
      title: "Successfully 🎉",
      icon: "success",
      confirmButtonText: "OK",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        resetFormEdit();
        await fetchProcessOrders();
        editItem(rawReservations.value.find((x) => x.processID === processID));
      }
    });
  } catch (e) {
    console.log(e);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "Internal Server Error",
      confirmButtonColor: "#007fc4",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    });
  } finally {
    isLoading.value = false;
  }
};

const submitFormUpdate = async () => {
  const { isConfirmed } = await Swal.fire({
    title: "Confirm Save",
    text: "Do you want to save?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0c80c4",
    cancelButtonColor: "#C0C0C0",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    allowOutsideClick: false,
    didOpen: () => {
      document.querySelector(".swal2-confirm").style.color = "white";
      document.querySelector(".swal2-cancel").style.color = "white";
    },
  });

  if (!isConfirmed) return;

  const p = processList.value;

  const data = {
    processID: p.processID,
    lineProcessID: p.lineProcessID,
    userID: userStore.empId,
    machine_STD: +mSpeedStd.value || 0,
    qty_Dozen: +mQtyDz.value || 0,
    manPowerSTD: +mManPowerStd.value || 0,
    checkIN: createdCheckin.value + " " + createdTime.value,
    checkOut:
      p.statusProcess === "InProcess"
        ? ""
        : updatedCheckOut.value + " " + updatedTimeCheckOut.value,
    lotFilms: films.value?.join(",") || "",
    detailProblem: itemProblemDetail.value.map((i) => ({
      machineID: i.machineID,
      problemID: i.problemID,
      problemDesc: i.problemDescription,
      downtime: i.downtime,
      updateDate: i.updateDate,
    })),
    detailReason: itemReasonDetail.value.map((i) => ({
      reasonID: i.reasonID,
      reasonDescID: i.reasonDescID,
      qty: i.qtyEa,
    })),
  };
  isLoading.value = true;
  try {
    await pUpdateDetailProcessList(data);
    Swal.fire({
      title: "Successfully 🎉",
      icon: "success",
      confirmButtonText: "OK",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        resetFormEdit();
        await fetchProcessOrders();
        editItem(rawReservations.value.find((x) => x.processID === p.processID));
      }
    });
  } catch (e) {
    console.log(e);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "Internal Server Error",
      confirmButtonColor: "#007fc4",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    });
  } finally {
    isLoading.value = false;
  }
};

// --------------------------------------------------------------
const isLoading = ref(false);
const sDisabledDate = ref(false);
const sDateStart = ref(null);
const sDateEnd = ref(null);
const rawReservations = ref([]);
const mFilterProcess = ref(null);
const mFilterOperator = ref(null);
const mFilterShift = ref(null);
const mFilterStatus = ref(null);
const mSearch = ref(null);
const userStore = useUserStore();
const dialogCreated = ref(false);
const createdCheckin = ref(null);
const createdTime = ref("00:00");
const createdLineProcess = ref(null);
const iLineProcess = ref([]);
const createdFilms = ref(null);
const iFilms = ref([]);
const selectedRadioProdMat = ref("Production");
const createdSearch = ref("");
const dialogCheckedOut = ref(false);
const updatedCheckOut = ref(null);
const updatedTimeCheckOut = ref("00:00");
const processList = ref([]);

const showSnackbar = ref(false);
const msgSnackbar = ref("");
const snackbarColor = ref("success");

const showSnackbars = (message, color = "yellow") => {
  msgSnackbar.value = message;
  snackbarColor.value = color;
  showSnackbar.value = true;
};

const createdProcessOrder = () => {
  dialogCreated.value = true;
  createdCheckin.value = getTodayYYYYMMDD();
  fetchLineProcess();
};
const updateProcessOrder = (item) => {
  if (item.qtyDozen == 0) {
    return showSnackbars("Quantity (DZ) cannot be blank or set to 0.");
  }
  dialogCheckedOut.value = true;
  processList.value = item;
  updatedCheckOut.value = getTodayYYYYMMDD();
};
const resetFormUpdateCheckedOut = () => {
  dialogCheckedOut.value = false;
  updatedTimeCheckOut.value = "00:00";
  processList.value = [];
};
const resetFormCreate = () => {
  dialogCreated.value = false;
  createdCheckin.value = getTodayYYYYMMDD();
  createdTime.value = "00:00";
  createdLineProcess.value = null;
  selectedRadioProdMat.value = "Production";
  createdFilms.value = null;
  films.value = [];
  selectedRow.value = [];
  createdSearch.value = "";
  tableItems.value = [];
};

const films = ref([]);
const filmInput = ref("");

const addFilm = () => {
  if (!filmInput.value) return;

  films.value.push(filmInput.value.trim());
  filmInput.value = "";
};

const removeFilm = (index) => {
  films.value.splice(index, 1);
};

const clearFilms = () => {
  films.value = [];
};

const getFilmText = (item) => {
  return typeof item === "string" ? item : item?.value || item?.title || "";
};

const handlePasteFilms = (e) => {
  e.preventDefault();

  const pasted = e.clipboardData.getData("text");
  const items = pasted
    .split(/[\n,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  films.value.push(...items);
};

const headers = [
  { title: "Process ID", align: "start", key: "processID" },
  { title: "Line Process Name", align: "start", key: "lineProcessName" },
  { title: "Operator", align: "start", key: "username" },
  { title: "Shift", align: "start", key: "shift" },
  { title: "Material", align: "start", key: "materialCode" },
  { title: "Description", align: "start", key: "materialDesc" },
  { title: "Check-In", align: "start", key: "displayCheckin", sortable: false },
  { title: "Check-Out", align: "start", key: "displayCheckOut", sortable: false },
  { title: "Status", align: "start", key: "statusProcess" },
  { title: "Actions", align: "center", key: "actions", sortable: false },
];

// 👉 Headers สำหรับ Production
const headersProduction = [
  { title: "Prod. Order", align: "start", value: "productionOrderNumber" },
  { title: "Material Code", align: "start", value: "materialCode" },
  {
    title: "Material Description",
    align: "start",
    value: "materialDescriptionEn",
  },
  { title: "Hg", align: "start", value: "displayHg1_3" },
  { title: "HgLv5", align: "start", value: "hgLv5" },
  { title: "HgLv7", align: "start", value: "hgDescLv7" },
  { title: "Speed Std.", align: "start", value: "speedStd" },
];

// 👉 Headers สำหรับ Material (เหมือน Production แต่ตัด Prod. Order ออก)
const headersMaterial = [
  { title: "Material Code", align: "start", value: "materialCode" },
  {
    title: "Material Description",
    align: "start",
    value: "materialDescriptionEn",
  },
  { title: "Hg", align: "start", value: "displayHg1_3" },
  { title: "HgLv5", align: "start", value: "hgLv5" },
  { title: "HgLv7", align: "start", value: "hgDescLv7" },
  { title: "Speed Std.", align: "start", value: "speedStd" },
];
const closeSearchProcessOrders = () => {
  sDisabledDate.value = false;
  rawReservations.value = [];
  processList.value = [];
  mFilterProcess.value = null;
  mFilterOperator.value = null;
  mFilterShift.value = null;
  mFilterStatus.value = null;
  mSearch.value = null;
};
// 👉 ใช้ computed เลือก header ตาม radio
const computedHeaders = computed(() => {
  return selectedRadioProdMat.value === "Production"
    ? headersProduction
    : headersMaterial;
});
const selectedRow = ref([]);
const tableItems = ref([]);
// 👉 เมื่อเลือก Line Process
const onSelectLineProcess = async (val) => {
  if (!val) return;

  const lineProcessID = val.lineProcessID;
  let results = [];
  if (selectedRadioProdMat.value === "Production") {
    results = await fetchProductionOrders(lineProcessID);
  } else {
    results = await fetchMaterialMaster(lineProcessID);
  }

  tableItems.value = results.map((el, idx) => ({
    ...el,
    _rowId: idx + 1,
    displayHg1_3: `${el.hgLv1}${el.hgLv3 ? ` - ${el.hgLv3}` : ""}`,
  }));
  selectedRow.value = [];
};
watch(selectedRadioProdMat, async () => {
  if (createdLineProcess.value) {
    await onSelectLineProcess(createdLineProcess.value);
  }
});

const filteredReservations = computed(() => {
  let items = rawReservations.value;

  if (mFilterProcess.value && mFilterProcess.value.length > 0) {
    const filterKeys = mFilterProcess.value.map((a) => a.key);
    items = items.filter((i) => filterKeys.includes(i.lineProcessID));
  }
  if (mFilterOperator.value && mFilterOperator.value.length > 0) {
    const filterKeys = mFilterOperator.value.map((a) => a.key);
    items = items.filter((i) => filterKeys.includes(i.userID));
  }
  if (mFilterShift.value && mFilterShift.value.length > 0) {
    const filterKeys = mFilterShift.value.map((a) => a.key);
    items = items.filter((i) => filterKeys.includes(i.shift));
  }
  if (mFilterStatus.value && mFilterStatus.value.length > 0) {
    const filterKeys = mFilterStatus.value.map((a) => a.key);
    items = items.filter((i) => filterKeys.includes(i.statusProcess));
  }

  return items;
});

const statusIndex = {
  InProcess: 1,
  WaitConfirm: 2,
  WaitApproved: 3,
  Completed: 4,
};

const iFilterStatus = computed(() => {
  const mapped = rawReservations.value.map((item) => ({
    key: item.statusProcess,
    display: item.statusProcess,
    sortIndex: statusIndex[item.statusProcess],
  }));
  return [...new Map(mapped.map((i) => [i.key, i])).values()].sort(
    (a, b) => a.sortIndex - b.sortIndex
  );
});

const iFilterOperator = computed(() => {
  const mapped = rawReservations.value.map((item) => ({
    key: item.userID,
    display: `${item.username}`,
  }));

  return [...new Map(mapped.map((item) => [item.key, item])).values()];
});

const iFilterShift = computed(() => {
  const mapped = rawReservations.value.map((item) => ({
    key: item.shift,
    display: `${item.shift}`,
  }));

  return [...new Map(mapped.map((item) => [item.key, item])).values()];
});

const iFilterProcess = computed(() => {
  const mapped = rawReservations.value.map((item) => ({
    key: item.lineProcessID,
    display: `${item.lineProcessName}`,
  }));

  return [...new Map(mapped.map((item) => [item.key, item])).values()];
});

function getFirstDayOfMonth() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  return `${yyyy}${mm}01`; // ตั้งให้เป็นวันที่ 01
}
function getTodayYYYYMMDD() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function formatDateTime(value) {
  if (!value) return "";

  // value รูปแบบ: YYYYMMDD HH:mm
  const [datePart, timePart] = value.split(" ");

  const year = datePart.substring(0, 4);
  const month = datePart.substring(4, 6);
  const day = datePart.substring(6, 8);

  return `${day}/${month}/${year} ${timePart}`;
}

const fetchProcessOrders = async () => {
  isLoading.value = true;
  const isOperator = ["OPERATOR"].some((i) => userStore.group.includes(i));

  const data = {
    startDate: sDateStart.value,
    endDate: sDateEnd.value,
    employee: isOperator ? userStore.empId : "",
  };

  try {
    const { results } = await gTProcessListBy(data);
    rawReservations.value = results.map((item) => ({
      ...item,
      displayCheckin: formatDateTime(item.checkIn),
      displayCheckOut: formatDateTime(item.checkOut),
    }));

    sDisabledDate.value = true;
    return rawReservations.value;
  } catch (err) {
    console.error("❌ Error while loading Line Process:", err);
  } finally {
    isLoading.value = false;
  }
};
const fetchLineProcess = async () => {
  try {
    const { results } = await gLineProcessUse();
    iLineProcess.value = results.map((item) => ({
      ...item,
    }));
  } catch (err) {
    console.error("❌ Error while loading fetchLineProcess:", err);
  }
};
const fetchFilms = async () => {
  try {
    const { results } = await gFilms();
    iFilms.value = results.map((item) => ({
      ...item,
    }));
  } catch (err) {
    console.error("❌ Error while loading fetchFilms:", err);
  }
};
const fetchReasonDamage = async () => {
  try {
    const { results } = await gReasonDamage();
    rawReasonDamage.value = results.map((item) => ({
      ...item,
    }));
    buildReasonHeader();
  } catch (err) {
    console.error("❌ Error while loading fetchReasonDamage:", err);
  }
};

const fetchReasonDataInTable = async (processID) => {
  const { results } = await gReasonDetailByID(processID);

  itemReasonDetail.value = (results || []).map((item, index) => ({
    ...item,
    qtyEa: item.qty,
    itemNo: index + 1,
  }));
};

const convertToCustomFormat = (updateDate) => {
  // แปลง updateDate ให้อยู่ในรูปแบบที่ JavaScript เข้าใจ (yyyy-MM-ddTHH:mm:ss)
  const formattedDateTime = updateDate.replace(
    /(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2})/,
    "$1-$2-$3T$4:$5:00"
  );

  const now = new Date(formattedDateTime);

  if (isNaN(now.getTime())) {
    return null; // หรือสามารถส่งค่าอื่นๆ ตามที่ต้องการ
  }

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มต้นจาก 0
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
const parseYYYYMMDDHHmm = (value) => {
  if (!value) return new Date(0);

  const [datePart, timePart] = value.split(" ");
  const year = Number(datePart.slice(0, 4));
  const month = Number(datePart.slice(4, 6)) - 1; // month เริ่มที่ 0
  const day = Number(datePart.slice(6, 8));

  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month, day, hour, minute);
};

const fetchProblemDataInTable = async (processID) => {
  const { results } = await gProblemDetailByID(processID);

  itemProblemDetail.value = (results || [])
    // ✅ sort ล่าสุดขึ้นก่อน
    .sort((a, b) => parseYYYYMMDDHHmm(b.updateDate) - parseYYYYMMDDHHmm(a.updateDate))
    .map((item, index) => ({
      ...item,
      displayDateTime: convertToCustomFormat(item.updateDate),
      itemNo: index + 1,
    }));
};

const fetchProductionOrders = async (data) => {
  try {
    const { results } = await gProductionOrders(data);
    return results ?? [];
  } catch (err) {
    console.error("❌ Error while loading fetchProductionOrders:", err);
  }
};
const fetchMaterialMaster = async (data) => {
  try {
    const { results } = await gMaterialMaster(data);
    return results ?? [];
  } catch (err) {
    console.error("❌ Error while loading fetchMaterialMaster:", err);
  }
};
const submitFormCreated = async () => {
  if (!createdLineProcess.value) {
    return showSnackbars("Please select line process");
  }
  if (selectedRow.value.length == 0) {
    return showSnackbars("Material cannot be left blank.");
  }
  Swal.fire({
    html: `Would you like to check in ?`,
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
        const data = {
          processID: "",
          lineProcessID: createdLineProcess.value?.lineProcessID ?? "",
          userID: userStore.empId,
          prodOrderID:
            selectedRadioProdMat.value == "Production"
              ? selectedRow.value[0]?.productionOrderNumber ?? ""
              : "",
          material_Code: selectedRow.value[0]?.materialCode ?? "",
          filmID: createdFilms.value?.filmID ?? "",
          lotFilms: films.value?.join(", ") ?? "",
          checkIN: `${createdCheckin.value} ${createdTime.value}`,
          checkOut: "",
          status: "InProcess",
        };
        await pTProcessList(data);
        Swal.fire({
          title: "Successfully 🎉",
          icon: "success",
          confirmButtonText: "OK",
          didOpen: () => {
            document.querySelector(".swal2-confirm").style.color = "white";
          },
        }).then((result) => {
          if (result.isConfirmed) {
            resetFormCreate();
            fetchProcessOrders();
          }
        });
      } catch (e) {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "Internal Server Error",
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
const submitFormCheckedOut = async () => {
  dialogCheckedOut.value = false;
  Swal.fire({
    html: `Would you like to check out
    <br/><strong> Process </strong> : ${processList.value.processID}
    <br/> <strong> Date </strong> :${formatDateTime(
      `${updatedCheckOut.value} ${updatedTimeCheckOut.value}`
    )} ?`,
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
        const data = {
          processID: processList.value.processID,
          lineProcessID: processList.value.lineProcessID,
          userID: userStore.empId,
          prodOrderID: "",
          material_Code: processList.value.materialCode,
          filmID: processList.value.filmID,
          lotFilms: processList.value.lotFilms,
          checkIN: processList.value.checkIn,
          checkOut: `${updatedCheckOut.value} ${updatedTimeCheckOut.value}`,
          status: "WaitConfirm",
        };
        await pTProcessList(data);
        Swal.fire({
          title: "Successfully 🎉",
          icon: "success",
          confirmButtonText: "OK",
          didOpen: () => {
            document.querySelector(".swal2-confirm").style.color = "white";
          },
        }).then((result) => {
          if (result.isConfirmed) {
            resetFormUpdateCheckedOut();
            fetchProcessOrders();
          }
        });
      } catch (e) {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "Internal Server Error",
          confirmButtonColor: "#007fc4",
          didOpen: () => {
            document.querySelector(".swal2-confirm").style.color = "white";
          },
        }).then((result) => {
          if (result.isConfirmed) {
            dialogCheckedOut.value = true;
          }
        });
      } finally {
        isLoading.value = false;
      }
    } else {
      dialogCheckedOut.value = true;
    }
  });
};

const canDelete = (item) => {
  const group = userStore.group;

  if (group.includes("ADMIN")) return true;

  if (group.includes("OPERATOR") && item.statusProcess === "InProcess") return true;

  if (group.includes("MANAGER") && item.statusProcess !== "Completed") return true;

  if (
    group.includes("SUPERVISOR") &&
    item.statusProcess !== "WaitApproved" &&
    item.statusProcess !== "Completed"
  ) {
    return true;
  }

  return false;
};

const DeleteProcessList = async (item) => {
  const result = await Swal.fire({
    html: `This action will delete process no. <strong>${item.processID}</strong>. Do you want to continue?`,
    icon: "warning",
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: "#0c80c4",
    cancelButtonColor: "#C0C0C0",
    confirmButtonText: "OK",
    didOpen: () => {
      document.querySelector(".swal2-confirm").style.color = "white";
      document.querySelector(".swal2-cancel").style.color = "white";
    },
  });

  if (!result.isConfirmed) return;

  isLoading.value = true;

  try {
    const { empId } = userStore;

    await pDeletedTProcessList({
      processID: item.processID,
      userID: empId,
    });
    isLoading.value = false;
    await Swal.fire({
      title: "Successfully 🎉",
      icon: "success",
      confirmButtonColor: "#0c80c4",
      confirmButtonText: "OK",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    });

    fetchProcessOrders();
  } catch (error) {
    await Swal.fire({
      text: "Internal Server Error",
      icon: "error",
      allowOutsideClick: false,
      confirmButtonColor: "#0c80c4",
      confirmButtonText: "OK",
      didOpen: () => {
        document.querySelector(".swal2-confirm").style.color = "white";
      },
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  sDateStart.value = getFirstDayOfMonth();
  sDateEnd.value = getTodayYYYYMMDD();
  fetchProcessOrders();
  fetchFilms();
  fetchReasonDamage();
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

.warning-chip {
  width: 100%;
  padding: 16px 20px;
  font-size: 16px;
  border-left: 6px solid #fb8c00; /* สีชัดกว่า */
  background: linear-gradient(90deg, #fff8e1, #fff3cd);
  box-shadow: 0 3px 12px rgba(251, 140, 0, 0.25);
  border-radius: 12px !important;

  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.chip-text {
  line-height: 1.5;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
  color: #6b4f00;
  font-weight: 500;
}

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

.info-box {
  display: flex;
  align-items: flex-start;
  padding: 4px 16px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  gap: 12px;
}

.info-icon {
  display: flex;
  align-items: center;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 13px;
  color: #757575;
  font-weight: 500;
  margin-bottom: 2px;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  word-break: break-word;
}

.custom-hr {
  border: none;
  height: 2px;
  margin: 18px 0;
}

.custom-hr.blue-yellow {
  background: linear-gradient(
    to right,
    transparent,
    #2196f3,
    #ffeb3b,
    #2196f3,
    transparent
  );
}
</style>
