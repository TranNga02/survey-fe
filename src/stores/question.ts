import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import { get, noop } from "lodash";

export const useQuestionStore = defineStore("question", () => {
  const getQuestions = async ({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> => {
    const onSuccess = get(callback, "onSuccess", noop);
    const onFailure = get(callback, "onFailure", noop);
    const onFinish = get(callback, "onFinish", noop);

    try {
      ApiService.setHeader();
      const response = await ApiService.get("admin/questions");
      onSuccess(response.data?.data || response.data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  };
  return { getQuestions };
});
