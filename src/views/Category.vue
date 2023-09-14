<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <div
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <!--begin::Add Category-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_customer"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg
                :src="getAssetPath('media/icons/duotune/arrows/arr075.svg')"
              />
            </span>
            Add Category
          </button>
          <!--end::Add Category-->
        </div>
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Group actions-->
        <div
          v-if="selectedIds.length !== 0"
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewCustomers()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-customer-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-customer-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <DataTable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
      >
        <template v-slot:name="{ row: category }">
          {{ category.name }}
        </template>
        <template v-slot:date="{ row: category }">
          {{ formatDate(category.createdAt) }}
        </template>
        <template v-slot:actions="{ row: category }">
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a class="dropdown-item">View</a>
              </li>
              <li>
                <a class="dropdown-item" @click="deleteCategory(category.id)"
                  >Delete</a
                >
              </li>
            </ul>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
  <CreateCategoryModal />
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import DataTable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import type { ICustomer } from "@/core/data/customers";
import arraySort from "array-sort";
import { useCategoryStore } from "@/stores/category";
import type { ICategory } from "@/core/data/category";
import { formatDate } from "@/core/helpers/date";
import CreateCategoryModal from "@/components/modals/forms/CreateCategoryModal.vue";
import SwalPopup from "@/core/helpers/swalPopup";

export default defineComponent({
  name: "category",
  components: {
    DataTable,
    CreateCategoryModal,
  },
  setup() {
    const store = useCategoryStore();
    const selectedIds = ref<Array<number>>([]);
    const tableData = ref<Array<ICategory>>([]);
    const initCustomers = ref<Array<ICustomer>>([]);

    const tableHeader = ref([
      {
        columnName: "Name",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Created Date",
        columnLabel: "date",
        sortEnabled: true,
        columnWidth: 225,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);

    onMounted(() => {
      // initCustomers.value.splice(0, tableData.value.length, ...tableData.value);
      getCategories();
    });

    const getCategories = async (): Promise<void> => {
      store.getCategories({
        callback: {
          onSuccess: (res: any) => {
            tableData.value = res.categories.rows;
          },
          onFailure: (err: any) => {
            SwalPopup.swalResultPopup(
              "Sorry, looks like there are some errors detected, please try again.",
              "error"
            );
          },
        },
      });
    };

    const deleteFewCustomers = () => {
      SwalPopup.swalChangePopup(
        "Are you sure you want to delete this building?",
        {
          onConfirmed: () => {
            selectedIds.value.forEach((item) => {
              deleteCategory(item);
            });
            selectedIds.value.length = 0;
          },
        },
        { confirmButtonText: "Yes, delete!" }
      );
    };

    const deleteCategory = (id: number) => {
      SwalPopup.swalChangePopup(
        "Are you sure you want to delete this building?",
        {
          onConfirmed: () => {
            for (let i = 0; i < tableData.value.length; i++) {
              if (tableData.value[i].id === id) {
                tableData.value.splice(i, 1);
              }
            }
          },
        },
        { confirmButtonText: "Yes, delete!" }
      );
    };

    const search = ref<string>("");
    const searchItems = () => {
      // tableData.value.splice(0, tableData.value.length, ...initCustomers.value);
      // if (search.value !== "") {
      //   let results: Array<ICustomer> = [];
      //   for (let j = 0; j < tableData.value.length; j++) {
      //     if (searchingFunc(tableData.value[j], search.value)) {
      //       results.push(tableData.value[j]);
      //     }
      //   }
      //   tableData.value.splice(0, tableData.value.length, ...results);
      // }
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].indexOf(value) != -1) {
            return true;
          }
        }
      }
      return false;
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(tableData.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    return {
      tableData,
      tableHeader,
      deleteCategory,
      search,
      searchItems,
      selectedIds,
      deleteFewCustomers,
      sort,
      onItemSelect,
      getAssetPath,
      formatDate,
    };
  },
});
</script>
