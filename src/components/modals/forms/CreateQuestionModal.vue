<template>
  <div
    class="modal fade"
    id="kt_modal_add_question"
    ref="addQuestionModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_question_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Create question</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_question_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg
                :src="getAssetPath('media/icons/duotune/arrows/arr061.svg')"
              />
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Form-->
        <el-form
          @submit.prevent="submit()"
          :model="formData"
          :rules="rules"
          ref="formRef"
          status-icon
        >
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_add_question_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_question_header"
              data-kt-scroll-wrappers="#kt_modal_add_question_scroll"
              data-kt-scroll-offset="300px"
            >
              <div class="fv-row mb-7">
                <!-- <div class="col-md-6 fv-row"> -->
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">
                  <span class="required">Category</span>
                </label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="categoryId">
                  <el-select v-model="formData.categoryId">
                    <el-option
                      v-for="category in listCategories"
                      :key="category.id"
                      :value="category.id"
                      :label="category.name"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- </div> -->

                <!--end::Input-->
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Description</label>
                <el-form-item prop="description">
                  <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="5"
                    placeholder="Enter description"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Answers</label>
                <el-form-item prop="answer">
                  <!-- <el-form-item prop="options"> -->
                  <div
                    v-for="(option, index) in formData.options"
                    class="d-flex border-bottom w-100 align-items-center mb-2 pb-1"
                    :key="index"
                  >
                    <el-form-item
                      class="w-100 pt-2 pb-4 mb-2"
                      :prop="'options.' + index + '.key'"
                      :rules="{
                        required: true,
                        message: 'Answer is required',
                        trigger: 'change',
                      }"
                    >
                      <el-input
                        v-model="option.key"
                        type="text"
                        placeholder="Enter answer"
                      ></el-input>
                    </el-form-item>

                    <el-tooltip
                      class="box-item"
                      effect="light"
                      content="Mark as right answer"
                      placement="top"
                    >
                      <el-switch
                        class="mx-3"
                        :value="option.isAnswer"
                        @change="(value) => chooseRightAnswer(index, value)"
                      />
                    </el-tooltip>
                    <button
                      type="button"
                      class="btn btn-sm btn-icon btn-light-danger"
                      @click="() => formData.options.splice(index, 1)"
                    >
                      <span class="svg-icon svg-icon-1">
                        <inline-svg
                          :src="
                            getAssetPath(
                              'media/icons/duotune/arrows/arr061.svg'
                            )
                          "
                        />
                      </span>
                    </button>
                  </div>
                  <!-- </el-form-item> -->
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <button
                  type="button"
                  class="btn btn-light-primary me-auto"
                  id="kt_create_new_custom_fields_add"
                  @click="addNewAnswer"
                >
                  <span class="svg-icon svg-icon-2">
                    <inline-svg
                      :src="
                        getAssetPath('media/icons/duotune/arrows/arr075.svg')
                      "
                    />
                  </span>
                  Add new answer
                </button>
              </div>
            </div>
          </div>

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              type="reset"
              id="kt_modal_add_question_cancel"
              class="btn btn-light me-3"
            >
              Cancel
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                Submit
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <inline-svg
                    :src="getAssetPath('media/icons/duotune/arrows/arr064.svg')"
                  />
                </span>
              </span>
              <span v-if="loading" class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
            <!--end::Button-->
          </div>
          <!--end::Modal footer-->
        </el-form>
        <!--end::Form-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2";
import SwalPopup from "@/core/helpers/swalPopup";
import { useQuestionStore } from "@/stores/question";
import { useCategoryStore } from "@/stores/category";
import type {
  CreateQuestionParams,
  IOption,
  IQuestion,
} from "@/core/data/question";
import type { ICategory } from "@/core/data/category";

export default defineComponent({
  name: "create-question-modal",
  components: {},
  emits: ["created-question"],
  setup(props, { emit }) {
    const questionStore = useQuestionStore();
    const categoryStore = useCategoryStore();
    const formRef = ref<null | HTMLFormElement>(null);
    const listCategories = ref<ICategory[]>([]);
    const addQuestionModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref<CreateQuestionParams>({
      categoryId: null,
      title: "",
      description: "",
      type: 1,
      order: 1,
      options: [
        {
          key: "",
          value: 1,
          isAnswer: false,
        },
      ],
    });

    const validateAnswer = (rule: any, value: any, callback: any) => {
      if (formData.value.options.length == 0) {
        callback(new Error("Please add at least one answer"));
      } else {
        let checked = 0;
        formData.value.options.map((answer: IOption) => {
          checked += Number(answer.isAnswer);
        });
        if (!checked) {
          callback(new Error("Please choose one right answer"));
        } else {
          callback();
        }
      }
    };

    const rules = ref({
      description: [
        {
          required: true,
          message: "Description is required",
          trigger: "change",
        },
      ],
      categoryId: [
        {
          required: true,
          message: "Category is required",
          trigger: "change",
        },
      ],
      answer: [{ validator: validateAnswer, trigger: "change" }],
    });

    onMounted(() => {
      getListCategories();
    });

    const getListCategories = async (): Promise<void> => {
      categoryStore.getCategories({
        callback: {
          onSuccess: (res: any) => {
            listCategories.value = res.categories.rows;
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

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;
          // createQuestion();
        }
      });
    };

    const addNewAnswer = () => {
      formData.value.options.push({
        key: "",
        value: 1,
        isAnswer: false,
      });
    };

    const chooseRightAnswer = (answerIndex: number, value: boolean) => {
      formData.value.options = formData.value.options.map(
        (answer: IOption, index) => {
          if (answerIndex === index) {
            return { ...answer, isAnswer: value };
          } else if (value) {
            return { ...answer, isAnswer: false };
          }
          return answer;
        }
      );
    };

    // const createQuestion = async (): Promise<void> => {
    //   store.createQuestion({
    //     params: formData.value,
    //     callback: {
    //       onSuccess: (res: any) => {
    //         loading.value = false;
    //         Swal.fire({
    //           text: "Question has been successfully added!",
    //           icon: "success",
    //           buttonsStyling: false,
    //           confirmButtonText: "Ok, got it!",
    //           heightAuto: false,
    //           customClass: {
    //             confirmButton: "btn btn-primary",
    //           },
    //         }).then(() => {
    //           emit("created-question");
    //           hideModal(addQuestionModalRef.value);
    //         });
    //       },
    //       onFailure: (err: any) => {
    //         loading.value = false;
    //         SwalPopup.swalResultPopup(
    //           "Sorry, looks like there are some errors detected, please try again.",
    //           "error"
    //         );
    //       },
    //     },
    //   });
    // };

    return {
      formData,
      listCategories,
      rules,
      submit,
      formRef,
      loading,
      addQuestionModalRef,
      getAssetPath,
      addNewAnswer,
      chooseRightAnswer,
    };
  },
});
</script>
