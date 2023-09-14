import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import { get, noop } from "lodash";

export const useCategoryStore = defineStore("category", () => {
  const getCategories = async ({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> => {
    const onSuccess = get(callback, "onSuccess", noop);
    const onFailure = get(callback, "onFailure", noop);
    const onFinish = get(callback, "onFinish", noop);

    try {
      ApiService.setHeader();
      const response = await ApiService.getWithParams("admin/categories", {
        page: 1,
      });
      onSuccess(response.data?.data || response.data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  };
  return { getCategories };
});
