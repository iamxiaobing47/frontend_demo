import { defineStore } from "pinia";
import { computed } from "vue";
import { testApi } from "@/services/test";
import { useRequest } from "@/composables/useRequest";

export const useIndexStore = defineStore("index", () => {
  const { loading, data, error, execute } = useRequest<string>();

  const result = computed(() => data.value ?? "");

  const fetchTest = async () => {
    await execute(testApi());
  };

  const clearResult = () => {
    data.value = "" as string;
    error.value = "";
  };

  return {
    loading,
    result,
    error,
    fetchTest,
    clearResult,
  };
});
