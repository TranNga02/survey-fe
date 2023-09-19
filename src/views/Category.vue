<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <div
          class="d-flex justify-content-end"
          data-kt-category-table-toolbar="base"
        >
          <!--begin::Add Category-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_category"
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
    </div>
    <div class="card-body pt-0">
      <DataTable
        @on-sort="sort"
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
          <div class="dropdown dropdown-primary">
            <button
              class="btn btn-sm btn-light btn-active-light-primary dropdown-toggle"
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
                <a
                  class="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_update_category"
                  @click="onEdit(category)"
                  >Edit</a
                >
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
  <CreateCategoryModal @created-category="getCategories" />
  <UpdateCategoryModal
    @updated-category="getCategories"
    :category="selectedCategory"
  />
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import DataTable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import arraySort from "array-sort";
import { useCategoryStore } from "@/stores/category";
import type { ICategory } from "@/core/data/category";
import { formatDate } from "@/core/helpers/date";
import CreateCategoryModal from "@/components/modals/forms/CreateCategoryModal.vue";
import UpdateCategoryModal from "@/components/modals/forms/UpdateCategoryModal.vue";
import SwalPopup from "@/core/helpers/swalPopup";

export default defineComponent({
  name: "category",
  components: {
    DataTable,
    CreateCategoryModal,
    UpdateCategoryModal,
  },
  setup() {
    const store = useCategoryStore();
    const selectedCategory = ref<ICategory>();
    const tableData = ref<Array<ICategory>>([]);

    const tableHeader = ref([
      {
        columnName: "Name",
        columnLabel: "name",
        sortEnabled: false,
        columnWidth: 175,
      },
      {
        columnName: "Created Date",
        columnLabel: "date",
        sortEnabled: false,
        columnWidth: 100,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);

    onMounted(() => {
      getCategories();
    });

    const getCategories = async (): Promise<void> => {
      store.getAllCategories({
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

    const deleteCategory = async (id: number) => {
      SwalPopup.swalChangePopup(
        "Are you sure you want to delete?",
        {
          onConfirmed: async () => {
            store.deleteCategory({
              id: id,
              callback: {
                onSuccess: () => {
                  getCategories();
                },
                onFailure: (err: any) => {
                  SwalPopup.swalResultPopup(
                    "Sorry, looks like there are some errors detected, please try again.",
                    "error"
                  );
                },
              },
            });
          },
        },
        { confirmButtonText: "Yes, delete!" }
      );
    };

    const search = ref<string>("");
    const searchItems = () => {};

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

    const onEdit = (category: ICategory) => {
      selectedCategory.value = category;
    };

    return {
      tableData,
      tableHeader,
      deleteCategory,
      search,
      searchItems,
      selectedCategory,
      sort,
      onEdit,
      getAssetPath,
      formatDate,
      getCategories,
    };
  },
});
</script>
