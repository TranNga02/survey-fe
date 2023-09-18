<template>
  <div
    class="modal fade"
    id="kt_modal_update_category"
    ref="updateCategoryModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_update_category_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Update category</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_update_category_close"
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
        >
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_update_category_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_update_category_header"
              data-kt-scroll-wrappers="#kt_modal_update_category_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-bold mb-2">Name</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="name">
                  <el-input
                    v-model="formData.name"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              type="reset"
              id="kt_modal_update_category_cancel"
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
import { defineComponent, ref, watch } from "vue";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2";
import { useCategoryStore } from "@/stores/category";
import type { UpdateCategoryParams } from "@/core/data/category";
import SwalPopup from "@/core/helpers/swalPopup";
import type { ICategory } from "@/core/data/category";

export default defineComponent({
  name: "update-category-modal",
  components: {},
  props: {
    category: {
      type: Object as () => ICategory,
      required: false,
    },
  },
  emits: ["updated-category"],
  setup(props, { emit }) {
    const store = useCategoryStore();
    const formRef = ref<null | HTMLFormElement>(null);
    const updateCategoryModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref<UpdateCategoryParams>({
      name: props?.category?.name || "",
    });

    watch(
      () => props.category,
      (newCategory) => {
        formData.value.name = newCategory?.name || "";
      }
    );

    const rules = ref({
      name: [
        {
          required: true,
          message: "Category name is required",
          trigger: "change",
        },
      ],
    });

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;
          updateCategory();
        }
      });
    };

    const updateCategory = async (): Promise<void> => {
      store.updateCategory({
        id: props?.category?.id.toString() || "",
        params: formData.value,
        callback: {
          onSuccess: (res: any) => {
            loading.value = false;
            Swal.fire({
              text: "Category has been successfully updated!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn btn-primary",
              },
            }).then(() => {
              emit("updated-category");
              hideModal(updateCategoryModalRef.value);
            });
          },
          onFailure: (err: any) => {
            loading.value = false;
            SwalPopup.swalResultPopup(
              "Sorry, looks like there are some errors detected, please try again.",
              "error"
            );
          },
        },
      });
    };

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      updateCategoryModalRef,
      getAssetPath,
    };
  },
});
</script>
