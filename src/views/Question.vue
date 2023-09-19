<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_question"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg
                :src="getAssetPath('media/icons/duotune/arrows/arr075.svg')"
              />
            </span>
            Add Question
          </button>
        </div>
      </div>
      <div class="card-toolbar">
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
            @click="deleteFewQuestions()"
          >
            Delete Selected
          </button>
        </div>
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
      </div>
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
        <template v-slot:description="{ row: question }">
          {{ question.description }}
        </template>
        <template v-slot:category="{ row: question }">
          {{ question.category.name }}
        </template>
        <template v-slot:date="{ row: question }">
          {{ formatDate(question.createdAt) }}
        </template>
        <template v-slot:actions="{ row: question }">
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
                  data-bs-target="#kt_modal_update_question"
                  >Edit</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="deleteQuestion(question.id)"
                  >Delete</a
                >
              </li>
            </ul>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
  <CreateQuestionModal @created-question="getQuestions" />
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import DataTable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import arraySort from "array-sort";
import type { IQuestion } from "@/core/data/question";
import { formatDate } from "@/core/helpers/date";
import CreateQuestionModal from "@/components/modals/forms/CreateQuestionModal.vue";
import SwalPopup from "@/core/helpers/swalPopup";
import { useQuestionStore } from "@/stores/question";

export default defineComponent({
  name: "question",
  components: {
    DataTable,
    CreateQuestionModal,
  },
  setup() {
    const store = useQuestionStore();
    const selectedIds = ref<Array<number>>([]);
    const tableData = ref<Array<IQuestion>>([]);

    const tableHeader = ref([
      {
        columnName: "Description",
        columnLabel: "description",
        columnWidth: 450,
      },
      {
        columnName: "Category",
        columnLabel: "category",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Created Date",
        columnLabel: "date",
        sortEnabled: true,
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
      getQuestions();
    });

    const getQuestions = async (): Promise<void> => {
      store.getQuestions({
        callback: {
          onSuccess: (res: any) => {
            tableData.value = res.items;
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

    const deleteFewQuestions = () => {
      SwalPopup.swalChangePopup(
        "Are you sure you want to delete?",
        {
          onConfirmed: () => {
            selectedIds.value.forEach((item) => {
              for (let i = 0; i < tableData.value.length; i++) {
                if (tableData.value[i].id === item) {
                  tableData.value.splice(i, 1);
                  break;
                }
              }
            });
            selectedIds.value.length = 0;
          },
        },
        { confirmButtonText: "Yes, delete!" }
      );
    };

    const deleteQuestion = (id: number) => {
      SwalPopup.swalChangePopup(
        "Are you sure you want to delete?",
        {
          onConfirmed: () => {
            for (let i = 0; i < tableData.value.length; i++) {
              if (tableData.value[i].id === id) {
                tableData.value.splice(i, 1);
                break;
              }
            }
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

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    return {
      tableData,
      tableHeader,
      deleteQuestion,
      search,
      searchItems,
      selectedIds,
      deleteFewQuestions,
      sort,
      onItemSelect,
      getAssetPath,
      formatDate,
      getQuestions,
    };
  },
});
</script>
