import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import { get, noop } from "lodash";
import type { UpdateCategoryParams } from "@/core/data/category";

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

  const createCategory = async ({
    params,
    callback,
  }: {
    params: UpdateCategoryParams;
    callback: App.Callback;
  }): Promise<void> => {
    const onSuccess = get(callback, "onSuccess", noop);
    const onFailure = get(callback, "onFailure", noop);
    const onFinish = get(callback, "onFinish", noop);

    try {
      ApiService.setHeader();
      const response = await ApiService.post("admin/categories", params);
      onSuccess(response.data?.data || response.data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  };

  const updateCategory = async ({
    id,
    params,
    callback,
  }: {
    id: string;
    params: UpdateCategoryParams;
    callback: App.Callback;
  }): Promise<void> => {
    const onSuccess = get(callback, "onSuccess", noop);
    const onFailure = get(callback, "onFailure", noop);
    const onFinish = get(callback, "onFinish", noop);

    try {
      ApiService.setHeader();
      const response = await ApiService.put(`admin/categories/${id}`, params);
      onSuccess(response.data?.data || response.data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  };

  const deleteCategory = async ({
    id,
    callback,
  }: {
    id: number;
    callback: App.Callback;
  }): Promise<void> => {
    const onSuccess = get(callback, "onSuccess", noop);
    const onFailure = get(callback, "onFailure", noop);
    const onFinish = get(callback, "onFinish", noop);

    try {
      ApiService.setHeader();
      const response = await ApiService.delete(`admin/categories/${id}`);
      onSuccess(response.data?.data || response.data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  };

  return { getCategories, createCategory, updateCategory, deleteCategory };
});
